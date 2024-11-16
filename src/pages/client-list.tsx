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
];

export default function ClientListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Client Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor your client base
            </p>
          </div>
          <CreateClientDialog />
        </div>

        <ClientStats />
        
        <ClientSearch
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
        />

        <div className="bg-card rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Next Appointment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{client.fullName}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phoneNumber}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {client.status}
                    </span>
                  </TableCell>
                  <TableCell>{client.lastVisit}</TableCell>
                  <TableCell>{client.nextAppointment}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/clients/${client.id}`}>
                      <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}