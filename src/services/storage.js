import { supabase } from './supabase';

const CARDS_BUCKET = 'cards';
const THUMBNAILS_BUCKET = 'thumbnails';

// Generate a unique filename
const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${randomString}.${extension}`;
};

// Upload a card image
export const uploadCardImage = async (file) => {
  try {
    const fileName = generateFileName(file.name);
    const filePath = `${fileName}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from(CARDS_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(CARDS_BUCKET)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
      fileName,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Upload a thumbnail image
export const uploadThumbnail = async (file, originalFileName) => {
  try {
    const thumbnailName = `${originalFileName.split('.')[0]}_thumb.jpg`;

    const { data, error } = await supabase.storage
      .from(THUMBNAILS_BUCKET)
      .upload(thumbnailName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(THUMBNAILS_BUCKET)
      .getPublicUrl(thumbnailName);

    return {
      url: urlData.publicUrl,
      path: thumbnailName,
    };
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    throw error;
  }
};

// Delete a card image
export const deleteCardImage = async (imagePath) => {
  try {
    const { error } = await supabase.storage
      .from(CARDS_BUCKET)
      .remove([imagePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Delete a thumbnail
export const deleteThumbnail = async (thumbnailPath) => {
  try {
    const { error } = await supabase.storage
      .from(THUMBNAILS_BUCKET)
      .remove([thumbnailPath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting thumbnail:', error);
    throw error;
  }
};

// Create a thumbnail from an image
export const createThumbnail = async (imageFile, maxWidth = 200, maxHeight = 200) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/jpeg',
          0.8
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });
};

// Convert a blob to a File object
export const blobToFile = (blob, fileName) => {
  return new File([blob], fileName, { type: blob.type });
};
