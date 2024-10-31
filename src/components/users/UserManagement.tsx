import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserList } from "./UserList";
import { UserForm } from "./UserForm";
import { ActivityLog } from "./ActivityLog";
import { RolePermissions } from "./RolePermissions";

export const UserManagement = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
      
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="new">Nouveau Utilisateur</TabsTrigger>
          <TabsTrigger value="roles">Rôles et Permissions</TabsTrigger>
          <TabsTrigger value="activity">Journal d'Activité</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserList />
        </TabsContent>

        <TabsContent value="new">
          <UserForm />
        </TabsContent>

        <TabsContent value="roles">
          <RolePermissions />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityLog />
        </TabsContent>
      </Tabs>
    </div>
  );
};