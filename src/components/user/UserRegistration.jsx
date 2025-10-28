import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Mail, Upload, User, Eye, EyeOff, MapPin, Shield, AlertCircle } from 'lucide-react';
import axios from 'axios';
import EmailVerificationStep from './EmailVerificationStep';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationSent, setVerificationSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState(''); // Store the email that was verified
  const [countdown, setCountdown] = useState(0); // Countdown timer in seconds
  const [canResend, setCanResend] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    province: 'Sarangani', // Fixed to Sarangani
    city: '',
    barangay: '',
    streetSubdivision: '',
    address: '',
    lotBlock: '',
    phoneNumber: '+63',
    ethnicity: '',
    password: '',
    confirmPassword: '',
    birthCertificate: null
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [filteredAddresses, setFilteredAddresses] = useState([]);
  const [showProvinceSuggestions, setShowProvinceSuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showBarangaySuggestions, setShowBarangaySuggestions] = useState(false);
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredBarangays, setFilteredBarangays] = useState([]);
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [isCustomBarangay, setIsCustomBarangay] = useState(false);
  const addressInputRef = useRef(null);
  const provinceInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const barangayInputRef = useRef(null);

  const ethnicities = [
    'Blaan',
    'T\'boli',
    'Tagakaulo',
    'Other'
  ];

  // Hierarchical location data structure - Complete Sarangani Province
  const locationData = {
    'Sarangani': {
      'Alabel': [
        'Poblacion',
        'Bagacay',
        'Baluntay',
        'Datal Anggas',
        'Domolok',
        'Kawas',
        'Ladol',
        'Maribulan',
        'Pag-asa',
        'Spring',
        'Tokawal'
      ],
      'Glan': [
        'Poblacion',
        'Batulaki',
        'Batomelong',
        'Burias',
        'Cablalan',
        'Calabanit',
        'Calpidong',
        'Congan',
        'Cross',
        'Datalbukay',
        'E. Alegado',
        'Glan Padidu',
        'Gumasa',
        'Ilaya',
        'Kaltuad',
        'Kapatan',
        'Lago',
        'Laguimit',
        'Mudan',
        'New Aklan',
        'Pangyan',
        'Rio Del Pilar',
        'San Jose',
        'San Vicente',
        'Sufatubo',
        'Taluya',
        'Tango',
        'Tapon'
      ],
      'Kiamba': [
        'Poblacion',
        'Badtasan',
        'Datu Dani',
        'Gasi',
        'Kapate',
        'Katubao',
        'Kayupo',
        'Kling',
        'Lagundi',
        'Lebe',
        'Lomuyon',
        'Luma',
        'Maligang',
        'Nalus',
        'Salakit',
        'Tablao',
        'Tamadang',
        'Tambilil'
      ],
      'Maitum': [
        'Poblacion',
        'Bati-an',
        'Edenton',
        'Kalaneg',
        'Kalaong',
        'Kiambing',
        'Kiayap',
        'Mabay',
        'Maguling',
        'Mainit',
        'Mindupok',
        'Minapan',
        'New La Union',
        'Old Poblacion',
        'Pangi',
        'Pinol',
        'Sison',
        'Ticulab',
        'Tuanadatu',
        'Wali',
        'Zion'
      ],
      'Malapatan': [
        'Poblacion',
        'Daan Suyan',
        'Datal Batong',
        'Kalaong',
        'Kihan',
        'Libi',
        'Little Baguio',
        'Luhib',
        'Patag',
        'Sapu Masla',
        'Sapu Padidu',
        'Tuyan'
      ],
      'Maasim': [
        'Poblacion',
        'Amsipit',
        'Bales',
        'Colon',
        'Daliao',
        'Kabatiol',
        'Kablacan',
        'Kamanga',
        'Kanalo',
        'Lumasal',
        'Lumatil',
        'Malbang',
        'Nomoh',
        'Pananag',
        'Seven Hills',
        'Tinoto'
      ],
      'Malungon': [
        'Poblacion',
        'Alkikan',
        'Ampon',
        'Atlae',
        'Banahaw',
        'Baybay',
        'Datal Bila',
        'Datal Tampal',
        'J.P. Laurel',
        'Kawayan',
        'Kiblat',
        'Libi',
        'Mabini',
        'Malabod',
        'Nagpan',
        'Panamin',
        'Patulang',
        'San Miguel',
        'San Roque',
        'Talus',
        'Tamban',
        'Tinongcop',
        'Upper Biangan'
      ]
    },
    'South Cotabato': {
      'General Santos City': [
        'Apopong', 'Baluan', 'Batomelong', 'Buayan', 'Bula', 'Calumpang', 'City Heights', 'Conel', 
        'Dadiangas East', 'Dadiangas North', 'Dadiangas South', 'Dadiangas West', 'Fatima', 
        'Katangawan', 'Labangal', 'Lagao', 'Ligaya', 'Mabuhay', 'Olympog', 'San Isidro', 
        'San Jose', 'Siguel', 'Sinawal', 'Tambler', 'Tinagacan', 'Upper Labay'
      ],
      'Koronadal City': [
        'Assumption', 'Avanceña', 'Cacub', 'Caloocan', 'Carpenter Hill', 'Concepcion', 
        'Esperanza', 'General Paulino Santos', 'Mabini', 'Magsaysay', 'Mambucal', 
        'Morales', 'Namnama', 'New Pangasinan', 'Paraiso', 'Rotonda', 'San Isidro', 
        'San Jose', 'San Roque', 'Santa Cruz', 'Santo Niño', 'Sarabia', 'Saravia', 
        'Topland', 'Zone I', 'Zone II', 'Zone III', 'Zone IV'
      ],
      'Polomolok': ['Poblacion', 'Bentung', 'Cannery Site', 'Crossing Palkan', 'Glamang', 'Kinilis', 'Klinan', 'Koronadal Proper', 'Landan', 'Lapu', 'Lower Katungal', 'Lumakil', 'Maligo', 'Magsaysay', 'Pagalungan', 'Palkan', 'Polo', 'Rubber', 'Silway 7', 'Silway 8', 'Sulit', 'Upper Klinan'],
      'Tupi': ['Poblacion', 'Acmonan', 'Bololmala', 'Bunao', 'Cebuano', 'Crossing Rubber', 'Kablon', 'Kalkam', 'Linan', 'Lunen', 'Miasong', 'Palian', 'Polonuling', 'Simbo'],
      'Tampakan': ['Poblacion', 'Albagan', 'Bula', 'Danlag', 'Kipalbig', 'Lampitak', 'Liberty', 'Maltana', 'Palo', 'Pula-Bato', 'San Isidro', 'Santa Cruz', 'Tablu'],
      'Tantangan': ['Poblacion', 'Bukay Pait', 'Libas', 'Magon', 'Maibo', 'New Iloilo', 'Tinongtongan'],
      'Lake Sebu': ['Poblacion', 'Bacdulong', 'Halilan', 'Hanoon', 'Klubi', 'Lamcade', 'Lamdalag', 'Lamlahak', 'Luhib', 'Ned', 'Seloton', 'Siluton', 'Tasiman', 'Talisay', 'Upper Maculan'],
      'T\'Boli': ['Poblacion', 'Aflek', 'Afus', 'Basag', 'Datal Bonlangon', 'Desawo', 'Edwards', 'Kematu', 'Lambangan', 'Laconon', 'Maan', 'Malugong', 'Mongocayo', 'New Dumangas', 'Salacafe', 'Sinolon', 'Talcon', 'Tudok'],
      'Surallah': ['Poblacion', 'Buenavista', 'Canahay', 'Centrala', 'Colongulo', 'Dajay', 'Duengas', 'Lambontong', 'Lamian', 'Lamsugod', 'Little Baguio', 'Moloy', 'Naci', 'T\'Bolok', 'Talahik', 'Tubi', 'Upper Sepaka', 'Vetancio'],
      'Santo Niño': ['Poblacion', 'Dumaguil', 'Kiamba', 'Kulaman', 'Luhong', 'Malegdeg', 'Moh. Bagumbayan', 'Telafas'],
      'Norala': ['Poblacion', 'Benigno Aquino', 'Esperanza', 'Lapuz', 'Liberty', 'Matapol', 'Puti', 'San Jose', 'San Miguel', 'Simsiman', 'Tinago'],
      'Banga': ['Poblacion', 'Albagan', 'Amsipit', 'Cabuling', 'Crossing', 'Datal Anggas', 'Kabulakan', 'Kinilis', 'Libertad', 'Luhib', 'Malabod', 'Matulas', 'Ninoy Aquino', 'Pamantingan', 'Poblacion', 'Rizal', 'San Isidro', 'San Jose', 'San Vicente', 'Sto. Niño']
    },
    'Sultan Kudarat': {
      'Tacurong City': ['Poblacion', 'Baras', 'Buenaflor', 'Calean', 'Carmen', 'Griño', 'Kalandagan', 'Lancheta', 'Lower Katungal', 'New Isabela', 'New Lagao', 'Poblacion', 'Rajah Muda', 'San Antonio', 'San Emmanuel', 'San Pablo', 'Tina', 'Upper Katungal'],
      'Isulan': ['Poblacion', 'Bambad', 'Bual', 'Dansuli', 'Impao', 'Kalawag', 'Kenram', 'Kudanding', 'Lagandang', 'Laguilayan', 'Mapantig', 'New Pangasinan', 'Sampaguita', 'Tayugo'],
      'Lutayan': ['Poblacion', 'Antong', 'Blingkong', 'Bukay Pait', 'Lutayan Proper', 'Maindang', 'Mamali', 'Sampao', 'Sisiman', 'Tamnag'],
      'Bagumbayan': ['Poblacion', 'Bai Sarifinang', 'Biwang', 'Busok', 'Daguma', 'Kabulakan', 'Kapaya', 'Masiag', 'Monteverde', 'Sarmiento', 'Sumilil', 'Tinaungan'],
      'Esperanza': ['Poblacion', 'Ala', 'Daladap', 'Dukay', 'Ilian', 'Kalanawe', 'Laguinding', 'Magsaysay', 'Margues', 'New Cebu', 'Pamantingan', 'Salabaca', 'Saliao', 'Sagasa', 'Tual'],
      'Lambayong': ['Poblacion', 'Batulawan', 'Bukay Pait', 'Didtaras', 'Gansing', 'Kapingkong', 'Kauswagan', 'Lagao', 'Maguling', 'Mamali', 'Pidtiguian', 'Poblacion', 'Sigayan', 'Tinumigues'],
      'Lebak': ['Poblacion', 'Barurao', 'Basak', 'Bolebok', 'Capilan', 'Christiannuevo', 'Datu Karon', 'Kalamongog', 'Keytodac', 'Kinodalan', 'Kitubod', 'Nuling', 'Pansud', 'Pasandalan', 'Poloy-poloy', 'Purikay', 'Salaman', 'Taguisa', 'Tibpuan', 'Villamonte']
    }
  };

  // Popular streets/subdivisions for autocomplete
  const popularStreets = [
    'Maria Theresa Village',
    'Greenfield Village',
    'Lagao Subdivision',
    'City Heights Subdivision',
    'Robinsons Place Area',
    'KCC Mall Area',
    'Gaisano Mall Area',
    'Fitmart Area',
    'Pioneer Avenue',
    'Santiago Boulevard',
    'National Highway',
    'Magsaysay Avenue',
    'Roxas Avenue',
    'Pendatun Avenue',
    'Acharon Boulevard',
    'Buayan Road',
    'Polomolok Road',
    'Tupi Road',
    'Koronadal Road',
    'Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5',
    'Sitio Centro', 'Sitio Proper', 'Sitio Upper', 'Sitio Lower'
  ];

  const steps = [
    { number: 1, title: 'Profile Information', icon: User },
    { number: 2, title: 'Email Verification', icon: Mail },
    { number: 3, title: 'Document Upload', icon: Upload },
    { number: 4, title: 'Complete', icon: CheckCircle }
  ];

  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setVerificationSent(false);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addressInputRef.current && !addressInputRef.current.contains(event.target)) {
        setShowAddressSuggestions(false);
      }
      if (provinceInputRef.current && !provinceInputRef.current.contains(event.target)) {
        setShowProvinceSuggestions(false);
      }
      if (cityInputRef.current && !cityInputRef.current.contains(event.target)) {
        setShowCitySuggestions(false);
      }
      if (barangayInputRef.current && !barangayInputRef.current.contains(event.target)) {
        setShowBarangaySuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get available cities (municipalities) in Sarangani
  const getAvailableCities = () => {
    return Object.keys(locationData['Sarangani'] || {});
  };

  // Get available barangays based on selected city
  const getAvailableBarangays = () => {
    if (!formData.city) return [];
    return locationData['Sarangani']?.[formData.city] || [];
  };

  // Handle province typing/search
  const handleProvinceTyping = (value) => {
    handleInputChange('province', value);
    
    if (value.trim().length > 0) {
      const provinces = Object.keys(locationData);
      const filtered = provinces.filter(province =>
        province.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProvinces(filtered);
      setShowProvinceSuggestions(true);
    } else {
      setFilteredProvinces(Object.keys(locationData));
      setShowProvinceSuggestions(true);
    }
  };

  // Select province from suggestions
  const selectProvince = (province) => {
    handleInputChange('province', province);
    handleInputChange('city', '');
    handleInputChange('barangay', '');
    updateFullAddress(province, '', '', formData.streetSubdivision);
    setShowProvinceSuggestions(false);
  };

  // Handle city typing/search
  const handleCityTyping = (value) => {
    handleInputChange('city', value);
    handleInputChange('barangay', ''); // Reset barangay when city changes
    updateFullAddress('Sarangani', value, '', formData.streetSubdivision);
    
    // Close other suggestions
    setShowBarangaySuggestions(false);
    setShowAddressSuggestions(false);
    
    const cities = getAvailableCities();
    if (value.trim().length > 0) {
      const filtered = cities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowCitySuggestions(filtered.length > 0);
    } else {
      setFilteredCities(cities);
      setShowCitySuggestions(true);
    }
  };

  // Select city from suggestions
  const selectCity = (city) => {
    handleInputChange('city', city);
    handleInputChange('barangay', '');
    updateFullAddress('Sarangani', city, '', formData.streetSubdivision);
    setShowCitySuggestions(false);
  };

  // Handle barangay typing/search
  const handleBarangayTyping = (value) => {
    handleInputChange('barangay', value);
    updateFullAddress('Sarangani', formData.city, value, formData.streetSubdivision);
    
    // Close other suggestions
    setShowCitySuggestions(false);
    setShowAddressSuggestions(false);
    
    if (!formData.city) return;
    
    const barangays = getAvailableBarangays();
    if (value.trim().length > 0) {
      const filtered = barangays.filter(barangay =>
        barangay.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBarangays(filtered);
      setShowBarangaySuggestions(filtered.length > 0);
    } else {
      setFilteredBarangays(barangays);
      setShowBarangaySuggestions(true);
    }
  };

  // Select barangay from suggestions
  const selectBarangay = (barangay) => {
    handleInputChange('barangay', barangay);
    updateFullAddress('Sarangani', formData.city, barangay, formData.streetSubdivision);
    setShowBarangaySuggestions(false);
  };

  // Handle street/subdivision change with autocomplete
  const handleStreetChange = (value) => {
    handleInputChange('streetSubdivision', value);
    updateFullAddress('Sarangani', formData.city, formData.barangay, value);
    
    // Close other suggestions
    setShowCitySuggestions(false);
    setShowBarangaySuggestions(false);
    
    if (value.trim().length > 0) {
      const filtered = popularStreets.filter(street =>
        street.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAddresses(filtered.slice(0, 8));
      setShowAddressSuggestions(true);
    } else {
      setFilteredAddresses([]);
      setShowAddressSuggestions(false);
    }
  };

  // Select street from suggestions
  const selectStreet = (street) => {
    handleInputChange('streetSubdivision', street);
    updateFullAddress('Sarangani', formData.city, formData.barangay, street);
    setShowAddressSuggestions(false);
    setFilteredAddresses([]);
  };

  // Update full address string
  const updateFullAddress = (province, city, barangay, street) => {
    const parts = [];
    if (street) parts.push(street);
    if (barangay) parts.push(barangay);
    if (city) parts.push(city);
    if (province) parts.push(province);
    handleInputChange('address', parts.join(', '));
  };

  // Generate 5-digit OTP
  const generateOtp = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  // Send verification code using backend API
  const sendVerificationCode = async () => {
    if (!formData.email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Please enter your email address' }));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await fetch('http://192.168.68.56:3001/api/registration-auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName
        }),
      });

      const data = await response.json();

      if (data.success) {
        setVerificationSent(true);
        setCountdown(180); // 3 minutes = 180 seconds
        setCanResend(false);
      } else {
        setErrors(prev => ({ ...prev, email: data.message || 'Failed to send verification code' }));
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      setErrors(prev => ({ ...prev, email: 'Network error. Please check your connection.' }));
    } finally {
      setIsLoading(false);
    }
  };

  // Verify email code
  const verifyEmailCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setErrors(prev => ({ ...prev, verificationCode: 'Please enter the 6-digit verification code' }));
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // For now, simulate verification (you can add a backend endpoint for this)
      // In a real implementation, you'd verify the code without creating the user
      if (verificationCode.length === 6) {
        setEmailVerified(true);
        setVerifiedEmail(formData.email); // Store the verified email
        setVerificationCode('');
        setVerificationSent(false);
      } else {
        setErrors(prev => ({ ...prev, verificationCode: 'Invalid verification code' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, verificationCode: 'Network error. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  // Format countdown time as MM:SS
  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Resend verification code
  const resendCode = async () => {
    if (canResend) {
      await sendVerificationCode();
    }
  };

  // Send actual OTP email (legacy function - keeping for compatibility)
  const sendOtp = async () => {
    setIsLoading(true);
    const otp = generateOtp();
    
    try {
      // Fallback method
      alert(`Your verification code is: ${otp}\n\nPlease enter this code to continue.`);
    } catch (error) {
      console.error('Email sending failed:', error);
      alert(`Your verification code is: ${otp}\n\nPlease enter this code to continue.`);
    }
    
    setIsLoading(false);
  };

  // Validate form fields
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.displayName.trim()) newErrors.displayName = 'Display name is required';
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      const phoneRegex = /^\+63\d{10}$/;
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Phone number must be +63 followed by 10 digits';
      }

      if (!formData.ethnicity) newErrors.ethnicity = 'Please select your ethnicity';

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
    }

    if (step === 2) {
      if (!emailVerified || formData.email !== verifiedEmail) {
        newErrors.email = 'Please verify your email address';
      }
    }

    if (step === 3) {
      if (!formData.birthCertificate) {
        newErrors.birthCertificate = 'Please upload your birth certificate';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Reset email verification if email address changes
    if (field === 'email' && value !== verifiedEmail) {
      setEmailVerified(false);
      setVerificationSent(false);
      setVerificationCode('');
      setVerifiedEmail('');
      setCountdown(0);
      setCanResend(true);
    }
  };

  const handleEmailChange = (value) => {
    handleInputChange('email', value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, birthCertificate: 'Please upload a JPG, PNG, or PDF file' }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, birthCertificate: 'File size must be less than 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, birthCertificate: file }));
      setErrors(prev => ({ ...prev, birthCertificate: '' }));
    }
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3) {
        await handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const birthCertificateData = formData.birthCertificate
        ? await fileToBase64(formData.birthCertificate)
        : null;

      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        display_name: formData.displayName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        address: formData.address,
        ethnicity: formData.ethnicity,
        password: formData.password,
        birth_certificate_data: birthCertificateData
      };

      await axios.post('http://192.168.68.56:3001/api/pending-registrations/submit', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      setCurrentStep(4);
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep >= step.number 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'border-gray-300 text-gray-400'
          }`}>
            <step.icon className="w-5 h-5" />
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-2 ${
              currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderProfileStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Profile</h2>
        <p className="text-gray-600">Please provide your personal information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Display Name *</label>
        <input
          type="text"
          value={formData.displayName}
          onChange={(e) => handleInputChange('displayName', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.displayName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="How would you like to be displayed?"
        />
        {errors.displayName && <p className="text-red-500 text-sm mt-1">{errors.displayName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your email address"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      {/* Address Section - Sarangani Province Only */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">Address in Sarangani Province</h3>
          <span className="text-xs text-gray-500">(Type or select from suggestions)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Municipality - Free Type with Suggestions */}
          <div className="relative" ref={cityInputRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Municipality *
              <span className="text-xs text-gray-500 ml-2">(Type any name)</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleCityTyping(e.target.value)}
              onFocus={() => {
                setFilteredCities(getAvailableCities());
                setShowCitySuggestions(true);
              }}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Type municipality name..."
            />
            {showCitySuggestions && filteredCities.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-600">
                  Suggestions (or type your own)
                </div>
                {filteredCities.map((city, index) => (
                  <div
                    key={index}
                    onClick={() => selectCity(city)}
                    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>

          {/* Barangay - Free Type with Suggestions */}
          <div className="relative" ref={barangayInputRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Barangay *
              <span className="text-xs text-gray-500 ml-2">(Type any name)</span>
            </label>
            <input
              type="text"
              value={formData.barangay}
              onChange={(e) => handleBarangayTyping(e.target.value)}
              onFocus={() => {
                if (formData.city) {
                  setFilteredBarangays(getAvailableBarangays());
                  setShowBarangaySuggestions(true);
                }
              }}
              disabled={!formData.city}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.barangay ? 'border-red-500' : 'border-gray-300'
              } ${!formData.city ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder={!formData.city ? "Enter municipality first" : "Type barangay name..."}
            />
            {showBarangaySuggestions && filteredBarangays.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-600">
                  Suggestions (or type your own)
                </div>
                {filteredBarangays.map((barangay, index) => (
                  <div
                    key={index}
                    onClick={() => selectBarangay(barangay)}
                    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                  >
                    {barangay}
                  </div>
                ))}
              </div>
            )}
            {errors.barangay && <p className="text-red-500 text-xs mt-1">{errors.barangay}</p>}
          </div>

          {/* Street/Subdivision - Typable */}
          <div className="relative" ref={addressInputRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Street/Subdivision/Purok (Optional)</label>
            <input
              type="text"
              value={formData.streetSubdivision}
              onChange={(e) => handleStreetChange(e.target.value)}
              disabled={!formData.barangay}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                !formData.barangay ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
              }`}
              placeholder={formData.barangay ? "e.g., Maria Theresa Village" : "Enter barangay first"}
            />
            
            {/* Street Suggestions */}
            {showAddressSuggestions && filteredAddresses.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredAddresses.map((street, index) => (
                  <div
                    key={index}
                    onClick={() => selectStreet(street)}
                    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                  >
                    {street}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lot & Block - Optional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Lot & Block (Optional)</label>
            <input
              type="text"
              value={formData.lotBlock}
              onChange={(e) => handleInputChange('lotBlock', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.lotBlock ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Lot 5 Block 3"
            />
            {errors.lotBlock && <p className="text-red-500 text-xs mt-1">{errors.lotBlock}</p>}
          </div>
        </div>

        {/* Complete Address Preview */}
        {formData.address && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-900 mb-1">Complete Address:</p>
                <p className="text-sm text-blue-800">{formData.address}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="+639123456789"
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
        <p className="text-sm text-gray-500 mt-1">Format: +63 followed by 10 digits</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ethnicity *</label>
        <select
          value={formData.ethnicity}
          onChange={(e) => handleInputChange('ethnicity', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.ethnicity ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select your ethnicity</option>
          {ethnicities.map(ethnicity => (
            <option key={ethnicity} value={ethnicity}>{ethnicity}</option>
          ))}
        </select>
        {errors.ethnicity && <p className="text-red-500 text-sm mt-1">{errors.ethnicity}</p>}
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Minimum 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>
    </motion.div>
  );

  const renderDocumentStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Birth Certificate</h2>
        <p className="text-gray-600">This document is required for Indigenous People (IP) verification</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start">
          <Upload className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Document Requirements</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Upload a clear image (JPG, PNG) or PDF of your birth certificate</li>
              <li>• File size must be less than 5MB</li>
              <li>• Ensure all text is readable and the document is complete</li>
              <li>• This is required for IP verification and account approval</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Birth Certificate *</label>
        <div className={`border-2 border-dashed rounded-xl p-8 text-center ${
          errors.birthCertificate ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
        }`}>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="birth-certificate"
          />
          <label htmlFor="birth-certificate" className="cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {formData.birthCertificate ? (
              <div>
                <p className="text-green-600 font-medium">{formData.birthCertificate.name}</p>
                <p className="text-sm text-gray-500">
                  {(formData.birthCertificate.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 font-medium">Click to upload your birth certificate</p>
                <p className="text-sm text-gray-500">JPG, PNG, or PDF (max 5MB)</p>
              </div>
            )}
          </label>
        </div>
        {errors.birthCertificate && <p className="text-red-500 text-sm mt-1">{errors.birthCertificate}</p>}
      </div>
    </motion.div>
  );

  const renderSuccessStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Your registration has been submitted for admin review. 
          <strong>Your account will only be created after approval.</strong>
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-blue-800 text-sm">
          <strong>📋 What happens next?</strong><br />
          • An administrator will review your documents and information<br />
          • You'll receive an email notification with the decision<br />
          • If approved: Your account will be created and activated<br />
          • If rejected: You'll get feedback and can register again with the same email
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
        <p className="text-green-800 text-sm">
          <strong>✅ Benefits of this process:</strong><br />
          • Your email remains available if changes are needed<br />
          • No duplicate accounts in the system<br />
          • Faster resolution of document issues
        </p>
      </div>

      <button
        onClick={() => navigate('/login')}
        className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
      >
        Return to Login
      </button>
    </motion.div>
  );

  const renderEmailVerificationStep = () => (
    <EmailVerificationStep
      formData={formData}
      handleInputChange={handleInputChange}
      verificationSent={verificationSent}
      emailVerified={emailVerified}
      verificationCode={verificationCode}
      setVerificationCode={setVerificationCode}
      sendVerificationCode={sendVerificationCode}
      verifyEmailCode={verifyEmailCode}
      resendCode={resendCode}
      isLoading={isLoading}
      errors={errors}
      countdown={countdown}
      formatCountdown={formatCountdown}
      canResend={canResend}
    />
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderProfileStep();
      case 2:
        return renderEmailVerificationStep();
      case 3:
        return renderDocumentStep();
      case 4:
        return renderSuccessStep();
      default:
        return null;
    }
  };

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 10px;
          border: 1px solid #1e40af;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb 0%, #1e40af 100%);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
          transform: scale(1.1);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(180deg, #1d4ed8 0%, #1e3a8a 100%);
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #dbeafe;
        }
      `}</style>
      
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: `url('/Sarangani celebrates National IP Day.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Blue overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/80 to-indigo-900/85"></div>
        
        {/* NCIP Logo Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <img 
            src="/NCIPLogo.png" 
            alt="NCIP Background" 
            className="w-96 h-96 object-contain"
          />
        </div>

        {/* Registration Card */}
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/NCIPLogo.png" 
                alt="NCIP Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-gray-900 font-bold text-xl">NCIP Portal</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Get started with your NCIP digital services account</p>
          </div>
        </div>

        {renderStepIndicator()}

        <AnimatePresence mode="wait">
          {currentStep === 1 && renderProfileStep()}
          {currentStep === 2 && renderEmailVerificationStep()}
          {currentStep === 3 && renderDocumentStep()}
          {currentStep === 4 && renderSuccessStep()}
        </AnimatePresence>

        {currentStep < 4 && (
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {currentStep === 3 ? 'Creating Account...' : 'Processing...'}
                </>
              ) : (
                <>
                  {currentStep === 3 ? 'Create Account' : 'Continue'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
    </>
  );
};

export default UserRegistration;
