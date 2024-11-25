import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Appointment } from '@/types/appointment';
import { AppointmentDialog } from './AppointmentDialog';
import { useAppointments } from '@/hooks/appointment-hooks';

export function AppointmentsTable() {
  const { t } = useTranslation();
  const { appointments, isLoading } = useAppointments();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.clientName.toLowerCase().includes(search.toLowerCase()) ||
      appointment.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || appointment.status === statusFilter;
    const matchesType = typeFilter === 'all' || appointment.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-[400px] w-full" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('appointment.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('appointment.filterByStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('appointment.allStatuses')}</SelectItem>
            {['scheduled', 'confirmed', 'cancelled', 'completed'].map(
              (status) => (
                <SelectItem key={status} value={status}>
                  <Badge
                    variant={
                      status === 'cancelled'
                        ? 'destructive'
                        : status === 'completed'
                        ? 'default'
                        : 'outline'
                    }
                    className="font-normal"
                  >
                    {t(`appointment.statuses.${status}`)}
                  </Badge>
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('appointment.filterByType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('appointment.allTypes')}</SelectItem>
            {['initial', 'followUp', 'assessment', 'emergency'].map((type) => (
              <SelectItem key={type} value={type}>
                <Badge
                  variant={type === 'emergency' ? 'destructive' : 'outline'}
                  className="font-normal"
                >
                  {t(`appointment.types.${type}`)}
                </Badge>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead className="w-[180px]">{t('appointment.date')}</TableHead>
              <TableHead className="w-[150px]">{t('appointment.time')}</TableHead>
              <TableHead>{t('appointment.clientName')}</TableHead>
              <TableHead className="w-[150px]">{t('appointment.type')}</TableHead>
              <TableHead className="w-[150px]">{t('appointment.status')}</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  {t('appointment.noAppointments')}
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((appointment) => (
                <TableRow
                  key={appointment.id}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleEditAppointment(appointment)}
                >
                  <TableCell className="font-medium">
                    {format(new Date(appointment.start), 'PPP')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(appointment.start), 'p')} -{' '}
                    {format(new Date(appointment.end), 'p')}
                  </TableCell>
                  <TableCell>{appointment.clientName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        appointment.type === 'emergency' ? 'destructive' : 'outline'
                      }
                      className="font-normal"
                    >
                      {t(`appointment.types.${appointment.type}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        appointment.status === 'cancelled'
                          ? 'destructive'
                          : appointment.status === 'completed'
                          ? 'default'
                          : 'outline'
                      }
                      className="font-normal"
                    >
                      {t(`appointment.statuses.${appointment.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t('common.openMenu')}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAppointment(appointment);
                          }}
                        >
                          {t('common.edit')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <AppointmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        appointment={selectedAppointment}
      />
    </div>
  );
}