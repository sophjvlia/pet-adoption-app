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
import axios from 'axios';

const AdminApplicationsView = () => {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch applications on component load
  useEffect(() => {
    fetchApplications();
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
