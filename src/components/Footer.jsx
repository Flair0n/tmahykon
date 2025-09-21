import React from "react";
import "../styles/Footer.css";

const Footer = () => {
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
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <a href="/about">Challenge Details</a>
                  </li>
                  <li>
                    <a href="/purpose">Challenge Purpose</a>
                  </li>
                  <li>
                    <a href="/awards">Awards & Support</a>
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
                  <a href="tel:9895760505" style={{ color: '#528FF0', textDecoration: 'underline', marginLeft: 2 }}>9895760505</a>
                </p>
              </div>

              <div className="copyright-text">
                <p>
                  © 2023 TMA HYKON Innovation Challenge. All Rights Reserved.
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