import 'intl-tel-input/build/css/intlTelInput.css';
import intlTelInput from 'intl-tel-input';
import { Container, Row, Col, Form, FloatingLabel, Button, Modal, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../App.css';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [iti, setItiRef] = useState(null);
  const phoneInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const iti = intlTelInput(phoneInputRef.current, {
      initialCountry: 'my',
      utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input/build/js/utils.js',
    });

    setItiRef(iti);

    return () => {
      iti.destroy();
    };
  }, [phoneNumber]);

  const handlePhoneChange = () => {
    const currentNumber = phoneInputRef.current.value;
    setPhoneNumber(currentNumber); 
  };

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    setFirstNameError('');
    setLastNameError('');
    setPhoneNumberError('');
    setEmailError('');
    setPasswordError('');

    let valid = true;

    if (!firstName) {
      setFirstNameError('First Name is required.');
      valid = false;
    }

    if (!lastName) {
      setLastNameError('Last Name is required.');
      valid = false;
    }

    if (!iti.telInput.value) {
      setPhoneNumberError('Enter a valid phone number.');
      valid = false;
    }

    if (!email) {
      setEmailError('Email is required.');
      valid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      valid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      valid = false;
    }

    if (!valid) {
      setLoading(false);
      return;
    }

    const countryCode = iti.getSelectedCountryData().dialCode;
    const countryCodeWithoutPlus = countryCode.replace('+', '');
    const phoneWithoutCountryCode = iti.telInput.value.replace(
      `+${countryCode}`,
      ''
    );

    try {
      const response = await axios.post(
        'https://pet-adoption-api-v2.vercel.app/signup',
        { 
          firstName,
          lastName, 
          countryCode: countryCodeWithoutPlus, 
          phoneNumber: phoneWithoutCountryCode, 
          email,
          password 
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setSuccess(true);
      setShowModal(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setShowModal(true);
      console.error('Error during registration:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center h-100"
    >
      <Row className="d-flex justify-content-center align-items-center w-100">
        <Col lg={8}>
          <div className="signup-container bg-light bg-gradient p-4 pb-2 rounded rounded-full shadow">
            <h4 className="mt-1 mb-4">Sign Up</h4>
            <Form onSubmit={handleSignUp}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <Form.Group>
                    <FloatingLabel controlId="first_name" label="First Name">
                      <Form.Control
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        isInvalid={!!firstNameError}
                      />
                      <Form.Control.Feedback type="invalid" className="d-flex justify-content-start">
                        {firstNameError}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </div>

                <div className="col-md-6 mb-3">
                  <Form.Group>
                    <FloatingLabel controlId="last_name" label="Last Name">
                      <Form.Control
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        isInvalid={!!lastNameError}
                      />
                      <Form.Control.Feedback type="invalid" className="d-flex justify-content-start">
                        {lastNameError}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <Form.Group style={{ height: "70%" }}>
                    <Form.Control
                      type="tel"
                      placeholder="Phone Number"
                      ref={phoneInputRef}
                      defaultValue={phoneNumber}
                      onBlur={handlePhoneChange}
                      className="w-100 h-100"
                      isInvalid={!!phoneNumberError}
                    />
                    <Form.Control.Feedback type="invalid" className="d-flex justify-content-start">
                      {phoneNumberError}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-md-6 mb-3">
                  <Form.Group>
                    <FloatingLabel controlId="email" label="Email">
                      <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={!!emailError}
                      />
                      <Form.Control.Feedback type="invalid" className="d-flex justify-content-start">
                        {emailError}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-4">
                <FloatingLabel controlId="password" label="Password">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!passwordError}
                  />
                  <Form.Control.Feedback type="invalid" className="d-flex justify-content-start">
                    {passwordError}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>

              <Button type="submit" className="my-1 py-2 w-100" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Sign Up'}
              </Button>

              <p className="mt-2">
                Already have an account? <Link to="/login">Log in here</Link>
              </p>
            </Form>

          </div>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{success ? 'Success' : 'Error'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {success
            ? 'Registration successful!'
            : 'An error occurred. Please try again.'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            if (success) {
              navigate('/login');
            } else {
              setShowModal(false);
            }
          }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
