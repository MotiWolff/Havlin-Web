import React from 'react';
import MainLayout from '../layouts/MainLayout';
import '../styles/family.css';
import { grandparents, families } from '../data/familyData';

const FamilyMemberCard = ({ title, children, isMain = false, icon }) => (
    <div className={`family-card-modern ${isMain ? 'main-card' : ''}`}>
        <div className="card-header-modern">
            {icon && <div className="card-icon-modern">{icon}</div>}
            <h3>{title}</h3>
        </div>
        <div className="card-body-modern">
             <div className="children-list-modern">
                {children}
             </div>
        </div>
    </div>
);

const SubFamilyCard = ({ parents, childrenNames }) => (
    <div className="sub-family-modern">
        <h4>{parents}</h4>
        {childrenNames && <p>{childrenNames}</p>}
    </div>
);

const Family = () => {
  return (
    <MainLayout>
        <div className="page-header text-center mb-5">
            <h1 className="display-4 text-gold mb-3">בני ובנות האצולה</h1>
            <p className="lead text-muted">עץ המשפחה המפואר שלנו</p>
        </div>
        
        <div className="container">
            {/* Grandparents - Center Stage */}
            <div className="row justify-content-center mb-5">
                <div className="col-md-8 col-lg-6">
                    <FamilyMemberCard 
                        title={grandparents.title}
                        isMain={true}
                        icon={<i className="fas fa-crown"></i>}
                    >
                        <h4>{grandparents.names}</h4>
                    </FamilyMemberCard>
                </div>
            </div>

            {/* Children Grid */}
            <div className="family-grid">
                {families.map((fam) => (
                  <FamilyMemberCard key={fam.id} title={fam.title}>
                    <h3>{fam.parents}</h3>
                    <p className="text-white mb-4">{fam.children}</p>
                    {fam.subFamilies && fam.subFamilies.length > 0 && (
                      <div className="sub-grid">
                        {fam.subFamilies.map((sub, idx) => (
                          <SubFamilyCard
                            key={`${fam.id}-${idx}`}
                            parents={sub.parents}
                            childrenNames={sub.childrenNames}
                          />
                        ))}
                      </div>
                    )}
                  </FamilyMemberCard>
                ))}
            </div>
        </div>
    </MainLayout>
  );
};

export default Family;
