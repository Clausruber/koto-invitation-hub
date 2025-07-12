
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User } from 'lucide-react';
import { DateTimePicker } from './DateTimePicker';
import { GuestInfoForm } from './GuestInfoForm';
import { VehicleInfoForm } from './VehicleInfoForm';
import { useInvitationForm } from '@/hooks/useInvitationForm';

interface CreateInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateInvitationModal = ({ isOpen, onClose }: CreateInvitationModalProps) => {
  const {
    formData,
    error,
    isLoading,
    handleInputChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
    resetForm
  } = useInvitationForm(onClose);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-effect border-0 shadow-2xl max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 gradient-primary rounded-full flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold text-koto-gray-dark text-center">
            Nueva Invitación
          </DialogTitle>
          <DialogDescription className="text-koto-gray-dark/70 text-center">
            Completa los datos del invitado y su vehículo
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <GuestInfoForm
            guestFirstName={formData.guestFirstName}
            guestLastName={formData.guestLastName}
            onInputChange={handleInputChange}
          />
          
          <VehicleInfoForm
            carModel={formData.carModel}
            licensePlate={formData.licensePlate}
            onInputChange={handleInputChange}
          />
          
          <DateTimePicker
            date={formData.visitDate}
            time={formData.visitTime}
            onDateChange={handleDateChange}
            onTimeChange={handleTimeChange}
          />
          
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-10"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-10 gradient-primary text-white hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? 'Creando...' : 'Crear Invitación'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
