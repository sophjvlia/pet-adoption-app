import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PetsListingPage = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [filters, setFilters] = useState({ species: '', breed: '' });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(
          'https://pet-adoption-api-v2.vercel.app/pets'
        );
        const responseData = response.data.data;

        if (responseData) {
          // Use spread operator to immutably update state
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
        (breed ? pet.breed.toLowerCase().includes(breed.toLowerCase()) : true) &&
        (gender ? pet.gender === gender : true) &&
        (age ? parseInt(pet.age, 10) === parseInt(age, 10) : true) &&
        (status ? pet.status === status : true) &&
        (name ? pet.name.toLowerCase().includes(name.toLowerCase()) : true)
    );
    setFilteredPets(filtered);
    setCurrentPage(1);
  }, [filters, pets]);
  

  // Pagination logic
  const indexOfLastPet = currentPage * itemsPerPage;
  const indexOfFirstPet = indexOfLastPet - itemsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div>
      <Container className="mt-4">
        {/* Title */}
        <Row>
          <Col>
            <h2 className="text-center">Pets Listing</h2>
          </Col>
        </Row>

        {/* Filter Section */}
        <Row className="mb-4">
          <Col md={6}>
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
          <Col md={6}>
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
          <Col md={6}>
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
          <Col md={6}>
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
          <Col md={6}>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="1">Available</option>
                <option value="0">Unavailable</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
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

        {/* Pets Listing */}
        <Row>
          {currentPets.length > 0 ? (
            currentPets.map((pet) => (
              <Col md={4} sm={6} key={pet.id} className="mb-4">
                <Card>
                  <Link to={`${pet.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Card.Img
                      variant="top"
                      src={pet.image_url}
                      alt={pet.name}
                    />
                    <Card.Body>
                      <Card.Title>{pet.name}</Card.Title>
                      <Card.Text>
                        <strong>Species:</strong> {pet.species}
                        <br />
                        <strong>Breed:</strong> {pet.breed}
                      </Card.Text>
                    </Card.Body>
                  </Link>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p className="text-center">No pets found.</p>
            </Col>
          )}
        </Row>

        {/* Pagination */}
        <Row>
          <Col>
            <Pagination className="justify-content-center">
              {Array.from(
                { length: Math.ceil(filteredPets.length / itemsPerPage) },
                (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                )
              )}
            </Pagination>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PetsListingPage;
