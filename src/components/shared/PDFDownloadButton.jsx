import React, { useState } from 'react';
import { Download, FileText, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { generateCOCPDF } from '../../utils/pdfGenerator';
import { consolidateFormData, validateConsolidatedData, createDataSummary } from '../../utils/dataConsolidator';

const PDFDownloadButton = ({ formData, applicationId }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [validationWarnings, setValidationWarnings] = useState([]);

  const handleDownload = async () => {
    setIsGenerating(true);
    setValidationWarnings([]);
    
    try {
      console.log('🔄 Starting PDF generation process...');
      
      // Step 1: Consolidate form data
      console.log('📋 Consolidating form data...');
      const consolidatedData = consolidateFormData(formData);
      
      // Step 2: Validate consolidated data
      console.log('✅ Validating consolidated data...');
      const validation = validateConsolidatedData(consolidatedData);
      
      if (!validation.isValid) {
        console.warn('⚠️ Validation warnings found:', validation.missingFields);
        setValidationWarnings(validation.missingFields);
        // Continue with generation but show warnings
      }
      
      // Step 3: Create data summary for logging
      const summary = createDataSummary(consolidatedData);
      console.log('📊 Application Summary:', summary);
      
      // Step 4: Generate PDF with consolidated data
      console.log('📄 Generating PDF with template mapping...');
      const pdf = await generateCOCPDF(consolidatedData);
      
      // Step 5: Download the generated PDF
      const fileName = `COC_Application_${summary.applicantName.replace(/\s+/g, '_')}_${applicationId || Date.now()}.pdf`;
      pdf.save(fileName);
      
      console.log('✅ PDF generated successfully:', fileName);
      
      // Step 6: Send data to backend for storage (optional)
      if (applicationId) {
        try {
          const response = await fetch('/api/pdf/generate-coc', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              formData: consolidatedData,
              applicationId: applicationId
            })
          });
          
          if (response.ok) {
            console.log('✅ Application data stored in database');
          }
        } catch (apiError) {
          console.warn('⚠️ Failed to store in database:', apiError.message);
          // Don't fail PDF generation if database storage fails
        }
      }
      
      setGenerated(true);
      
      // Reset after 5 seconds
      setTimeout(() => {
        setGenerated(false);
        setValidationWarnings([]);
      }, 5000);
      
    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      alert(`Failed to generate PDF. Please try again.\n\nError: ${error.message}\n\nTip: Make sure all required fields are filled out.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg border-2 border-blue-200 p-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="p-3 bg-blue-600 rounded-xl">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-2xl font-bold text-gray-900">Download Your Application</h3>
          <p className="text-sm text-gray-600 mt-1">Get your completed COC application form as PDF</p>
        </div>
      </div>

      {/* Validation Warnings */}
      {validationWarnings.length > 0 && (
        <div className="bg-yellow-50 rounded-xl p-6 mb-6 border-2 border-yellow-200">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-yellow-800 mb-2">Missing Information Detected</h4>
              <p className="text-sm text-yellow-700 mb-3">
                The following fields are missing but PDF generation will continue:
              </p>
              <ul className="text-sm text-yellow-700 space-y-1">
                {validationWarnings.map((field, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    {field.replace(/\./g, ' → ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-white rounded-xl p-6 mb-6 border-2 border-blue-100">
        <div className="flex items-center mb-3">
          <Info className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="font-bold text-gray-900">Your PDF will include:</h4>
        </div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span><strong>Page 1:</strong> Certificate of Confirmation Form (Personal Index, Educational Background, Parental Background)</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span><strong>Page 2:</strong> Barangay Certification</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span><strong>Page 3:</strong> Tribal Chieftain Certification</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span><strong>Page 4:</strong> Joint Affidavit of Two Disinterested Persons</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span><strong>Page 5:</strong> Genealogy Tree (3rd Generation)</span>
          </li>
        </ul>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>Enhanced PDF Generation:</strong> Uses consolidated data mapping to ensure accurate field placement matching official NCIP forms.
          </p>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
          generated
            ? 'bg-green-600 text-white'
            : isGenerating
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl transform hover:scale-105'
        }`}
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            Generating PDF...
          </>
        ) : generated ? (
          <>
            <CheckCircle className="w-6 h-6" />
            PDF Downloaded Successfully!
          </>
        ) : (
          <>
            <Download className="w-6 h-6" />
            Download Application as PDF
          </>
        )}
      </button>

      {/* Note */}
      <p className="text-xs text-gray-600 text-center mt-4 italic">
        Note: Please print and sign the downloaded PDF before submitting to NCIP office
      </p>
    </div>
  );
};

export default PDFDownloadButton;
