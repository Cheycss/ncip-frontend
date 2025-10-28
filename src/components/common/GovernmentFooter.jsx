import React from 'react';
import { Shield, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

const GovernmentFooter = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      {/* Main Footer Content */}
      <div className="gov-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Agency Information */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">NCIP</h3>
                <p className="text-gray-300 text-sm">National Commission on Indigenous Peoples</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              The National Commission on Indigenous Peoples (NCIP) is the primary government agency 
              responsible for the protection and promotion of the rights and welfare of Indigenous 
              Cultural Communities/Indigenous Peoples (ICCs/IPs) in the Philippines.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Republic Act No. 8371</span>
              <span>•</span>
              <span>Indigenous Peoples Rights Act of 1997</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="/apply" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  Certificate of Confirmation
                </a>
              </li>
              <li>
                <a 
                  href="/status" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Application Status
                </a>
              </li>
              <li>
                <a 
                  href="/requirements" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Requirements Guide
                </a>
              </li>
              <li>
                <a 
                  href="/help" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Help & Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">2nd Floor, N. dela Merced Bldg.</p>
                  <p className="text-gray-300">Cor. West & Quezon Ave.</p>
                  <p className="text-gray-300">Quezon City, Philippines</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a 
                  href="tel:+63-2-8373-2086" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  +63 (2) 8373-2086
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a 
                  href="mailto:info@ncip.gov.ph" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  info@ncip.gov.ph
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Government Links Bar */}
      <div className="border-t border-gray-800">
        <div className="gov-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <a 
                href="https://www.gov.ph" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
              >
                Official Gazette
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://www.foi.gov.ph" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
              >
                Freedom of Information
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="/privacy-policy" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="/accessibility" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Accessibility
              </a>
            </div>
            
            <div className="text-sm text-gray-400">
              <p>© 2024 National Commission on Indigenous Peoples</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="gov-container py-4">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Shield className="w-4 h-4" />
            <span>
              This is an official government website. Information and services are provided by the 
              National Commission on Indigenous Peoples.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GovernmentFooter;
