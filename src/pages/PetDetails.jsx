import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from 'axios';

const PetDetail = () => {
  const { id } = useParams();
  const [userId, setUserId] = useState(null);
  const [pet, setPet] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    experience: '',
    workSchedule: '',
    timeCommitment: '',
    outdoorSpace: '',
    travelFrequency: '',
    householdMembers: '',
    petAllergies: '',
    petTypesCaredFor: '',
    petTraining: '',
    adoptionReason: ''
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
      setFormData({ ...formData, user_id: storedUserId });
    }
  }, []);

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await axios.get(
          `https://pet-adoption-api-v2.vercel.app/pets/${id}`
        );
        const responseData = response.data.data;

        if (responseData) {
          setPet(responseData);
        }
      } catch (error) {
        console.error('Error fetching pet data:', error);
      }
    };
    fetchPetDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {

    if (userId) {
      const apiData = {
        user_id: userId,
        pet_id: pet.id,
        reason: formData.adoptionReason, 
        living_situation: formData.livingSituation,
        experience: formData.experience,
        household: formData.householdMembers, 
        employment_status: formData.workSchedule,
        other_pets: formData.petTypesCaredFor, 
        travel_frequency: formData.travelFrequency,
        time_dedication: formData.timeCommitment, 
        outdoor_space: formData.outdoorSpace,
        allergies: formData.petAllergies, 
        pet_training: formData.petTraining,
        pet_preferences: formData.petPreferences,
      };
      
      try {
        const response = await fetch('https://pet-adoption-api-v2.vercel.app/application', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(apiData)
        });

        if (response.ok) {
          alert('Form submitted successfully');
        } else {
          alert('Failed to submit form');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form');
      }
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container mt-5 pt-5">
      <Row>
        {/* Image Section */}
        <Col md={4}>
          <img
            src={pet.image_url}
            alt={pet.name}
            className="img-fluid rounded mb-3"
          />
          <Button variant="primary" className="w-100" onClick={handleOpenModal}>
            Adopt Me!
          </Button>
        </Col>

        {/* Details Section */}
        <Col md={8}>
          <h2>{pet.name}</h2>
          <p><strong>Species:</strong> {pet.species}</p>
          <p><strong>Breed:</strong> {pet.breed_name}</p>
          <p><strong>Gender:</strong> {pet.gender}</p>
          <p><strong>Age:</strong> {pet.age}</p>
          <p><strong>Status:</strong> {pet.status}</p>
          <p><strong>Description:</strong> {pet.description}</p>
        </Col>
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Adoption Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* <Form.Group controlId="name">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="phone" className="mt-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter your phone number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group> */}

            <Form.Group controlId="experience" className="mt-3">
              <Form.Label>Do you have prior experience with pets?</Form.Label>
              <Form.Check
                type="radio"
                label="Yes"
                name="experience"
                value="Yes"
                checked={formData.experience === 'Yes'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="No"
                name="experience"
                value="No"
                checked={formData.experience === 'No'}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="workSchedule" className="mt-3">
              <Form.Label>What is your work schedule?</Form.Label>
              <Form.Check
                type="radio"
                label="Full-time"
                name="workSchedule"
                value="Full-time"
                checked={formData.workSchedule === 'Full-time'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="Part-time"
                name="workSchedule"
                value="Part-time"
                checked={formData.workSchedule === 'Part-time'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="Flexible"
                name="workSchedule"
                value="Flexible"
                checked={formData.workSchedule === 'Flexible'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="Not currently working"
                name="workSchedule"
                value="Not currently working"
                checked={formData.workSchedule === 'Not currently working'}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="timeCommitment" className="mt-3">
              <Form.Label>How much time can you dedicate daily to caring for a pet?</Form.Label>
              <Form.Check
                type="radio"
                label="Less than 1 hour"
                name="timeCommitment"
                value="Less than 1 hour"
                checked={formData.timeCommitment === 'Less than 1 hour'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="1-3 hours"
                name="timeCommitment"
                value="1-3 hours"
                checked={formData.timeCommitment === '1-3 hours'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="3-5 hours"
                name="timeCommitment"
                value="3-5 hours"
                checked={formData.timeCommitment === '3-5 hours'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="5+ hours"
                name="timeCommitment"
                value="5+ hours"
                checked={formData.timeCommitment === '5+ hours'}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="livingSituation" className="mt-3">
              <Form.Label>What is your current living situation?</Form.Label>
              <Form.Check
                type="radio"
                label="Apartment"
                name="livingSituation"
                value="Apartment"
                checked={formData.livingSituation === 'Apartment'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="House"
                name="livingSituation"
                value="House"
                checked={formData.livingSituation === 'House'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="Townhouse"
                name="livingSituation"
                value="Townhouse"
                checked={formData.livingSituation === 'Townhouse'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="Other"
                name="livingSituation"
                value="Other"
                checked={formData.livingSituation === 'Other'}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="outdoorSpace" className="mt-3">
              <Form.Label>Do you have outdoor space for the pet?</Form.Label>
              <Form.Check
                type="radio"
                label="Yes, a fenced yard"
                name="outdoorSpace"
                value="Yes, a fenced yard"
                checked={formData.outdoorSpace === 'Yes, a fenced yard'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="Yes, an open yard"
                name="outdoorSpace"
                value="Yes, an open yard"
                checked={formData.outdoorSpace === 'Yes, an open yard'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="No, but I live near parks"
                name="outdoorSpace"
                value="No, but I live near parks"
                checked={formData.outdoorSpace === 'No, but I live near parks'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="No outdoor space"
                name="outdoorSpace"
                value="No outdoor space"
                checked={formData.outdoorSpace === 'No outdoor space'}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="travelFrequency" className="mt-3">
              <Form.Label>How often do you travel?</Form.Label>
              <Form.Check
                type="radio"
                label="Rarely"
                name="travelFrequency"
                value="Rarely"
                checked={formData.travelFrequency === 'Rarely'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="Occasionally (1-3 times per year)"
                name="travelFrequency"
                value="Occasionally (1-3 times per year)"
                checked={formData.travelFrequency === 'Occasionally (1-3 times per year)'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="Frequently (4+ times per year)"
                name="travelFrequency"
                value="Frequently (4+ times per year)"
                checked={formData.travelFrequency === 'Frequently (4+ times per year)'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="I am always traveling"
                name="travelFrequency"
                value="I am always traveling"
                checked={formData.travelFrequency === 'I am always traveling'}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="householdMembers" className="mt-3">
              <Form.Label>Do you have other members in your household?</Form.Label>
              <Form.Check
                type="radio"
                label="Yes, adults only"
                name="householdMembers"
                value="Yes, adults only"
                checked={formData.householdMembers === 'Yes, adults only'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="Yes, with children under 12"
                name="householdMembers"
                value="Yes, with children under 12"
                checked={formData.householdMembers === 'Yes, with children under 12'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="Yes, with children 12 and older"
                name="householdMembers"
                value="Yes, with children 12 and older"
                checked={formData.householdMembers === 'Yes, with children 12 and older'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="No, I live alone"
                name="householdMembers"
                value="No, I live alone"
                checked={formData.householdMembers === 'No, I live alone'}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="petAllergies" className="mt-3">
              <Form.Label>Does anyone in your household have pet allergies?</Form.Label>
              <Form.Check
                type="radio"
                label="Yes"
                name="petAllergies"
                value="Yes"
                checked={formData.petAllergies === 'Yes'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="No"
                name="petAllergies"
                value="No"
                checked={formData.petAllergies === 'No'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="Not sure"
                name="petAllergies"
                value="Not sure"
                checked={formData.petAllergies === 'Not sure'}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="petTypesCaredFor" className="mt-3">
              <Form.Label>What type of pets have you cared for before?</Form.Label>
              <Form.Check
                type="radio"
                label="Dogs"
                name="petTypesCaredFor"
                value="Dogs"
                checked={formData.petTypesCaredFor === 'Dogs'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="Cats"
                name="petTypesCaredFor"
                value="Cats"
                checked={formData.petTypesCaredFor === 'Cats'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="Small mammals (e.g., rabbits, hamsters)"
                name="petTypesCaredFor"
                value="Small mammals (e.g., rabbits, hamsters)"
                checked={formData.petTypesCaredFor === 'Small mammals (e.g., rabbits, hamsters)'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="Birds"
                name="petTypesCaredFor"
                value="Birds"
                checked={formData.petTypesCaredFor === 'Birds'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="Fish/Reptiles"
                name="petTypesCaredFor"
                value="Fish/Reptiles"
                checked={formData.petTypesCaredFor === 'Fish/Reptiles'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="None"
                name="petTypesCaredFor"
                value="None"
                checked={formData.petTypesCaredFor === 'None'}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="petTraining" className="mt-3">
              <Form.Label>Are you willing to invest time in pet training?</Form.Label>
              <Form.Check
                type="radio"
                label="Yes"
                name="petTraining"
                value="Yes"
                checked={formData.petTraining === 'Yes'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="No"
                name="petTraining"
                value="No"
                checked={formData.petTraining === 'No'}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="Not sure"
                name="petTraining"
                value="Not sure"
                checked={formData.petTraining === 'Not sure'}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="adoptionReason" className="mt-3">
              <Form.Label>Why do you want to adopt a pet?</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Explain your reasons for adopting a pet."
                name="adoptionReason"
                value={formData.adoptionReason}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PetDetail;
