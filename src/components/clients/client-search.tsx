import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientSearchProps {
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export function ClientSearch({ onSearchChange, onSortChange }: ClientSearchProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('client.search')}
          className="pl-8"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select onValueChange={onSortChange} defaultValue="name-asc">
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={t('client.sort')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">{t('client.sortOptions.nameAsc')}</SelectItem>
          <SelectItem value="name-desc">{t('client.sortOptions.nameDesc')}</SelectItem>
          <SelectItem value="recent">{t('client.sortOptions.recent')}</SelectItem>
          <SelectItem value="oldest">{t('client.sortOptions.oldest')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}