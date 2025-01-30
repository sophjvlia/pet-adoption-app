import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Spinner
} from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { PopupWidget } from 'react-calendly';
import axios from 'axios';

const AdminApplicationsView = () => {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch applications on component load
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('https://pet-adoption-api-v2.vercel.app/applications');
      setApplications(response.data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleEditClick = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const updateStatus = async (id) => {
    setLoading(true);

    try {

      const statusMap = {
        approved: 1,
        pending: 0,
        rejected: -1
      };

      const response = await axios.put(
        `https://pet-adoption-api-v2.vercel.app/application/${id}/status`,
        { 
          status: statusMap[selectedApplication.status],
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

    } catch (error) {
      console.error('Error during updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      await axios.delete(`https://pet-adoption-api-v2.vercel.app/applications/${id}`);
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
                <th>Applicant</th>
                <th>Pet</th>
                <th>Living Situation</th>
                <th>Experience</th>
                <th>Household</th>
                <th>Work Status</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application, index) => (
                <tr key={application.id}>
                  <td>{index + 1}</td>
                  <td>{application.first_name + ' ' + application.last_name}</td>
                  <td>{application.pet_name}</td>
                  <td>{application.living_situation}</td>
                  <td>{application.experience ? 'Yes' : 'No'}</td>
                  <td>{application.household_members}</td>
                  <td>{application.work_schedule}</td>
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
            <Modal.Title>Application Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <h4>Applicant</h4>
              <Form.Group controlId="full_name" className="mb-2">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={`${selectedApplication.first_name} ${selectedApplication.last_name}`}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="phone_number" className="mb-2">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={`+${selectedApplication.country_code} ${selectedApplication.phone_number}`}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  defaultValue={selectedApplication.email}
                  readOnly
                />
              </Form.Group>

              <h4>Pet</h4>
              <Form.Group controlId="pet_name" className="mb-2">
                <Form.Label>Pet Name</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.pet_name}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="species" className="mb-2">
                <Form.Label>Species</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.species}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="breed_name" className="mb-2">
                <Form.Label>Breed</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.breed_name}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="gender" className="mb-2">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.gender}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="age" className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.age}
                  readOnly
                />
              </Form.Group>

              <h4>Details</h4>
              <Form.Group controlId="experience" className="mb-2">
                <Form.Label>Experience</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.experience ? "Yes" : "No"}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="work_schedule" className="mb-2">
                <Form.Label>Work Schedule</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.work_schedule}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="time_commitment" className="mb-2">
                <Form.Label>Time Commitment</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.time_commitment}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="living_situation" className="mb-2">
                <Form.Label>Living Situation</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.living_situation}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="outdoor_space" className="mb-2">
                <Form.Label>Outdoor Space</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.outdoor_space}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="travel_frequency" className="mb-2">
                <Form.Label>Travel Frequency</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.travel_frequency}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="household_members" className="mb-2">
                <Form.Label>Household Members</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.household_members}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="pet_allergies" className="mb-2">
                <Form.Label>Pet Allergies</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.pet_allergies}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="pet_types_cared_for" className="mb-2">
                <Form.Label>Pet Types Cared For</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.pet_types_cared_for}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="pet_training" className="mb-2">
                <Form.Label>Pet Training</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.pet_training}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="adoption_reason" className="mb-3">
                <Form.Label>Adoption Reason</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedApplication.adoption_reason}
                  readOnly
                />
              </Form.Group>

              <h4>Application Status</h4>
              <Form.Group controlId="status" className="mb-2">
                <div className="d-flex justify-content-start align-items-center">
                  <Form.Check
                    type="radio"
                    className="me-4"
                    label="Approved"
                    name="applicationStatus"
                    value="approved"
                    checked={selectedApplication.status === "approved"}
                    onChange={(e) => setSelectedApplication({ ...selectedApplication, status: e.target.value })}
                  />
                  <Form.Check
                    type="radio"
                    className="me-4"
                    label="Pending"
                    name="applicationStatus"
                    value="pending"
                    checked={selectedApplication.status === "pending"}
                    onChange={(e) => setSelectedApplication({ ...selectedApplication, status: e.target.value })}
                  />
                  <Form.Check
                    type="radio"
                    className="me-4"
                    label="Rejected"
                    name="applicationStatus"
                    value="rejected"
                    checked={selectedApplication.status === "rejected"}
                    onChange={(e) => setSelectedApplication({ ...selectedApplication, status: e.target.value })}
                  />
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            <Button type="button" className="my-1 py-2 w-100" onClick={() => updateStatus(selectedApplication.id)} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default AdminApplicationsView;
