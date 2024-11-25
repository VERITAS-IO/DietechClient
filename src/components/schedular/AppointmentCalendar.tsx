/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { AppointmentDialog } from './AppointmentDialog';
import { Appointment } from '@/types/appointment';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { cn } from '@/lib/utils/utils';
import { useAppointments } from '@/hooks/appointment-hooks';

const calendarClasses = {
  container: 'overflow-auto font-sans',
  toolbar: 'mb-6 flex flex-wrap justify-between items-center gap-4',
  toolbarLabel: 'text-xl font-semibold text-foreground',
  buttonGroup: 'flex gap-1',
  button: cn(
    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
    'bg-background hover:bg-accent',
    'border border-input',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    'data-[active=true]:bg-primary data-[active=true]:text-primary-foreground'
  ),
  month: {
    header: 'bg-background border-b border-border py-3 font-medium text-muted-foreground',
    row: 'border-b border-border hover:bg-accent/5 transition-colors',
    cell: cn(
      'p-2 relative h-32 overflow-hidden transition-colors',
      'hover:bg-accent/10'
    ),
    event: cn(
      'mb-1 truncate rounded-md px-2 py-1 text-xs font-medium',
      'hover:opacity-90 transition-opacity cursor-pointer'
    ),
    dateButton: cn(
      'absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center',
      'hover:bg-accent transition-colors text-sm font-medium'
    ),
    today: 'bg-accent/20',
    weekend: 'bg-muted/30',
    neighboringMonth: 'text-muted-foreground/50',
  },
};

export function AppointmentCalendar() {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language.startsWith('tr') ? tr : enUS;
  const { appointments, isLoading } = useAppointments();

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: {
      'en-US': currentLocale,
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedAppointment({
      id: '',
      title: '',
      start,
      end,
      clientId: '',
      clientName: '',
      type: 'initial',
      status: 'scheduled',
      notes: '',
      preparationInstructions: '',
    });
    setIsDialogOpen(true);
  };

  const handleSelectEvent = (event: Appointment) => {
    setSelectedAppointment(event);
    setIsDialogOpen(true);
  };

  const eventStyleGetter = (event: Appointment) => {
    let backgroundColor = '';
    let textColor = 'white';
    let border = 'none';

    switch (event.type) {
      case 'initial':
        backgroundColor = 'hsl(var(--primary))';
        break;
      case 'followUp':
        backgroundColor = 'hsl(var(--chart-2))';
        break;
      case 'assessment':
        backgroundColor = 'hsl(var(--chart-3))';
        break;
      case 'emergency':
        backgroundColor = 'hsl(var(--destructive))';
        break;
    }

    if (event.status === 'cancelled') {
      backgroundColor = 'hsl(var(--muted))';
      textColor = 'hsl(var(--muted-foreground))';
      border = '1px dashed hsl(var(--border))';
    }

    return {
      style: {
        backgroundColor,
        color: textColor,
        border,
        borderRadius: '6px',
        opacity: event.status === 'cancelled' ? 0.7 : 1,
        padding: '2px 6px',
        fontSize: '0.75rem',
        lineHeight: '1.25rem',
        fontWeight: 500,
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      },
    };
  };

  const components = {
    toolbar: (props: any) => (
      <div className={calendarClasses.toolbar}>
        <span className={calendarClasses.toolbarLabel}>
          {props.label}
        </span>
        <div className={calendarClasses.buttonGroup}>
          <button
            onClick={() => props.onNavigate('PREV')}
            className={calendarClasses.button}
          >
            {t('calendar.previous')}
          </button>
          <button
            onClick={() => props.onNavigate('TODAY')}
            className={calendarClasses.button}
            data-active={props.date.toDateString() === new Date().toDateString()}
          >
            {t('calendar.today')}
          </button>
          <button
            onClick={() => props.onNavigate('NEXT')}
            className={calendarClasses.button}
          >
            {t('calendar.next')}
          </button>
        </div>
        <div className={calendarClasses.buttonGroup}>
          {props.views.map((view: string) => (
            <button
              key={view}
              onClick={() => props.onView(view)}
              className={calendarClasses.button}
              data-active={props.view === view}
            >
              {t(`calendar.${view.toLowerCase()}`)}
            </button>
          ))}
        </div>
      </div>
    ),
  };

  if (isLoading) {
    return (
      <Card className="h-[800px] p-6">
        <Skeleton className="h-full w-full" />
      </Card>
    );
  }

  return (
    <Card className="h-[800px] p-6">
      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        className={calendarClasses.container}
        components={components}
        dayPropGetter={date => ({
          className: cn(
            calendarClasses.month.cell,
            date.getDay() === 0 || date.getDay() === 6 && calendarClasses.month.weekend,
            date.toDateString() === new Date().toDateString() && calendarClasses.month.today
          )
        })}
        formats={{
          monthHeaderFormat: 'MMMM yyyy',
          dayHeaderFormat: 'cccc',
          dayRangeHeaderFormat: ({ start, end }) =>
            `${format(start, 'MMMM dd')} – ${format(end, 'dd, yyyy')}`,
        }}
      />
      <AppointmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        appointment={selectedAppointment}
      />
    </Card>
  );
}