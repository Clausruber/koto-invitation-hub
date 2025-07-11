
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useInvitationStore } from '@/stores/invitationStore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Car, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DateTimePicker } from './DateTimePicker';

interface CreateInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateInvitationModal = ({ isOpen, onClose }: CreateInvitationModalProps) => {
  const [formData, setFormData] = useState({
    guestFirstName: '',
    guestLastName: '',
    carModel: '',
    licensePlate: '',
    visitDate: undefined as Date | undefined,
    visitTime: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuthStore();
  const { createInvitation } = useInvitationStore();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, visitDate: date }));
  };

  const handleTimeChange = (time: string) => {
    setFormData(prev => ({ ...prev, visitTime: time }));
  };

  const resetForm = () => {
    setFormData({
      guestFirstName: '',
      guestLastName: '',
      carModel: '',
      licensePlate: '',
      visitDate: undefined,
      visitTime: ''
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!formData.visitDate || !formData.visitTime) {
      setError('Por favor selecciona fecha y hora de visita');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      const invitationData = {
        guestFirstName: formData.guestFirstName,
        guestLastName: formData.guestLastName,
        carModel: formData.carModel,
        licensePlate: formData.licensePlate,
        visitDate: formData.visitDate.toLocaleDateString('es-ES'),
        visitTime: formData.visitTime,
        residentId: user.residentId,
        residentName: `${user.firstName} ${user.lastName}`,
        residentAddress: user.address
      };
      
      const newInvitation = await createInvitation(invitationData, user);
      
      toast({
        title: "¡Invitación creada exitosamente!",
        description: `Código: ${newInvitation.code} - ${newInvitation.formattedDate} a las ${newInvitation.visitTime}`,
      });
      
      resetForm();
      onClose();
    } catch (err) {
      setError('Error al crear la invitación');
      toast({
        title: "Error",
        description: "No se pudo crear la invitación",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestFirstName" className="text-koto-gray-dark font-medium text-sm">
                Nombre
              </Label>
              <Input
                id="guestFirstName"
                value={formData.guestFirstName}
                onChange={(e) => handleInputChange('guestFirstName', e.target.value)}
                className="h-10 border-koto-gray-dark/20 focus:border-koto-blue"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guestLastName" className="text-koto-gray-dark font-medium text-sm">
                Apellido
              </Label>
              <Input
                id="guestLastName"
                value={formData.guestLastName}
                onChange={(e) => handleInputChange('guestLastName', e.target.value)}
                className="h-10 border-koto-gray-dark/20 focus:border-koto-blue"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="carModel" className="text-koto-gray-dark font-medium text-sm">
              Modelo del Coche
            </Label>
            <div className="relative">
              <Car className="absolute left-3 top-2.5 h-4 w-4 text-koto-gray-dark/50" />
              <Input
                id="carModel"
                value={formData.carModel}
                onChange={(e) => handleInputChange('carModel', e.target.value)}
                className="pl-10 h-10 border-koto-gray-dark/20 focus:border-koto-blue"
                placeholder="Ej: Toyota Corolla"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="licensePlate" className="text-koto-gray-dark font-medium text-sm">
              Placa
            </Label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 h-4 w-4 text-koto-gray-dark/50" />
              <Input
                id="licensePlate"
                value={formData.licensePlate}
                onChange={(e) => handleInputChange('licensePlate', e.target.value.toUpperCase())}
                className="pl-10 h-10 border-koto-gray-dark/20 focus:border-koto-blue font-mono"
                placeholder="ABC123"
                required
              />
            </div>
          </div>
          
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
