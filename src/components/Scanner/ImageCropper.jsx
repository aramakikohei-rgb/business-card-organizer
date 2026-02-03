import { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Button from '../common/Button';

const ImageCropper = ({ imageSrc, onCropComplete, onCancel }) => {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 90,
    height: 60,
    x: 5,
    y: 20,
  });
  const [completedCrop, setCompletedCrop] = useState(null);

  const onImageLoad = useCallback((e) => {
    imgRef.current = e.currentTarget;

    const { width, height } = e.currentTarget;

    // Set initial crop to center of image with business card aspect ratio (1.75:1)
    const aspectRatio = 1.75;
    let cropWidth, cropHeight;

    if (width / height > aspectRatio) {
      cropHeight = height * 0.8;
      cropWidth = cropHeight * aspectRatio;
    } else {
      cropWidth = width * 0.9;
      cropHeight = cropWidth / aspectRatio;
    }

    const x = (width - cropWidth) / 2;
    const y = (height - cropHeight) / 2;

    setCrop({
      unit: 'px',
      width: cropWidth,
      height: cropHeight,
      x,
      y,
    });
  }, []);

  const getCroppedImage = useCallback(async () => {
    if (!completedCrop || !imgRef.current) {
      // If no crop selected, use the full image
      onCropComplete(imageSrc);
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const croppedFile = new File([blob], 'cropped-card.jpg', {
            type: 'image/jpeg',
          });
          const croppedUrl = URL.createObjectURL(blob);
          onCropComplete(croppedUrl, croppedFile);
        }
      },
      'image/jpeg',
      0.95
    );
  }, [completedCrop, imageSrc, onCropComplete]);

  const skipCrop = () => {
    onCropComplete(imageSrc);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Adjust the crop area to focus on the business card
        </p>
      </div>

      <div className="relative bg-gray-900 rounded-lg overflow-hidden">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          className="max-h-[60vh]"
        >
          <img
            src={imageSrc}
            alt="Crop preview"
            onLoad={onImageLoad}
            className="max-w-full max-h-[60vh] object-contain"
          />
        </ReactCrop>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onCancel}>
          Back
        </Button>

        <div className="flex space-x-3">
          <Button variant="secondary" onClick={skipCrop}>
            Skip Crop
          </Button>
          <Button onClick={getCroppedImage}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
