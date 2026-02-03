import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import Button from '../common/Button';

const CameraCapture = ({ onCapture, onCancel }) => {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode,
  };

  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Convert base64 to blob
        fetch(imageSrc)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
            onCapture(file, imageSrc);
          });
      }
    }
  }, [onCapture]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleUserMediaError = (error) => {
    console.error('Camera error:', error);
    setError('Unable to access camera. Please check permissions or try uploading an image instead.');
  };

  const handleUserMedia = () => {
    setIsReady(true);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-gray-500 mx-auto mb-4"
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
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          </div>
        ) : (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMediaError={handleUserMediaError}
              onUserMedia={handleUserMedia}
              className="w-full h-full object-cover"
            />

            {/* Camera overlay guide */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-8 border-2 border-white/50 rounded-lg">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white rounded-tl" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white rounded-tr" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white rounded-bl" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white rounded-br" />
              </div>
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/30 px-3 py-1 rounded-full">
                Position card within frame
              </p>
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>

        <button
          onClick={handleCapture}
          disabled={!isReady || error}
          className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 hover:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <div className="w-12 h-12 rounded-full bg-primary-600 hover:bg-primary-700 transition-colors" />
        </button>

        <button
          onClick={toggleCamera}
          disabled={!isReady}
          className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
