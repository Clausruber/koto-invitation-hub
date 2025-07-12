
import { useState } from 'react';
import { Invitation } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: Invitation;
}

export const QRCodeModal = ({ isOpen, onClose, invitation }: QRCodeModalProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const invitationInfo = `
INVITACIÓN KOTO21
=================
Invitado: ${invitation.guestFirstName} ${invitation.guestLastName}
Vehículo: ${invitation.carModel}
Placa: ${invitation.licensePlate}
Fecha: ${invitation.visitDate}
Residente: ${invitation.residentName}
Dirección: ${invitation.residentAddress}
Código: ${invitation.code}
  `.trim();

  const handleCopyInfo = async () => {
    try {
      await navigator.clipboard.writeText(invitationInfo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "¡Información copiada!",
        description: "Los datos de la invitación se han copiado al portapapeles",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar la información",
        variant: "destructive"
      });
    }
  };

  const handleDownloadQR = () => {
    // Use public QR URL if available, otherwise fallback to generated QR code
    const qrImageUrl = invitation.publicQrUrl || invitation.qrCode;
    
    if (qrImageUrl) {
      const link = document.createElement('a');
      link.href = qrImageUrl;
      link.download = `invitacion-${invitation.code}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "¡Descarga iniciada!",
        description: "El código QR se está descargando",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const qrImageUrl = invitation.publicQrUrl || invitation.qrCode;
        await navigator.share({
          title: 'Invitación Koto21',
          text: invitationInfo,
          url: qrImageUrl
        });
      } catch (err) {
        // Si el usuario cancela el share, no mostrar error
        if (err instanceof Error && err.name !== 'AbortError') {
          toast({
            title: "Error",
            description: "No se pudo compartir la invitación",
            variant: "destructive"
          });
        }
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      handleCopyInfo();
    }
  };

  // Use public QR URL if available, otherwise fallback to generated QR code
  const displayQrUrl = invitation.publicQrUrl || invitation.qrCode;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-0 shadow-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-koto-gray-dark text-center">
            Código QR - Invitación
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* QR Code */}
          <Card className="bg-white border-2 border-dashed border-koto-blue/30">
            <CardContent className="p-6 text-center">
              {displayQrUrl ? (
                <img
                  src={displayQrUrl}
                  alt="Código QR de la invitación"
                  className="mx-auto w-48 h-48 rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Generando QR...</p>
                </div>
              )}
              
              <div className="mt-4 text-center">
                <p className="font-mono text-lg text-koto-blue font-bold">
                  {invitation.code}
                </p>
                <p className="text-sm text-koto-gray-dark/70 mt-1">
                  Código de invitación
                </p>
                {invitation.publicQrUrl && (
                  <p className="text-xs text-koto-green mt-1">
                    ✓ Almacenado en la nube
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Invitation Details */}
          <Card className="bg-koto-gray/50 border-0">
            <CardContent className="p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-koto-gray-dark">Invitado:</span>
                  <span className="text-koto-gray-dark">{invitation.guestFirstName} {invitation.guestLastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-koto-gray-dark">Vehículo:</span>
                  <span className="text-koto-gray-dark">{invitation.carModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-koto-gray-dark">Placa:</span>
                  <span className="text-koto-gray-dark font-mono">{invitation.licensePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-koto-gray-dark">Fecha:</span>
                  <span className="text-koto-gray-dark">{invitation.visitDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadQR}
              className="border-koto-blue text-koto-blue hover:bg-koto-blue hover:text-white"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-koto-green text-koto-green hover:bg-koto-green hover:text-white"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyInfo}
              className={`border-koto-gray-dark text-koto-gray-dark hover:bg-koto-gray-dark hover:text-white ${
                copied ? 'bg-koto-green text-white border-koto-green' : ''
              }`}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <Button
            onClick={onClose}
            className="w-full gradient-primary text-white hover:opacity-90"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
