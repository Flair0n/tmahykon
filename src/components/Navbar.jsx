import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <header className={`header-area ${scrolled ? "sticky" : ""}`}>
      <div className="classy-nav-container">
        <div className="container">
          <div className="classy-navbar">
            <Link to="/" className="nav-brand">
              TMA HYKON
            </Link>

            <div className="classy-navbar-toggler" onClick={toggleMobileMenu}>
              <span className="navbarToggler"></span>
            </div>

            <div className={`classy-menu ${mobileMenu ? "menu-on" : ""}`}>
              <div className="classycloseIcon" onClick={toggleMobileMenu}>
                <div className="cross-wrap">
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div className="classynav">
                <ul>
                  <li>
                    <a href="#home" onClick={e => {
                      e.preventDefault();
                      if (location.pathname !== "/") {
                        navigate("/", { state: { scrollToTop: true } });
                      } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}>Home</a>
                  </li>
                  <li>
                    <a href="#purpose" onClick={e => {
                      e.preventDefault();
                      if (location.pathname !== "/") {
                        navigate("/", { state: { scrollToPurpose: true } });
                      } else {
                        const purpose = document.getElementById('purpose');
                        if (purpose) {
                          purpose.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          window.location.hash = '#purpose';
                        }
                      }
                    }}>Purpose</a>
                  </li>
                  <li>
                    <a href="#about" onClick={e => {
                      e.preventDefault();
                      if (location.pathname !== "/") {
                        navigate("/", { state: { scrollToAbout: true } });
                      } else {
                        const about = document.getElementById('about');
                        if (about) {
                          about.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          window.location.hash = '#about';
                        }
                      }
                    }}>Challenge Details</a>
                  </li>
                  <li>
                    <a href="#awards" onClick={e => {
                      e.preventDefault();
                      if (location.pathname !== "/") {
                        navigate("/", { state: { scrollToAwards: true } });
                      } else {
                        const awards = document.getElementById('awards');
                        if (awards) {
                          awards.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          window.location.hash = '#awards';
                        }
                      }
                    }}>Awards & Support</a>
                  </li>
                  <li>
                    <a href="#footer" onClick={e => {
                      e.preventDefault();
                      const footer = document.getElementById('footer');
                      if (footer) {
                        footer.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.location.hash = 'footer';
                      }
                    }}>Contact Us</a>
                  </li>
                  <li>
                    <a
                      href="/form"
                      className="register-now-btn"
                      style={{
                        background: '#494DCA',
                        color: '#fff',
                        borderRadius: '30px',
                        padding: '8px 18px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px #0002',
                        transition: 'background 0.2s',
                        display: 'inline-block',
                        marginRight: 0,
                      }}
                      onClick={e => {
                        e.preventDefault();
                        if (location.pathname !== "/form") {
                          navigate("/form");
                        }
                      }}
                    >
                      Register Now
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;