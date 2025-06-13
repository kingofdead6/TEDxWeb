import ProfileCard from '../../components/Profile/ProfileCard';
import NavBar from '../../components/Shared/Navbar';

function ProfilePage() {
  return (
    <div className="container mx-auto p-4">
      <NavBar />
      <ProfileCard />
    </div>
  );
}

export default ProfilePage;