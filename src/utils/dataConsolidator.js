/**
 * Data Consolidation Utility for NCIP COC Application
 * Consolidates all form data into a structured JSON object for PDF generation
 */

/**
 * Consolidates all form data from Pages 1-5 into a structured object
 * @param {Object} allFormData - Combined data from all form pages
 * @returns {Object} Consolidated data object ready for PDF generation
 */
export const consolidateFormData = (allFormData) => {
  // Extract data from different pages
  const page1Data = allFormData || {};
  const page2Data = allFormData.page2 || allFormData;
  const page3Data = allFormData.page3 || allFormData;
  const page4Data = allFormData.page4 || {};
  const page5Data = allFormData.page5 || allFormData;

  // Create consolidated data structure
  const consolidatedData = {
    // Personal Information (Page 1)
    personalInfo: {
      firstName: page1Data.firstName || '',
      middleName: page1Data.middleName || '',
      lastName: page1Data.lastName || '',
      fullName: page1Data.name || `${page1Data.firstName || ''} ${page1Data.middleName || ''} ${page1Data.lastName || ''}`.trim(),
      city: page1Data.city || '',
      barangay: page1Data.barangay || '',
      placeOfOrigin: page1Data.placeOfOrigin || '',
      placeOfBirth: page1Data.placeOfBirth || '',
      dateOfBirth: page1Data.dateOfBirth || '',
      civilStatus: page1Data.civilStatus || '',
      tribe: page1Data.iccs || '',
      spouseName: page1Data.spouseName || '',
      applicantSignature: page1Data.applicantSignature || ''
    },

    // Educational Background (Page 1)
    education: {
      attainment: page1Data.highestEducation || '',
      degree: page1Data.degreeObtained || ''
    },

    // Land Matter Information (Page 1 - if applicable)
    landMatter: {
      homesteadNo: page1Data.homesteadNo || '',
      lotNo: page1Data.lotNo || '',
      dateOfIssuance: page1Data.dateOfIssuance || '',
      area: page1Data.area || '',
      location: page1Data.location || ''
    },

    // Barangay Certification (Page 2)
    barangayCertification: {
      province: page2Data.province || 'SARANGANI',
      municipality: page2Data.municipality || page1Data.city || '',
      barangay: page2Data.barangay || page1Data.barangay || '',
      applicantName: page2Data.applicantName || page1Data.applicantSignature || page1Data.name || '',
      residenceLocation: page2Data.residenceLocation || `${page1Data.barangay || ''}, ${page1Data.city || ''}, Sarangani Province`,
      parentAscendantName: page2Data.parentAscendantName || page1Data.fatherName || '',
      iccGroup: page2Data.iccGroup || page1Data.fatherTribe || page1Data.iccs || '',
      residenceYears: page2Data.residenceYears || '',
      issuanceDay: page2Data.issuanceDay || new Date().getDate().toString(),
      issuanceMonth: page2Data.issuanceMonth || new Date().toLocaleString('default', { month: 'long' }),
      issuanceYear: page2Data.issuanceYear || '2024',
      punongBarangaySignature: page2Data.punongBarangaySignature || ''
    },

    // Tribal Certification (Page 3)
    tribalCertification: {
      province: page3Data.province || 'SARANGANI',
      municipality: page3Data.municipality || page1Data.city || '',
      barangay: page3Data.barangay || page1Data.barangay || '',
      applicantName: page3Data.applicantName || page1Data.applicantSignature || page1Data.name || '',
      belongingLocation: page3Data.belongingLocation || `${page1Data.barangay || ''}, ${page1Data.city || ''}, Sarangani Province`,
      iccGroup: page3Data.iccGroup || page1Data.iccs || '',
      parentNames: page3Data.parentNames || page1Data.fatherName || '',
      parentNames2: page3Data.parentNames2 || page1Data.motherName || '',
      iccGroup1: page3Data.iccGroup1 || page1Data.fatherTribe || page1Data.iccs || '',
      iccGroup2: page3Data.iccGroup2 || page1Data.motherTribe || page1Data.iccs || '',
      parentAscendantNames: page3Data.parentAscendantNames || `${page1Data.fatherName || ''} and ${page1Data.motherName || ''}`,
      purpose: page3Data.purpose || allFormData.purpose || '',
      issuanceDay: page3Data.issuanceDay || new Date().getDate().toString(),
      issuanceMonth: page3Data.issuanceMonth || new Date().toLocaleString('default', { month: 'long' }),
      issuanceYear: page3Data.issuanceYear || '2024',
      ipsHeadSignature: page3Data.ipsHeadSignature || '',
      barangayIpmrSignature: page3Data.barangayIpmrSignature || '',
      municipalTribalChieftainSignature: page3Data.municipalTribalChieftainSignature || ''
    },

    // Joint Affidavit (Page 4)
    affidavit: {
      province: page4Data.province || 'SARANGANI',
      municipality: page4Data.municipality || page1Data.city || '',
      affiant1Name: page4Data.affiant1Name || '',
      affiant2Name: page4Data.affiant2Name || '',
      affiantsAddress: page4Data.affiantsAddress || `${page1Data.barangay || ''}, ${page1Data.city || ''}, Sarangani Province`,
      affiantsAddress2: page4Data.affiantsAddress2 || `${page1Data.barangay || ''}, ${page1Data.city || ''}, Sarangani Province`,
      subjectName: page4Data.subjectName || page1Data.applicantSignature || page1Data.name || '',
      spouseName: page4Data.spouseName || page1Data.spouseName || '',
      coupleAddress: page4Data.coupleAddress || `${page1Data.barangay || ''}, ${page1Data.city || ''}, Sarangani Province`,
      childName: page4Data.childName || '',
      childBirthDate: page4Data.childBirthDate || '',
      childOrder: page4Data.childOrder || '',
      ipMemberName: page4Data.ipMemberName || page1Data.applicantSignature || page1Data.name || '',
      ipGroup: page4Data.ipGroup || page1Data.iccs || '',
      fatherName: page4Data.fatherName || page1Data.fatherName || '',
      motherName: page4Data.motherName || page1Data.motherName || '',
      parentsIpGroup1: page4Data.parentsIpGroup1 || page1Data.fatherTribe || page1Data.iccs || '',
      parentsIpGroup2: page4Data.parentsIpGroup2 || page1Data.motherTribe || page1Data.iccs || '',
      membershipSubject: page4Data.membershipSubject || page1Data.applicantSignature || page1Data.name || '',
      signatureDay: page4Data.signatureDay || new Date().getDate().toString(),
      signatureMonth: page4Data.signatureMonth || new Date().toLocaleString('default', { month: 'long' }),
      signatureYear: page4Data.signatureYear || '2024'
    },

    // Genealogy Information (Page 5)
    genealogy: {
      applicant: {
        name: page1Data.applicantSignature || page1Data.name || '',
        tribe: page1Data.iccs || ''
      },
      father: {
        name: page1Data.fatherName || '',
        tribe: page1Data.fatherTribe || page1Data.iccs || '',
        address: page1Data.fatherAddress || ''
      },
      mother: {
        name: page1Data.motherName || '',
        tribe: page1Data.motherTribe || page1Data.iccs || '',
        address: page1Data.motherAddress || ''
      },
      paternalGrandfather: {
        name: page1Data.fatherGrandfather || page5Data.paternalGrandfather || '',
        tribe: page1Data.fatherTribeGrandparents || ''
      },
      paternalGrandmother: {
        name: page1Data.fatherGrandmother || page5Data.paternalGrandmother || '',
        tribe: page1Data.fatherTribeGrandparents || ''
      },
      maternalGrandfather: {
        name: page1Data.motherGrandfather || page5Data.maternalGrandfather || '',
        tribe: page1Data.motherTribeGrandparents || ''
      },
      maternalGrandmother: {
        name: page1Data.motherGrandmother || page5Data.maternalGrandmother || '',
        tribe: page1Data.motherTribeGrandparents || ''
      }
    },

    // Application Metadata
    metadata: {
      applicationDate: new Date().toISOString(),
      purpose: allFormData.purpose || allFormData.selectedPurpose?.name || '',
      applicationId: allFormData.applicationId || '',
      status: allFormData.status || 'draft'
    }
  };

  return consolidatedData;
};

