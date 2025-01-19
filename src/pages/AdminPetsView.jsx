import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Pagination
} from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion';

const AdminPetsView = () => {

  const [pets, setPets] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
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
  const [errors, setErrors] = useState({});
  // Pagination
  const [filteredPets, setFilteredPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [filters, setFilters] = useState({
    species: '',     
    breed: '', 
    gender: '',
    age: '',            
    status: '',          
    name: '',           
  });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(
          'https://pet-adoption-api-v2.vercel.app/pets'
        );
        const responseData = response.data.data;

        if (responseData) {
          setPets(responseData);
          setFilteredPets(responseData);
        }
      } catch (error) {
        console.error('Error fetching pet data:', error);
      }
    };

    fetchPets(); 
  }, []);


  useEffect(() => {
    const { species, breed, gender, age, status, name } = filters;
    const filtered = pets.filter(
      (pet) =>
        (species ? pet.species === species : true) &&
        (breed ? pet.breed_name.toLowerCase().includes(breed.toLowerCase()) : true) &&
        (gender ? pet.gender === gender : true) &&
        (age ? parseInt(pet.age, 10) === parseInt(age, 10) : true) &&
        (status ? pet.status === status : true) &&
        (name ? pet.name.toLowerCase().includes(name.toLowerCase()) : true)
    );
    setFilteredPets(filtered);
    setCurrentPage(1);
  }, [filters, pets]);


  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview); 
      }
    };
  }, [imagePreview]);


  // Pagination logic
  const indexOfLastPet = currentPage * itemsPerPage;
  const indexOfFirstPet = indexOfLastPet - itemsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(filteredPets.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [name]: value };
      console.log('Updated Filters:', updatedFilters); // Debugging
      return updatedFilters;
    });
  };
  


  // Handle pet species change
  const handleSpeciesChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    await fetchBreedsBySpecies(value);
  };


  const fetchBreedsBySpecies = async (species) => {
    if (species.trim().toLowerCase() == 'dog') {
      try {
        const response = await axios.get(
          'https://pet-adoption-api-v2.vercel.app/dog/breeds'
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
    } else if (species.trim().toLowerCase() == 'cat') {
      try {
        const response = await axios.get(
          'https://pet-adoption-api-v2.vercel.app/cat/breeds'
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
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };


  // Handle image file upload and generate temporary URL
  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    console.log(file);
    setFormData({ ...formData, ['image']: file });
    setImagePreview(URL.createObjectURL(file));
  };


  // Handle pet status change
  const handleStatusChange = (e) => {
    console.log(e.target);
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  // Validate form fields
  const validateFields = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.species) newErrors.species = 'Species is required.';
    if (!formData.breed) newErrors.breed = 'Breed is required.';
    if (!formData.gender) newErrors.gender = 'Gender is required.';
    if (!formData.age) newErrors.age = 'Age is required.';
    if (!formData.description) newErrors.description = 'Description is required.';
    if (!formData.image) newErrors.image = 'Image is required.';
    if (!formData.status) newErrors.status = 'Status is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };


  // Add new pet
  const handleAddPet = async () => {

    if (!validateFields()) {
      return; 
    }

    try {
      const response = await axios.post(
        'https://pet-adoption-api-v2.vercel.app/pets',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setPets([...pets, { ...response.data, id: pets.length + 1 }]);
      setShowAddModal(false);

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
        `https://pet-adoption-api-v2.vercel.app/pets/${selectedPet.id}`,
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
        const response = await axios.delete(`https://pet-adoption-api-v2.vercel.app/pets/${id}`);
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
  const handleEditClick = async (pet) => {
    setSelectedPet(pet);

    await fetchBreedsBySpecies(pet.species);

    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed_id,
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
          <h2 className="text-center">Pets Management</h2>
        </Col>
      </Row>

      {/* Filter Section */}
      <Row className="align-items-center mb-3">
        <Col>
          <Accordion>
            {/* Accordion Header */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                Filters
              </Accordion.Header>

              {/* Accordion Body */}
              <Accordion.Body>
                <Row>
                  <Col md={4} className="mb-2">
                    <Form.Group controlId="species">
                      <Form.Label>Species</Form.Label>
                      <Form.Control
                        as="select"
                        name="species"
                        value={filters.species}
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-2">
                    <Form.Group controlId="breed">
                      <Form.Label>Breed</Form.Label>
                      <Form.Control
                        type="text"
                        name="breed"
                        placeholder="Search by breed"
                        value={filters.breed}
                        onChange={handleFilterChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-2">
                    <Form.Group controlId="gender">
                      <Form.Label>Gender</Form.Label>
                      <Form.Control
                        as="select"
                        name="gender"
                        value={filters.gender}
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-2">
                    <Form.Group controlId="age">
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="age"
                        placeholder="Search by age"
                        value={filters.age}
                        onChange={handleFilterChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-2">
                    <Form.Group controlId="status">
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        as="select"
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        <option value="1">Active</option>
                        <option value="2">Pending Adoption</option>
                        <option value="3">Adopted</option>
                        <option value="0">Inactive</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-2">
                    <Form.Group controlId="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Search by name"
                        value={filters.name}
                        onChange={handleFilterChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col sm={2} className="d-flex justify-content-start">
          <Button
            variant="success"
            size="sm"
            className="mt-3 mt-md-0 ms-md-3 btn btn-success btn-sm"
            onClick={() => setShowAddModal(true)}
          >
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
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {currentPets.length > 0 ? (
              currentPets.map((pet, index) => (
                <tr key={pet.id}>
                  <td>{index + 1}</td>
                  <td>{pet.name}</td>
                  <td>{pet.species}</td>
                  <td>{pet.breed_name}</td>
                  <td>{pet.gender}</td>
                  <td>{pet.age}</td>
                  <td>
                    {(() => {
                      switch (pet.status) {
                        case '1':
                          return 'Active';
                        case '2':
                          return 'Pending Adoption';
                        case '3':
                          return 'Adopted';
                        case '0':
                          return 'Inactive';
                        default:
                          return 'Unknown Status';
                      }
                    })()}
                  </td>
                  <td>
                    <Button
                      variant="info"
                      className="me-md-2 mb-2 mb-md-0 btn btn-info"
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
              ))
            ) : null}
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
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </Form.Group>
            <Form.Group controlId="petSpecies" className="mb-3">
              <Form.Label>Species</Form.Label>
              <Form.Select name="species" onChange={handleSpeciesChange}>
                <option value="">Select One</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </Form.Select>
              {errors.species && <div className="text-danger">{errors.species}</div>}
            </Form.Group>
            <Form.Group controlId="petBreed" className="mb-3">
              <Form.Label>Breed</Form.Label>
              <Form.Select name="breed" onChange={handleInputChange}>
                <option value="">Select One</option>
                {breeds && breeds.length > 0 ? (
                    breeds.map((breed) => (
                      <option key={breed.id} value={breed.id}>
                        {breed.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No breeds available</option>
                  )}
              </Form.Select>
              {errors.breed && <div className="text-danger">{errors.breed}</div>}
            </Form.Group>
            <Form.Group controlId="petGender" className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" onChange={handleInputChange}>
                <option value="">Select One</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Select>
              {errors.gender && <div className="text-danger">{errors.gender}</div>}
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
              {errors.age && <div className="text-danger">{errors.age}</div>}
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
              {errors.description && <div className="text-danger">{errors.description}</div>}
            </Form.Group>
            {imagePreview && (
              <div className="my-3 mb-2 d-flex justify-content-center">
                <img
                  src={imagePreview}
                  alt="Uploaded Preview"
                  style={{ width: '100%', maxWidth: '300px', borderRadius: '10px' }}
                />
              </div>
            )}
            <Form.Group controlId="petImage" className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleFileChange}
              />
              {errors.image && <div className="text-danger">{errors.image}</div>}
            </Form.Group>
            <Form.Group controlId="petStatus" className="mb-3">
              <Form.Label>Status</Form.Label>
              <div className="d-flex justify-content-evenly align-items-center">
                {[
                  { label: 'Active', value: '1' },
                  { label: 'Pending Adoption', value: '2' },
                  { label: 'Adopted', value: '3' },
                  { label: 'Inactive', value: '0' },
                ].map((option) => (
                  <Form.Check
                    key={option.value}
                    type="radio"
                    label={option.label}
                    value={option.value}
                    name="status"
                    onChange={handleStatusChange}
                  />
                ))}
              </div>
              {errors.status && <div className="text-danger">{errors.status}</div>}
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
            {formData.image && (
              <div className="d-flex justify-content-center my-2">
                <img
                  src={formData.image}
                  alt="Pet"
                  style={{
                    width: '300px',
                    height: 'auto',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                />
              </div>
            )}
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

      {/* Pagination */}
      <Row>
        <Col>
          <Pagination className="justify-content-center">
            {[...Array(totalPages).keys()].map((pageNumber) => (
              <Pagination.Item
                key={pageNumber + 1}
                active={currentPage === pageNumber + 1}
                onClick={() => handlePageChange(pageNumber + 1)}
              >
                {pageNumber + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPetsView;
