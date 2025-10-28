import jsPDF from 'jspdf';
import { consolidateFormData, validateConsolidatedData } from './dataConsolidator.js';
import { PDF_FIELD_MAPPINGS, getDataValue, formatDateForPDF, validatePageData } from './pdfFieldMapping.js';

// NCIP Logo as base64
let logoDataUrl = null;

// Function to load logo
const loadLogo = async () => {
  if (logoDataUrl) return logoDataUrl;
  
  try {
    const response = await fetch('/NCIPLogo.png');
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        logoDataUrl = reader.result;
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to load logo:', error);
    return null;
  }
};

/**
 * Generate PDF for Certificate of Confirmation Application
 * Uses consolidated data and field mapping for accurate template-based generation
 */
export const generateCOCPDF = async (rawFormData) => {
  try {
    // Step 1: Consolidate all form data into structured object
    console.log('🔄 Consolidating form data...');
    const consolidatedData = consolidateFormData(rawFormData);
    
    // Step 2: Validate consolidated data
    console.log('✅ Validating consolidated data...');
    const validation = validateConsolidatedData(consolidatedData);
    if (!validation.isValid) {
      console.warn('⚠️ Missing required fields:', validation.missingFields);
      // Continue with generation but log warnings
    }
    
    // Step 3: Load logo
    console.log('🖼️ Loading NCIP logo...');
    logoDataUrl = await loadLogo();
    
    // Step 4: Create PDF with template mapping
    console.log('📄 Generating PDF with template mapping...');
    const pdf = new jsPDF('p', 'mm', 'letter');
    
    // Generate each page using field mappings
    addPage1WithMapping(pdf, consolidatedData); // COC Form - Page 1
    pdf.addPage();
    addPage2WithMapping(pdf, consolidatedData); // Barangay Certification - Page 2
    pdf.addPage();
    addPage3WithMapping(pdf, consolidatedData); // Tribal Chieftain Certification - Page 3
    pdf.addPage();
    addPage4WithMapping(pdf, consolidatedData); // Joint Affidavit - Page 4
    pdf.addPage();
    addPage5WithMapping(pdf, consolidatedData); // Genealogy Tree - Page 5
    
    console.log('✅ PDF generation completed successfully');
    return pdf;
    
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

// Helper function to add logo
const addLogo = (pdf, x, y, width, height) => {
  if (logoDataUrl) {
    try {
      pdf.addImage(logoDataUrl, 'PNG', x, y, width, height);
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
    }
  }
};

// Helper function to add watermark background logo
const addWatermark = (pdf, pageWidth, pageHeight) => {
  if (logoDataUrl) {
    try {
      const watermarkSize = 150;
      const x = (pageWidth - watermarkSize) / 2;
      const y = (pageHeight - watermarkSize) / 2;
      
      pdf.saveGraphicsState();
      pdf.setGState(new pdf.GState({ opacity: 0.08 }));
      pdf.addImage(logoDataUrl, 'PNG', x, y, watermarkSize, watermarkSize);
      pdf.restoreGraphicsState();
    } catch (error) {
      console.error('Error adding watermark to PDF:', error);
    }
  }
};

/**
 * Generic function to add text fields to PDF using field mapping
 * @param {Object} pdf - jsPDF instance
 * @param {Object} consolidatedData - Consolidated form data
 * @param {Object} fieldMappings - Field mappings for the page
 */
const addFieldsWithMapping = (pdf, consolidatedData, fieldMappings) => {
  Object.entries(fieldMappings).forEach(([fieldName, mapping]) => {
    if (fieldName === 'logo') {
      // Handle logo separately
      addLogo(pdf, mapping.x, mapping.y, mapping.width, mapping.height);
      return;
    }
    
    if (!mapping.dataPath) return;
    
    // Get the value from consolidated data
    let value = getDataValue(consolidatedData, mapping.dataPath);
    
    // Format dates if needed
    if (mapping.dataPath.includes('Date') && value) {
      value = formatDateForPDF(value);
    }
    
    // Skip empty values
    if (!value || value.trim() === '') return;
    
    // Set font properties
    pdf.setFontSize(mapping.fontSize || 10);
    pdf.setFont('helvetica', 'normal');
    
    // Add text with proper alignment
    try {
      if (mapping.maxWidth) {
        // Handle text wrapping if maxWidth is specified
        const lines = pdf.splitTextToSize(value, mapping.maxWidth);
        pdf.text(lines, mapping.x, mapping.y, { 
          align: mapping.align || 'left',
          maxWidth: mapping.maxWidth 
        });
      } else {
        pdf.text(value, mapping.x, mapping.y, { align: mapping.align || 'left' });
      }
    } catch (error) {
      console.warn(`Error adding field ${fieldName}:`, error);
    }
  });
};

// Page 1: COC Form - Personal Information (Using Field Mapping)
const addPage1WithMapping = (pdf, consolidatedData) => {
  const pageWidth = 215.9;
  const pageHeight = 279.4;
  
  // Validate page data
  const validation = validatePageData(consolidatedData, 'page1');
  if (!validation.isValid) {
    console.warn('Page 1 validation warnings:', validation.missingFields);
  }
  
  // Add watermark
  addWatermark(pdf, pageWidth, pageHeight);
  
  // Add official header
  addOfficialHeader(pdf, pageWidth);
  
  // Add form title
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CERTIFICATE OF CONFIRMATION', pageWidth / 2, 60, { align: 'center' });
  pdf.text('OF INDIGENOUS PEOPLES MEMBERSHIP', pageWidth / 2, 68, { align: 'center' });
  
  // Add all fields using mapping
  addFieldsWithMapping(pdf, consolidatedData, PDF_FIELD_MAPPINGS.page1);
};

// Page 2: Barangay Certification (Using Field Mapping)
const addPage2WithMapping = (pdf, consolidatedData) => {
  const pageWidth = 215.9;
  const pageHeight = 279.4;
  
  // Validate page data
  const validation = validatePageData(consolidatedData, 'page2');
  if (!validation.isValid) {
    console.warn('Page 2 validation warnings:', validation.missingFields);
  }
  
  // Add watermark
  addWatermark(pdf, pageWidth, pageHeight);
  
  // Add official header
  addOfficialHeader(pdf, pageWidth);
  
  // Add certification header
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OFFICE OF THE PUNONG BARANGAY', pageWidth / 2, 50, { align: 'center' });
  pdf.setFontSize(18);
  pdf.text('CERTIFICATION', pageWidth / 2, 65, { align: 'center' });
  
  // Add "TO WHOM IT MAY CONCERN"
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TO WHOM IT MAY CONCERN:', 20, 90);
  
  // Add certification text with placeholders
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const certText = [
    'THIS IS TO CERTIFY that',
    'is a resident of',
    ', Philippines.',
    '',
    'Certify further that the parent/s and/or ascendants of',
    'belongs to',
    'ICCs/IPs',
    'and a resident of this barangay for more than',
    'years.',
    '',
    'This certification is issued upon his/her request to support his/her',
    'application for the Certificate of Confirmation of IP Membership.',
    '',
    'Issued this',
    'of',
    '2024.'
  ];
  
  let yPos = 110;
  certText.forEach(line => {
    if (line.trim() !== '') {
      pdf.text(line, 20, yPos);
    }
    yPos += 8;
  });
  
  // Add all mapped fields
  addFieldsWithMapping(pdf, consolidatedData, PDF_FIELD_MAPPINGS.page2);
  
  // Add signature section
  pdf.text('Punong Barangay', 140, 275);
};

// Page 3: Tribal Chieftain Certification (Using Field Mapping)
const addPage3WithMapping = (pdf, consolidatedData) => {
  const pageWidth = 215.9;
  const pageHeight = 279.4;
  
  // Validate page data
  const validation = validatePageData(consolidatedData, 'page3');
  if (!validation.isValid) {
    console.warn('Page 3 validation warnings:', validation.missingFields);
  }
  
  // Add watermark
  addWatermark(pdf, pageWidth, pageHeight);
  
  // Add official header
  addOfficialHeader(pdf, pageWidth);
  
  // Add certification header
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OFFICE OF THE TRIBAL CHIEFTAIN', pageWidth / 2, 50, { align: 'center' });
  pdf.setFontSize(18);
  pdf.text('CERTIFICATION', pageWidth / 2, 65, { align: 'center' });
  
  // Add "TO WHOM IT MAY CONCERN"
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TO WHOM IT MAY CONCERN:', 20, 90);
  
  // Add certification content
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  // Add all mapped fields
  addFieldsWithMapping(pdf, consolidatedData, PDF_FIELD_MAPPINGS.page3);
  
  // Add signature sections
  pdf.text('IPS Head/Tribal Chieftain', 140, 290);
  pdf.text('Barangay IPMR', 140, 310);
  pdf.text('Municipal Tribal Chieftain', 50, 330);
};

// Page 4: Joint Affidavit (Using Field Mapping)
const addPage4WithMapping = (pdf, consolidatedData) => {
  const pageWidth = 215.9;
  const pageHeight = 279.4;
  
  // Validate page data
  const validation = validatePageData(consolidatedData, 'page4');
  if (!validation.isValid) {
    console.warn('Page 4 validation warnings:', validation.missingFields);
  }
  
  // Add watermark
  addWatermark(pdf, pageWidth, pageHeight);
  
  // Add official header
  addOfficialHeader(pdf, pageWidth);
  
  // Add affidavit title
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('JOINT AFFIDAVIT OF TWO DISINTERESTED PERSONS', pageWidth / 2, 50, { align: 'center' });
  
  // Add affidavit content structure
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const affidavitText = [
    'WE,                    and                    both',
    'of legal age, Filipino citizen, single/married and bonafide residents of',
    '                    and                    Philippines',
    'respectively. After been duly sworn in accordance with the law, do hereby depose and say:',
    '',
    'That we know personally                    and',
    '                    to be husband and wife being our neighbors at',
    '                    ',
    '',
    'That after couple of years living together the couple have a child born name',
    '                    as their                    born child.',
    '',
    'That                    is a member of the Indigenous Peoples',
    'belonging to the                    ICCs being his/her father',
    '                    and mother                    belonging to',
    'the                    and                    ICCs, respectively.',
    '',
    'That we are executing this Joint Affidavit to establish the fact and truth',
    'surrounding the IP membership of                    .'
  ];
  
  let yPos = 80;
  affidavitText.forEach(line => {
    pdf.text(line, 20, yPos);
    yPos += 10;
  });
  
  // Add all mapped fields
  addFieldsWithMapping(pdf, consolidatedData, PDF_FIELD_MAPPINGS.page4);
};

// Page 5: Genealogy Tree (Using Field Mapping)
const addPage5WithMapping = (pdf, consolidatedData) => {
  const pageWidth = 215.9;
  const pageHeight = 279.4;
  
  // Validate page data
  const validation = validatePageData(consolidatedData, 'page5');
  if (!validation.isValid) {
    console.warn('Page 5 validation warnings:', validation.missingFields);
  }
  
  // Add watermark
  addWatermark(pdf, pageWidth, pageHeight);
  
  // Add official header
  addOfficialHeader(pdf, pageWidth);
  
  // Add genealogy title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('GENEALOGY TREE', pageWidth / 2, 50, { align: 'center' });
  
  // Draw family tree structure
  drawFamilyTreeStructure(pdf);
  
  // Add all mapped fields
  addFieldsWithMapping(pdf, consolidatedData, PDF_FIELD_MAPPINGS.page5);
};

// Helper function to add official header
const addOfficialHeader = (pdf, pageWidth) => {
  let y = 20;
  
  // Add logo
  addLogo(pdf, 20, y, 15, 15);
  
  // Add official text
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('REPUBLIC OF THE PHILIPPINES', pageWidth / 2, y + 2, { align: 'center' });
  pdf.text('OFFICE OF THE PRESIDENT', pageWidth / 2, y + 7, { align: 'center' });
  pdf.text('NATIONAL COMMISSION ON INDIGENOUS PEOPLES', pageWidth / 2, y + 12, { align: 'center' });
  pdf.text('PROVINCIAL OFFICE - SARANGANI PROVINCE', pageWidth / 2, y + 17, { align: 'center' });
};

// Helper function to draw family tree structure
const drawFamilyTreeStructure = (pdf) => {
  // Draw boxes and connecting lines for family tree
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.5);
  
  // Grandparents level (top)
  pdf.rect(30, 90, 60, 20); // Paternal grandparents
  pdf.rect(124, 90, 60, 20); // Maternal grandparents
  
  // Parents level (middle)
  pdf.rect(45, 140, 60, 20); // Father
  pdf.rect(139, 140, 60, 20); // Mother
  
  // Applicant level (bottom)
  pdf.rect(92, 190, 60, 20); // Applicant
  
  // Draw connecting lines
  // Grandparents to parents
  pdf.line(75, 110, 75, 140); // Paternal line
  pdf.line(154, 110, 169, 140); // Maternal line
  
  // Parents to applicant
  pdf.line(75, 160, 122, 190); // Father to applicant
  pdf.line(169, 160, 122, 190); // Mother to applicant
};

// Page 1: COC Form - Personal Index
const addPage1 = (pdf, data) => {
  const margin = 20;
  const pageWidth = 215.9;
  const pageHeight = 279.4; // Letter size height in mm
  
  // Add Watermark Background
  addWatermark(pdf, pageWidth, pageHeight);
  
  let y = 15;
  
  // Add Logo (left side)
  addLogo(pdf, margin, y, 15, 15);
  
  // Official Header (centered)
  y = 20;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('REPUBLIC OF THE PHILIPPINES', pageWidth / 2, y, { align: 'center' });
  y += 5;
  pdf.text('OFFICE OF THE PRESIDENT', pageWidth / 2, y, { align: 'center' });
  y += 5;
  pdf.setFont('helvetica', 'bold');
  pdf.text('NATIONAL COMMISSION ON INDIGENOUS PEOPLES', pageWidth / 2, y, { align: 'center' });
  y += 5;
  pdf.text('SARANGANI PROVINCIAL OFFICE', pageWidth / 2, y, { align: 'center' });
  
  // Horizontal line
  y += 5;
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 10;
  
  // Form Title
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CERTIFICATE OF CONFIRMATION', pageWidth / 2, y, { align: 'center' });
  y += 8;
  
  // Subtitle
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Information Index', pageWidth / 2, y, { align: 'center' });
  y += 5;
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(8);
  pdf.text('(Please print all entries legibly and avoid erasures)', pageWidth / 2, y, { align: 'center' });
  y += 10;
  
  // Personal Index
  pdf.setFontSize(10);
  pdf.text('I. PERSONAL INDEX', margin, y);
  y += 10;
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  
  // Handle multiple field name variations
  const fullName = data.fullName || data.name || data.applicantName || '';
  const birthDate = data.birthDate || data.dateOfBirth || '';
  const birthPlace = data.birthPlace || '';
  const sex = data.sex || '';
  const civilStatus = data.civilStatus || '';
  const tribe = data.tribe || data.iccs || data.fatherTribe || '';
  const address = `${data.barangay || ''}, ${data.city || 'Alabel'}, ${data.province || 'Sarangani'}`;
  
  pdf.text(`Full Name: ${fullName}`, margin, y);
  y += 7;
  pdf.text(`Sex: ${sex}`, margin, y);
  y += 7;
  pdf.text(`Date of Birth: ${birthDate}`, margin, y);
  y += 7;
  pdf.text(`Place of Birth: ${birthPlace}`, margin, y);
  y += 7;
  pdf.text(`Address: ${address}`, margin, y);
  y += 7;
  pdf.text(`Civil Status: ${civilStatus}`, margin, y);
  y += 7;
  pdf.text(`ICCs/Tribe: ${tribe}`, margin, y);
  y += 15;
  
  // Educational Background
  pdf.setFont('helvetica', 'bold');
  pdf.text('II. EDUCATIONAL BACKGROUND', margin, y);
  y += 10;
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Highest Education: ${data.highestEducation || ''}`, margin, y);
  y += 7;
  pdf.text(`Degree: ${data.degreeObtained || data.degree || ''}`, margin, y);
  y += 7;
  pdf.text(`School: ${data.schoolName || ''}`, margin, y);
  y += 15;
  
  // Parental Background
  pdf.setFont('helvetica', 'bold');
  pdf.text('III. PARENTAL BACKGROUND', margin, y);
  y += 10;
  pdf.setFont('helvetica', 'normal');
  pdf.text('FATHER', margin, y);
  pdf.text('MOTHER', 120, y);
  y += 7;
  pdf.text(`Name: ${data.fatherName || ''}`, margin, y);
  pdf.text(`Name: ${data.motherName || ''}`, 120, y);
  y += 7;
  pdf.text(`Tribe: ${data.fatherTribe || ''}`, margin, y);
  pdf.text(`Tribe: ${data.motherTribe || ''}`, 120, y);
  y += 7;
  pdf.text(`Birthplace: ${data.fatherBirthplace || ''}`, margin, y);
  pdf.text(`Birthplace: ${data.motherBirthplace || ''}`, 120, y);
};

// Page 2: Barangay Certification
const addPage2 = (pdf, data) => {
  const pageWidth = 215.9;
  const pageHeight = 279.4;
  const margin = 20;
  
  // Add Watermark Background
  addWatermark(pdf, pageWidth, pageHeight);
  
  let y = 15;
  
  // Add Logo (centered)
  addLogo(pdf, pageWidth / 2 - 7.5, y, 15, 15);
  
  y = 35;
  
  // Header
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Republic of the Philippines', pageWidth / 2, y, { align: 'center' });
  y += 5;
  pdf.text(`Province of ${data.province || 'SARANGANI'}`, pageWidth / 2, y, { align: 'center' });
  y += 5;
  pdf.text(`Municipality of ${data.city || '_______________'}`, pageWidth / 2, y, { align: 'center' });
  y += 5;
  pdf.text(`Barangay of ${data.barangay || '_______________'}`, pageWidth / 2, y, { align: 'center' });
  
  y += 8;
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 15;
  
  // Title
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OFFICE OF THE PUNONG BARANGAY', pageWidth / 2, y, { align: 'center' });
  y += 12;
  pdf.setFontSize(16);
  pdf.text('C E R T I F I C A T I O N', pageWidth / 2, y, { align: 'center' });
  y += 20;
  
  // Content
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TO WHOM IT MAY CONCERN:', margin, y);
  y += 15;
  
  pdf.setFont('helvetica', 'normal');
  const applicantName = data.applicantName || data.fullName || data.name || '_______________';
  const residenceLocation = data.residenceLocation || `${data.barangay || ''}, ${data.city || 'Alabel'}, ${data.province || 'Sarangani Province'}`;
  const parentName = data.parentAscendantName || data.fatherName || '_______________';
  const iccGroup = data.iccGroup || data.tribe || data.fatherTribe || '_______________';
  
  const text1 = `THIS IS TO CERTIFY that ${applicantName} is a resident of`;
  const text2 = `${residenceLocation}, Philippines.`;
  const text3 = `Certify further that the parent/s and/or ascendants of ${applicantName}`;
  const text4 = `belongs to ${iccGroup} ICCs/IPs and a resident of this barangay.`;
  const text5 = 'This certification is issued upon his/her request to support his/her application for the';
  const text6 = 'Certificate of Confirmation of IP Membership.';
  const text7 = `Issued this ${new Date().getDate()} of ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}.`;
  
  pdf.text(text1, margin + 10, y);
  y += 7;
  pdf.text(text2, margin + 10, y);
  y += 12;
  pdf.text(text3, margin + 10, y);
  y += 7;
  pdf.text(text4, margin + 10, y);
  y += 12;
  pdf.text(text5, margin + 10, y);
  y += 7;
  pdf.text(text6, margin + 10, y);
  y += 12;
  pdf.text(text7, margin + 10, y);
  y += 40;
  
  // Signature line
  pdf.setLineWidth(0.1);
  pdf.line(pageWidth - margin - 80, y, pageWidth - margin, y);
  pdf.setFontSize(10);
  pdf.text('Punong Barangay', pageWidth - margin - 40, y + 5, { align: 'center' });
  
  // Footer
  pdf.setFontSize(7);
  pdf.text('3 | P a g e', margin, 270);
  pdf.text('C O C F o r m s - Sar Prov', pageWidth - margin - 40, 270);
};

// Page 3: Tribal Chieftain Certification
const addPage3 = (pdf, data) => {
  const pageWidth = 215.9;
  const pageHeight = 279.4;
  const margin = 20;
  
  // Add Watermark Background
  addWatermark(pdf, pageWidth, pageHeight);
  
  let y = 15;
  
  // Add Logo (centered)
  addLogo(pdf, pageWidth / 2 - 7.5, y, 15, 15);
  
  y = 35;
  
  // Header
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Republic of the Philippines', pageWidth / 2, y, { align: 'center' });
  y += 5;
  pdf.text(`Province of ${data.province || 'SARANGANI'}`, pageWidth / 2, y, { align: 'center' });
  y += 5;
  pdf.text(`Municipality of ${data.city || '_______________'}`, pageWidth / 2, y, { align: 'center' });
  y += 5;
  pdf.text(`Barangay of ${data.barangay || '_______________'}`, pageWidth / 2, y, { align: 'center' });
  
  y += 8;
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 15;
  
  // Title
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OFFICE OF THE TRIBAL CHIEFTAIN', pageWidth / 2, y, { align: 'center' });
  y += 12;
  pdf.setFontSize(16);
  pdf.text('C E R T I F I C A T I O N', pageWidth / 2, y, { align: 'center' });
  y += 20;
  
  // Content
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TO WHOM IT MAY CONCERN:', margin, y);
  y += 15;
  
  pdf.setFont('helvetica', 'normal');
  const applicantName = data.applicantSignature || data.fullName || data.name || '_______________';
  const location = `${data.barangay || ''}, ${data.city || 'Alabel'}`;
  const iccGroup = data.tribalAffiliation || data.tribe || data.fatherTribe || '_______________';
  const certPurpose = data.certificationPurpose || data.purpose || 'Certificate of Confirmation';
  
  const text1 = `THIS IS TO CERTIFY that ${applicantName} of`;
  const text2 = `${location} belonging to the ${iccGroup}`;
  const text3 = 'Indigenous Cultural Communities (ICCs). His/her';
  const text4 = `parents ${data.fatherName || '_______________'} and ${data.motherName || '_______________'}`;
  const text5 = `being members of the ${data.fatherTribe || '_______________'} and ${data.motherTribe || '_______________'} ICCs, respectively.`;
  const text6 = 'Certify further that the parent/s and or ascendants';
  const text7 = `of ${applicantName} are original residents of this place.`;
  const text8 = `This certification is issued for ${certPurpose} purpose.`;
  const text9 = `Issued this ${new Date().getDate()} of ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}.`;
  
  pdf.text(text1, margin + 10, y);
  y += 7;
  pdf.text(text2, margin + 10, y);
  y += 7;
  pdf.text(text3, margin + 10, y);
  y += 7;
  pdf.text(text4, margin + 10, y);
  y += 7;
  pdf.text(text5, margin + 10, y);
  y += 12;
  pdf.text(text6, margin + 10, y);
  y += 7;
  pdf.text(text7, margin + 10, y);
  y += 12;
  pdf.text(text8, margin + 10, y);
  y += 12;
  pdf.text(text9, margin + 10, y);
  y += 40;
  
  // Signature lines
  pdf.setLineWidth(0.1);
  pdf.line(pageWidth - margin - 80, y, pageWidth - margin, y);
  pdf.setFontSize(10);
  pdf.text('IPS Head/Tribal Chieftain', pageWidth - margin - 40, y + 5, { align: 'center' });
  
  y += 20;
  pdf.line(pageWidth - margin - 80, y, pageWidth - margin, y);
  pdf.text('Barangay IPMR', pageWidth - margin - 40, y + 5, { align: 'center' });
  
  // Footer
  pdf.setFontSize(7);
  pdf.text('4 | P a g e', margin, 270);
  pdf.text('C O C F o r m s - Sar Prov', pageWidth - margin - 40, 270);
};

// Page 4: Joint Affidavit
const addPage4 = (pdf, data) => {
  const pageWidth = 215.9;
  const pageHeight = 279.4;
  const margin = 20;
  
  // Add Watermark Background
  addWatermark(pdf, pageWidth, pageHeight);
  
  let y = 15;
  
  // Add Logo (centered)
  addLogo(pdf, pageWidth / 2 - 7.5, y, 15, 15);
  
  y = 35;
  
  // Header
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Republic of the Philippines', pageWidth / 2, y, { align: 'center' });
  y += 5;
  pdf.text(`Province of ${data.province || 'SARANGANI'}`, pageWidth / 2, y, { align: 'center' });
  y += 5;
  pdf.text(`Municipality of ${data.city || '_______________'}`, pageWidth / 2, y, { align: 'center' });
  y += 10;
  
  // Title
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('JOINT AFFIDAVIT OF TWO DISINTERESTED PERSONS', pageWidth / 2, y, { align: 'center' });
  y += 20;
  
  // Content
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  // Extract data from page4 if available
  const page4Data = data.page4 || {};
  const affiant1Name = page4Data.affiant1Name || '_______________';
  const affiant1Address = page4Data.affiant1Address || `${data.barangay || '_______________'}, ${data.city || '_______________'}`;
  const affiant2Name = page4Data.affiant2Name || '_______________';
  const affiant2Address = page4Data.affiant2Address || `${data.barangay || '_______________'}, ${data.city || '_______________'}`;
  const applicantName = data.fullName || data.name || '_______________';
  const spouseName = data.spouseName || page4Data.spouseName || '_______________';
  
  const text1 = `WE, the undersigned, both of legal age, Filipino citizen, single/married and bonafide residents of`;
  const text2 = `${data.barangay || '_______________'}, ${data.city || '_______________'}, Sarangani Province, Philippines`;
  const text3 = 'respectively. After been duly sworn in accordance with the law, do hereby depose and say:';
  const text4 = `That we know personally ${applicantName} and`;
  const text5 = `${spouseName} to be husband and wife being our neighbors at`;
  const text6 = `${data.barangay || '_______________'}, ${data.city || '_______________'}.`;
  const text7 = `That ${applicantName} is a member of the Indigenous Peoples`;
  const text8 = `belonging to the ${data.tribe || data.fatherTribe || '_______________'} ICCs being his/her father`;
  const text9 = `${data.fatherName || '_______________'} and mother ${data.motherName || '_______________'} belonging to`;
  const text10 = `the ${data.fatherTribe || '_______________'} and ${data.motherTribe || '_______________'} ICCs, respectively.`;
  const text11 = 'That we are executing this Joint Affidavit to establish the fact and truth surrounding the IP';
  const text12 = `membership of ${applicantName}.`;
  const text13 = `IN WITNESS WHEREOF, we have hereunto affixed our signature this ${new Date().getDate()} day of`;
  const text14 = `${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()} at ${data.city || '_______________'}, Philippines.`;
  
  pdf.text(text1, margin + 10, y);
  y += 6;
  pdf.text(text2, margin + 10, y);
  y += 6;
  pdf.text(text3, margin + 10, y);
  y += 10;
  pdf.text(text4, margin + 10, y);
  y += 6;
  pdf.text(text5, margin + 10, y);
  y += 6;
  pdf.text(text6, margin + 10, y);
  y += 10;
  pdf.text(text7, margin + 10, y);
  y += 6;
  pdf.text(text8, margin + 10, y);
  y += 6;
  pdf.text(text9, margin + 10, y);
  y += 6;
  pdf.text(text10, margin + 10, y);
  y += 10;
  pdf.text(text11, margin + 10, y);
  y += 6;
  pdf.text(text12, margin + 10, y);
  y += 12;
  pdf.text(text13, margin + 10, y);
  y += 6;
  pdf.text(text14, margin + 10, y);
  y += 30;
  
  // Signature lines
  pdf.setLineWidth(0.1);
  pdf.line(margin + 20, y, margin + 80, y);
  pdf.line(pageWidth - margin - 80, y, pageWidth - margin - 20, y);
  pdf.setFontSize(9);
  pdf.text('Affiant', margin + 50, y + 5, { align: 'center' });
  pdf.text('Affiant', pageWidth - margin - 50, y + 5, { align: 'center' });
  
  // Footer
  pdf.setFontSize(7);
  pdf.text('5 | P a g e', margin, 270);
  pdf.text('C O C F o r m s - Sar Prov', pageWidth - margin - 40, 270);
};

// Page 5: Genealogy Tree (EXACT match to official form)
const addPage5 = (pdf, data) => {
  const pageWidth = 215.9;
  const pageHeight = 279.4;
  const margin = 20;
  
  // Add Watermark Background
  addWatermark(pdf, pageWidth, pageHeight);
  
  let y = 15;
  
  // Add Logo (centered)
  addLogo(pdf, pageWidth / 2 - 7.5, y, 15, 15);
  
  y = 35;
  
  // Official Header
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('REPUBLIC OF THE PHILIPPINES', pageWidth / 2, y, { align: 'center' });
  y += 4;
  pdf.text('OFFICE OF THE PRESIDENT', pageWidth / 2, y, { align: 'center' });
  y += 4;
  pdf.setFont('helvetica', 'bold');
  pdf.text('NATIONAL COMMISSION ON INDIGENOUS PEOPLES', pageWidth / 2, y, { align: 'center' });
  y += 4;
  pdf.text('SARANGANI PROVINCIAL OFFICE', pageWidth / 2, y, { align: 'center' });
  
  y += 3;
  pdf.setLineWidth(0.8);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 10;
  
  // Great Grandparents Row (8 boxes) - Top row
  const boxWidth = 23;
  const boxHeight = 20;
  const startX = 15;
  const gap = 1;
  
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  
  for (let i = 0; i < 8; i++) {
    const x = startX + (i * (boxWidth + gap));
    pdf.rect(x, y, boxWidth, boxHeight);
    pdf.text('Great Grandfather', x + boxWidth/2, y + 4, { align: 'center' });
    pdf.setFontSize(6);
    pdf.text('ICCs:', x + 2, y + 16);
    pdf.text('Place of Origin:', x + 2, y + 19);
  }
  
  y += boxHeight + 8;
  
  // Grandparents Row (4 boxes)
  const gpBoxWidth = 48;
  const gpBoxHeight = 22;
  
  pdf.setFontSize(8);
  
  // Paternal Grandfather
  pdf.rect(startX, y, gpBoxWidth, gpBoxHeight);
  pdf.text('Grandfather', startX + gpBoxWidth/2, y + 5, { align: 'center' });
  pdf.setFontSize(7);
  pdf.text(`${data.paternal_grandfather_first_name || ''} ${data.paternal_grandfather_last_name || ''}`, startX + gpBoxWidth/2, y + 10, { align: 'center' });
  pdf.setFontSize(6);
  pdf.text(`ICCs: ${data.paternal_grandfather_ethnicity || ''}`, startX + 2, y + 18);
  
  // Paternal Grandmother
  pdf.setFontSize(8);
  pdf.rect(startX + gpBoxWidth + gap, y, gpBoxWidth, gpBoxHeight);
  pdf.text('Grandmother', startX + gpBoxWidth + gap + gpBoxWidth/2, y + 5, { align: 'center' });
  pdf.setFontSize(7);
  pdf.text(`${data.paternal_grandmother_first_name || ''} ${data.paternal_grandmother_last_name || ''}`, startX + gpBoxWidth + gap + gpBoxWidth/2, y + 10, { align: 'center' });
  pdf.setFontSize(6);
  pdf.text(`ICCs: ${data.paternal_grandmother_ethnicity || ''}`, startX + gpBoxWidth + gap + 2, y + 18);
  
  // Maternal Grandfather
  pdf.setFontSize(8);
  pdf.rect(startX + (gpBoxWidth + gap) * 2, y, gpBoxWidth, gpBoxHeight);
  pdf.text('Grandfather', startX + (gpBoxWidth + gap) * 2 + gpBoxWidth/2, y + 5, { align: 'center' });
  pdf.setFontSize(7);
  pdf.text(`${data.maternal_grandfather_first_name || ''} ${data.maternal_grandfather_last_name || ''}`, startX + (gpBoxWidth + gap) * 2 + gpBoxWidth/2, y + 10, { align: 'center' });
  pdf.setFontSize(6);
  pdf.text(`ICCs: ${data.maternal_grandfather_ethnicity || ''}`, startX + (gpBoxWidth + gap) * 2 + 2, y + 18);
  
  // Maternal Grandmother
  pdf.setFontSize(8);
  pdf.rect(startX + (gpBoxWidth + gap) * 3, y, gpBoxWidth, gpBoxHeight);
  pdf.text('Grandmother', startX + (gpBoxWidth + gap) * 3 + gpBoxWidth/2, y + 5, { align: 'center' });
  pdf.setFontSize(7);
  pdf.text(`${data.maternal_grandmother_first_name || ''} ${data.maternal_grandmother_last_name || ''}`, startX + (gpBoxWidth + gap) * 3 + gpBoxWidth/2, y + 10, { align: 'center' });
  pdf.setFontSize(6);
  pdf.text(`ICCs: ${data.maternal_grandmother_ethnicity || ''}`, startX + (gpBoxWidth + gap) * 3 + 2, y + 18);
  
  y += gpBoxHeight + 8;
  
  // Parents Row (2 boxes)
  const parentBoxWidth = 80;
  const parentBoxHeight = 25;
  const parentStartX = pageWidth / 2 - parentBoxWidth - 10;
  
  pdf.setFontSize(9);
  
  // Father
  pdf.rect(parentStartX, y, parentBoxWidth, parentBoxHeight);
  pdf.text('Father', parentStartX + parentBoxWidth/2, y + 6, { align: 'center' });
  pdf.setFontSize(8);
  pdf.text(`${data.father_first_name || ''} ${data.father_middle_name || ''} ${data.father_last_name || ''}`, parentStartX + parentBoxWidth/2, y + 12, { align: 'center' });
  pdf.setFontSize(6);
  pdf.text(`ICCs: ${data.father_ethnicity || ''}`, parentStartX + 2, y + 20);
  pdf.text(`Place of Origin: ${data.fatherAddress || ''}`, parentStartX + 2, y + 23);
  
  // Mother
  pdf.setFontSize(9);
  pdf.rect(parentStartX + parentBoxWidth + 20, y, parentBoxWidth, parentBoxHeight);
  pdf.text('Mother', parentStartX + parentBoxWidth + 20 + parentBoxWidth/2, y + 6, { align: 'center' });
  pdf.setFontSize(8);
  pdf.text(`${data.mother_first_name || ''} ${data.mother_middle_name || ''} ${data.mother_last_name || ''}`, parentStartX + parentBoxWidth + 20 + parentBoxWidth/2, y + 12, { align: 'center' });
  pdf.setFontSize(6);
  pdf.text(`ICCs: ${data.mother_ethnicity || ''}`, parentStartX + parentBoxWidth + 20 + 2, y + 20);
  pdf.text(`Place of Origin: ${data.motherAddress || ''}`, parentStartX + parentBoxWidth + 20 + 2, y + 23);
  
  y += parentBoxHeight + 8;
  
  // EGO (Representative) - Bottom center
  const egoBoxWidth = 90;
  const egoBoxHeight = 28;
  const egoX = pageWidth / 2 - egoBoxWidth / 2;
  
  pdf.setFontSize(10);
  pdf.rect(egoX, y, egoBoxWidth, egoBoxHeight);
  pdf.text('EGO', egoX + egoBoxWidth/2, y + 6, { align: 'center' });
  pdf.setFontSize(8);
  pdf.text('(Representative)', egoX + egoBoxWidth/2, y + 11, { align: 'center' });
  pdf.setFontSize(9);
  pdf.text(`${data.applicant_first_name || ''} ${data.applicant_middle_name || ''} ${data.applicant_last_name || ''}`, egoX + egoBoxWidth/2, y + 17, { align: 'center' });
  pdf.setFontSize(6);
  pdf.text(`ICCs: ${data.applicant_ethnicity || ''}`, egoX + 2, y + 23);
  pdf.text(`Place of Origin: ${data.placeOfOrigin || ''}`, egoX + 2, y + 26);
  
  y += egoBoxHeight + 15;
  
  // Certification Section
  pdf.setFontSize(8);
  pdf.text('Certified Correct:', pageWidth - 80, y);
  
  y += 15;
  
  // Bottom Signatures
  pdf.setFontSize(7);
  pdf.text('Attested by:', margin, y);
  pdf.text('Conformed:', pageWidth / 2 - 20, y);
  
  y += 15;
  
  // Signature lines
  pdf.setLineWidth(0.1);
  
  // LUCIANO B. LUMANCAS
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text('LUCIANO B. LUMANCAS', margin + 30, y, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.text('Community Development Officer III', margin + 30, y + 4, { align: 'center' });
  
  // Municipal Tribal Chieftain
  pdf.line(pageWidth / 2 - 40, y + 5, pageWidth / 2 + 10, y + 5);
  pdf.text('Municipal Tribal Chieftain', pageWidth / 2 - 15, y + 9, { align: 'center' });
  
  // Barangay IPMR
  pdf.line(pageWidth / 2 + 30, y + 5, pageWidth / 2 + 80, y + 5);
  pdf.text('Barangay IPMR', pageWidth / 2 + 55, y + 9, { align: 'center' });
  
  // Barangay Tribal Chieftain
  pdf.line(pageWidth - 80, y + 5, pageWidth - margin, y + 5);
  pdf.text('Barangay Tribal Chieftain', pageWidth - 50, y + 9, { align: 'center' });
  
  y += 15;
  
  // ICCs Note
  pdf.setFontSize(6);
  pdf.rect(margin, y, 80, 8);
  pdf.text('ICCs= Indigenous Cultural Communities (IP Group)', margin + 2, y + 5);
  
  // Footer
  pdf.setFontSize(7);
  pdf.text('6 | P a g e', margin, 270);
  pdf.text('C O C F o r m s - Sar Prov', pageWidth - margin - 40, 270);
};

export const downloadPDF = (pdf, filename = 'COC_Application.pdf') => {
  pdf.save(filename);
};
