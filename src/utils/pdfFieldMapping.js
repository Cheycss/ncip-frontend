/**
 * PDF Field Mapping Configuration for NCIP COC Forms
 * Maps consolidated data to specific coordinates on each PDF page
 */

/**
 * Complete field mapping for all 5 pages of the COC form
 * Each mapping includes:
 * - dataPath: Path to data in consolidated object (dot notation)
 * - x, y: Coordinates on the PDF page (in mm)
 * - fontSize: Font size for the text
 * - maxWidth: Maximum width for text wrapping
 * - align: Text alignment ('left', 'center', 'right')
 */
export const PDF_FIELD_MAPPINGS = {
  // PAGE 1: Personal Information & COC Form
  page1: {
    // Header Information
    logo: { x: 20, y: 15, width: 15, height: 15 },
    
    // Personal Index Section
    fullName: {
      dataPath: 'personalInfo.fullName',
      x: 50, y: 80, fontSize: 12, maxWidth: 100, align: 'left'
    },
    firstName: {
      dataPath: 'personalInfo.firstName',
      x: 50, y: 95, fontSize: 10, maxWidth: 50, align: 'left'
    },
    middleName: {
      dataPath: 'personalInfo.middleName',
      x: 105, y: 95, fontSize: 10, maxWidth: 50, align: 'left'
    },
    lastName: {
      dataPath: 'personalInfo.lastName',
      x: 160, y: 95, fontSize: 10, maxWidth: 50, align: 'left'
    },
    city: {
      dataPath: 'personalInfo.city',
      x: 50, y: 110, fontSize: 10, maxWidth: 70, align: 'left'
    },
    barangay: {
      dataPath: 'personalInfo.barangay',
      x: 125, y: 110, fontSize: 10, maxWidth: 70, align: 'left'
    },
    placeOfOrigin: {
      dataPath: 'personalInfo.placeOfOrigin',
      x: 50, y: 125, fontSize: 10, maxWidth: 100, align: 'left'
    },
    placeOfBirth: {
      dataPath: 'personalInfo.placeOfBirth',
      x: 50, y: 140, fontSize: 10, maxWidth: 100, align: 'left'
    },
    dateOfBirth: {
      dataPath: 'personalInfo.dateOfBirth',
      x: 50, y: 155, fontSize: 10, maxWidth: 70, align: 'left'
    },
    civilStatus: {
      dataPath: 'personalInfo.civilStatus',
      x: 125, y: 155, fontSize: 10, maxWidth: 50, align: 'left'
    },
    tribe: {
      dataPath: 'personalInfo.tribe',
      x: 50, y: 170, fontSize: 10, maxWidth: 100, align: 'left'
    },
    spouseName: {
      dataPath: 'personalInfo.spouseName',
      x: 50, y: 185, fontSize: 10, maxWidth: 100, align: 'left'
    },
    
    // Educational Background
    highestEducation: {
      dataPath: 'education.attainment',
      x: 50, y: 210, fontSize: 10, maxWidth: 80, align: 'left'
    },
    degree: {
      dataPath: 'education.degree',
      x: 135, y: 210, fontSize: 10, maxWidth: 80, align: 'left'
    },
    
    // Parental Background - Father
    fatherName: {
      dataPath: 'genealogy.father.name',
      x: 50, y: 235, fontSize: 10, maxWidth: 100, align: 'left'
    },
    fatherAddress: {
      dataPath: 'genealogy.father.address',
      x: 50, y: 250, fontSize: 10, maxWidth: 100, align: 'left'
    },
    fatherTribe: {
      dataPath: 'genealogy.father.tribe',
      x: 50, y: 265, fontSize: 10, maxWidth: 80, align: 'left'
    },
    fatherGrandfather: {
      dataPath: 'genealogy.paternalGrandfather.name',
      x: 50, y: 280, fontSize: 10, maxWidth: 80, align: 'left'
    },
    fatherGrandmother: {
      dataPath: 'genealogy.paternalGrandmother.name',
      x: 135, y: 280, fontSize: 10, maxWidth: 80, align: 'left'
    },
    
    // Parental Background - Mother
    motherName: {
      dataPath: 'genealogy.mother.name',
      x: 50, y: 305, fontSize: 10, maxWidth: 100, align: 'left'
    },
    motherAddress: {
      dataPath: 'genealogy.mother.address',
      x: 50, y: 320, fontSize: 10, maxWidth: 100, align: 'left'
    },
    motherTribe: {
      dataPath: 'genealogy.mother.tribe',
      x: 50, y: 335, fontSize: 10, maxWidth: 80, align: 'left'
    },
    motherGrandfather: {
      dataPath: 'genealogy.maternalGrandfather.name',
      x: 50, y: 350, fontSize: 10, maxWidth: 80, align: 'left'
    },
    motherGrandmother: {
      dataPath: 'genealogy.maternalGrandmother.name',
      x: 135, y: 350, fontSize: 10, maxWidth: 80, align: 'left'
    },
    
    // Land Matter (if applicable)
    homesteadNo: {
      dataPath: 'landMatter.homesteadNo',
      x: 50, y: 380, fontSize: 10, maxWidth: 70, align: 'left'
    },
    lotNo: {
      dataPath: 'landMatter.lotNo',
      x: 125, y: 380, fontSize: 10, maxWidth: 70, align: 'left'
    },
    
    // Signature
    applicantSignature: {
      dataPath: 'personalInfo.applicantSignature',
      x: 107, y: 420, fontSize: 12, maxWidth: 100, align: 'center'
    }
  },

  // PAGE 2: Barangay Certification
  page2: {
    // Certification Content
    applicantName: {
      dataPath: 'barangayCertification.applicantName',
      x: 85, y: 140, fontSize: 11, maxWidth: 120, align: 'left'
    },
    residenceLocation: {
      dataPath: 'barangayCertification.residenceLocation',
      x: 50, y: 155, fontSize: 11, maxWidth: 150, align: 'left'
    },
    parentAscendantName: {
      dataPath: 'barangayCertification.parentAscendantName',
      x: 50, y: 185, fontSize: 11, maxWidth: 120, align: 'left'
    },
    iccGroup: {
      dataPath: 'barangayCertification.iccGroup',
      x: 175, y: 185, fontSize: 11, maxWidth: 60, align: 'left'
    },
    residenceYears: {
      dataPath: 'barangayCertification.residenceYears',
      x: 140, y: 200, fontSize: 11, maxWidth: 30, align: 'center'
    },
    issuanceDay: {
      dataPath: 'barangayCertification.issuanceDay',
      x: 85, y: 230, fontSize: 11, maxWidth: 20, align: 'center'
    },
    issuanceMonth: {
      dataPath: 'barangayCertification.issuanceMonth',
      x: 120, y: 230, fontSize: 11, maxWidth: 40, align: 'center'
    },
    punongBarangaySignature: {
      dataPath: 'barangayCertification.punongBarangaySignature',
      x: 140, y: 260, fontSize: 12, maxWidth: 80, align: 'center'
    }
  },

  // PAGE 3: Tribal Chieftain Certification
  page3: {
    applicantName: {
      dataPath: 'tribalCertification.applicantName',
      x: 85, y: 140, fontSize: 11, maxWidth: 120, align: 'left'
    },
    belongingLocation: {
      dataPath: 'tribalCertification.belongingLocation',
      x: 50, y: 155, fontSize: 11, maxWidth: 100, align: 'left'
    },
    iccGroup: {
      dataPath: 'tribalCertification.iccGroup',
      x: 155, y: 155, fontSize: 11, maxWidth: 60, align: 'left'
    },
    parentNames: {
      dataPath: 'tribalCertification.parentNames',
      x: 50, y: 185, fontSize: 11, maxWidth: 80, align: 'left'
    },
    parentNames2: {
      dataPath: 'tribalCertification.parentNames2',
      x: 135, y: 185, fontSize: 11, maxWidth: 80, align: 'left'
    },
    iccGroup1: {
      dataPath: 'tribalCertification.iccGroup1',
      x: 85, y: 200, fontSize: 11, maxWidth: 50, align: 'left'
    },
    iccGroup2: {
      dataPath: 'tribalCertification.iccGroup2',
      x: 140, y: 200, fontSize: 11, maxWidth: 50, align: 'left'
    },
    purpose: {
      dataPath: 'tribalCertification.purpose',
      x: 80, y: 230, fontSize: 11, maxWidth: 100, align: 'left'
    },
    issuanceDay: {
      dataPath: 'tribalCertification.issuanceDay',
      x: 85, y: 250, fontSize: 11, maxWidth: 20, align: 'center'
    },
    issuanceMonth: {
      dataPath: 'tribalCertification.issuanceMonth',
      x: 120, y: 250, fontSize: 11, maxWidth: 40, align: 'center'
    },
    ipsHeadSignature: {
      dataPath: 'tribalCertification.ipsHeadSignature',
      x: 140, y: 280, fontSize: 12, maxWidth: 80, align: 'center'
    },
    barangayIpmrSignature: {
      dataPath: 'tribalCertification.barangayIpmrSignature',
      x: 140, y: 300, fontSize: 12, maxWidth: 80, align: 'center'
    },
    municipalTribalChieftainSignature: {
      dataPath: 'tribalCertification.municipalTribalChieftainSignature',
      x: 50, y: 320, fontSize: 12, maxWidth: 80, align: 'center'
    }
  },

  // PAGE 4: Joint Affidavit
  page4: {
    affiant1Name: {
      dataPath: 'affidavit.affiant1Name',
      x: 35, y: 120, fontSize: 11, maxWidth: 80, align: 'left'
    },
    affiant2Name: {
      dataPath: 'affidavit.affiant2Name',
      x: 125, y: 120, fontSize: 11, maxWidth: 80, align: 'left'
    },
    affiantsAddress: {
      dataPath: 'affidavit.affiantsAddress',
      x: 50, y: 140, fontSize: 11, maxWidth: 100, align: 'left'
    },
    affiantsAddress2: {
      dataPath: 'affidavit.affiantsAddress2',
      x: 160, y: 140, fontSize: 11, maxWidth: 80, align: 'left'
    },
    subjectName: {
      dataPath: 'affidavit.subjectName',
      x: 75, y: 170, fontSize: 11, maxWidth: 100, align: 'left'
    },
    spouseName: {
      dataPath: 'affidavit.spouseName',
      x: 50, y: 185, fontSize: 11, maxWidth: 100, align: 'left'
    },
    coupleAddress: {
      dataPath: 'affidavit.coupleAddress',
      x: 50, y: 200, fontSize: 11, maxWidth: 120, align: 'left'
    },
    childName: {
      dataPath: 'affidavit.childName',
      x: 120, y: 220, fontSize: 11, maxWidth: 80, align: 'left'
    },
    childBirthDate: {
      dataPath: 'affidavit.childBirthDate',
      x: 50, y: 235, fontSize: 11, maxWidth: 60, align: 'left'
    },
    childOrder: {
      dataPath: 'affidavit.childOrder',
      x: 120, y: 235, fontSize: 11, maxWidth: 30, align: 'left'
    },
    ipMemberName: {
      dataPath: 'affidavit.ipMemberName',
      x: 35, y: 265, fontSize: 11, maxWidth: 100, align: 'left'
    },
    ipGroup: {
      dataPath: 'affidavit.ipGroup',
      x: 85, y: 280, fontSize: 11, maxWidth: 60, align: 'left'
    },
    fatherName: {
      dataPath: 'affidavit.fatherName',
      x: 50, y: 295, fontSize: 11, maxWidth: 80, align: 'left'
    },
    motherName: {
      dataPath: 'affidavit.motherName',
      x: 140, y: 295, fontSize: 11, maxWidth: 80, align: 'left'
    },
    parentsIpGroup1: {
      dataPath: 'affidavit.parentsIpGroup1',
      x: 50, y: 310, fontSize: 11, maxWidth: 50, align: 'left'
    },
    parentsIpGroup2: {
      dataPath: 'affidavit.parentsIpGroup2',
      x: 110, y: 310, fontSize: 11, maxWidth: 50, align: 'left'
    },
    membershipSubject: {
      dataPath: 'affidavit.membershipSubject',
      x: 85, y: 340, fontSize: 11, maxWidth: 100, align: 'left'
    }
  },

  // PAGE 5: Genealogy Tree
  page5: {
    // Applicant (Center)
    applicantName: {
      dataPath: 'genealogy.applicant.name',
      x: 107, y: 200, fontSize: 10, maxWidth: 80, align: 'center'
    },
    applicantTribe: {
      dataPath: 'genealogy.applicant.tribe',
      x: 107, y: 210, fontSize: 9, maxWidth: 80, align: 'center'
    },
    
    // Father (Left side)
    fatherName: {
      dataPath: 'genealogy.father.name',
      x: 60, y: 150, fontSize: 10, maxWidth: 70, align: 'center'
    },
    fatherTribe: {
      dataPath: 'genealogy.father.tribe',
      x: 60, y: 160, fontSize: 9, maxWidth: 70, align: 'center'
    },
    
    // Mother (Right side)
    motherName: {
      dataPath: 'genealogy.mother.name',
      x: 154, y: 150, fontSize: 10, maxWidth: 70, align: 'center'
    },
    motherTribe: {
      dataPath: 'genealogy.mother.tribe',
      x: 154, y: 160, fontSize: 9, maxWidth: 70, align: 'center'
    },
    
    // Paternal Grandparents (Top left)
    paternalGrandfather: {
      dataPath: 'genealogy.paternalGrandfather.name',
      x: 35, y: 100, fontSize: 9, maxWidth: 50, align: 'center'
    },
    paternalGrandmother: {
      dataPath: 'genealogy.paternalGrandmother.name',
      x: 85, y: 100, fontSize: 9, maxWidth: 50, align: 'center'
    },
    
    // Maternal Grandparents (Top right)
    maternalGrandfather: {
      dataPath: 'genealogy.maternalGrandfather.name',
      x: 129, y: 100, fontSize: 9, maxWidth: 50, align: 'center'
    },
    maternalGrandmother: {
      dataPath: 'genealogy.maternalGrandmother.name',
      x: 179, y: 100, fontSize: 9, maxWidth: 50, align: 'center'
    }
  }
};

