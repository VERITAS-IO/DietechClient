import { useTranslation } from 'react-i18next';
import { useQueryAppointmentNotes } from '@/hooks/appointment-note-hooks';
import { useAppointmentNoteStore } from '@/stores/appointment-note-store';
import { GetAppointmentNoteResponse, NoteType } from '@/types/appointment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Clock } from 'lucide-react';
import { CardDataGrid, CardColumn } from '@/components/ui/card-data-grid';
import { CardDataGridFilter, FilterOption } from '@/components/ui/card-data-grid-filter';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useAppointments } from '@/hooks/appointment-hooks';
import { AppointmentNoteDetailDialog } from './AppointmentNoteDetailDialog';
import { AppointmentNoteCreateDialog } from './AppointmentNoteCreateDialog';

export function AppointmentNoteCardList() {
    const { t } = useTranslation();
    const filters = useAppointmentNoteStore((state) => state.filters);
    const setFilters = useAppointmentNoteStore((state) => state.setFilters);
    const resetFilters = useAppointmentNoteStore((state) => state.resetFilters);
    const setSelectedNote = useAppointmentNoteStore((state) => state.setSelectedNote);
    const setDetailModalOpen = useAppointmentNoteStore((state) => state.setDetailModalOpen);
    const setCreateModalOpen = useAppointmentNoteStore((state) => state.setCreateModalOpen);
    
    // Get appointments for filtering
    const { appointments } = useAppointments();
    
    // Local state for active filters
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
        search: filters.searchTerm || '',
        appointmentId: filters.appointmentId ? filters.appointmentId.toString() : 'all',
        noteType: filters.noteType ? filters.noteType.toString() : 'all',
        sortBy: filters.sortBy || 'newest'
    });

    // Update local filter state when store filters change
    useEffect(() => {
        setActiveFilters({
            search: filters.searchTerm || '',
            appointmentId: filters.appointmentId ? filters.appointmentId.toString() : 'all',
            noteType: filters.noteType ? filters.noteType.toString() : 'all',
            sortBy: filters.sortBy || 'newest'
        });
    }, [filters]);

    // Query appointment notes with current filters
    const { data, isLoading, error } = useQueryAppointmentNotes(filters);

    // Handle card click to show note details
    const handleCardClick = (note: GetAppointmentNoteResponse) => {
        setSelectedNote(note);
        setDetailModalOpen(true);
    };

    // Handle filter changes from the filter component
    const handleFilterChange = (newFilters: Record<string, any>) => {
        const updatedFilters = { ...filters };
        
        // Handle search
        if ('search' in newFilters) {
            updatedFilters.searchTerm = newFilters.search || undefined;
        }
        
        // Handle appointment selection
        if ('appointmentId' in newFilters) {
            updatedFilters.appointmentId = newFilters.appointmentId && newFilters.appointmentId !== 'all' 
                ? parseInt(newFilters.appointmentId, 10)
                : undefined;
        }
        
        // Handle note type
        if ('noteType' in newFilters) {
            updatedFilters.noteType = newFilters.noteType && newFilters.noteType !== 'all' 
                ? parseInt(newFilters.noteType, 10) as NoteType
                : undefined;
        }
        
        // Handle sorting
        if ('sortBy' in newFilters) {
            updatedFilters.sortBy = newFilters.sortBy && newFilters.sortBy !== 'all'
                ? newFilters.sortBy as 'newest' | 'oldest'
                : 'newest';
        }
        
        // Update filters and reset to first page
        setFilters({ 
            ...updatedFilters,
            pageNumber: 1 
        });
    };

    const handleResetFilters = () => {
        resetFilters();
        setActiveFilters({
            search: '',
            appointmentId: 'all',
            noteType: 'all',
            sortBy: 'newest'
        });
    };

    const getNoteTypeBadge = (noteType?: NoteType) => {
        if (noteType === undefined || noteType === null) {
            return <Badge variant="secondary">{t('appointment.notes.types.unknown')}</Badge>;
        }
        
        switch (noteType) {
            case NoteType.PreAppointment:
                return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    {t(`appointment.notes.types.${noteType}`)}
                </Badge>;
            case NoteType.DuringAppointment:
                return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                    {t(`appointment.notes.types.${noteType}`)}
                </Badge>;
            case NoteType.AfterAppointment:
                return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                    {t(`appointment.notes.types.${noteType}`)}
                </Badge>;
            default:
                return <Badge variant="secondary">{t('appointment.notes.types.unknown')}</Badge>;
        }
    };

    const getAppointmentName = (appointmentId: number) => {
        // First ensure appointmentId exists and is valid
        if (!appointmentId || isNaN(appointmentId)) {
            return t('appointment.notes.invalidAppointment');
        }
        
        // Find the appointment in the array
        const appointment = appointments.find(a => a.id === appointmentId);
        
        // Handle case when appointment doesn't exist
        if (!appointment) {
            console.warn(`Appointment with ID ${appointmentId} not found`);
            return t('appointment.notes.appointmentNotFound');
        }
        
        // Now that we've verified appointment exists, handle date formatting
        try {
            const date = new Date(appointment.start);
            if (isNaN(date.getTime())) {
                return `${appointment.clientName} - ${t('common.invalidDate')}`;
            }
            return `${appointment.clientName} - ${format(date, 'dd/MM/yyyy')}`;
        } catch (err) {
            console.error('Date formatting error:', err);
            return `${appointment.clientName} - ${t('common.invalidDate')}`;
        }
    };

    // Define filter options
    const filterOptions: FilterOption[] = [
        {
            id: 'appointmentId',
            label: t('appointment.label'),
            type: 'select',
            options: appointments.map(appointment => {
                let dateDisplay = t('common.invalidDate');
                try {
                    const date = new Date(appointment.start);
                    if (!isNaN(date.getTime())) {
                        dateDisplay = format(date, 'dd/MM/yyyy HH:mm');
                    }
                } catch (err) {
                    console.error('Date formatting error:', err);
                }
                
                return {
                    value: appointment.id.toString(),
                    label: `${appointment.clientName} - ${dateDisplay}`
                };
            }),
            placeholder: t('appointment.filter.selectAppointment')
        },
        {
            id: 'noteType',
            label: t('appointment.notes.type'),
            type: 'select',
            options: [
                { value: NoteType.PreAppointment.toString(), label: t('appointment.notes.types.1') },
                { value: NoteType.DuringAppointment.toString(), label: t('appointment.notes.types.2') },
                { value: NoteType.AfterAppointment.toString(), label: t('appointment.notes.types.3') }
            ],
            placeholder: t('appointment.notes.filter.selectType')
        },
        {
            id: 'sortBy',
            label: t('common.sort'),
            type: 'select',
            options: [
                { value: 'newest', label: t('appointment.notes.filter.newest') },
                { value: 'oldest', label: t('appointment.notes.filter.oldest') }
            ],
            placeholder: t('common.sortBy')
        }
    ];

    // Define columns for the card data grid
    const columns: CardColumn<GetAppointmentNoteResponse>[] = [
        {
            key: 'appointmentInfo',
            title: t('appointment.label'),
            primary: true,
            render: (note) => getAppointmentName(note?.appointmentId)
        },
        {
            key: 'noteType',
            title: t('appointment.notes.type'),
            header: true,
            render: (note) => getNoteTypeBadge(note?.noteType)
        },
        {
            key: 'note',
            title: t('appointment.notes.content'),
            secondary: true,
            render: (note) => {
                const noteText = note?.note || '';
                return noteText.length > 100 ? `${noteText.substring(0, 100)}...` : noteText;
            }
        },
        {
            key: 'createdAt',
            title: t('common.createdAt'),
            render: (note) => {
                if (!note || !note.createdAt) {
                    return <div className="flex items-center">
                        <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                        {t('common.invalidDate')}
                    </div>;
                }
                
                try {
                    const date = new Date(note.createdAt);
                    if (isNaN(date.getTime())) {
                        return <div className="flex items-center">
                            <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                            {t('common.invalidDate')}
                        </div>;
                    }
                    
                    return <div className="flex items-center">
                        <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                        {format(date, 'dd/MM/yyyy HH:mm')}
                    </div>;
                } catch (err) {
                    console.error('Date formatting error:', err);
                    return <div className="flex items-center">
                        <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                        {t('common.invalidDate')}
                    </div>;
                }
            }
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t('appointment.notes.list.title')}</h2>
                <Button onClick={() => setCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('appointment.notes.add')}
                </Button>
            </div>
            
            <CardDataGridFilter
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                activeFilters={activeFilters}
                showFilterToggle={true}
                searchColumn="search"
            />
            
            <CardDataGrid
                data={data?.items || []}
                columns={columns}
                loading={isLoading}
                error={error}
                onCardClick={handleCardClick}
                pagination={data ? {
                    currentPage: data.pageNumber,
                    pageSize: data.pageSize,
                    totalItems: data.totalCount,
                    onPageChange: (page) => setFilters({ ...filters, pageNumber: page }),
                    onPageSizeChange: (size) => setFilters({ 
                        ...filters,
                        pageSize: size,
                        pageNumber: 1
                    }),
                    pageSizeOptions: [5, 10, 25, 50],
                    showPageSizeSelector: true
                } : undefined}
                layoutOptions={{
                    grid: { xs: 1, sm: 1, md: 1, lg: 1 },
                    cardSize: 'default',
                    vertical: true
                }}
            />
            
            <AppointmentNoteDetailDialog />
            <AppointmentNoteCreateDialog />
            {/* <AppointmentNoteDeleteDialog /> */}
        </div>
    );
} 