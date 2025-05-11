import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { useDietStore } from "@/stores/diet-store";
import DietCreateDialog from "@/components/diet/DietCreateDialog";
import DietCardList from "@/components/diet/DietCardList";
import { useState } from "react";

const DietsPage = () => {
  const { t } = useTranslation();
  const setCreateModalOpen = useDietStore((state) => state.setCreateModalOpen);
  const isCreateModalOpen = useDietStore((state) => state.isCreateModalOpen);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('diet.title')}</h1>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('diet.create')}
        </Button>
      </div>
      
      <DietCardList />
      
      {isCreateModalOpen && <DietCreateDialog />}
    </div>
  );
};

export default DietsPage; 