/**
 * Validates that all required fields are present in consolidated data
 * @param {Object} consolidatedData - The consolidated data object
 * @returns {Object} Validation result with isValid boolean and missing fields array
 */
export const validateConsolidatedData = (consolidatedData) => {
  const requiredFields = [
    'personalInfo.firstName',
    'personalInfo.lastName',
    'personalInfo.city',
    'personalInfo.barangay',
    'personalInfo.dateOfBirth',
    'personalInfo.tribe',
    'genealogy.father.name',
    'genealogy.mother.name'
  ];

  const missingFields = [];

  requiredFields.forEach(fieldPath => {
    const value = getNestedValue(consolidatedData, fieldPath);
    if (!value || value.trim() === '') {
      missingFields.push(fieldPath);
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Helper function to get nested object values using dot notation
 * @param {Object} obj - The object to search
 * @param {string} path - Dot notation path (e.g., 'personalInfo.firstName')
 * @returns {*} The value at the specified path
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : '';
  }, obj);
};

/**
 * Creates a summary object for display purposes
 * @param {Object} consolidatedData - The consolidated data object
 * @returns {Object} Summary object with key information
 */
export const createDataSummary = (consolidatedData) => {
  return {
    applicantName: consolidatedData.personalInfo.fullName,
    location: `${consolidatedData.personalInfo.barangay}, ${consolidatedData.personalInfo.city}`,
    tribe: consolidatedData.personalInfo.tribe,
    purpose: consolidatedData.metadata.purpose,
    applicationDate: new Date(consolidatedData.metadata.applicationDate).toLocaleDateString(),
    completedSections: {
      personalInfo: !!consolidatedData.personalInfo.firstName,
      barangayCert: !!consolidatedData.barangayCertification.applicantName,
      tribalCert: !!consolidatedData.tribalCertification.applicantName,
      affidavit: !!consolidatedData.affidavit.affiant1Name,
      genealogy: !!consolidatedData.genealogy.father.name
    }
  };
};

export default {
  consolidateFormData,
  validateConsolidatedData,
  createDataSummary
};
