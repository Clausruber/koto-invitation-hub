
import { useState } from 'react';
import { Invitation } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInvitationStore } from '@/stores/invitationStore';
import { QrCode, User, Car, Calendar, MapPin, Hash, Clock, X } from 'lucide-react';
import { QRCodeModal } from './QRCodeModal';

interface InvitationCardProps {
  invitation: Invitation;
  showActions: boolean;
}

export const InvitationCard = ({ invitation, showActions }: InvitationCardProps) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const { deactivateInvitation } = useInvitationStore();

  const handleDeactivate = () => {
    deactivateInvitation(invitation.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <Card className={`glass-effect border-0 shadow-lg card-hover ${!invitation.isActive ? 'opacity-75' : ''}`}>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-koto-gray-dark">
                  {invitation.guestFirstName} {invitation.guestLastName}
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-koto-gray-dark/70 mt-1">
                  <Hash className="h-3 w-3" />
                  <span className="font-mono">{invitation.code}</span>
                </div>
                <div className="text-xs text-koto-gray-dark/50 mt-1">
                  Base64: {invitation.codeBase64.slice(0, 12)}...
                </div>
              </div>
            </div>
            
            <Badge 
              variant={invitation.isActive ? "default" : "secondary"}
              className={invitation.isActive ? "gradient-secondary text-white" : ""}
            >
              {invitation.isActive ? 'Activa' : 'Inactiva'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Car className="h-4 w-4 text-koto-blue" />
              <div>
                <p className="text-sm font-medium text-koto-gray-dark">Vehículo</p>
                <p className="text-sm text-koto-gray-dark/70">{invitation.carModel}</p>
                <p className="text-xs text-koto-gray-dark/60 font-mono">{invitation.licensePlate}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-koto-green" />
              <div>
                <p className="text-sm font-medium text-koto-gray-dark">Fecha de Visita</p>
                <p className="text-sm text-koto-gray-dark/70">{invitation.formattedDate || invitation.visitDate}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="h-4 w-4 text-koto-blue" />
            <div>
              <p className="text-sm font-medium text-koto-gray-dark">Hora de Visita</p>
              <p className="text-sm text-koto-gray-dark/70">{invitation.visitTime}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-koto-blue" />
            <div>
              <p className="text-sm font-medium text-koto-gray-dark">Dirección</p>
              <p className="text-sm text-koto-gray-dark/70">{invitation.residentAddress}</p>
            </div>
          </div>
          
          <div className="text-xs text-koto-gray-dark/60">
            Creada el {formatDate(invitation.createdAt)}
          </div>
          
          {showActions && invitation.isActive && (
            <div className="flex space-x-2 pt-2 border-t border-koto-gray-dark/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQRModal(true)}
                className="flex-1 border-koto-blue text-koto-blue hover:bg-koto-blue hover:text-white"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Ver QR
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeactivate}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Desactivar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        invitation={invitation}
      />
    </>
  );
};
