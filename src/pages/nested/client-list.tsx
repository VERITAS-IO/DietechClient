import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { ClientStats } from "@/components/clients/client-stats";
import { CreateClientDialog } from "@/components/clients/create-client-dialog";
import ClientCardList from "@/components/clients/ClientCardList";

export default function ClientListPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('client.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('client.management')}
            </p>
          </div>
          <CreateClientDialog />
        </div>

      <div className="mb-6">
          <ClientStats />
        </div>
        
      <ClientCardList />
    </div>
  );
}