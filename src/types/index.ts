
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
  guestFirstName: string;
  guestLastName: string;
  carModel: string;
  licensePlate: string;
  visitDate: string;
  createdAt: string;
  residentId: string;
  residentName: string;
  residentAddress: string;
  qrCode?: string;
  isActive: boolean;
}

export interface QRData {
  guestName: string;
  carModel: string;
  visitDate: string;
  residentName: string;
  residentAddress: string;
  residentId: string;
  invitationCode: string;
}
