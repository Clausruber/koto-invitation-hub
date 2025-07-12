
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Invitation, User, WebhookPayload } from '@/types';
import { generateInvitationCode, formatDateForDatabase } from '@/utils/generators';
import { generateQRData, generateQRCodeURL, generateQRCodeDataURL } from '@/utils/qrGenerator';
import { sendInvitationWebhook } from '@/services/webhookService';
import { uploadQRCodeToStorage, deleteQRCodeFromStorage } from '@/services/qrStorageService';

interface InvitationState {
  invitations: Invitation[];
  createInvitation: (data: Omit<Invitation, 'id' | 'code' | 'codeBase64' | 'createdAt' | 'qrCode' | 'publicQrUrl' | 'isActive'>, user: User) => Promise<Invitation>;
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
        
        const newInvitation: Invitation = {
          ...data,
          id: Date.now().toString(),
          code,
          codeBase64,
          createdAt: new Date().toISOString(),
          isActive: true
        };
        
        // Generate QR code
        const qrData = generateQRData(newInvitation, user);
        newInvitation.qrCode = generateQRCodeURL(qrData);
        
        try {
          // Generate QR code as data URL and upload to storage
          const qrDataUrl = await generateQRCodeDataURL(qrData);
          const publicQrUrl = await uploadQRCodeToStorage(qrDataUrl, newInvitation.code, user.id);
          
          if (publicQrUrl) {
            newInvitation.publicQrUrl = publicQrUrl;
          }
        } catch (error) {
          console.error('Error uploading QR code to storage:', error);
          // Continue without storage upload if it fails
        }
        
        // Save to store
        set(state => ({
          invitations: [...state.invitations, newInvitation]
        }));
        
        // Send webhook with all required information including public QR URL
        try {
          const formattedDate = formatDateForDatabase(new Date(newInvitation.visitDate));
          
          const webhookPayload: WebhookPayload = {
            qrCode: newInvitation.qrCode || '',
            publicQrUrl: newInvitation.publicQrUrl || '',
            residentPhone: user.whatsapp,
            guestFullName: `${newInvitation.guestFirstName} ${newInvitation.guestLastName}`,
            residentFullName: `${user.firstName} ${user.lastName}`,
            residentAddress: user.address,
            invitationDate: newInvitation.visitDate,
            formattedDate: formattedDate,
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
        const invitation = get().invitations.find(inv => inv.id === id);
        
        // Delete QR code from storage if it exists
        if (invitation?.publicQrUrl) {
          deleteQRCodeFromStorage(invitation.publicQrUrl).catch(error => {
            console.error('Error deleting QR code from storage:', error);
          });
        }
        
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