/**
 * Gets the value from consolidated data using a dot notation path
 * @param {Object} data - The consolidated data object
 * @param {string} path - Dot notation path (e.g., 'personalInfo.firstName')
 * @returns {string} The value at the specified path or empty string
 */
export const getDataValue = (data, path) => {
  try {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : '';
    }, data) || '';
  } catch (error) {
    console.warn(`Error getting value for path: ${path}`, error);
    return '';
  }
};

/**
 * Formats date values for PDF display
 * @param {string} dateValue - Date string in various formats
 * @returns {string} Formatted date string
 */
export const formatDateForPDF = (dateValue) => {
  if (!dateValue) return '';
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return dateValue; // Return original if invalid date
    
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return dateValue; // Return original value if formatting fails
  }
};

/**
 * Validates that required fields have values for each page
 * @param {Object} consolidatedData - The consolidated data object
 * @param {string} pageNumber - Page number to validate (page1, page2, etc.)
 * @returns {Object} Validation result
 */
export const validatePageData = (consolidatedData, pageNumber) => {
  const requiredFieldsByPage = {
    page1: ['personalInfo.firstName', 'personalInfo.lastName', 'personalInfo.tribe'],
    page2: ['barangayCertification.applicantName', 'barangayCertification.residenceLocation'],
    page3: ['tribalCertification.applicantName', 'tribalCertification.iccGroup'],
    page4: ['affidavit.affiant1Name', 'affidavit.affiant2Name', 'affidavit.subjectName'],
    page5: ['genealogy.father.name', 'genealogy.mother.name']
  };

  const requiredFields = requiredFieldsByPage[pageNumber] || [];
  const missingFields = [];

  requiredFields.forEach(fieldPath => {
    const value = getDataValue(consolidatedData, fieldPath);
    if (!value || value.trim() === '') {
      missingFields.push(fieldPath);
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields,
    pageNumber
  };
};

export default {
  PDF_FIELD_MAPPINGS,
  getDataValue,
  formatDateForPDF,
  validatePageData
};
