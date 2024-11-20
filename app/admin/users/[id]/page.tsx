import React from 'react';
import { notFound } from 'next/navigation';
import { getUserById } from '@/app/actions/users';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditUserForm } from './edit-user-form';
import { ActivityHistory } from './activity-history';

export default async function UserPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">User Details</h1>
      <div className="flex h-[calc(100vh-150px)] gap-6">
        <div className="w-1/4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong className="text-muted">Name:</strong> {user.name}
              </p>
              <p>
                <strong className="text-muted">Membership Plan:</strong> {user.membershipPlan}
              </p>
              <p>
                <strong className="text-muted">Membership Status:</strong> {user.membershipStatus}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="w-3/4">
          <Tabs defaultValue="edit" className="flex h-full flex-col">
            <TabsList>
              <TabsTrigger value="edit">Edit User</TabsTrigger>
              <TabsTrigger value="activity">Activity History</TabsTrigger>
            </TabsList>
            <TabsContent value="edit" className="flex-grow">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Edit User</CardTitle>
                </CardHeader>
                <CardContent>
                  <EditUserForm user={user} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity" className="flex-grow">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityHistory userId={user.id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
