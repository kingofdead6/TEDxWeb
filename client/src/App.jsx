import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Home from './pages/Home';
import Events from './pages/Events';
import AboutUs from "./pages/AboutUs/AboutUs";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Footer from "./components/shared/Footer";
import NavBar from "./components/shared/NavBar";
import Partners from "./pages/Discover/Partners";
import Speakers from "./pages/Discover/Speakers";
import Involved from "./pages/Discover/Involved";
import Preformer from "./pages/Forms/Preformer/Preformer";
import Press from "./pages/Forms/Press/Press";
import Volunteers from "./pages/Forms/Volunteers/Volunteers";
import Speaker from "./pages/Forms/Speakers/Speakers";
import Partner from "./pages/Forms/Partners/Partners";
import Reserve from "./pages/Forms/Reserve/Reserve";
import HomePage from "./components/CheckIns/pages/Home/HomePage";
import LoginPage from "./components/CheckIns/pages/Auth/LoginPage";
import RegisterPage from "./components/CheckIns/pages/Auth/RegisterPage";
import EventsPage from "./components/CheckIns/pages/User/EventsPage";
import AttendeesPage from "./components/CheckIns/pages/User/AttendeesPage";
import ScanPage from "./components/CheckIns/pages/User/ScanPage";
import ProfilePage from "./components/CheckIns/pages/User/ProfilePage";
import AdminEventsPage from "./components/CheckIns/pages/Admin/AdminEventsPage";
import AdminUsersPage from "./components/CheckIns/pages/Admin/AdminUsersPage";
import AdminStatisticsPage from "./components/CheckIns/pages/Admin/AdminStatisticsPage";
import AdminAddParticipants from "./components/CheckIns/pages/Admin/AdminAddParticipants";
import AdminViewParticipants from "./components/CheckIns/pages/Admin/AdminViewParticipants";
import AdminViewContactMessages from "./components/CheckIns/pages/Admin/AdminViewContactMessages";
import EventDetailsPage from "./components/Events/EventDetailsPage";
import AdminAddEventPage from "./components/CheckIns/pages/Admin/AdminAddEventPage";
import AdminRegistraionPage from "./components/CheckIns/pages/Admin/AdminRegistraionPage";
import QrScanPage from "./components/CheckIns/components/Admin/QrScanPage";
import AdminNewsLetterPage from "./components/CheckIns/pages/Admin/AdminNewsLetterPage";

// Layout component for routes with NavBar
function MainLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes with NavBar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="discover-partners" element={<Partners />} />
          <Route path="discover-speakers" element={<Speakers />} />
          <Route path="get-involved" element={<Involved />} />
          <Route path="performer-form" element={<Preformer />} />
          <Route path="media-form" element={<Press />} />
          <Route path="volunteer-form" element={<Volunteers />} />
          <Route path="speaker-form" element={<Speaker />} />
          <Route path="partner-form" element={<Partner />} />
          <Route path="/events/:eventId/register" element={<Reserve />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* Check-ins routes without NavBar */}
        <Route path="checkins" element={<HomePage />} />
        <Route path="checkins/login" element={<LoginPage />} />
        <Route path="checkins/register" element={<RegisterPage />} />
        <Route path="checkins/events" element={<EventsPage />} />
        <Route path="checkins/events/:eventId/attendees" element={<AttendeesPage />} />
        <Route path="checkins/events/:eventId/scan" element={<ScanPage />} />
        <Route path="checkins/profile" element={<ProfilePage />} />
        <Route path="checkins/admin/events" element={<AdminEventsPage />} />
        <Route path="checkins/admin/users" element={<AdminUsersPage />} />
        <Route path="checkins/admin/statistics" element={<AdminStatisticsPage />} />
        <Route path="/checkins/admin/participants/add" element={<AdminAddParticipants />} />
        <Route path="/checkins/admin/participants/view" element={<AdminViewParticipants />} />
        <Route path="/checkins/admin/contacts" element={<AdminViewContactMessages />} />
        <Route path="/checkins/admin/events/add" element={<AdminAddEventPage />} />
        <Route path="/checkins/admin/newsletter" element={<AdminNewsLetterPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/checkins/events/:eventId/registrations" element={<AdminRegistraionPage />} />
        <Route path="/events/:eventId/scan" element={<QrScanPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;