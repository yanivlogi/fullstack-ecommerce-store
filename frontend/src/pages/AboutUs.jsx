import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import developerImage from '../uploads/developerImage.png';

const AboutUs = () => {
  return (
    <Container>
      <h1 style={{direction:'rtl' ,padding:'20px',textAlign:'center',color:'rgb(225, 13, 13)',fontWeight:"bold"}}>קצת עלינו</h1>
      <p style={{ textShadow: '1px 1px 2px pink',fontSize:'18px',textAlign:'center' }}>
      במשלוח חיות מחמד, אנו נלהבים לחבר בין בעלי חיים לבתים אוהבים. אנו יודעים שמציאת חיית המחמד המושלמת יכולה להיות אתגר, וזו הסיבה שהפכנו את המשימה שלנו לפשט את התהליך. הפלטפורמה שלנו מאפשרת לך לגלוש חיות מחמד לאימוץ מן הנוחות של הבית שלך, ואנחנו מציעים שירותי משלוח מהיר ואמין כדי לקבל את החבר החדש שלך פרוותי לך מהר ככל האפשר. </p>
      <h2>הצוות שלנו</h2>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img variant="top" src={developerImage} />
            <Card.Body>
              <Card.Title>Viktor Brusilovsky</Card.Title>
              <Card.Text>
              Full stack software developer
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Img variant="top" src={developerImage} />
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
