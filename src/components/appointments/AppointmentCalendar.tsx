import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { GetAppointmentResponse, AppointmentType } from '@/types/appointment';
import { useAppointmentStore } from '@/stores/appointment-store';
import { cn } from '@/lib/utils/utils';
import { AppointmentDialog } from './AppointmentDialog';
import { AppointmentNotesDialog } from './AppointmentNotesDialog';
import { AppointmentDropdownMenu } from './AppointmentDropdownMenu';
import trLocale from '@fullcalendar/core/locales/tr';
import { useTranslation } from 'react-i18next';
import { createRoot } from 'react-dom/client';

import './calendar.css';

export function AppointmentCalendar() {
  const { t } = useTranslation();
  const { appointments, getAppointments } = useAppointmentStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<GetAppointmentResponse | null>(null);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);

  useEffect(() => {
    // Fetch appointments for current month and next month
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    
    getAppointments({
      startDate,
      endDate
    });
  }, []);

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.start);
    setSelectedAppointment(null);
    setIsAppointmentDialogOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    clickInfo.jsEvent.preventDefault();
    const appointment = appointments.find(apt => apt.id === parseInt(clickInfo.event.id));
    if (appointment) {
      setSelectedAppointment(appointment);
    }
  };
  
  const getEventColor = (appointment: GetAppointmentResponse) => {
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
      status: appointment.status,
      appointment: appointment,
    }
  }));

  const renderEventContent = (eventInfo: any) => {
    const appointment = eventInfo.event.extendedProps.appointment;
    
    // Create a container for the event content
    const container = document.createElement('div');
    container.className = 'fc-event-main-content relative';
    
    // Create a text element for the title
    const titleElement = document.createElement('div');
    titleElement.textContent = eventInfo.event.title;
    container.appendChild(titleElement);
    
    // Create a container for the dropdown
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'absolute top-1 right-1';
    container.appendChild(dropdownContainer);
    
    // Use createRoot to render the React component
    const root = createRoot(dropdownContainer);
    root.render(
      <AppointmentDropdownMenu
        appointment={appointment}
        onEditClick={() => {
          setSelectedAppointment(appointment);
          setIsAppointmentDialogOpen(true);
        }}
        onNotesClick={() => {
          setSelectedAppointment(appointment);
          setIsNotesDialogOpen(true);
        }}
      />
    );

    return { domNodes: [container] };
  };

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
            setIsAppointmentDialogOpen(true);
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
          eventContent={renderEventContent}
        />
      </div>

      <AppointmentDialog
        isOpen={isAppointmentDialogOpen}
        onClose={() => setIsAppointmentDialogOpen(false)}
        selectedDate={selectedDate}
        appointment={selectedAppointment}
      />

      {selectedAppointment && (
        <AppointmentNotesDialog
          isOpen={isNotesDialogOpen}
          onClose={() => setIsNotesDialogOpen(false)}
          appointmentId={selectedAppointment.id}
        />
      )}
    </div>
  );
}