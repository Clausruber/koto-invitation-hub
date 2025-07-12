
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useInvitationStore } from '@/stores/invitationStore';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  guestFirstName: string;
  guestLastName: string;
  carModel: string;
  licensePlate: string;
  visitDate: Date | undefined;
  visitTime: string;
}

export const useInvitationForm = (onClose: () => void) => {
  const [formData, setFormData] = useState<FormData>({
    guestFirstName: '',
    guestLastName: '',
    carModel: '',
    licensePlate: '',
    visitDate: undefined,
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
        description: `Código: ${newInvitation.code} - ${newInvitation.visitDate} a las ${newInvitation.visitTime}`,
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

  return {
    formData,
    error,
    isLoading,
    handleInputChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
    resetForm
  };
};
