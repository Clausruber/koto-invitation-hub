
import { QRData, Invitation, User } from '@/types';

export const generateQRData = (invitation: Invitation, user: User): QRData => {
  return {
    guestName: `${invitation.guestFirstName} ${invitation.guestLastName}`,
    carModel: invitation.carModel,
    visitDate: invitation.visitDate,
    residentName: `${user.firstName} ${user.lastName}`,
    residentAddress: user.address,
    residentId: user.residentId,
    invitationCode: invitation.code
  };
};

export const generateQRCodeURL = (data: QRData): string => {
  const qrContent = `
INVITACIÓN KOTO21
=================
Invitado: ${data.guestName}
Vehículo: ${data.carModel}
Fecha: ${data.visitDate}
Residente: ${data.residentName}
Dirección: ${data.residentAddress}
ID Residente: ${data.residentId}
Código: ${data.invitationCode}
  `.trim();
  
  // Using QR Server API for generating QR codes
  const encodedContent = encodeURIComponent(qrContent);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedContent}`;
};
