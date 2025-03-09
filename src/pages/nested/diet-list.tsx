import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import DietList from '@/components/diet/DietList';
import DietFilters from '@/components/diet/DietFilters';
import DietCreateDialog from '@/components/diet/DietCreateDialog';
import { useDietStore } from '@/stores/diet-store';
import { Plus } from 'lucide-react';

export default function DietListPage() {
    const { t } = useTranslation();
    const setCreateModalOpen = useDietStore((state) => state.setCreateModalOpen);

    const handleCreate = () => {
        setCreateModalOpen(true);
    };

    return (
        <div className="container py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t('diet.title')}</h1>
                <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('diet.create')}
                </Button>
            </div>

            <DietFilters />
            <DietList />
            <DietCreateDialog />
        </div>
    );
}
