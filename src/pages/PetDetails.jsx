import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const PetDetail = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);

  const pet = {
    id,
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    gender: "Male",
    age: "2 years",
    status: "Available",
    description: "Buddy is a friendly and energetic dog who loves to play fetch and go on long walks.",
    image_url: "https://via.placeholder.com/200",
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container mt-5">
      <Row>
        {/* Image Section */}
        <Col md={4}>
          <img
            src={pet.image_url}
            alt={pet.name}
            className="img-fluid rounded"
          />
        </Col>

        {/* Details Section */}
        <Col md={8}>
          <h2>{pet.name}</h2>
          <p><strong>Species:</strong> {pet.species}</p>
          <p><strong>Breed:</strong> {pet.breed}</p>
          <p><strong>Gender:</strong> {pet.gender}</p>
          <p><strong>Age:</strong> {pet.age}</p>
          <p><strong>Status:</strong> {pet.status}</p>
          <p><strong>Description:</strong> {pet.description}</p>

          <Button variant="primary" onClick={handleOpenModal}>
            Adopt Me!
          </Button>
        </Col>
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Adoption Inquiry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Your Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" />
            </Form.Group>
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" />
            </Form.Group>
            <Form.Group controlId="experience" className="mt-3">
              <Form.Label>Do you have prior experience with pets?</Form.Label>
              <Form.Check type="radio" label="Yes" name="experience" />
              <Form.Check type="radio" label="No" name="experience" />
            </Form.Group>
            <Form.Group controlId="homeEnvironment" className="mt-3">
              <Form.Label>Describe your home environment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="E.g., apartment, house with a yard, etc."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="success" onClick={() => alert("Form submitted!")}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PetDetail;
