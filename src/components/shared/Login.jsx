import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const { login, user, loading, error } = useAuth()
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [lastUserInteraction, setLastUserInteraction] = useState(Date.now())
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Carousel slides data
  const slides = [
    {
      title: "Welcome to NCIP Alabel Sarangani Portal",
      subtitle: "Your gateway to Indigenous Peoples Digital Services and Certificate of Confirmation applications.",
      highlight: "Indigenous Peoples services",
      stats: null
    },
    {
      title: "Serving Alabel Community",
      subtitle: "Dedicated to protecting and promoting the rights of Indigenous Cultural Communities in Alabel, Sarangani Province.",
      highlight: "Indigenous Cultural Communities",
      stats: null
    },
    {
      title: "Digital Transformation",
      subtitle: "Experience modern, efficient services designed specifically for Indigenous communities with secure online applications.",
      highlight: "Indigenous communities",
      stats: null
    }
  ]

  // Carousel navigation functions
  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setLastUserInteraction(Date.now()) // Record user interaction
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setIsTransitioning(false)
    }, 150) // Smooth transition delay
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setLastUserInteraction(Date.now()) // Record user interaction
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
      setIsTransitioning(false)
    }, 150) // Smooth transition delay
  }

  const goToSlide = (index) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setLastUserInteraction(Date.now()) // Record user interaction
    setTimeout(() => {
      setCurrentSlide(index)
      setIsTransitioning(false)
    }, 150) // Smooth transition delay
  }

  const autoNextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setIsTransitioning(false)
    }, 300) // Slower auto transition
  }

  // Auto-advance only after 9 seconds of no user interaction
  useEffect(() => {
    if (isTransitioning) return

    const autoAdvanceTimer = setTimeout(() => {
      autoNextSlide()
    }, 9000) // Auto-advance after 9 seconds

    return () => clearTimeout(autoAdvanceTimer)
  }, [lastUserInteraction, isTransitioning, currentSlide])

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'admin' ? '/admin' : '/user'
      navigate(redirectPath, { replace: true })
    }
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear errors when user starts typing
    if (loginError) setLoginError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setLoginError('')

    try {
      await login(credentials)
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Top Navigation Bar */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* NCIP Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200 border border-gray-200">
                  <img 
                    src="/NCIPLogo.png" 
                    alt="NCIP Logo" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  NCIP, Alabel Sarangani
                </h1>
                <p className="text-sm text-blue-100 font-medium">National Commission on Indigenous Peoples</p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Secure Portal</span>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  to="/register"
                  className="text-white hover:text-blue-100 px-4 py-2 rounded-lg font-medium transition-colors hover:bg-white/10"
                >
                  Create Account
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - About NCIP and System */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section with Indigenous Background - Full Viewport */}
        <div className="relative mb-20 rounded-3xl overflow-hidden shadow-2xl min-h-[calc(100vh-5rem)]">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-indigo-900/90 z-10"></div>
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/Sarangani celebrates National IP Day.jpg'), linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)`
              }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative z-20 text-center py-24 px-8 min-h-[calc(100vh-5rem)] flex flex-col justify-center">
            {/* NCIP Logo */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <img 
                  src="/NCIPLogo.png" 
                  alt="NCIP Logo" 
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
            
            {/* Carousel Content */}
            <div className={`mb-8 transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-75 transform scale-95' : 'opacity-100 transform scale-100'}`}>
              {/* Fixed height container for title to prevent size changes */}
              <div className="h-32 md:h-40 flex items-center justify-center mb-6">
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight transition-all duration-700 ease-in-out text-center">
                  {slides[currentSlide].title.includes("NCIP Alabel Sarangani") ? (
                    <>
                      Welcome to<br />
                      <span className="text-blue-200">NCIP Alabel Sarangani Portal</span>
                    </>
                  ) : (
                    <span className="text-blue-200">{slides[currentSlide].title}</span>
                  )}
                </h1>
              </div>
              
              {/* Fixed height container for subtitle to prevent size changes */}
              <div className="h-24 md:h-32 flex items-center justify-center mb-8">
                <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto font-light leading-relaxed transition-all duration-700 ease-in-out text-center">
                  {slides[currentSlide].subtitle.split(slides[currentSlide].highlight).map((part, index, array) => (
                    <span key={index}>
                      {part}
                      {index < array.length - 1 && (
                        <span className="font-semibold text-white">{slides[currentSlide].highlight}</span>
                      )}
                    </span>
                  ))}
                </p>
              </div>

            </div>

            {/* Navigation Buttons - Positioned on sides */}
            <button
              onClick={prevSlide}
              className="absolute left-8 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors shadow-lg"
            >
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors shadow-lg"
            >
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center space-x-3 mb-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-white shadow-lg' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Cultural Pattern Decoration */}
            <div className="absolute top-1/4 left-1/4 w-8 h-8 border-2 border-white/10 rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-6 h-6 border-2 border-blue-200/20 rounded-full"></div>
            <div className="absolute bottom-1/4 left-1/3 w-4 h-4 border-2 border-indigo-200/30 rounded-full"></div>
          </div>
        </div>

        {/* System Overview Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Elevating Indigenous Services
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              NCIP Digital Portal: A streamlined Certificate of Confirmation application system for Indigenous Peoples in Alabel, Sarangani Province. Empowering communities with digital access to essential government services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-900">Digital Application</h3>
                    <p className="text-blue-600 font-semibold text-sm">5-Step Process</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Complete your Certificate of Confirmation application from the comfort of your home. Our intuitive 5-step process guides you through personal information, document uploads, and verification.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-900">Real-Time Tracking</h3>
                    <p className="text-green-600 font-semibold text-sm">Status Updates</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Track your application progress in real-time. Receive instant notifications when your documents are reviewed and your certificate is ready for download.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
              <div className="text-center mb-6">
                <div className="inline-flex items-center bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-semibold text-sm mb-4">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></div>
                  Certificate Preview
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-dashed border-indigo-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img src="/NCIPLogo.png" alt="NCIP" className="w-8 h-8 mr-2" />
                    <span className="font-bold text-gray-900">NCIP, Alabel Sarangani</span>
                  </div>
                  <div className="text-xs text-gray-500">Digital Certificate</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Applicant:</span>
                    <span className="font-semibold ml-2">Juan Dela Cruz</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-semibold ml-2">Alabel, Sarangani</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-green-600 font-semibold ml-2">✓ Approved</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Certificate ID:</span>
                    <span className="font-mono text-sm ml-2">COC-2024-001</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg font-semibold text-sm">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What is NCIP Digital Portal Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-4">
              What is NCIP Digital Portal?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Intelligent certificate processing built for Indigenous communities on the move.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 border border-blue-100 mb-12">
            <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
              NCIP Digital Portal is a streamlined Certificate of Confirmation system designed to simplify Indigenous identity verification. 
              By combining secure document upload and digital processing, it ensures accurate and efficient certificate generation for 
              education, business, and government service applications. Seamless automation keeps applicants informed while empowering 
              Indigenous communities to access essential services from anywhere.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Location Verified</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Applications processed only for verified residents of Alabel, Sarangani Province.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Monitoring</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Instantly track your application progress with live status updates and notifications.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Upload System</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Built-in document security safeguards your personal information with encrypted storage.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">User-Friendly Interface</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Streamlined workflows ensure fast, secure applications for every Indigenous community member.
              </p>
            </div>
          </div>
        </div>


        {/* Get Started Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl p-12 text-white text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the digital transformation of Indigenous services in Alabel. Apply for your Certificate of Confirmation online today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-white/20"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-8 flex justify-center space-x-8 text-blue-100">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free to Use</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7" />
              </svg>
              <span>Fast</span>
            </div>
          </div>
        </div>

      </main>

    </div>
  )
}

export default Login
