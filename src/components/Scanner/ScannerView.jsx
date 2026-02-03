import { useState } from 'react';
import CameraCapture from './CameraCapture';
import ImageUpload from './ImageUpload';
import ImageCropper from './ImageCropper';
import Button from '../common/Button';

const ScannerView = ({ onImageReady }) => {
  const [mode, setMode] = useState('select'); // 'select', 'camera', 'upload', 'crop'
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);

  const handleCapture = (file, imageSrc) => {
    setCapturedFile(file);
    setCapturedImage(imageSrc);
    setMode('crop');
  };

  const handleUpload = (file, imageSrc) => {
    setCapturedFile(file);
    setCapturedImage(imageSrc);
    setMode('crop');
  };

  const handleCropComplete = (croppedImageSrc, croppedFile) => {
    // If croppedFile is provided, use it. Otherwise, use the original file with the cropped image src
    const fileToUse = croppedFile || capturedFile;
    onImageReady(fileToUse, croppedImageSrc || capturedImage);
  };

  const resetScanner = () => {
    setMode('select');
    setCapturedImage(null);
    setCapturedFile(null);
  };

  if (mode === 'crop' && capturedImage) {
    return (
      <ImageCropper
        imageSrc={capturedImage}
        onCropComplete={handleCropComplete}
        onCancel={resetScanner}
      />
    );
  }

  if (mode === 'camera') {
    return <CameraCapture onCapture={handleCapture} onCancel={resetScanner} />;
  }

  if (mode === 'upload') {
    return (
      <div className="space-y-4">
        <ImageUpload onUpload={handleUpload} />
        <div className="text-center">
          <Button variant="ghost" onClick={resetScanner}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Select mode
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Scan Business Card
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose how you'd like to capture your business card
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Camera Option */}
        <button
          onClick={() => setMode('camera')}
          className="card p-6 text-left hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Use Camera
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Take a photo of your business card using your device camera
              </p>
            </div>
          </div>
        </button>

        {/* Upload Option */}
        <button
          onClick={() => setMode('upload')}
          className="card p-6 text-left hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Upload Image
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload an existing photo of a business card from your device
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ScannerView;
