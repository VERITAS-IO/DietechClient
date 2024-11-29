import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Table2 } from 'lucide-react';
import { AppointmentCalendar } from '@/components/schedular/AppointmentCalendar';
import { AppointmentsTable } from '@/components/schedular/AppointmentsTable';

export default function AppointmentsPage() {
  const { t } = useTranslation();

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('appointment.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('appointment.description')}
        </p>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          <TabsTrigger
            value="calendar"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {t('appointment.calendarView')}
          </TabsTrigger>
          <TabsTrigger
            value="table"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <Table2 className="mr-2 h-4 w-4" />
            {t('appointment.tableView')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <AppointmentCalendar />
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <AppointmentsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}