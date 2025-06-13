import RegisterForm from '../../components/Auth/RegisterForm';
import NavBar from '../../components/Shared/Navbar';

function RegisterPage() {
  return (
    <div className="container mx-auto p-4 ">
      <NavBar />
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;