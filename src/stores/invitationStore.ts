
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Invitation, User, WebhookPayload } from '@/types';
import { generateInvitationCode, formatDateForDatabase } from '@/utils/generators';
import { generateQRData, generateQRCodeURL } from '@/utils/qrGenerator';
import { sendInvitationWebhook } from '@/services/webhookService';

interface InvitationState {
  invitations: Invitation[];
  createInvitation: (data: Omit<Invitation, 'id' | 'code' | 'codeBase64' | 'createdAt' | 'qrCode' | 'isActive' | 'formattedDate'>, user: User) => Promise<Invitation>;
  getActiveInvitations: (residentId: string) => Invitation[];
  getInvitationHistory: (residentId: string) => Invitation[];
  deactivateInvitation: (id: string) => void;
}

// Helper function to encode string to base64
const encodeToBase64 = (text: string): string => {
  return btoa(text);
};

export const useInvitationStore = create<InvitationState>()(
  persist(
    (set, get) => ({
      invitations: [],
      
      createInvitation: async (data, user) => {
        const code = generateInvitationCode();
        const codeBase64 = encodeToBase64(code);
        
        // Parse the visit date to create formatted date
        const visitDate = new Date(data.visitDate);
        const formattedDate = formatDateForDatabase(visitDate);
        
        const newInvitation: Invitation = {
          ...data,
          id: Date.now().toString(),
          code,
          codeBase64,
          formattedDate,
          createdAt: new Date().toISOString(),
          isActive: true
        };
        
        // Generate QR code
        const qrData = generateQRData(newInvitation, user);
        newInvitation.qrCode = generateQRCodeURL(qrData);
        
        // Save to store
        set(state => ({
          invitations: [...state.invitations, newInvitation]
        }));
        
        // Send webhook with all required information
        try {
          const webhookPayload: WebhookPayload = {
            qrCode: newInvitation.qrCode || '',
            residentPhone: user.whatsapp,
            guestFullName: `${newInvitation.guestFirstName} ${newInvitation.guestLastName}`,
            residentFullName: `${user.firstName} ${user.lastName}`,
            residentAddress: user.address,
            invitationDate: newInvitation.visitDate,
            formattedDate: newInvitation.formattedDate,
            visitTime: newInvitation.visitTime
          };
          
          const webhookSent = await sendInvitationWebhook(webhookPayload);
          if (!webhookSent) {
            console.warn('Webhook failed but invitation was created');
          }
        } catch (error) {
          console.error('Error sending webhook:', error);
          // Don't fail the invitation creation if webhook fails
        }
        
        return newInvitation;
      },
      
      getActiveInvitations: (residentId: string) => {
        return get().invitations.filter(inv => 
          inv.residentId === residentId && inv.isActive
        );
      },
      
      getInvitationHistory: (residentId: string) => {
        return get().invitations.filter(inv => inv.residentId === residentId);
      },
      
      deactivateInvitation: (id: string) => {
        set(state => ({
          invitations: state.invitations.map(inv =>
            inv.id === id ? { ...inv, isActive: false } : inv
          )
        }));
      }
    }),
    {
      name: 'koto21-invitations',
    }
  )
);
