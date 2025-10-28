// Sarangani Province data for dropdowns
export const saranganiCities = [
  'Alabel',
  'Glan',
  'Kiamba',
  'Maasim',
  'Maitum',
  'Malapatan',
  'Malungon'
];

export const saranganiBarangays = {
  'Alabel': [
    'Alegria', 'Bagacay', 'Baluntay', 'Datal Anggas', 'Domolok', 'Kawas',
    'Ladol', 'Makar', 'Pag-asa', 'Poblacion', 'Spring', 'Tokawal'
  ],
  'Glan': [
    'Baliton', 'Batulaki', 'Big Margus', 'Congan', 'Cross', 'Datalbani',
    'E. Alegado', 'Glan Padidu', 'Kapok', 'Lago', 'Laguimit', 'Landan',
    'Margus', 'New Aklan', 'Pangyan', 'Poblacion', 'Rio del Pilar',
    'Small Margus', 'Taluya', 'Tango', 'Tarong'
  ],
  'Kiamba': [
    'Badtasan', 'Datu Dani', 'Datu Karon', 'Datu Lipus', 'Datu Sinsuat',
    'Datu Wasay', 'Katubao', 'Lebe', 'Luma', 'Mabay', 'Nalus',
    'Poblacion', 'Suli', 'Tamadang', 'Tamnag'
  ],
  'Maasim': [
    'Amsipit', 'Bales', 'Kamanga', 'Kiden', 'Lumatil', 'Maasim',
    'Pananag', 'Poblacion', 'Tibpuan', 'Tuka'
  ],
  'Maitum': [
    'Batian', 'Kiambing', 'Mabay', 'Mindupok', 'New Ilocos',
    'Panamin', 'Poblacion', 'Ticulab', 'Upo'
  ],
  'Malapatan': [
    'Amaga', 'Balindog', 'Datal Bila', 'Kalaong', 'Kauran',
    'Lebe', 'Luma', 'Malapatan', 'Poblacion', 'Sapu Masla',
    'Sapu Padidu', 'Towak'
  ],
  'Malungon': [
    'Datal Anggas', 'Kalkam', 'Landan', 'Lebe', 'Malungon',
    'Nanga', 'New Cebu', 'Poblacion', 'Ragandang', 'Tinoto',
    'Tupig'
  ]
};

// Main saranganiData object expected by GenealogyForm
export const saranganiData = {
  cities: saranganiCities.map(name => ({ name, barangays: saranganiBarangays[name] || [] })),
  civilStatus: [
    'Single',
    'Married',
    'Widowed',
    'Separated',
    'Divorced'
  ],
  tribes: [
    'Blaan',
    'Tboli', 
    'Tagakaulo',
    'Manobo',
    'Higaonon',
    'Talaandig',
    'Bukidnon'
  ]
};

// Editable tribes list - can be expanded by users
export const getIndigenousTribes = () => {
  const storedTribes = JSON.parse(localStorage.getItem('ncip_tribes') || '[]');
  const defaultTribes = ['Blaan', 'Tboli', 'Tagakaulo'];
  
  // Merge default with stored, remove duplicates
  const allTribes = [...new Set([...defaultTribes, ...storedTribes])];
  return allTribes.sort();
};

export const addNewTribe = (tribeName) => {
  if (!tribeName || tribeName.trim() === '') return;
  
  const currentTribes = JSON.parse(localStorage.getItem('ncip_tribes') || '[]');
  const trimmedTribe = tribeName.trim();
  
  if (!currentTribes.includes(trimmedTribe)) {
    currentTribes.push(trimmedTribe);
    localStorage.setItem('ncip_tribes', JSON.stringify(currentTribes));
  }
};

export const civilStatusOptions = [
  'Single',
  'Married',
  'Widowed',
  'Separated',
  'Divorced'
];

export const educationalAttainmentOptions = [
  'Elementary Graduate',
  'Elementary Undergraduate', 
  'High School Graduate',
  'High School Undergraduate',
  'Senior High School Graduate',
  'Senior High School Undergraduate',
  'College Graduate',
  'College Undergraduate',
  'Vocational/Technical Graduate',
  'Vocational/Technical Undergraduate',
  'Masters Degree',
  'Doctorate Degree',
  'No Formal Education'
];

