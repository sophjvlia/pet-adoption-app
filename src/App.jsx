import { useEffect } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Outlet, useNavigate, Navigate, useLocation, Link } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import PetsListingPage from './pages/Pets'
import PetDetailsPage from './pages/PetDetails'
import AdminPetsView from './pages/AdminPetsView'
import AdminApplicationsView from './pages/AdminApplicationsView'
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import pawsAndTails from './assets/paws-and-tails-bg.png'

export function Layout() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect logged-in users from Login page
  useEffect(() => {
    if (isLoggedIn && location.pathname === "/login") {
      navigate("/pets");
    }
  }, [isLoggedIn, navigate, location]);

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect after logout
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-main position-fixed w-100" style={{ zIndex: "100" }}>
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img width="150" src={pawsAndTails} alt="Paws and Tails Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/pets">Pets</Nav.Link>
              {isAdmin && <Nav.Link as={Link} to="/dashboard/pets">My Pets</Nav.Link>}
              <Nav.Link as={Link} to="/dashboard/applications">My Applications</Nav.Link>
              {!isLoggedIn && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
              {isLoggedIn && <Nav.Link onClick={handleLogout}>Logout</Nav.Link>}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="pets" element={<PetsListingPage />} />
            <Route path="pets/:id" element={<PetDetailsPage />} />
            <Route path="dashboard/pets" element={<AdminPetsView />} />
            <Route path="dashboard/applications" element={<AdminApplicationsView />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
