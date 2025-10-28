import React from 'react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();
  
  const handleEducationApply = () => {
    navigate('/apply-education');
  };
  
  const handleAncestralApply = () => {
    navigate('/apply-ancestral');
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">NCIP Services</h1>
        <p className="text-primary-100 text-lg">
          Access various services provided by the NCIP for indigenous communities
        </p>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-bold text-secondary-900 mb-6">Available Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education/Employment Service */}
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white p-6 rounded-lg flex flex-col">
            <h3 className="text-xl font-bold mb-4">Education/Employment</h3>
            <p className="text-blue-100 mb-6 leading-relaxed flex-grow">
              The NCIP's Educational and Employment Services with the Certificate of Confirmation (COC) focus on supporting Indigenous Peoples in accessing scholarships, employment opportunities, and related benefits. The COC certifies an individual's membership in an Indigenous Cultural Community (ICC), which is often a requirement for eligibility in educational programs, job applications, and government services specifically designed for IPs.
            </p>
            <button 
              onClick={handleEducationApply}
              className="bg-white text-blue-800 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors mt-auto"
            >
              Apply Now
            </button>
          </div>

          {/* Ancestral Domain Service */}
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white p-6 rounded-lg flex flex-col">
            <h3 className="text-xl font-bold mb-4">Ancestral Domain</h3>
            <p className="text-blue-100 mb-6 leading-relaxed flex-grow">
              The NCIP's Ancestral Domain Service safeguards Indigenous Peoples' rights by issuing Certificates of Ancestral Land Title (CALT), ensuring proper land ownership, conducting boundary mapping, and securing Free and Prior Informed Consent (FPIC) for land use.
            </p>
            <button 
              onClick={handleAncestralApply}
              className="bg-white text-blue-800 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors mt-auto"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
