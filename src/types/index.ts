
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  address: string;
  residentId: string; // 3 letters + 5 numbers
}

export interface Invitation {
  id: string;
  code: string; // 2 letters + 4 numbers
  codeBase64: string; // base64 encoded version of the code
  guestFirstName: string;
  guestLastName: string;
  carModel: string;
  licensePlate: string;
  visitDate: string;
  visitTime: string;
  createdAt: string;
  residentId: string;
  residentName: string;
  residentAddress: string;
  qrCode?: string;
  isActive: boolean;
}

export interface News {
  id: string;
  name: string;
  noticia: string;
  fecha: string;
  imageUrl?: string;
  userId: string;
  createdAt: string;
}

export interface QRData {
  guestName: string;
  carModel: string;
  visitDate: string;
  visitTime: string;
  residentName: string;
  residentAddress: string;
  residentId: string;
  invitationCode: string;
}

export interface WebhookPayload {
  qrCode: string;
  residentPhone: string;
  guestFullName: string;
  residentFullName: string;
  residentAddress: string;
  invitationDate: string;
  formattedDate: string;
  visitTime: string;
}
