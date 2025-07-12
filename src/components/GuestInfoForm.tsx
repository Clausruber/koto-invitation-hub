
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GuestInfoFormProps {
  guestFirstName: string;
  guestLastName: string;
  onInputChange: (field: string, value: string) => void;
}

export const GuestInfoForm = ({ guestFirstName, guestLastName, onInputChange }: GuestInfoFormProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="guestFirstName" className="text-koto-gray-dark font-medium text-sm">
          Nombre
        </Label>
        <Input
          id="guestFirstName"
          value={guestFirstName}
          onChange={(e) => onInputChange('guestFirstName', e.target.value)}
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
          value={guestLastName}
          onChange={(e) => onInputChange('guestLastName', e.target.value)}
          className="h-10 border-koto-gray-dark/20 focus:border-koto-blue"
          required
        />
      </div>
    </div>
  );
};
