import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const AdminPetsView = () => {
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(
          'https://04f998f0-ccf3-4018-b568-26432c01ec37-00-27ggrvg7746p7.sisko.replit.dev/pets'
        );
        const responseData = response.data.data;

        if (responseData) {
          // Use spread operator to immutably update state
          setPets(responseData);
          console.log(responseData);
        }
      } catch (error) {
        console.error('Error fetching pet data:', error);
      }
    };

    fetchPets(); // Call the async function
  }, []);

  const [pets, setPets] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [status, setStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    gender: '',
    age: '',
    description: '',
    image: '',
    status: '',
  });

  // Handle pet species change
  const handleSpeciesChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (value.trim().toLowerCase() == 'dog') {
      try {
        const response = await axios.get(
          'https://04f998f0-ccf3-4018-b568-26432c01ec37-00-27ggrvg7746p7.sisko.replit.dev/dog/breeds'
        );
        const responseData = response.data.data;

        if (responseData) {
          const breeds = [];

          responseData.forEach((data) => {
            breeds.push({
              id: data.id,
              name: data.breed,
            });
          });

          setBreeds(breeds);
        }
      } catch (error) {
        console.error('Error fetching dog breeds:', error);
      }
    } else if (value.trim().toLowerCase() == 'cat') {
      try {
        const response = await axios.get(
          'https://04f998f0-ccf3-4018-b568-26432c01ec37-00-27ggrvg7746p7.sisko.replit.dev/cat/breeds'
        );
        const responseData = response.data.data;

        if (responseData) {
          const breeds = [];

          responseData.forEach((data) => {
            breeds.push({
              id: data.id,
              name: data.breed,
            });
          });

          setBreeds(breeds);
        }
      } catch (error) {
        console.error('Error fetching cat breeds:', error);
      }
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    console.log(file);
    setFormData({ ...formData, ['image']: file });
  };

  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Add new pet
  const handleAddPet = async () => {
    try {
      const response = await axios.post(
        'https://04f998f0-ccf3-4018-b568-26432c01ec37-00-27ggrvg7746p7.sisko.replit.dev/pets',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response);

      // Add the new pet to the local state only after a successful response
      setPets([...pets, { ...response.data, id: pets.length + 1 }]); // Use the server response to populate the pet list
      setShowAddModal(false);

      // Reset the form data
      setFormData({
        name: '',
        species: '',
        breed: '',
        gender: '',
        age: '',
        description: '',
        image: '',
        status: '',
      });
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  // Edit pet
  const handleEditPet = async () => {
    try {
      const response = await axios.put(
        'https://04f998f0-ccf3-4018-b568-26432c01ec37-00-27ggrvg7746p7.sisko.replit.dev/pets',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response);

      setShowEditModal(false);

      // Reset the form data
      setFormData({
        name: '',
        species: '',
        breed: '',
        gender: '',
        age: '',
        description: '',
        image: '',
        status: '',
      });
    } catch (error) {
      console.error('Error during login:', error);
    }
    setPets(
      pets.map((pet) =>
        pet.id === selectedPet.id ? { ...selectedPet, ...formData } : pet
      )
    );
    setShowEditModal(false);
    setFormData({ name: '', species: '', breed: '' });
  };

  // Delete pet
  const handleDeletePet = async (id) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        const response = await axios.delete(`https://04f998f0-ccf3-4018-b568-26432c01ec37-00-27ggrvg7746p7.sisko.replit.dev/pets/${id}`);
        console.log(response);
  
        // Reset the form data
        setFormData({
          name: '',
          species: '',
          breed: '',
          gender: '',
          age: '',
          description: '',
          image: '',
          status: '',
        });

        fetchPets();
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  };

  // Open edit modal and prefill form
  const handleEditClick = (pet) => {
    console.log(pet);
    setSelectedPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      gender: pet.gender,
      age: pet.age,
      description: pet.description,
      image: pet.image_url,
      status: pet.status,
    });
    setShowEditModal(true);
  };

  return (
    <Container>
      {/* Title */}
      <Row className="mt-5 py-5">
        <Col>
          <h2 className="text-center">Admin Pets Management</h2>
        </Col>
      </Row>

      {/* Add Pet Button */}
      <Row className="mb-3">
        <Col className="text-end">
          <Button variant="success" onClick={() => setShowAddModal(true)}>
            Add New Pet
          </Button>
        </Col>
      </Row>

      {/* Pets Table */}
      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Description</th>
                <th>Image</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr key={pet.id}>
                  <td>{pet.id}</td>
                  <td>{pet.name}</td>
                  <td>{pet.species}</td>
                  <td>{pet.breed}</td>
                  <td>{pet.gender}</td>
                  <td>{pet.age}</td>
                  <td>{pet.description}</td>
                  <td>
                    <img width="50" src={pet.image} />
                  </td>
                  <td>{pet.status}</td>
                  <td>
                    <Button
                      variant="info"
                      className="me-2"
                      onClick={() => handleEditClick(pet)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeletePet(pet.id)}
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

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Pet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="petName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter pet name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="petSpecies" className="mb-3">
              <Form.Label>Species</Form.Label>
              <Form.Select name="species" onChange={handleSpeciesChange}>
                <option value="">Select One</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </Form.Select>
            </Form.Group>
            {breeds && breeds.length > 0 && (
              <Form.Group controlId="petBreed" className="mb-3">
                <Form.Label>Breed</Form.Label>
                <Form.Select name="breed" onChange={handleInputChange}>
                  <option value="">Select One</option>
                  {breeds.map((breed) => (
                    <option key={breed.id} value={breed.id}>
                      {breed.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            <Form.Group controlId="petGender" className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" onChange={handleInputChange}>
                <option value="">Select One</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="petAge" className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter pet age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="petDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter pet description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="petImage" className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group controlId="petStatus" className="mb-3">
              <Form.Label>Status</Form.Label>
              <div className="d-flex justify-content-evenly align-items-center">
                {[
                  { label: 'Active', value: 1 },
                  { label: 'Pending Adoption', value: 2 },
                  { label: 'Adopted', value: 3 },
                  { label: 'Inactive', value: 0 },
                ].map((option) => (
                  <Form.Check
                    key={option.value}
                    type="radio"
                    label={option.label}
                    value={option.value}
                    name="status"
                    checked={status === option.value}
                    onChange={handleStatusChange}
                  />
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAddPet}>
            Add Pet
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="petName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter pet name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="petSpecies" className="mb-3">
              <Form.Label>Species</Form.Label>
              <Form.Select
                name="species"
                value={formData.species || ''}
                onChange={handleSpeciesChange}
              >
                <option value="">Select One</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="petBreed" className="mb-3">
              <Form.Label>Breed</Form.Label>
              <Form.Select
                name="breed"
                value={formData.breed || ''}
                onChange={handleInputChange}
              >
                <option value="">Select One</option>
                {breeds.map((breed) => (
                  <option key={breed.id} value={breed.id}>
                    {breed.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="petGender" className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender || ''}
                onChange={handleInputChange}
              >
                <option value="">Select One</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="petAge" className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter pet age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="petDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter pet description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="petImage" className="mb-3">
              <Form.Label>Image</Form.Label>
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Pet"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                  }}
                />
              )}
              <Form.Control
                type="file"
                name="image"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group controlId="petStatus" className="mb-3">
              <Form.Label>Status</Form.Label>
              <div className="d-flex justify-content-evenly align-items-center">
                {[
                  { label: 'Active', value: 1 },
                  { label: 'Pending Adoption', value: 2 },
                  { label: 'Adopted', value: 3 },
                  { label: 'Inactive', value: 0 },
                ].map((option) => (
                  <Form.Check
                    key={option.value}
                    type="radio"
                    label={option.label}
                    value={option.value}
                    name="status"
                    checked={formData.status == option.value}
                    onChange={handleStatusChange}
                  />
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditPet}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPetsView;
