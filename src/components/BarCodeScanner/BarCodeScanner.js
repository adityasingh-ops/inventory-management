import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import { X, Camera, Smartphone } from 'lucide-react';

const BarcodeScanner = ({ onBarcodeScanned, onClose }) => {
  const scannerRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
  
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false
      },
      false
    );
  
    const onScanSuccess = (decodedText, decodedResult) => {
      console.log("✅ Code scanned: ", decodedText);
      onBarcodeScanned(decodedText);
      html5QrcodeScanner.clear();
    };
  
    let firstFailureLogged = false;
  
    const onScanFailure = (error) => {
      // Only log once or disable logging
      if (!firstFailureLogged) {
        console.warn("📷 Waiting for barcode...");
        firstFailureLogged = true;
      }
      // You can show a toast or UI hint here if needed
    };
  
    try {
      html5QrcodeScanner.render(onScanSuccess, onScanFailure);
      setScanner(html5QrcodeScanner);
      setIsScanning(true);
    } catch (error) {
      console.error("❌ Scanner init error:", error);
      setError("Camera access denied or not available.");
    }
  
    return () => {
      html5QrcodeScanner.clear().catch(console.error);
    };
  }, [onBarcodeScanned]);
  

  const handleClose = () => {
    if (scanner) {
      scanner.clear().catch(console.error);
    }
    onClose();
  };

  const handleManualInput = () => {
    const barcode = prompt('Enter barcode manually:');
    if (barcode && barcode.trim()) {
      onBarcodeScanned(barcode.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Camera className="h-6 w-6 text-blue-400" />
            Scan Barcode
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error ? (
          <div className="text-center py-8">
            <div className="bg-red-900/50 border border-red-700 rounded-xl p-6 mb-4">
              <p className="text-red-300 mb-4">{error}</p>
              <p className="text-sm text-gray-400">
                Please allow camera access or try manual input
              </p>
            </div>
            <button
              onClick={handleManualInput}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Smartphone className="h-4 w-4" />
              Manual Input
            </button>
          </div>
        ) : (
          <div>
            <div id="qr-reader" className="mb-4"></div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleManualInput}
                className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors flex items-center gap-2 justify-center"
              >
                <Smartphone className="h-4 w-4" />
                Manual Input
              </button>
              
              <div className="bg-gray-800 rounded-xl p-4">
                <h4 className="text-sm font-medium text-white mb-2">Instructions:</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Position the barcode within the scanning area</li>
                  <li>• Ensure good lighting for better scanning</li>
                  <li>• Hold steady until the code is detected</li>
                  <li>• Use manual input if camera scanning fails</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;