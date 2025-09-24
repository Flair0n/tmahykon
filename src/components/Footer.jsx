import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <footer id="footer" className="footer-area bg-img">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="footer-content">
              <div className="footer-logo">
                <h3>TMA HYKON</h3>
                <p>Innovation Challenge</p>
              </div>

              <div className="footer-nav">
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
                    }}>Challenge Purpose</a>
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
                </ul>
              </div>

              <div className="contact-info">
                <p>
                  <i className="fa fa-envelope"></i> Email:
                  info@tmathrissur.com, tma.tcr@gmail.com
                </p>
                <p style={{ color: '#bdbdbd', marginTop: 8 }}>
                  If you have any doubts, contact: <i className="fa fa-phone" style={{ marginLeft: 6, marginRight: 4 }}></i>
                  <a href="tel:9895760505" style={{ color: '#7676BF', textDecoration: 'underline', marginLeft: 2 }}>9895760505</a>
                </p>
              </div>

              <div className="copyright-text">
                <p>
                  © 2025 TMA HYKON Innovation Challenge. All Rights Reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;