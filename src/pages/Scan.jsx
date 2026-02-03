import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScannerView from '../components/Scanner/ScannerView';
import ContactForm from '../components/ContactDetail/ContactForm';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { useContacts } from '../context/ContactContext';
import { useToast } from '../components/common/Toast';
import { performOCR } from '../services/ocr';
import { parseBusinessCard } from '../services/parser';
import { uploadCardImage, createThumbnail, uploadThumbnail, blobToFile } from '../services/storage';

const Scan = () => {
  const navigate = useNavigate();
  const { addContact } = useContacts();
  const toast = useToast();

  const [step, setStep] = useState('scan'); // 'scan', 'processing', 'review'
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [rawText, setRawText] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleImageReady = async (file, previewUrl) => {
    setImageFile(file);
    setImagePreview(previewUrl);
    setStep('processing');

    try {
      // Upload image to Firebase Storage
      const uploadResult = await uploadCardImage(file);
      setUploadedImageUrl(uploadResult.url);

      // Create and upload thumbnail
      const thumbnailBlob = await createThumbnail(file);
      const thumbnailFile = blobToFile(thumbnailBlob, `thumb_${file.name}`);
      const thumbnailResult = await uploadThumbnail(thumbnailFile, uploadResult.fileName);
      setUploadedThumbnailUrl(thumbnailResult.url);

      // Perform OCR
      const ocrResult = await performOCR(file);
      setRawText(ocrResult.fullText);

      // Parse the OCR result
      const parsed = parseBusinessCard(ocrResult.fullText);
      setParsedData(parsed);

      setStep('review');
      toast.success('Card scanned successfully!');
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(error.message || 'Failed to process card. Please try again.');
      setStep('scan');
    }
  };

  const handleSaveContact = async (formData) => {
    setSaving(true);
    try {
      const newContact = await addContact(formData, uploadedImageUrl, uploadedThumbnailUrl);
      toast.success('Contact saved successfully!');
      navigate(`/contact/${newContact.id}`);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save contact. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setStep('scan');
    setImageFile(null);
    setImagePreview(null);
    setParsedData(null);
    setRawText('');
    setUploadedImageUrl(null);
    setUploadedThumbnailUrl(null);
  };

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loading size="lg" text="Processing your business card..." />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Extracting contact information...
        </p>
      </div>
    );
  }

  if (step === 'review') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Review Contact
          </h1>
          <Button variant="ghost" onClick={handleCancel}>
            Scan Another
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Card Preview
              </h3>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Scanned card"
                  className="w-full rounded-lg"
                />
              )}
            </div>

            {/* Raw OCR Text */}
            <div className="card p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Extracted Text
              </h3>
              <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg max-h-48 overflow-y-auto">
                {rawText || 'No text extracted'}
              </pre>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Verify & Edit Details
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Review the extracted information and make any necessary corrections before saving.
              </p>
              <ContactForm
                initialData={parsedData}
                onSubmit={handleSaveContact}
                onCancel={handleCancel}
                loading={saving}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Scan step
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Scan Business Card
      </h1>
      <ScannerView onImageReady={handleImageReady} />
    </div>
  );
};

export default Scan;
