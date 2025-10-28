import React from 'react';
import { Shield, Menu, X } from 'lucide-react';

const GovernmentHeader = ({ user, onLogout, currentPage = "NCIP Services" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="gov-skip-link">
        Skip to main content
      </a>
      
      {/* Official Government Banner */}
      <div className="bg-gray-800 text-white py-2">
        <div className="gov-container">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>An official website of the Republic of the Philippines</span>
            </div>
            <div className="hidden md:block">
              <span className="text-gray-300">Secure • Official • Trusted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b-4 border-blue-600 shadow-sm">
        <div className="gov-container">
          <div className="flex items-center justify-between py-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  National Commission on Indigenous Peoples
                </h1>
                <p className="text-sm text-gray-600">Certificate of Confirmation Services</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a 
                href="/services" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                aria-label="View available services"
              >
                Services
              </a>
              <a 
                href="/help" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                aria-label="Get help and support"
              >
                Help
              </a>
              <a 
                href="/contact" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                aria-label="Contact information"
              >
                Contact
              </a>
              
              {user ? (
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-300">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.first_name || user.firstName || 'User'} {user.last_name || user.lastName || ''}
                    </p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="gov-btn gov-btn-secondary"
                    aria-label="Sign out of your account"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <a href="/login" className="gov-btn gov-btn-secondary">
                    Sign In
                  </a>
                  <a href="/register" className="gov-btn gov-btn-primary">
                    Create Account
                  </a>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col gap-4">
                <a 
                  href="/services" 
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                >
                  Services
                </a>
                <a 
                  href="/help" 
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                >
                  Help
                </a>
                <a 
                  href="/contact" 
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                >
                  Contact
                </a>
                
                {user ? (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      {user.first_name || user.firstName || 'User'} {user.last_name || user.lastName || ''}
                    </p>
                    <button
                      onClick={onLogout}
                      className="gov-btn gov-btn-secondary w-full"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                    <a href="/login" className="gov-btn gov-btn-secondary">
                      Sign In
                    </a>
                    <a href="/register" className="gov-btn gov-btn-primary">
                      Create Account
                    </a>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="gov-container py-3">
          <nav aria-label="Breadcrumb navigation">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Home
                </a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-700 font-medium" aria-current="page">
                {currentPage}
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </>
  );
};

export default GovernmentHeader;
