import Statistics from '../../components/Admin/StatisticsCard';
import NavBar from '../../components/Shared/Navbar';

function AdminStatisticsPage() {
  return (
    <div className="container mx-auto p-4">
      <NavBar />
      <Statistics />
    </div>
  );
}

export default AdminStatisticsPage;