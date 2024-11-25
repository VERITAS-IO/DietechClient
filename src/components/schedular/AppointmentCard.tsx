import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Appointment } from "@/types/appointment";
import { formatAppointmentDate } from "@/lib/utils/dates";
import { Clock, User } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
}

export function AppointmentCard({ appointment, onEdit }: AppointmentCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="w-full transition-all hover:shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{appointment.title}</CardTitle>
          <Badge
            variant={
              appointment.status === "confirmed"
                ? "success"
                : appointment.status === "cancelled"
                ? "destructive"
                : "default"
            }
          >
            {t(`appointment.statuses.${appointment.status}`)}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {formatAppointmentDate(new Date(appointment.start))}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          {appointment.clientName}
        </div>
        {appointment.notes && (
          <p className="text-sm text-muted-foreground">{appointment.notes}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onEdit(appointment)}
        >
          {t("common.edit")}
        </Button>
      </CardFooter>
    </Card>
  );
}