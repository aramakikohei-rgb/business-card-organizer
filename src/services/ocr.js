const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Perform OCR on an image file
export const performOCR = async (imageFile) => {
  const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;

  if (!apiKey) {
    throw new Error('Google Vision API key is not configured');
  }

  try {
    const base64Image = await fileToBase64(imageFile);

    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: 'TEXT_DETECTION',
              maxResults: 1,
            },
            {
              type: 'DOCUMENT_TEXT_DETECTION',
              maxResults: 1,
            },
          ],
        },
      ],
    };

    const response = await fetch(`${VISION_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OCR request failed');
    }

    const data = await response.json();

    // Extract text from response
    const textAnnotations = data.responses[0]?.textAnnotations || [];
    const fullText = textAnnotations[0]?.description || '';

    // Get individual text blocks for better parsing
    const textBlocks = data.responses[0]?.fullTextAnnotation?.pages?.[0]?.blocks || [];

    return {
      fullText,
      textBlocks,
      rawResponse: data,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    throw error;
  }
};

// Perform OCR from a URL (if image is already uploaded)
export const performOCRFromUrl = async (imageUrl) => {
  const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;

  if (!apiKey) {
    throw new Error('Google Vision API key is not configured');
  }

  try {
    const requestBody = {
      requests: [
        {
          image: {
            source: {
              imageUri: imageUrl,
            },
          },
          features: [
            {
              type: 'TEXT_DETECTION',
              maxResults: 1,
            },
            {
              type: 'DOCUMENT_TEXT_DETECTION',
              maxResults: 1,
            },
          ],
        },
      ],
    };

    const response = await fetch(`${VISION_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OCR request failed');
    }

    const data = await response.json();

    const textAnnotations = data.responses[0]?.textAnnotations || [];
    const fullText = textAnnotations[0]?.description || '';

    return {
      fullText,
      rawResponse: data,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    throw error;
  }
};
