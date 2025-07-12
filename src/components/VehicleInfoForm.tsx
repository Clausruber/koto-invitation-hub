
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, Hash } from 'lucide-react';

interface VehicleInfoFormProps {
  carModel: string;
  licensePlate: string;
  onInputChange: (field: string, value: string) => void;
}

export const VehicleInfoForm = ({ carModel, licensePlate, onInputChange }: VehicleInfoFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="carModel" className="text-koto-gray-dark font-medium text-sm">
          Modelo del Coche
        </Label>
        <div className="relative">
          <Car className="absolute left-3 top-2.5 h-4 w-4 text-koto-gray-dark/50" />
          <Input
            id="carModel"
            value={carModel}
            onChange={(e) => onInputChange('carModel', e.target.value)}
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
            value={licensePlate}
            onChange={(e) => onInputChange('licensePlate', e.target.value.toUpperCase())}
            className="pl-10 h-10 border-koto-gray-dark/20 focus:border-koto-blue font-mono"
            placeholder="ABC123"
            required
          />
        </div>
      </div>
    </>
  );
};
