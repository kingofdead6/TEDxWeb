import LoginForm from '../../components/Auth/LoginForm';
import NavBar from '../../components/Shared/Navbar';

function LoginPage() {
  return (
    <div className="container mx-auto p-4">
      <NavBar />
      <LoginForm />
    </div>
  );
}

export default LoginPage;