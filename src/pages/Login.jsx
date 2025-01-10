import { Container, Row, Col, Form, FloatingLabel, Button, Modal, Spinner } from 'react-bootstrap'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import '../App.css'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogIn(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const response = await axios.post('https://pet-adoption-api-v2.vercel.app/login', { email, password });
      const { user, token } = response.data;
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('token', token);
      navigate('/pets');
    } catch (error) {
      setMessage(error.response.data.error);
      setShowModal(true);
      console.error('Error during login:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container fluid className="d-flex justify-content-center align-items-center h-100">
      <Row className="d-flex justify-content-center align-items-center w-100">
        <Col lg={5}>
          <div className="signup-container bg-light bg-gradient p-4 pb-2 rounded rounded-full shadow">
            <h4 className="mt-1 mb-4">
              Log In
            </h4>
            <Form onSubmit={handleLogIn}>
              <Form.Group className="mb-3">
                <FloatingLabel controlId="email" label="Email">
                  <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </FloatingLabel>
              </Form.Group>

              <Form.Group className="mb-4">
                <FloatingLabel controlId="password" label="Password">
                  <Form.Control type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </FloatingLabel>
              </Form.Group>

              <Button type="submit" className="my-1 py-2 w-100" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Log In'}
              </Button>

              <p className="mt-2">Don't have an account? <Link to="/signup">Sign up here</Link></p>
            </Form>
          </div>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
