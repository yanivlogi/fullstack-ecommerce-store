import './ButtonBite.css';
import { Link } from 'react-router-dom';

const ButtonBite = ({ to = "/", children = "כניסה" }) => {
  return (
    <Link to={to} className="btn-bite">
      {children}
    </Link>
  );
};

export default ButtonBite;
