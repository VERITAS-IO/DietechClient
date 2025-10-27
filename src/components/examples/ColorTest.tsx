import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function ColorTest() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Light Mode Color Test</h1>
        <p className="text-muted-foreground">
          Testing the new softer, more user-friendly light mode colors
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Primary Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This card uses the new softer background colors and borders.
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Accent Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This card has a primary border to show the muted primary color.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary">
          <CardHeader>
            <CardTitle>Secondary Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-foreground">
              This card uses the secondary background color.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Buttons */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive Button</Button>
        </div>
      </div>

      {/* Form Elements */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Form Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input Field</label>
            <Input placeholder="Enter some text..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Disabled Input</label>
            <Input placeholder="Disabled input" disabled />
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>

      {/* Table */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Table</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">John Doe</TableCell>
                <TableCell>
                  <Badge variant="secondary">Active</Badge>
                </TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jane Smith</TableCell>
                <TableCell>
                  <Badge variant="outline">Pending</Badge>
                </TableCell>
                <TableCell>User</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Bob Johnson</TableCell>
                <TableCell>
                  <Badge variant="destructive">Inactive</Badge>
                </TableCell>
                <TableCell>Moderator</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Color Swatches */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Color Swatches</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-16 bg-background border rounded-md"></div>
            <p className="text-sm font-medium">Background</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-card border rounded-md"></div>
            <p className="text-sm font-medium">Card</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-primary rounded-md"></div>
            <p className="text-sm font-medium text-primary-foreground">Primary</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-secondary rounded-md"></div>
            <p className="text-sm font-medium text-secondary-foreground">Secondary</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-muted rounded-md"></div>
            <p className="text-sm font-medium text-muted-foreground">Muted</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-accent rounded-md"></div>
            <p className="text-sm font-medium text-accent-foreground">Accent</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-destructive rounded-md"></div>
            <p className="text-sm font-medium text-destructive-foreground">Destructive</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 border border-border rounded-md"></div>
            <p className="text-sm font-medium">Border</p>
          </div>
        </div>
      </div>
    </div>
  );
}
