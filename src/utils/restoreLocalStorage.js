// Restore localStorage data for NCIP System
// Run this to restore all purposes, users, and demo data

export const restoreAllData = () => {
  console.log('🔄 Restoring localStorage data...');
  
  // 1. Restore Purposes
  const purposes = [
    { id: 1, name: 'Scholarship', description: 'For educational scholarship applications' },
    { id: 2, name: 'Employment', description: 'For employment verification' },
    { id: 3, name: 'Travel Abroad', description: 'For international travel documentation' },
    { id: 4, name: 'Government Transaction', description: 'For government-related transactions' },
    { id: 5, name: 'IP Identification', description: 'For indigenous peoples identification' },
    { id: 6, name: 'Legal Matters', description: 'For legal proceedings and documentation' },
    { id: 7, name: 'Business Registration', description: 'For business-related applications' },
    { id: 8, name: 'Land Claim', description: 'For ancestral domain and land claims' },
    { id: 9, name: 'Cultural Preservation', description: 'For cultural heritage documentation' },
    { id: 10, name: 'Others', description: 'For other purposes not listed' }
  ];
  
  localStorage.setItem('ncip_purposes', JSON.stringify(purposes));
  console.log('✅ Purposes restored:', purposes.length);
  
  // 2. Restore Demo Users
  const users = [
    {
      id: 'admin',
      username: 'admin',
      email: 'admin@ncip.gov',
      password: 'admin123', // In production, this should be hashed
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user',
      username: 'user',
      email: 'user@ncip.gov',
      password: 'user123', // In production, this should be hashed
      firstName: 'Maria',
      lastName: 'Santos',
      role: 'user',
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('ncip_users', JSON.stringify(users));
  console.log('✅ Users restored:', users.length);
  
  // 3. Initialize empty arrays for other data
  if (!localStorage.getItem('ncip_applications')) {
    localStorage.setItem('ncip_applications', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('applications')) {
    localStorage.setItem('applications', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('ncip_notifications')) {
    localStorage.setItem('ncip_notifications', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('ncip_genealogy_records')) {
    localStorage.setItem('ncip_genealogy_records', JSON.stringify([]));
  }
  
  console.log('✅ All localStorage data restored successfully!');
  console.log('');
  console.log('📋 Available accounts:');
  console.log('   Admin: admin@ncip.gov / admin123');
  console.log('   User:  user@ncip.gov / user123');
  console.log('');
  console.log('🎯 You can now login and use the system!');
  
  return { purposes, users };
};

// Auto-restore on import
if (typeof window !== 'undefined') {
  restoreAllData();
}

export default restoreAllData;
