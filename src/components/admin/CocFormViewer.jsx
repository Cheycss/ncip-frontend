import React from 'react';

const CocFormViewer = ({ formData, currentPage, selectedPurpose, setCurrentPage }) => {
  const renderPage1 = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex flex-col items-center mb-4">
          <img 
            src="/NCIPLogo.png" 
            alt="NCIP Logo" 
            className="w-16 h-16 mb-4"
          />
          <div>
            <h1 className="text-lg font-bold text-gray-900">REPUBLIC OF THE PHILIPPINES</h1>
            <h2 className="text-base font-semibold text-gray-800">NATIONAL COMMISSION ON INDIGENOUS PEOPLES</h2>
            <p className="text-sm text-gray-600">Regional Office No. XI</p>
          </div>
        </div>
      </div>

      {/* Personal Index Section */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
          I. PERSONAL INDEX
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <p className="text-gray-900">{formData.name || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Civil Status</label>
              <p className="text-gray-900">{formData.civilStatus || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="block text-sm font-semibold text-gray-700 mb-1">ICCs</label>
              <p className="text-gray-900">{formData.iccs || 'N/A'}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
            <p className="text-gray-900">{formData.address || 'N/A'}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Place of Origin</label>
            <p className="text-gray-900">{formData.placeOfOrigin || 'N/A'}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Place of Birth</label>
              <p className="text-gray-900">{formData.placeOfBirth || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
              <p className="text-gray-900">{formData.dateOfBirth || 'N/A'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Spouse Name</label>
              <p className="text-gray-900">{formData.spouseName || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Background Section */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
          II. EDUCATIONAL BACKGROUND
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Highest Educational Attainment</label>
            <p className="text-gray-900">{formData.highestEducation || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Degree Obtained</label>
            <p className="text-gray-900">{formData.degreeObtained || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Parental Background Section */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
          III. PARENTAL BACKGROUND
        </h3>
        <div className="grid grid-cols-2 gap-8">
          {/* Father Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-bold text-gray-900 mb-3 text-center bg-blue-50 py-2 rounded">FATHER</h4>
            <div className="space-y-3">
              <div className="bg-gray-50 p-2 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                <p className="text-sm text-gray-900">{formData.fatherName || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Address</label>
                <p className="text-sm text-gray-900">{formData.fatherAddress || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tribe</label>
                <p className="text-sm text-gray-900">{formData.fatherTribe || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Grandfather</label>
                <p className="text-sm text-gray-900">{formData.fatherGrandfather || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Grandmother</label>
                <p className="text-sm text-gray-900">{formData.fatherGrandmother || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Mother Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-bold text-gray-900 mb-3 text-center bg-pink-50 py-2 rounded">MOTHER</h4>
            <div className="space-y-3">
              <div className="bg-gray-50 p-2 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                <p className="text-sm text-gray-900">{formData.motherName || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Address</label>
                <p className="text-sm text-gray-900">{formData.motherAddress || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tribe</label>
                <p className="text-sm text-gray-900">{formData.motherTribe || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Grandfather</label>
                <p className="text-sm text-gray-900">{formData.motherGrandfather || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Grandmother</label>
                <p className="text-sm text-gray-900">{formData.motherGrandmother || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Land Matter Section */}
      {selectedPurpose === 'Land Matter' && (
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
            IV. LAND MATTER INFORMATION
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Homestead/Free Patent No.</label>
                <p className="text-gray-900">{formData.homesteadNo || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Lot No.</label>
                <p className="text-gray-900">{formData.lotNo || 'N/A'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Issuance</label>
                <p className="text-gray-900">{formData.dateOfIssuance || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Area</label>
                <p className="text-gray-900">{formData.area || 'N/A'}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <p className="text-gray-900">{formData.location || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Signature Section */}
      <div className="border-t border-gray-300 pt-6">
        <div className="text-center">
          <div className="bg-gray-50 p-4 rounded inline-block">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Applicant Signature</label>
            <p className="text-lg text-gray-900 font-semibold">{formData.applicantSignature || 'N/A'}</p>
            <p className="text-sm text-gray-600 mt-2">(Printed Name/Signature of Applicant)</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage2 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900">BARANGAY CERTIFICATION</h2>
        <p className="text-sm text-gray-600 mt-2">Page 2 of 4</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Province</label>
            <p className="text-gray-900">{formData.province || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Municipality</label>
            <p className="text-gray-900">{formData.municipality || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Barangay</label>
            <p className="text-gray-900">{formData.barangay || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">CERTIFICATION</h3>
          <div className="space-y-4">
            <div className="bg-white p-3 rounded">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Applicant Name</label>
              <p className="text-gray-900">{formData.applicantName || formData.name || 'N/A'}</p>
            </div>
            <div className="bg-white p-3 rounded">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Residence Location</label>
              <p className="text-gray-900">{formData.residenceLocation || formData.address || 'N/A'}</p>
            </div>
            <div className="bg-white p-3 rounded">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Parent/Ascendant Name</label>
              <p className="text-gray-900">{formData.parentAscendantName || 'N/A'}</p>
            </div>
            <div className="bg-white p-3 rounded">
              <label className="block text-sm font-semibold text-gray-700 mb-1">ICC Group</label>
              <p className="text-gray-900">{formData.iccGroup || formData.iccs || 'N/A'}</p>
            </div>
            <div className="bg-white p-3 rounded">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Years of Residence</label>
              <p className="text-gray-900">{formData.residenceYears || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Issuance Day</label>
            <p className="text-gray-900">{formData.issuanceDay || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Issuance Month</label>
            <p className="text-gray-900">{formData.issuanceMonth || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Issuance Year</label>
            <p className="text-gray-900">{formData.issuanceYear || '2024'}</p>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gray-50 p-4 rounded inline-block">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Punong Barangay Signature</label>
            <p className="text-lg text-gray-900 font-semibold">{formData.punongBarangaySignature || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage3 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900">TRIBAL CERTIFICATION</h2>
        <p className="text-sm text-gray-600 mt-2">Page 3 of 4</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Province</label>
            <p className="text-gray-900">{formData.province || 'SARANGANI'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Municipality</label>
            <p className="text-gray-900">{formData.municipality || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Barangay</label>
            <p className="text-gray-900">{formData.barangay || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">TRIBAL INFORMATION</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Applicant Name</label>
                <p className="text-gray-900">{formData.applicantName || formData.name || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Belonging Location</label>
                <p className="text-gray-900">{formData.belongingLocation || formData.address || 'N/A'}</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded">
              <label className="block text-sm font-semibold text-gray-700 mb-1">ICC Group</label>
              <p className="text-gray-900">{formData.iccGroup || formData.iccs || 'N/A'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Names (1)</label>
                <p className="text-gray-900">{formData.parentNames || formData.fatherName || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Names (2)</label>
                <p className="text-gray-900">{formData.parentNames2 || formData.motherName || 'N/A'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded">
                <label className="block text-sm font-semibold text-gray-700 mb-1">ICC Group 1</label>
                <p className="text-gray-900">{formData.iccGroup1 || formData.fatherTribe || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <label className="block text-sm font-semibold text-gray-700 mb-1">ICC Group 2</label>
                <p className="text-gray-900">{formData.iccGroup2 || formData.motherTribe || 'N/A'}</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Parent/Ascendant Names</label>
              <p className="text-gray-900">{formData.parentAscendantNames || 'N/A'}</p>
            </div>
            
            <div className="bg-white p-3 rounded">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Purpose</label>
              <p className="text-gray-900">{formData.purpose || selectedPurpose || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Issuance Day</label>
            <p className="text-gray-900">{formData.issuanceDay || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Issuance Month</label>
            <p className="text-gray-900">{formData.issuanceMonth || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Issuance Year</label>
            <p className="text-gray-900">{formData.issuanceYear || '2024'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="bg-gray-50 p-4 rounded inline-block">
              <label className="block text-sm font-semibold text-gray-700 mb-2">IPS Head/Tribal Chieftain</label>
              <p className="text-lg text-gray-900 font-semibold">{formData.ipsHeadSignature || 'N/A'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="bg-gray-50 p-4 rounded">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Barangay IPMR</label>
                <p className="text-gray-900 font-semibold">{formData.barangayIpmrSignature || 'N/A'}</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-50 p-4 rounded">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Municipal Tribal Chieftain</label>
                <p className="text-gray-900 font-semibold">{formData.municipalTribalChieftainSignature || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Page 4: Joint Affidavit of Two Disinterested Persons</h3>
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <span>Republic of the Philippines</span>
            <span>)</span>
          </div>
          <div className="flex justify-between items-start mb-2">
            <span>Province of</span>
            <span className="font-medium">{formData.page4?.province || '_________________'}</span>
            <span>)</span>
          </div>
          <div className="flex justify-between items-start">
            <span>Municipality of</span>
            <span className="font-medium">{formData.page4?.municipality || '_________________'}</span>
            <span>) S. S.</span>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mt-8 mb-8">
          JOINT AFFIDAVIT OF TWO DISINTERESTED PERSONS
        </h2>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* First paragraph */}
        <div className="flex flex-wrap items-center gap-2">
          <span>WE,</span>
          <span className="border-b border-black px-2 py-1 min-w-[200px] font-medium">
            {formData.page4?.affiant1Name || '_________________'}
          </span>
          <span>and</span>
          <span className="border-b border-black px-2 py-1 min-w-[200px] font-medium">
            {formData.page4?.affiant2Name || '_________________'}
          </span>
          <span>both</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span>of legal age, Filipino citizen, single/married and bonafide residents of</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="border-b border-black px-2 py-1 min-w-[300px] font-medium">
            {formData.page4?.affiantsAddress || '_________________'}
          </span>
          <span>and</span>
          <span className="border-b border-black px-2 py-1 min-w-[200px] font-medium">
            {formData.page4?.affiantsAddress2 || '_________________'}
          </span>
          <span>Philippines</span>
        </div>

        <div>
          <span>respectively. After been duly sworn in accordance with the law, do hereby depose and say:</span>
        </div>

        {/* Second paragraph */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span>That we know personally</span>
            <span className="border-b border-black px-2 py-1 min-w-[200px] font-medium">
              {formData.page4?.subjectName || '_________________'}
            </span>
            <span>and</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="border-b border-black px-2 py-1 min-w-[200px] font-medium">
              {formData.page4?.spouseName || '_________________'}
            </span>
            <span>to be husband and wife being our neighbors at</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="border-b border-black px-2 py-1 min-w-[300px] font-medium">
              {formData.page4?.coupleAddress || '_________________'}
            </span>
          </div>
        </div>

        {/* Third paragraph */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span>That after couple of years living together the couple have a child born name</span>
            <span className="border-b border-black px-2 py-1 min-w-[150px] font-medium">
              {formData.page4?.childName || '_________________'}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="border-b border-black px-2 py-1 min-w-[150px] font-medium">
              {formData.page4?.childBirthDate || '_________________'}
            </span>
            <span>as their</span>
            <span className="border-b border-black px-2 py-1 min-w-[100px] font-medium">
              {formData.page4?.childOrder || '_________________'}
            </span>
            <span>born child.</span>
          </div>
        </div>

        {/* Fourth paragraph */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span>That</span>
            <span className="border-b border-black px-2 py-1 min-w-[200px] font-medium">
              {formData.page4?.ipMemberName || '_________________'}
            </span>
            <span>is a member of the Indigenous Peoples</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span>belonging to the</span>
            <span className="border-b border-black px-2 py-1 min-w-[150px] font-medium">
              {formData.page4?.ipGroup || '_________________'}
            </span>
            <span>ICCs being his/her father</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="border-b border-black px-2 py-1 min-w-[150px] font-medium">
              {formData.page4?.fatherName || '_________________'}
            </span>
            <span>and mother</span>
            <span className="border-b border-black px-2 py-1 min-w-[150px] font-medium">
              {formData.page4?.motherName || '_________________'}
            </span>
            <span>belonging to</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span>the</span>
            <span className="border-b border-black px-2 py-1 min-w-[120px] font-medium">
              {formData.page4?.parentsIpGroup1 || '_________________'}
            </span>
            <span>and</span>
            <span className="border-b border-black px-2 py-1 min-w-[120px] font-medium">
              {formData.page4?.parentsIpGroup2 || '_________________'}
            </span>
            <span>ICCs, respectively.</span>
          </div>
        </div>

        {/* Fifth paragraph */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span>That we are executing this Joint Affidavit to establish the fact and truth surrounding the IP</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span>membership of</span>
            <span className="border-b border-black px-2 py-1 min-w-[200px] font-medium">
              {formData.page4?.membershipSubject || '_________________'}
            </span>
            <span>.</span>
          </div>
        </div>

        {/* Witness clause */}
        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-2">
            <span>IN WITNESS WHEREOF, we have hereunto affixed our signature this</span>
            <span className="border-b border-black px-2 py-1 min-w-[50px] font-medium">
              {formData.page4?.signatureDay || '_____'}
            </span>
            <span>day of</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="border-b border-black px-2 py-1 min-w-[100px] font-medium">
              {formData.page4?.signatureMonth || '_________________'}
            </span>
            <span>,</span>
            <span className="border-b border-black px-2 py-1 min-w-[80px] font-medium">
              {formData.page4?.signatureYear || '_____'}
            </span>
            <span>at</span>
          </div>
        </div>

        {/* Signature section */}
        <div className="mt-12 grid grid-cols-2 gap-8">
          <div className="text-center">
            <div className="border-b border-black mb-2 h-12"></div>
            <div className="italic">Affiant</div>
            <div className="mt-4 text-sm">
              <div>Comm. Tax Cert. No. <span className="border-b border-black px-1 min-w-[100px] font-medium inline-block">
                {formData.page4?.affiant1TaxCert || '_________'}
              </span></div>
              <div className="mt-1">Issued on: <span className="border-b border-black px-1 min-w-[100px] font-medium inline-block">
                {formData.page4?.affiant1IssuedOn || '_________'}
              </span></div>
              <div className="mt-1">Issued at: <span className="border-b border-black px-1 min-w-[100px] font-medium inline-block">
                {formData.page4?.affiant1IssuedAt || '_________'}
              </span></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="border-b border-black mb-2 h-12"></div>
            <div className="italic">Affiant</div>
            <div className="mt-4 text-sm">
              <div>Comm. Tax Cert. No <span className="border-b border-black px-1 min-w-[100px] font-medium inline-block">
                {formData.page4?.affiant2TaxCert || '_________'}
              </span></div>
              <div className="mt-1">Issued on: <span className="border-b border-black px-1 min-w-[100px] font-medium inline-block">
                {formData.page4?.affiant2IssuedOn || '_________'}
              </span></div>
              <div className="mt-1">Issued at: <span className="border-b border-black px-1 min-w-[100px] font-medium inline-block">
                {formData.page4?.affiant2IssuedAt || '_________'}
              </span></div>
            </div>
          </div>
        </div>

        {/* Notary section */}
        <div className="mt-12">
          <div className="flex flex-wrap items-center gap-2">
            <span>SUBSCRIBED AND SWORN to before me this</span>
            <span className="border-b border-black px-2 py-1 min-w-[50px] font-medium">
              {formData.page4?.notaryDay || '_____'}
            </span>
            <span>day of</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="border-b border-black px-2 py-1 min-w-[100px] font-medium">
              {formData.page4?.notaryMonth || '_________________'}
            </span>
            <span>,</span>
            <span className="border-b border-black px-2 py-1 min-w-[80px] font-medium">
              {formData.page4?.notaryYear || '_____'}
            </span>
            <span>at</span>
          </div>
          
          <div className="mt-8 text-center">
            <span className="font-bold">WITNESS MY HAND AND SEAL.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-sm">
          <div>Doc. No. <span className="border-b border-black px-1 min-w-[50px] font-medium inline-block">
            {formData.page4?.docNo || '___'}
          </span></div>
          <div className="mt-1">Page N. <span className="border-b border-black px-1 min-w-[50px] font-medium inline-block">
            {formData.page4?.pageNo || '___'}
          </span></div>
          <div className="mt-1">Book No. <span className="border-b border-black px-1 min-w-[50px] font-medium inline-block">
            {formData.page4?.bookNo || '___'}
          </span></div>
          <div className="mt-1">Series of 2024</div>
        </div>
      </div>
    </div>
  );

  const renderPage5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Page 5: Genealogical Information</h3>
      
      {/* Great Grandparents Section */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Great Grandparents</h3>
        <div className="grid grid-cols-4 gap-4">
          {/* Paternal Great Grandparents */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Paternal Side</h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Great Grandfather 1</label>
                <p className="text-sm text-gray-900">{formData.paternalGreatGrandfather1 || 'N/A'}</p>
                <p className="text-xs text-gray-600">ICC: {formData.paternalGreatGrandfather1ICC || 'N/A'}</p>
                <p className="text-xs text-gray-600">Origin: {formData.paternalGreatGrandfather1Origin || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Great Grandmother 1</label>
                <p className="text-sm text-gray-900">{formData.paternalGreatGrandmother1 || 'N/A'}</p>
                <p className="text-xs text-gray-600">ICC: {formData.paternalGreatGrandmother1ICC || 'N/A'}</p>
                <p className="text-xs text-gray-600">Origin: {formData.paternalGreatGrandmother1Origin || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Great Grandfather 2</label>
                <p className="text-sm text-gray-900">{formData.paternalGreatGrandfather2 || 'N/A'}</p>
                <p className="text-xs text-gray-600">ICC: {formData.paternalGreatGrandfather2ICC || 'N/A'}</p>
                <p className="text-xs text-gray-600">Origin: {formData.paternalGreatGrandfather2Origin || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Great Grandmother 2</label>
                <p className="text-sm text-gray-900">{formData.paternalGreatGrandmother2 || 'N/A'}</p>
                <p className="text-xs text-gray-600">ICC: {formData.paternalGreatGrandmother2ICC || 'N/A'}</p>
                <p className="text-xs text-gray-600">Origin: {formData.paternalGreatGrandmother2Origin || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          {/* Maternal Great Grandparents */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Maternal Side</h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Great Grandfather 1</label>
                <p className="text-sm text-gray-900">{formData.maternalGreatGrandfather1 || 'N/A'}</p>
                <p className="text-xs text-gray-600">ICC: {formData.maternalGreatGrandfather1ICC || 'N/A'}</p>
                <p className="text-xs text-gray-600">Origin: {formData.maternalGreatGrandfather1Origin || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Great Grandmother 1</label>
                <p className="text-sm text-gray-900">{formData.maternalGreatGrandmother1 || 'N/A'}</p>
                <p className="text-xs text-gray-600">ICC: {formData.maternalGreatGrandmother1ICC || 'N/A'}</p>
                <p className="text-xs text-gray-600">Origin: {formData.maternalGreatGrandmother1Origin || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Great Grandfather 2</label>
                <p className="text-sm text-gray-900">{formData.maternalGreatGrandfather2 || 'N/A'}</p>
                <p className="text-xs text-gray-600">ICC: {formData.maternalGreatGrandfather2ICC || 'N/A'}</p>
                <p className="text-xs text-gray-600">Origin: {formData.maternalGreatGrandfather2Origin || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Great Grandmother 2</label>
                <p className="text-sm text-gray-900">{formData.maternalGreatGrandmother2 || 'N/A'}</p>
                <p className="text-xs text-gray-600">ICC: {formData.maternalGreatGrandmother2ICC || 'N/A'}</p>
                <p className="text-xs text-gray-600">Origin: {formData.maternalGreatGrandmother2Origin || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grandparents Section */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Grandparents</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Paternal Side</h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Grandfather</label>
                <p className="text-sm text-gray-900">{formData.paternalGrandfather || 'N/A'}</p>
                <p className="text-xs text-gray-600">ICC: {formData.paternalGrandfatherICC || 'N/A'}</p>
                <p className="text-xs text-gray-600">Origin: {formData.paternalGrandfatherOrigin || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Grandmother</label>
                <p className="text-sm text-gray-900">{formData.paternalGrandmother || 'N/A'}</p>
                <p className="text-xs text-gray-600">ICC: {formData.paternalGrandmotherICC || 'N/A'}</p>
                <p className="text-xs text-gray-600">Origin: {formData.paternalGrandmotherOrigin || 'N/A'}</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Maternal Side</h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Grandfather</label>
                <p className="text-sm text-gray-900">{formData.maternalGrandfather || 'N/A'}</p>
                <p className="text-xs text-gray-600">ICC: {formData.maternalGrandfatherICC || 'N/A'}</p>
                <p className="text-xs text-gray-600">Origin: {formData.maternalGrandfatherOrigin || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Grandmother</label>
                <p className="text-sm text-gray-900">{formData.maternalGrandmother || 'N/A'}</p>
                <p className="text-xs text-gray-600">ICC: {formData.maternalGrandmotherICC || 'N/A'}</p>
                <p className="text-xs text-gray-600">Origin: {formData.maternalGrandmotherOrigin || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parents Section */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Parents</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded">
            <h4 className="font-semibold text-gray-800 mb-2">Father</h4>
            <p className="text-sm text-gray-900">{formData.father || 'N/A'}</p>
            <p className="text-xs text-gray-600">ICC: {formData.fatherICC || 'N/A'}</p>
            <p className="text-xs text-gray-600">Origin: {formData.fatherOrigin || 'N/A'}</p>
          </div>
          <div className="bg-white p-4 rounded">
            <h4 className="font-semibold text-gray-800 mb-2">Mother</h4>
            <p className="text-sm text-gray-900">{formData.mother || 'N/A'}</p>
            <p className="text-xs text-gray-600">ICC: {formData.motherICC || 'N/A'}</p>
            <p className="text-xs text-gray-600">Origin: {formData.motherOrigin || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* EGO (Representative) Section */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">EGO (Representative)</h3>
        <div className="bg-white p-4 rounded text-center">
          <p className="text-lg font-semibold text-gray-900">{formData.ego || 'N/A'}</p>
          <p className="text-sm text-gray-600">ICC: {formData.egoICC || 'N/A'}</p>
          <p className="text-sm text-gray-600">Origin: {formData.egoOrigin || 'N/A'}</p>
        </div>
      </div>

      {/* Attestation Section */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Attestation & Signatures</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded">
            <h4 className="font-semibold text-gray-800 mb-2">Attested by:</h4>
            <p className="text-sm text-gray-900">{formData.communityOfficer || 'LUCIANO B. LUMANCAS'}</p>
            <p className="text-xs text-gray-600">Community Development Officer III</p>
          </div>
          <div className="bg-white p-4 rounded">
            <h4 className="font-semibold text-gray-800 mb-2">Conformed by:</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Municipal Tribal Chieftain:</span>
                <p className="text-gray-900">{formData.municipalTribalChieftain || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium">Barangay IPMR:</span>
                <p className="text-gray-900">{formData.barangayIPMR || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium">Barangay Tribal Chieftain:</span>
                <p className="text-gray-900">{formData.barangayTribalChieftain || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium">Barangay:</span>
                <p className="text-gray-900">{formData.barangay || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return renderPage1()
      case 2:
        return renderPage2()
      case 3:
        return renderPage3()
      case 4:
        return renderPage4()
      case 5:
        return renderPage5()
      default:
        return renderPage1()
    } 
  }

  return (
    <div className="space-y-6">
      {/* Page Navigation */}
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Previous Page
        </button>
        
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-full font-semibold transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}
          disabled={currentPage === 5}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Next Page
        </button>
      </div>

      {/* Page Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {renderPageContent()}
      </div>
    </div>
  )
};

export default CocFormViewer;
