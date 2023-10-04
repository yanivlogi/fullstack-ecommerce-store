import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const AboutUs = () => {
  return (
    <Container>
      <h1 style={{direction:'rtl' ,padding:'20px'}}>קצת עלינו</h1>
      <p>
        At Pet Delivery, we're passionate about connecting animals with loving homes. We know that finding the perfect pet can be a challenge, which is why we've made it our mission to simplify the process. Our platform allows you to browse adoptable pets from the comfort of your own home, and we offer fast and reliable delivery services to get your new furry friend to you as quickly as possible.
      </p>
      <h2>הצוות שלנו</h2>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img variant="top" src="https://www.seekpng.com/png/full/202-2024994_profile-icon-profile-logo-no-background.png" />
            <Card.Body>
              <Card.Title>Victor Brobslovsky</Card.Title>
              <Card.Text>
              Full stack software developer
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Img variant="top" src="https://www.seekpng.com/png/full/202-2024994_profile-icon-profile-logo-no-background.png" />
            <Card.Body>
              <Card.Title>Yaniv Logi</Card.Title>
              <Card.Text>
              Full stack software developer 
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
