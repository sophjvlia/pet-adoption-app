import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
} from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { PopupWidget } from 'react-calendly';
import axios from 'axios';

const AdminApplicationsView = () => {
  // const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch applications on component load
  useEffect(() => {
    // fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('https://pet-adoption-api-v2.vercel.app/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleEditClick = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleDeleteApplication = async (id) => {
    try {
      await axios.delete(`/api/applications/${id}`);
      setApplications(applications.filter((app) => app.id !== id));
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const handleModalClose = () => {
    setSelectedApplication(null);
    setShowModal(false);
  };

  const applications = [
    {
      id: 1,
      user_id: 'U12345',
      pet_id: 'P56789',
      reason: 'Looking for a companion.',
      living_situation: 'Apartment',
      experience: 'Owned a dog before',
      household: 'Family of 4',
      employment_status: 'Full-Time',
      status: 'Approved',
    },
    {
      id: 2,
      user_id: 'U23456',
      pet_id: 'P67890',
      reason: 'My kids want a pet.',
      living_situation: 'House with yard',
      experience: 'No prior experience',
      household: 'Family of 3',
      employment_status: 'Part-Time',
      status: 'Pending',
    },
    {
      id: 3,
      user_id: 'U34567',
      pet_id: 'P78901',
      reason: 'I want a jogging partner.',
      living_situation: 'Condo',
      experience: 'Owned a cat before',
      household: 'Single',
      employment_status: 'Self-Employed',
      status: 'Rejected',
    },
    {
      id: 4,
      user_id: 'U45678',
      pet_id: 'P89012',
      reason: 'For emotional support.',
      living_situation: 'House with yard',
      experience: 'Volunteered at a shelter',
      household: 'Couple',
      employment_status: 'Unemployed',
      status: 'Approved',
    },
    {
      id: 5,
      user_id: 'U56789',
      pet_id: 'P90123',
      reason: 'To teach my kids responsibility.',
      living_situation: 'Apartment',
      experience: 'Owned a rabbit before',
      household: 'Family of 5',
      employment_status: 'Full-Time',
      status: 'Pending',
    },
  ];
  

  return (
    <Container>
      {/* Title */}
      <Row className="mt-5 py-5">
        <Col>
          <h2 className="text-center">Application Management</h2>
        </Col>
      </Row>

      {/* Applications Table */}
      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>User ID</th>
                <th>Pet ID</th>
                <th>Reason</th>
                <th>Living Situation</th>
                <th>Experience</th>
                <th>Household</th>
                <th>Employment Status</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>{application.id}</td>
                  <td>{application.user_id}</td>
                  <td>{application.pet_id}</td>
                  <td>{application.reason}</td>
                  <td>{application.living_situation}</td>
                  <td>{application.experience}</td>
                  <td>{application.household}</td>
                  <td>{application.employment_status}</td>
                  <td>{application.status || 'Pending'}</td>
                  <td>
                    <Button
                      variant="info"
                      className="me-2"
                      onClick={() => handleEditClick(application)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteApplication(application.id)}
                    >
                      <FaTrash />
                    </Button>
                    <PopupWidget
                      url="https://calendly.com/sophie-jcrabtree/30min"
                      rootElement={document.getElementById('root')}
                      text="Schedule"
                      color="#00a2ff"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Edit Application Modal */}
      {selectedApplication && (
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Application</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="reason">
                <Form.Label>Reason</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  defaultValue={selectedApplication.reason}
                />
              </Form.Group>
              <Form.Group controlId="livingSituation" className="mt-3">
                <Form.Label>Living Situation</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.living_situation}
                />
              </Form.Group>
              <Form.Group controlId="experience" className="mt-3">
                <Form.Label>Experience</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.experience}
                />
              </Form.Group>
              <Form.Group controlId="household" className="mt-3">
                <Form.Label>Household</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.household}
                />
              </Form.Group>
              <Form.Group controlId="employmentStatus" className="mt-3">
                <Form.Label>Employment Status</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.employment_status}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            <Button variant="primary">Save Changes</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default AdminApplicationsView;
