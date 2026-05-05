import AdminLayout from "@/components/admin/AdminLayout";
import LeadsView from "@/components/admin/LeadsView";
import TeamManagement from "@/components/admin/TeamManagement";
import AdminContacts from "@/components/admin/AdminContacts";
import AdminProfile from "@/pages/AdminProfile";
import { Routes, Route } from "react-router-dom";

export default function Admin() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<LeadsView />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="team" element={<TeamManagement />} />
        <Route path="profile" element={<AdminProfile />} />
      </Routes>
    </AdminLayout>
  );
}
