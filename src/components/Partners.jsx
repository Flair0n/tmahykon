import React from 'react';
import '../styles/Partners.css';

const Partners = () => {
  const partnerCategories = [
    {
      title: 'Associate Partner',
      color: '#1a73e8',
      partners: [
        { 
          name: 'Educational Institute', 
          logo: '/api/placeholder/150/80',
          description: 'Educational Partner'
        }
      ]
    },
    {
      title: 'Skill Partners',
      color: '#00c853',
      partners: [
        { 
          name: 'Developer Community',
          logo: '/api/placeholder/150/80',
          description: 'Developer Community'
        },
        { 
          name: 'Training Academy',
          logo: '/api/placeholder/150/80',
          description: 'Training Partner'
        },
        { 
          name: 'Learning Platform',
          logo: '/api/placeholder/150/80',
          description: 'Learning Platform'
        },
        { 
          name: 'Skills Development Center',
          logo: '/api/placeholder/150/80',
          description: 'Educational Support'
        },
        { 
          name: 'Innovation Hub',
          logo: '/api/placeholder/150/80',
          description: 'Government Initiative'
        },
        { 
          name: 'Technology Institute',
          logo: '/api/placeholder/150/80',
          description: 'Technology Training'
        },
        { 
          name: 'Professional Academy',
          logo: '/api/placeholder/150/80',
          description: 'Administrative Training'
        },
        { 
          name: 'Management Center',
          logo: '/api/placeholder/150/80',
          description: 'Performance Management'
        }
      ]
    },
    {
      title: 'Industry Partners',
      color: '#ff6b35',
      partners: [
        { 
          name: 'Career Solutions',
          logo: '/api/placeholder/150/80',
          description: 'Recruitment Solutions'
        },
        { 
          name: 'Industry Association',
          logo: '/api/placeholder/150/80',
          description: 'Industry Association'
        }
      ]
    },
    {
      title: 'Ecosystem Partners',
      color: '#9c27b0',
      partners: [
        { 
          name: 'Tech Solutions',
          logo: '/api/placeholder/150/80',
          description: 'Technology Integration'
        },
        { 
          name: 'Innovation Center',
          logo: '/api/placeholder/150/80',
          description: 'Startup Ecosystem'
        },
        { 
          name: 'Business Chamber',
          logo: '/api/placeholder/150/80',
          description: 'Chamber of Commerce'
        },
        { 
          name: 'Tech Association',
          logo: '/api/placeholder/150/80',
          description: 'IT Industry Body'
        },
        { 
          name: 'Diversity Network',
          logo: '/api/placeholder/150/80',
          description: 'Diversity Initiative'
        },
        { 
          name: 'Social Foundation',
          logo: '/api/placeholder/150/80',
          description: 'Social Impact'
        }
      ]
    },
    {
      title: 'Knowledge Partners',
      color: '#ff9800',
      partners: [
        { 
          name: 'Professional Network',
          logo: '/api/placeholder/150/80',
          description: 'Professional Network'
        },
        { 
          name: 'Online Learning Platform',
          logo: '/api/placeholder/150/80',
          description: 'Online Learning'
        },
        { 
          name: 'Entrepreneurship Foundation',
          logo: '/api/placeholder/150/80',
          description: 'Entrepreneurship'
        }
      ]
    }
  ];

  return (
    <section className="partners-section" id="partners">
      <div className="partners-container">
        <div className="partners-header">
          <h6 className="section-subtitle">WHO HELPS US TO CREATE</h6>
          <h2 className="section-title">Our Partners</h2>
        </div>

        <div className="partner-categories">
          {partnerCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="partner-category">
              <div 
                className="category-header"
                style={{ backgroundColor: category.color }}
              >
                <h3>{category.title}</h3>
              </div>
              <div className="category-content">
                <div className="partners-grid">
                  {category.partners.map((partner, partnerIndex) => (
                    <div key={partnerIndex} className="partner-card">
                      <div className="partner-logo">
                        <img 
                          src={partner.logo} 
                          alt={partner.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="logo-placeholder" style={{ display: 'none' }}>
                          {partner.name}
                        </div>
                      </div>
                      <div className="partner-info">
                        <h4>{partner.name}</h4>
                        <p>{partner.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;