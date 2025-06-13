import QRScanner from "../../components/Attendees/QRScanner";
import NavBar from '../../components/Shared/Navbar';

function ScanPage() {
  return (
    <div className="container mx-auto p-4">
      <NavBar />
      <QRScanner />
    </div>
  );
}

export default ScanPage;