import UserTable from '../../components/Admin/UsersTable';
import NavBar from '../../components/Shared/Navbar';

function AdminUsersPage() {
  return (
    <div className="container mx-auto p-4">
      <NavBar />
      <UserTable />
    </div>
  );
}

export default AdminUsersPage;