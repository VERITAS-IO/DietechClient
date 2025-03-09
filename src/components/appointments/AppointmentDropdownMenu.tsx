import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';
import { Appointment } from '@/types/appointment';

interface AppointmentDropdownMenuProps {
  appointment: Appointment;
  onEditClick: () => void;
  onNotesClick: () => void;
}

export function AppointmentDropdownMenu({
  appointment,
  onEditClick,
  onNotesClick,
}: AppointmentDropdownMenuProps) {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEditClick}>
          {t('appointment.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onNotesClick}>
          {t('appointment.notes.view')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}