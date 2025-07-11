
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Invitation, User } from '@/types';
import { generateInvitationCode } from '@/utils/generators';
import { generateQRData, generateQRCodeURL } from '@/utils/qrGenerator';

interface InvitationState {
  invitations: Invitation[];
  createInvitation: (data: Omit<Invitation, 'id' | 'code' | 'createdAt' | 'qrCode' | 'isActive'>, user: User) => Promise<Invitation>;
  getActiveInvitations: (residentId: string) => Invitation[];
  getInvitationHistory: (residentId: string) => Invitation[];
  deactivateInvitation: (id: string) => void;
}

export const useInvitationStore = create<InvitationState>()(
  persist(
    (set, get) => ({
      invitations: [],
      
      createInvitation: async (data, user) => {
        const newInvitation: Invitation = {
          ...data,
          id: Date.now().toString(),
          code: generateInvitationCode(),
          createdAt: new Date().toISOString(),
          isActive: true
        };
        
        // Generate QR code
        const qrData = generateQRData(newInvitation, user);
        newInvitation.qrCode = generateQRCodeURL(qrData);
        
        set(state => ({
          invitations: [...state.invitations, newInvitation]
        }));
        
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
