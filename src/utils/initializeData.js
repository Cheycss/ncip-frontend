// Initialize default data for NCIP enhanced features
export const initializeDefaultData = () => {
  // Initialize document requirements
  const defaultRequirements = [
    {
      id: 'req_1',
      serviceType: 'Certificate of Confirmation',
      requirementName: 'Birth Certificate',
      description: 'Official birth certificate from PSA',
      validityPeriod: 365, // days
      submissionDeadline: 30, // days from application
      allowedFileTypes: ['pdf', 'jpg', 'png'],
      maxFileSize: 5, // MB
      isMandatory: true,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'req_2',
      serviceType: 'Certificate of Confirmation',
      requirementName: 'Valid ID',
      description: 'Government-issued photo identification',
      validityPeriod: 1825, // 5 years
      submissionDeadline: 30,
      allowedFileTypes: ['pdf', 'jpg', 'png'],
      maxFileSize: 5,
      isMandatory: true,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'req_3',
      serviceType: 'Certificate of Confirmation',
      requirementName: 'Barangay Certificate',
      description: 'Certificate of residency from barangay',
      validityPeriod: 90, // 3 months
      submissionDeadline: 15,
      allowedFileTypes: ['pdf', 'jpg', 'png'],
      maxFileSize: 5,
      isMandatory: true,
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ];

  // Initialize system configurations
  const defaultConfigurations = [
    {
      id: 'config_1',
      key: 'notification_schedule',
      value: JSON.stringify([30, 15, 7, 1]), // days before expiration
      description: 'Days before document expiration to send notifications'
    },
    {
      id: 'config_2',
      key: 'cancellation_grace_period',
      value: '7', // days
      description: 'Grace period before auto-cancelling overdue applications'
    },
    {
      id: 'config_3',
      key: 'email_notifications_enabled',
      value: 'true',
      description: 'Enable email notifications'
    },
    {
      id: 'config_4',
      key: 'sms_notifications_enabled',
      value: 'true',
      description: 'Enable SMS notifications'
    }
  ];

  // Initialize sample genealogy records
  const sampleGenealogyRecords = [
    {
      id: 'gen_1',
      firstName: 'Maria',
      lastName: 'Santos',
      middleName: 'Cruz',
      birthDate: '1985-03-15',
      birthPlace: 'Alabel, Sarangani',
      tribe: 'Blaan',
      civilStatus: 'Married',
      currentAddress: 'Purok 1, Barangay Poblacion, Alabel, Sarangani',
      contactNumber: '09123456789',
      fatherFirstName: 'Juan',
      fatherLastName: 'Santos',
      fatherMiddleName: 'Dela Cruz',
      motherFirstName: 'Rosa',
      motherLastName: 'Cruz',
      motherMiddleName: 'Garcia',
      paternalGrandfatherName: 'Pedro Santos',
      paternalGrandmotherName: 'Carmen Dela Cruz',
      maternalGrandfatherName: 'Antonio Cruz',
      maternalGrandmotherName: 'Esperanza Garcia',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Initialize sample applications with documents
  const sampleApplications = [
    {
      id: 'app_sample_1',
      userId: 'user',
      serviceType: 'Certificate of Confirmation',
      purpose: 'IP Identification',
      status: 'pending',
      submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      documents: [
        {
          id: 'doc_1',
          requirementId: 'req_1',
          fileName: 'birth_certificate.pdf',
          status: 'approved',
          submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000).toISOString(), // expires in 350 days
          canReuse: true
        },
        {
          id: 'doc_2',
          requirementId: 'req_2',
          fileName: 'valid_id.jpg',
          status: 'expired',
          submittedAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // expired 10 days ago
          canReuse: false
        }
      ]
    }
  ];

  // Store in localStorage if not already present
  if (!localStorage.getItem('ncip_document_requirements')) {
    localStorage.setItem('ncip_document_requirements', JSON.stringify(defaultRequirements));
  }

  if (!localStorage.getItem('ncip_system_configurations')) {
    localStorage.setItem('ncip_system_configurations', JSON.stringify(defaultConfigurations));
  }

  if (!localStorage.getItem('ncip_genealogy_records')) {
    localStorage.setItem('ncip_genealogy_records', JSON.stringify(sampleGenealogyRecords));
  }

  // Add sample applications to existing applications
  const existingApplications = JSON.parse(localStorage.getItem('ncip_applications') || '[]');
  const hasUserApplications = existingApplications.some(app => app.userId === 'user');
  
  if (!hasUserApplications) {
    const updatedApplications = [...existingApplications, ...sampleApplications];
    localStorage.setItem('ncip_applications', JSON.stringify(updatedApplications));
  }

  // Initialize empty arrays for other data if not present
  if (!localStorage.getItem('ncip_notifications')) {
    localStorage.setItem('ncip_notifications', JSON.stringify([]));
  }

  if (!localStorage.getItem('ncip_application_deadlines')) {
    localStorage.setItem('ncip_application_deadlines', JSON.stringify([]));
  }

  if (!localStorage.getItem('ncip_re_applications')) {
    localStorage.setItem('ncip_re_applications', JSON.stringify([]));
  }

  console.log('NCIP enhanced features data initialized successfully');
};

// Auto-initialize on module load
if (typeof window !== 'undefined') {
  initializeDefaultData();
}
