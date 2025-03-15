import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ClientSearch } from "@/components/clients/client-search";
import { ClientStats } from "@/components/clients/client-stats";
import { CreateClientDialog } from "@/components/clients/create-client-dialog";
import { DataTablePagination } from "@/components/common/DataTablePagination";
import { useTranslation } from "react-i18next";

// Mock data for client list
const mockClients = [
  {
    id: 1,
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "+1234567890",
    lastVisit: "2024-01-15",
    status: "Active",
    nextAppointment: "2024-02-01",
  },
  {
    id: 2,
    fullName: "Jane Smith",
    email: "jane@example.com",
    phoneNumber: "+1234567891",
    lastVisit: "2024-01-20",
    status: "Pending",
    nextAppointment: "2024-02-03",
  },
  // Add more mock clients to demonstrate pagination
  {
    id: 3,
    fullName: "Robert Johnson",
    email: "robert@example.com",
    phoneNumber: "+1234567892",
    lastVisit: "2024-01-18",
    status: "Active",
    nextAppointment: "2024-02-05",
  },
  {
    id: 4,
    fullName: "Emily Davis",
    email: "emily@example.com",
    phoneNumber: "+1234567893",
    lastVisit: "2024-01-22",
    status: "Active",
    nextAppointment: "2024-02-10",
  },
  {
    id: 5,
    fullName: "Michael Wilson",
    email: "michael@example.com",
    phoneNumber: "+1234567894",
    lastVisit: "2024-01-25",
    status: "Pending",
    nextAppointment: "2024-02-15",
  },
];

export default function ClientListPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3); // Number of clients per page

  const filteredClients = mockClients
    .filter((client) =>
      Object.values(client).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name-desc":
          return b.fullName.localeCompare(a.fullName);
        case "recent":
          return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
        case "oldest":
          return new Date(a.lastVisit).getTime() - new Date(b.lastVisit).getTime();
        default:
          return a.fullName.localeCompare(b.fullName);
      }
    });

  // Calculate pagination
  const totalItems = filteredClients.length;
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container m-0">
        <div className="flex justify-between items-center mb-8 section pb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('client.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('client.management')}
            </p>
          </div>
          <CreateClientDialog />
        </div>

        <div className="section pb-6 mb-6">
          <ClientStats />
        </div>
        
        <div className="section pb-6 mb-6">
          <ClientSearch
            onSearchChange={setSearchQuery}
            onSortChange={setSortBy}
          />
        </div>

        <div className="table-container mb-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{t('client.name')}</TableHead>
                <TableHead>{t('client.email')}</TableHead>
                <TableHead>{t('client.phone')}</TableHead>
                <TableHead>{t('client.status')}</TableHead>
                <TableHead>{t('client.lastVisit')}</TableHead>
                <TableHead>{t('client.nextAppointment')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClients.length > 0 ? (
                paginatedClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{client.fullName}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phoneNumber}</TableCell>
                    <TableCell>
                      <span className={`status-badge ${
                        client.status === 'Active' ? 'status-active' : 'status-pending'
                      }`}>
                        {client.status}
                      </span>
                    </TableCell>
                    <TableCell>{client.lastVisit}</TableCell>
                    <TableCell>{client.nextAppointment}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/dashboard/clients/${client.id}`}>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                          {t('client.viewDetails')}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    {t('client.noClients')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalItems > 0 && (
          <div className="mt-4 pagination">
            <DataTablePagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[3, 5, 10, 25]}
              showPageSizeSelector={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}