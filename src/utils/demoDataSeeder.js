// Demo Data Seeder for NCIP System
// This script seeds localStorage with demo data for testing purposes

export const seedDemoData = () => {
  console.log('🌱 Seeding demo data...');
  
  // Seed demo user account
  const demoUser = {
    id: 'demo-user-001',
    email: 'user@ncip.gov',
    firstName: 'Maria',
    lastName: 'Santos',
    role: 'user',
    isActive: true,
    createdAt: new Date().toISOString()
  };
  
  // Check if demo user already exists
  const existingUsers = JSON.parse(localStorage.getItem('ncip_users') || '[]');
  const demoUserExists = existingUsers.find(user => user.email === 'user@ncip.gov');
  
  if (!demoUserExists) {
    existingUsers.push(demoUser);
    localStorage.setItem('ncip_users', JSON.stringify(existingUsers));
    console.log('✅ Demo user account created: user@ncip.gov');
  }
  
  // Seed demo applications
  const generateExpirationDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString();
  };
  
  const demoApplications = [
    {
      id: 'COC-1730000001',
      userId: 'demo-user-001',
      email: 'user@ncip.gov',
      firstName: 'Maria',
      lastName: 'Santos',
      serviceType: 'Certificate of Confirmation',
      purpose: 'Scholarship',
      status: 'under_review',
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      formData: {
        firstName: 'Maria',
        lastName: 'Santos',
        middleName: 'Cruz',
        birthDate: '1995-05-15',
        birthPlace: 'Baguio City',
        address: '123 Main St, Baguio City',
        purpose: 'Scholarship'
      },
      requirements: {
        birth_certificate: {
          name: 'birth_certificate.pdf',
          size: 245760,
          type: 'application/pdf',
          submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: generateExpirationDate(358), // Valid for 358 more days
          status: 'valid'
        },
        valid_id: {
          name: 'valid_id.jpg',
          size: 512000,
          type: 'image/jpeg',
          submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: generateExpirationDate(358), // Valid for 358 more days
          status: 'valid'
        },
        school_enrollment: {
          name: 'enrollment_certificate.pdf',
          size: 189440,
          type: 'application/pdf',
          submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: generateExpirationDate(358), // Valid for 358 more days
          status: 'valid'
        },
        grades_transcript: {
          name: 'transcript.pdf',
          size: 334080,
          type: 'application/pdf',
          submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: generateExpirationDate(358), // Valid for 358 more days
          status: 'valid'
        },
        income_certificate: {
          name: 'income_certificate.pdf',
          size: 156672,
          type: 'application/pdf',
          submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: generateExpirationDate(358), // Valid for 358 more days
          status: 'valid'
        }
      },
      pageStatuses: {
        page1: 'completed',
        page2: 'completed',
        page3: 'completed',
        page4: 'completed',
        page5: 'completed',
        page6: 'completed',
        documents: 'completed'
      },
      comments: {},
      reviewProgress: 100
    },
    {
      id: 'COC-1730000002',
      userId: 'demo-user-001',
      email: 'user@ncip.gov',
      firstName: 'Maria',
      lastName: 'Santos',
      serviceType: 'Certificate of Confirmation',
      purpose: 'Travel Abroad',
      status: 'under_review',
      submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      formData: {
        firstName: 'Maria',
        lastName: 'Santos',
        middleName: 'Cruz',
        birthDate: '1995-05-15',
        birthPlace: 'Baguio City',
        address: '123 Main St, Baguio City',
        purpose: 'Travel Abroad'
      },
      requirements: {
        birth_certificate: {
          name: 'birth_certificate.pdf',
          size: 245760,
          type: 'application/pdf',
          submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: generateExpirationDate(350), // Valid for 350 more days
          status: 'valid'
        },
        valid_id: {
          name: 'drivers_license.jpg',
          size: 412000,
          type: 'image/jpeg',
          submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: generateExpirationDate(-5), // EXPIRED 5 days ago
          status: 'expired'
        },
        passport: {
          name: 'passport.jpg',
          size: 678000,
          type: 'image/jpeg',
          submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: generateExpirationDate(350), // Valid for 350 more days
          status: 'valid'
        },
        visa_application: {
          name: 'visa_application.pdf',
          size: 289440,
          type: 'application/pdf',
          submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: generateExpirationDate(-2), // EXPIRED 2 days ago
          status: 'expired'
        },
        travel_itinerary: {
          name: 'travel_itinerary.pdf',
          size: 134080,
          type: 'application/pdf',
          submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: generateExpirationDate(350), // Valid for 350 more days
          status: 'valid'
        }
      },
      pageStatuses: {
        page1: 'completed',
        page2: 'completed',
        page3: 'completed',
        page4: 'completed',
        page5: 'completed',
        page6: 'completed',
        documents: 'completed'
      },
      comments: {},
      reviewProgress: 100
    }
  ];
  
  // Seed admin applications
  const existingAdminApplications = JSON.parse(localStorage.getItem('applications') || '[]');
  const existingIds = existingAdminApplications.map(app => app.id);
  
  demoApplications.forEach(app => {
    if (!existingIds.includes(app.id)) {
      existingAdminApplications.push(app);
    }
  });
  
  localStorage.setItem('applications', JSON.stringify(existingAdminApplications));
  
  // Seed user-specific applications
  const userApplicationsKey = `user_applications_${demoUser.id}`;
  const existingUserApplications = JSON.parse(localStorage.getItem(userApplicationsKey) || '[]');
  const existingUserIds = existingUserApplications.map(app => app.id);
  
  demoApplications.forEach(app => {
    if (!existingUserIds.includes(app.id)) {
      const userApp = {
        id: app.id,
        userId: app.userId,
        userEmail: app.email,
        type: app.serviceType,
        serviceType: app.serviceType,
        purpose: app.purpose,
        status: app.status,
        submittedAt: app.submittedAt,
        updatedAt: app.updatedAt,
        data: app.formData,
        requirements: app.requirements
      };
      existingUserApplications.push(userApp);
    }
  });
  
  localStorage.setItem(userApplicationsKey, JSON.stringify(existingUserApplications));
  
  console.log('✅ Demo applications seeded');
  console.log('📊 Applications created:');
  console.log('  - Scholarship application (all valid requirements)');
  console.log('  - Travel Abroad application (2 expired requirements)');
  console.log('🎯 Demo account: user@ncip.gov / user123');
};

// Auto-seed on import in development
if (typeof window !== 'undefined') {
  // Only seed in browser environment
  seedDemoData();
}

export default seedDemoData;
