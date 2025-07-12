
import { QRData, Invitation, User } from '@/types';

export const generateQRData = (invitation: Invitation, user: User): QRData => {
  return {
    guestName: `${invitation.guestFirstName} ${invitation.guestLastName}`,
    carModel: invitation.carModel,
    visitDate: invitation.visitDate,
    visitTime: invitation.visitTime,
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
Hora: ${data.visitTime}
Residente: ${data.residentName}
Dirección: ${data.residentAddress}
ID Residente: ${data.residentId}
Código: ${data.invitationCode}
  `.trim();
  
  // Using QR Server API for generating QR codes
  const encodedContent = encodeURIComponent(qrContent);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedContent}`;
};

export const generateQRCodeDataURL = async (data: QRData): Promise<string> => {
  const qrContent = `
INVITACIÓN KOTO21
=================
Invitado: ${data.guestName}
Vehículo: ${data.carModel}
Fecha: ${data.visitDate}
Hora: ${data.visitTime}
Residente: ${data.residentName}
Dirección: ${data.residentAddress}
ID Residente: ${data.residentId}
Código: ${data.invitationCode}
  `.trim();
  
  // Using QR Server API to get the QR code as data URL
  const encodedContent = encodeURIComponent(qrContent);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedContent}`;
  
  try {
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error generating QR code data URL:', error);
    return qrUrl; // Fallback to external URL
  }
};
