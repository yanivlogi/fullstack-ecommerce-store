import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaGoogle,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  const originalColors = {
    facebook: "#1877F2", // Original Facebook color
    twitter: "#1DA1F2", // Original Twitter color
    google: "#4285F4", // Original Google color
    instagram: "#C13584", // Original Instagram color
    linkedin: "#0077B5", // Original LinkedIn color
    github: "#333", // Original GitHub color
  };

  const iconStyle = {
    transition: "color 0.2s",
  };

  const handleMouseEnter = (iconName) => {
    iconStyle.color = originalColors[iconName];
  };

  const handleMouseLeave = () => {
    iconStyle.color = ""; // Reset to default color
  };

  return (
    <footer className="bg-dark text-center text-white py-5">
      <div className="container">
        <section className="mb-4">
          <p>
            We are dedicated to helping animals find their forever homes. Our mission is to connect
            adoptable pets with loving families and provide the support and resources necessary to
            ensure a successful adoption.
          </p>
        </section>
        <section>
          <a
            className="btn btn-outline-light btn-floating m-1"
            href="#!"
            role="button"
            onMouseEnter={() => handleMouseEnter("facebook")}
            onMouseLeave={handleMouseLeave}
            style={{ ...iconStyle, color: originalColors.facebook }}
          >
            <FaFacebook />
          </a>

          <a
            className="btn btn-outline-light btn-floating m-1"
            href="#!"
            role="button"
            onMouseEnter={() => handleMouseEnter("twitter")}
            onMouseLeave={handleMouseLeave}
            style={{ ...iconStyle, color: originalColors.twitter }}
          >
            <FaTwitter />
          </a>

          <a
            className="btn btn-outline-light btn-floating m-1"
            href="#!"
            role="button"
            onMouseEnter={() => handleMouseEnter("google")}
            onMouseLeave={handleMouseLeave}
            style={{ ...iconStyle, color: originalColors.google }}
          >
            <FaGoogle />
          </a>

          <a
            className="btn btn-outline-light btn-floating m-1"
            href="#!"
            role="button"
            onMouseEnter={() => handleMouseEnter("instagram")}
            onMouseLeave={handleMouseLeave}
            style={{ ...iconStyle, color: originalColors.instagram }}
          >
            <FaInstagram />
          </a>

          <a
            className="btn btn-outline-light btn-floating m-1"
            href="#!"
            role="button"
            onMouseEnter={() => handleMouseEnter("linkedin")}
            onMouseLeave={handleMouseLeave}
            style={{ ...iconStyle, color: originalColors.linkedin }}
          >
            <FaLinkedin />
          </a>

          <a
            className="btn btn-outline-light btn-floating m-1"
            href="#!"
            role="button"
            onMouseEnter={() => handleMouseEnter("github")}
            onMouseLeave={handleMouseLeave}
            style={{ ...iconStyle, color: originalColors.github }}
          >
            <FaGithub />
          </a>
        </section>
      </div>
      <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
        <p>&copy; {new Date().getFullYear()} Our Business: Animal Adoption</p>
      </div>
    </footer>
  );
};

export default Footer;
