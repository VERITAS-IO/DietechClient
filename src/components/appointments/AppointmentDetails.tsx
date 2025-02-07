  import { useEffect, useState } from 'react';
  import { useTranslation } from 'react-i18next';
  import { format } from 'date-fns';
  import { Calendar, Clock, User } from 'lucide-react';
  import { Badge } from '@/components/ui/badge';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Separator } from '@/components/ui/separator';
  import { useAppointmentStore } from '@/stores/appointment-store';
  import { AppointmentType, AppointmentStatus, Appointment } from '@/types/appointment';
  import { AppointmentNotes } from './AppointmentNotes';

  interface AppointmentDetailsProps {
    appointmentId: number;
  }

  export function AppointmentDetails({ appointmentId }: AppointmentDetailsProps) {
    const { t } = useTranslation();
    const { getAppointment, isLoading } = useAppointmentStore();
    const [appointment, setAppointment] = useState<Appointment | undefined>();

    useEffect(() => {
      const loadAppointment = async () => {
        const data = await getAppointment(appointmentId);
        setAppointment(data);
      };
      loadAppointment();
    }, [appointmentId, getAppointment]);

    if (isLoading) {
      return <div>{t('common.loading')}</div>;
    }

    if (!appointment) {
      return <div>{t('appointment.notFound')}</div>;
    }

    const getAppointmentTypeLabel = (type: AppointmentType) => {
      return t(`appointment.types.${AppointmentType[type].toLowerCase()}`);
    };

    const getAppointmentStatusLabel = (status: AppointmentStatus) => {
      return t(`appointment.statuses.${AppointmentStatus[status].toLowerCase()}`);
    };

    const getStatusColor = (status: AppointmentStatus) => {
      switch (status) {
        case AppointmentStatus.Scheduled:
          return 'bg-yellow-500';
        case AppointmentStatus.Confirmed:
          return 'bg-green-500';
        case AppointmentStatus.Cancelled:
          return 'bg-red-500';
        case AppointmentStatus.Completed:
          return 'bg-blue-500';
        default:
          return 'bg-gray-500';
      }
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{appointment.title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {getAppointmentTypeLabel(appointment.type)}
              </Badge>
              <Badge className={getStatusColor(appointment.status)}>
                {getAppointmentStatusLabel(appointment.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.clientName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(appointment.start, 'PPP')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(appointment.start, 'p')} - {format(appointment.end, 'p')}
                </span>
              </div>
              {appointment.preparationInstructions && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">
                      {t('appointment.preparationInstructions')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {appointment.preparationInstructions}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <AppointmentNotes appointmentId={appointmentId} />
          </CardContent>
        </Card>
      </div>
    );
  }
