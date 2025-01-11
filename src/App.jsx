import { Container, Nav, Navbar } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import PetsListingPage from './pages/Pets'
import AdminPetsView from './pages/AdminPetsView'
import AdminApplicationsView from './pages/AdminApplicationsView'
import './App.css';

export function Layout() {
  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary position-fixed w-100">
        <Container>
          <Navbar.Brand href="">Paws and Tails</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/pets">Pets</Nav.Link>
              <Nav.Link href="/dashboard/pets">Admin Pets</Nav.Link>
              <Nav.Link href="/dashboard/applications">Admin Applications</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet/>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="signup" element={<Signup/>} />
          <Route path="login" element={<Login/>} />
          <Route path="pets" element={<PetsListingPage/>} />
          <Route path="dashboard/pets" element={<AdminPetsView/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
