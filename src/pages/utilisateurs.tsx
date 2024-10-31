import { NavigationBar } from "@/components/layout/NavigationBar";
import { UserManagement } from "@/components/users/UserManagement";

const UtilisateursPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="container mx-auto p-8">
        <UserManagement />
      </div>
    </div>
  );
};

export default UtilisateursPage;