// Philippines provinces for editable dropdown
export const philippinesProvinces = [
  'Abra', 'Agusan del Norte', 'Agusan del Sur', 'Aklan', 'Albay', 'Antique', 'Apayao', 'Aurora',
  'Basilan', 'Bataan', 'Batanes', 'Batangas', 'Benguet', 'Biliran', 'Bohol', 'Bukidnon', 'Bulacan',
  'Cagayan', 'Camarines Norte', 'Camarines Sur', 'Camiguin', 'Capiz', 'Catanduanes', 'Cavite',
  'Cebu', 'Compostela Valley', 'Cotabato', 'Davao del Norte', 'Davao del Sur', 'Davao Occidental',
  'Davao Oriental', 'Dinagat Islands', 'Eastern Samar', 'Guimaras', 'Ifugao', 'Ilocos Norte',
  'Ilocos Sur', 'Iloilo', 'Isabela', 'Kalinga', 'La Union', 'Laguna', 'Lanao del Norte',
  'Lanao del Sur', 'Leyte', 'Maguindanao', 'Marinduque', 'Masbate', 'Misamis Occidental',
  'Misamis Oriental', 'Mountain Province', 'Negros Occidental', 'Negros Oriental', 'Northern Samar',
  'Nueva Ecija', 'Nueva Vizcaya', 'Occidental Mindoro', 'Oriental Mindoro', 'Palawan', 'Pampanga',
  'Pangasinan', 'Quezon', 'Quirino', 'Rizal', 'Romblon', 'Samar', 'Sarangani', 'Siquijor',
  'Sorsogon', 'South Cotabato', 'Southern Leyte', 'Sultan Kudarat', 'Sulu', 'Surigao del Norte',
  'Surigao del Sur', 'Tarlac', 'Tawi-Tawi', 'Zambales', 'Zamboanga del Norte', 'Zamboanga del Sur',
  'Zamboanga Sibugay'
];

// Common degree options for editable dropdown
export const commonDegrees = [
  // Basic Education
  'Elementary Graduate',
  'Elementary Undergraduate',
  'High School Graduate',
  'High School Undergraduate',
  'Senior High School Graduate',
  'Senior High School Undergraduate',
  
  // Vocational/Technical
  'Vocational Course Graduate',
  'Technical Course Graduate',
  'TESDA Certificate',
  'Certificate Course',
  'Diploma Course',
  
  // College/University
  'Associate Degree',
  'Bachelor of Arts',
  'Bachelor of Science',
  'Bachelor of Elementary Education',
  'Bachelor of Secondary Education',
  'Bachelor of Science in Information Technology',
  'Bachelor of Science in Computer Science',
  'Bachelor of Science in Business Administration',
  'Bachelor of Science in Accountancy',
  'Bachelor of Science in Nursing',
  'Bachelor of Science in Engineering',
  'Bachelor of Science in Agriculture',
  'Bachelor of Science in Psychology',
  'Bachelor of Science in Biology',
  'Bachelor of Science in Chemistry',
  'Bachelor of Science in Civil Engineering',
  'Bachelor of Science in Criminology',
  'Bachelor of Science in Economics',
  'Bachelor of Science in Mathematics',
  'Bachelor of Science in Physics',
  
  // Graduate Studies
  'Master of Arts',
  'Master of Science',
  'Master of Business Administration',
  'Doctor of Philosophy',
  'Doctor of Medicine',
];

// Editable degrees list - can be expanded by users
export const getCommonDegrees = () => {
  const storedDegrees = JSON.parse(localStorage.getItem('ncip_degrees') || '[]');
  
  // Merge default with stored, remove duplicates
  const allDegrees = [...new Set([...commonDegrees, ...storedDegrees])];
  return allDegrees.sort();
};

export const addNewDegree = (degreeName) => {
  if (!degreeName || degreeName.trim() === '') return;
  
  const currentDegrees = JSON.parse(localStorage.getItem('ncip_degrees') || '[]');
  const trimmedDegree = degreeName.trim();
  
  if (!currentDegrees.includes(trimmedDegree)) {
    currentDegrees.push(trimmedDegree);
    localStorage.setItem('ncip_degrees', JSON.stringify(currentDegrees));
  }
};

// Editable provinces list - can be expanded by users
export const getPhilippinesProvinces = () => {
  const storedProvinces = JSON.parse(localStorage.getItem('ncip_provinces') || '[]');
  
  // Merge default with stored, remove duplicates
  const allProvinces = [...new Set([...philippinesProvinces, ...storedProvinces])];
  return allProvinces.sort();
};

export const addNewProvince = (provinceName) => {
  if (!provinceName || provinceName.trim() === '') return;
  
  const currentProvinces = JSON.parse(localStorage.getItem('ncip_provinces') || '[]');
  const trimmedProvince = provinceName.trim();
  
  if (!currentProvinces.includes(trimmedProvince)) {
    currentProvinces.push(trimmedProvince);
    localStorage.setItem('ncip_provinces', JSON.stringify(currentProvinces));
  }
};
