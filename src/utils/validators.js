// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Phone validation (basic)
export const isValidPhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Required field validation
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Contact form validation
export const validateContact = (contact) => {
  const errors = {};

  // Name validation
  if (!isRequired(contact.fullName)) {
    errors.fullName = 'Name is required';
  }

  // Email validation (if provided)
  if (contact.emails?.length > 0) {
    contact.emails.forEach((email, index) => {
      if (email.value && !isValidEmail(email.value)) {
        errors[`email_${index}`] = 'Invalid email address';
      }
    });
  }

  // Phone validation (if provided)
  if (contact.phones?.length > 0) {
    contact.phones.forEach((phone, index) => {
      if (phone.value && !isValidPhone(phone.value)) {
        errors[`phone_${index}`] = 'Invalid phone number';
      }
    });
  }

  // Website validation (if provided)
  if (contact.website && !isValidUrl(contact.website)) {
    errors.website = 'Invalid website URL';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// File type validation
export const isValidImageType = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];
  return validTypes.includes(file.type.toLowerCase());
};

// File size validation (default 10MB)
export const isValidFileSize = (file, maxSizeMB = 10) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};
