import React, { useState } from 'react';
import '../styles/Partners.css';

const Partners = () => {
  const [activeTab, setActiveTab] = useState('technical');

  const partnerCategories = {
    technical: {
      title: 'Technical Partner',
      icon: 'fas fa-code',
      color: '#8b5cf6',
      partners: [
        { name: 'Cloud Solutions Partner', icon: 'fas fa-cloud', description: 'Technology Solutions' },
        { name: 'Platform Partner', icon: 'fas fa-server', description: 'Cloud Infrastructure' },
        { name: 'Infrastructure Partner', icon: 'fas fa-database', description: 'Platform Services' }
      ]
    },
    community: {
      title: 'Community Partner',
      icon: 'fas fa-users',
      color: '#f59e0b',
      partners: [
        { name: 'Community Partner 1', icon: 'fas fa-handshake', description: 'Developer Community' },
        { name: 'Community Partner 2', icon: 'fas fa-user-friends', description: 'Innovation Network' },
        { name: 'Community Partner 3', icon: 'fas fa-globe', description: 'Global Outreach' }
      ]
    },
    media: {
      title: 'Media Partner',
      icon: 'fas fa-broadcast-tower',
      color: '#8b5cf6',
      partners: [
        { name: 'Media Partner 1', icon: 'fas fa-newspaper', description: 'Press Coverage' },
        { name: 'Media Partner 2', icon: 'fas fa-tv', description: 'Broadcasting' },
        { name: 'Media Partner 3', icon: 'fas fa-podcast', description: 'Digital Media' }
      ]
    },
    ecosystem: {
      title: 'Ecosystem Partner',
      icon: 'fas fa-network-wired',
      color: '#f59e0b',
      partners: [
        { name: 'Ecosystem Partner 1', icon: 'fas fa-building', description: 'Business Ecosystem' },
        { name: 'Ecosystem Partner 2', icon: 'fas fa-seedling', description: 'Startup Incubator' },
        { name: 'Ecosystem Partner 3', icon: 'fas fa-rocket', description: 'Innovation Hub' }
      ]
    },
    industry: {
      title: 'Industry Partner',
      icon: 'fas fa-industry',
      color: '#8b5cf6',
      partners: [
        { name: 'Industry Partner 1', icon: 'fas fa-cogs', description: 'Manufacturing' },
        { name: 'Industry Partner 2', icon: 'fas fa-microchip', description: 'Technology' },
        { name: 'Industry Partner 3', icon: 'fas fa-chart-line', description: 'Analytics' }
      ]
    },
    knowledge: {
      title: 'Knowledge Partner',
      icon: 'fas fa-graduation-cap',
      color: '#f59e0b',
      partners: [
        { name: 'Knowledge Partner 1', icon: 'fas fa-university', description: 'Academic Institution' },
        { name: 'Knowledge Partner 2', icon: 'fas fa-book', description: 'Research Center' },
        { name: 'Knowledge Partner 3', icon: 'fas fa-lightbulb', description: 'Think Tank' }
      ]
    }
  };

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  return (
    <section className="partners-area section-padding-100" id="partners">
      <div className="partners-container">
        <div className="section-heading">
          <h4>Our Network</h4>
          <h2>Partner Types</h2>
          <p>Collaborating with industry leaders to create an innovation ecosystem</p>
        </div>

        {/* Partner Tabs */}
        <div className="partner-tabs">
          {Object.entries(partnerCategories).map(([key, category]) => (
            <button
              key={key}
              className={`tab-button ${activeTab === key ? 'active' : ''}`}
              onClick={() => handleTabClick(key)}
              style={{
                '--tab-color': category.color
              }}
            >
              <i className={category.icon}></i>
              <span>{category.title}</span>
            </button>
          ))}
        </div>

        {/* Partner Content */}
        <div className="partner-content">
          {Object.entries(partnerCategories).map(([key, category]) => (
            <div
              key={key}
              className={`partner-category-section ${activeTab === key ? 'expanded' : ''}`}
            >
              <div className="partner-grid">
                {category.partners.map((partner, index) => (
                  <div key={index} className="partner-card">
                    <div className="card-glow"></div>
                    <div 
                      className="partner-icon"
                      style={{
                        background: `linear-gradient(135deg, ${category.color}, ${category.color}80)`
                      }}
                    >
                      <i className={partner.icon}></i>
                    </div>
                    <h5>{partner.name}</h5>
                    <p className="partner-description">{partner.description}</p>
                    <div className="partner-type-badge" style={{ background: category.color }}>
                      {category.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;