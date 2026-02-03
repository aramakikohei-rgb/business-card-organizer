// Format phone number for display
export const formatPhone = (phone) => {
  if (!phone) return '';

  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // US phone format
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // US phone with country code
  if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  // Return original if we can't format
  return phone;
};

// Format date for display
export const formatDate = (date) => {
  if (!date) return '';

  const d = date.toDate ? date.toDate() : new Date(date);

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format relative time
export const formatRelativeTime = (date) => {
  if (!date) return '';

  const d = date.toDate ? date.toDate() : new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return formatDate(date);
  }
};

// Format address for display
export const formatAddress = (address) => {
  if (!address) return '';

  const { street, city, state, postalCode, country } = address;
  const parts = [];

  if (street) parts.push(street);
  if (city) {
    let cityLine = city;
    if (state) cityLine += `, ${state}`;
    if (postalCode) cityLine += ` ${postalCode}`;
    parts.push(cityLine);
  } else {
    if (state) parts.push(state);
    if (postalCode) parts.push(postalCode);
  }
  if (country && country !== 'USA' && country !== 'US') {
    parts.push(country);
  }

  return parts.join('\n');
};

// Format name (first letter uppercase)
export const formatName = (name) => {
  if (!name) return '';

  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Truncate text with ellipsis
export const truncate = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Get initials from name
export const getInitials = (name, maxLength = 2) => {
  if (!name) return '?';

  return name
    .split(' ')
    .slice(0, maxLength)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};
