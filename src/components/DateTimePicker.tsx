
import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getTimeOptions } from '@/utils/generators';

interface DateTimePickerProps {
  date?: Date;
  time?: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

export const DateTimePicker = ({ date, time, onDateChange, onTimeChange }: DateTimePickerProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const timeOptions = getTimeOptions();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-koto-gray-dark font-medium text-sm">
          Fecha de Visita
        </Label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-10 border-koto-gray-dark/20 focus:border-koto-blue",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                onDateChange(selectedDate);
                setIsCalendarOpen(false);
              }}
              disabled={(date) => date < today}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label className="text-koto-gray-dark font-medium text-sm">
          Hora de Visita
        </Label>
        <Select value={time} onValueChange={onTimeChange}>
          <SelectTrigger className="h-10 border-koto-gray-dark/20 focus:border-koto-blue">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-koto-gray-dark/50" />
              <SelectValue placeholder="Selecciona una hora" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white border border-koto-gray-dark/20">
            {timeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
