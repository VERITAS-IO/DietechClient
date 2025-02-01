import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { Appointment, AppointmentType } from '@/types/appointment';
import { useAppointmentStore } from '@/stores/appointment-store';
import { cn } from '@/lib/utils/utils';
import { AppointmentDialog } from './AppointmentDialog';
import trLocale from '@fullcalendar/core/locales/tr';
import { useTranslation } from 'react-i18next';

import './calendar.css';

export function AppointmentCalendar() {
  const { t } = useTranslation();
  const { appointments } = useAppointmentStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.start);
    setSelectedAppointment(null);
    setIsDialogOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const appointment = appointments.find(apt => apt.id === parseInt(clickInfo.event.id));
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsDialogOpen(true);
    }
  };

  const getEventColor = (appointment: Appointment) => {
    switch (appointment.type) {
      case AppointmentType.Initial:
        return 'dark:bg-red-700 bg-[#FF5A5F]';
      case AppointmentType.FollowUp:
        return 'dark:bg-teal-700 bg-[#00A699]';
      case AppointmentType.Assessment:
        return 'dark:bg-orange-700 bg-[#FC642D]';
      case AppointmentType.Emergency:
        return 'dark:bg-gray-700 bg-[#484848]';
      default:
        return 'dark:bg-gray-600 bg-[#767676]';
    }
  };

  const events = appointments.map(appointment => ({
    id: appointment.id.toString(),
    title: `${appointment.clientName} - ${appointment.type}`,
    start: appointment.start,
    end: appointment.end,
    classNames: [getEventColor(appointment)],
    textColor: '#FFFFFF',
    extendedProps: {
      status: appointment.status
    }
  }));

  return (
    
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-semibold text-primary">{t('appointment.title')}</h1>
        </div>
        <Button
          onClick={() => {
            setSelectedDate(new Date());
            setSelectedAppointment(null);
            setIsDialogOpen(true);
          }}
          className="bg-[#FF5A5F] hover:bg-[#FF5A5F]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('appointment.create')}
        </Button>
      </div>

      <div className={cn(
        "flex-1 bg-white rounded-lg shadow-sm p-4",
        "fc fc-media-screen fc-direction-ltr fc-theme-standard"
      )}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="100%"
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          locale={trLocale}
        />
      </div>

      <AppointmentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedDate={selectedDate}
        appointment={selectedAppointment}
      />
    </div>
  );
}