import { useState, useEffect } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Outlet, useNavigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import PetsListingPage from './pages/Pets'
import PetDetailsPage from './pages/PetDetails'
import AdminPetsView from './pages/AdminPetsView'
import AdminApplicationsView from './pages/AdminApplicationsView'
import './App.css';

export function Layout({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setIsLoggedIn(false); 
    navigate('/login'); 
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary position-fixed w-100">
        <Container>
          <Navbar.Brand href="/">Paws and Tails</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/pets">Pets</Nav.Link>
              {isLoggedIn && <Nav.Link href="/dashboard/pets">Admin Pets</Nav.Link>}
              {isLoggedIn && <Nav.Link href="/dashboard/applications">Admin Applications</Nav.Link>}
              {!isLoggedIn && <Nav.Link href="/login">Login</Nav.Link>}
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}>
          <Route path="signup" element={<Signup/>} />
          <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="pets" element={<PetsListingPage/>} />
          <Route path="pets/:id" element={<PetDetailsPage/>} />
          <Route path="dashboard/pets" element={isAdmin ? <AdminPetsView/> : <Navigate to="/"/>} />
          <Route path="dashboard/applications" element={isAdmin ? <AdminApplicationsView/> : <Navigate to="/"/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
