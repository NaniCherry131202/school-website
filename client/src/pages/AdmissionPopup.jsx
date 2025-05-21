import React, { useEffect, useState } from 'react';

const AdmissionPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('admissionPopupSeen');
    if (!hasSeenPopup) {
      setShowPopup(true);
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('admissionPopupSeen', 'true');
      console.log('admissionPopupSeen set to true'); // Debug
    }
    setShowPopup(false);
  };

  console.log('showPopup:', showPopup); // Debug render state

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000]">
      <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden max-w-xl w-[90%] border border-gray-200">
        {/* Close Button - Positioned Inside the Popup */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-700 transition-all z-[1001]"
          aria-label="Close"
        >
          <span className="text-xl font-bold">×</span>
        </button>

        {/* Popup Image or Fallback */}
        {imageError ? (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Image failed to load</p>
          </div>
        ) : (
          <div className="w-full">
            <img
              src="/popup.jpg"
              alt="Admissions Open"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Don't show again checkbox */}
        <div className="p-4 flex items-center justify-between text-sm text-gray-700">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="accent-blue-600"
            />
            Don't show again
          </label>
          <span className="text-xs text-gray-500">(Auto-closes in 15s)</span>
        </div>
      </div>
    </div>
  );
};

export default AdmissionPopup;