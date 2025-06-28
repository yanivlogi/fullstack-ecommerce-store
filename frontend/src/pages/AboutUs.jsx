import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import developerImage from '../uploads/developerImage.png';

const AboutUs = () => {
  return (
    <Container>
      <h2 style={{padding:'20px'}}>קצת עלינו</h2>
      <p style={{ textShadow: '1px 1px 2px rgb(0, 167, 209)',fontSize:'18px',textAlign:'center' , color:'#0d6efd' }}>
      במשלוח חיות מחמד, אנו נלהבים לחבר בין בעלי חיים לבתים אוהבים. אנו יודעים שמציאת חיית המחמד המושלמת יכולה להיות אתגר, וזו הסיבה שהפכנו את המשימה שלנו לפשט את התהליך. הפלטפורמה שלנו מאפשרת לך לגלוש חיות מחמד לאימוץ מן הנוחות של הבית שלך, ואנחנו מציעים שירותי משלוח מהיר ואמין כדי לקבל את החבר החדש שלך פרוותי לך מהר ככל האפשר. </p>
      <Row>
      <h2 style={{direction:'rtl' ,textAlign:'center',fontWeight:"bold" , textShadow: '0px 0px 6px rgb(0, 167, 209)' , color:'white'}}>הצוות שלנו</h2>
        <Col md={9}>
        
        </Col>
        <Col md={8}>
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
