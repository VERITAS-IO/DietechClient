import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { GetAppointmentResponse, QueryAppointmentsRequest } from '@/types/appointment';
import { cn } from '@/lib/utils/utils';
import { AppointmentDialog } from './AppointmentDialog';
import { AppointmentNotesDialog } from './AppointmentNotesDialog';
import trLocale from '@fullcalendar/core/locales/tr';
import { useTranslation } from 'react-i18next';
import { createRoot } from 'react-dom/client';
import { useAppointments } from '@/hooks/appointment-hooks';

import './calendar.css';

export function AppointmentCalendar() {
  const { t } = useTranslation();
  const [query, setQuery] = useState<QueryAppointmentsRequest>({});
  const { appointments = [], createAppointment, updateAppointment, deleteAppointment } = useAppointments(query);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<GetAppointmentResponse | null>(null);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);

  useEffect(() => {
    // Fetch appointments for current month and next month
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    
    setQuery({
      startDate,
      endDate
    });
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo.start);
    setSelectedAppointment(null);
    setIsAppointmentDialogOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    clickInfo.jsEvent.preventDefault();
    const appointment = appointments.find(apt => apt.id === parseInt(clickInfo.event.id));
    if (appointment) {
      setSelectedAppointment(appointment);
      
      // Show a context menu at the click position with options
      const menuX = clickInfo.jsEvent.pageX;
      const menuY = clickInfo.jsEvent.pageY;
      
      // Create and render a context menu
      const menuContainer = document.createElement('div');
      menuContainer.style.position = 'absolute';
      menuContainer.style.left = `${menuX}px`;
      menuContainer.style.top = `${menuY}px`;
      menuContainer.style.zIndex = '1000';
      document.body.appendChild(menuContainer);
      
      const root = createRoot(menuContainer);
      
      // Function to remove the menu when clicked outside
      const handleClickOutside = () => {
        document.body.removeChild(menuContainer);
        document.removeEventListener('click', handleClickOutside);
      };
      
      // Add a small delay before adding the click listener to prevent immediate removal
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 10);
      
      root.render(
        <div className="bg-white dark:bg-gray-800 rounded-md shadow-md border border-gray-200 dark:border-gray-700 p-1 min-w-[160px]">
          <button 
            className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              setIsAppointmentDialogOpen(true);
              handleClickOutside();
            }}
          >
            {t('appointment.edit')}
          </button>
          <button 
            className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              setIsNotesDialogOpen(true);
              handleClickOutside();
            }}
          >
            {t('appointment.notes.view')}
          </button>
        </div>
      );
    }
  };
  
  const getEventColor = (appointment: GetAppointmentResponse) => {
    switch (appointment.type) {
      case 'Initial':
        return 'dark:bg-red-700 bg-[#FF5A5F]';
      case 'FollowUp':
        return 'dark:bg-teal-700 bg-[#00A699]';
      case 'Assessment':
        return 'dark:bg-orange-700 bg-[#FC642D]';
      case 'Emergency':
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

  const renderEventContent = (eventInfo: EventContentArg) => {
    // Create a container for the event content
    const container = document.createElement('div');
    container.className = 'fc-event-main-content relative';
    
    // Create a text element for the title
    const titleElement = document.createElement('div');
    titleElement.textContent = eventInfo.event.title;
    container.appendChild(titleElement);
    
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
        createAppointment={createAppointment}
        updateAppointment={updateAppointment}
        deleteAppointment={deleteAppointment}
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