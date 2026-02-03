// Regex patterns for extraction
const patterns = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(?:\+?1?[-.\s]?)?\(?[0-9]{2,4}\)?[-.\s]?[0-9]{2,4}[-.\s]?[0-9]{2,4}(?:[-.\s]?[0-9]{1,4})?/g,
  website: /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?/gi,
  linkedin: /(?:linkedin\.com\/in\/|linkedin\.com\/company\/)[a-zA-Z0-9-]+/gi,
  twitter: /@[a-zA-Z0-9_]+/g,
  postalCode: /\b\d{5}(?:-\d{4})?\b|\b[A-Z]\d[A-Z]\s?\d[A-Z]\d\b/g,
};

// Job title keywords
const jobTitleKeywords = [
  'CEO', 'CTO', 'CFO', 'COO', 'CMO', 'CIO',
  'President', 'Vice President', 'VP',
  'Director', 'Manager', 'Lead', 'Head',
  'Engineer', 'Developer', 'Designer', 'Architect',
  'Analyst', 'Consultant', 'Specialist', 'Coordinator',
  'Associate', 'Assistant', 'Senior', 'Junior',
  'Executive', 'Officer', 'Administrator',
  'Sales', 'Marketing', 'Finance', 'Operations',
  'Partner', 'Founder', 'Owner', 'Principal',
];

// Company suffixes
const companySuffixes = [
  'Inc', 'Inc.', 'LLC', 'LLC.', 'Ltd', 'Ltd.',
  'Corp', 'Corp.', 'Corporation',
  'Co', 'Co.', 'Company',
  'Group', 'Holdings', 'Partners',
  'Solutions', 'Services', 'Technologies',
  'International', 'Global', 'Enterprises',
];

// Extract emails from text
const extractEmails = (text) => {
  const matches = text.match(patterns.email) || [];
  return [...new Set(matches)].map((email, index) => ({
    type: index === 0 ? 'work' : 'personal',
    value: email.toLowerCase(),
    isPrimary: index === 0,
  }));
};

// Extract phone numbers from text
const extractPhones = (text) => {
  const matches = text.match(patterns.phone) || [];
  // Filter out numbers that are too short or look like years/dates
  const validPhones = matches
    .map(phone => phone.replace(/\s+/g, ' ').trim())
    .filter(phone => {
      const digits = phone.replace(/\D/g, '');
      return digits.length >= 7 && digits.length <= 15;
    });

  return [...new Set(validPhones)].slice(0, 3).map((phone, index) => ({
    type: index === 0 ? 'mobile' : 'office',
    value: phone,
    isPrimary: index === 0,
  }));
};

// Extract website URLs
const extractWebsites = (text) => {
  const matches = text.match(patterns.website) || [];
  // Filter out email domains and social media
  return matches
    .filter(url => {
      const lower = url.toLowerCase();
      return !lower.includes('@') &&
             !lower.includes('linkedin') &&
             !lower.includes('twitter') &&
             !lower.includes('facebook') &&
             !lower.includes('instagram');
    })
    .map(url => {
      if (!url.startsWith('http')) {
        return `https://${url}`;
      }
      return url;
    })[0] || '';
};

// Extract social links
const extractSocialLinks = (text) => {
  const linkedin = text.match(patterns.linkedin)?.[0] || '';
  const twitter = text.match(patterns.twitter)?.[0] || '';

  return {
    linkedin: linkedin ? `https://${linkedin}` : '',
    twitter: twitter || '',
  };
};

// Check if a line might be a job title
const isLikelyJobTitle = (line) => {
  const upperLine = line.toUpperCase();
  return jobTitleKeywords.some(keyword =>
    upperLine.includes(keyword.toUpperCase())
  );
};

// Check if a line might be a company name
const isLikelyCompany = (line) => {
  return companySuffixes.some(suffix =>
    line.toLowerCase().includes(suffix.toLowerCase())
  );
};

// Check if a line might be an address
const isLikelyAddress = (line) => {
  const addressKeywords = ['street', 'st.', 'st ', 'avenue', 'ave', 'road', 'rd', 'boulevard', 'blvd', 'suite', 'floor', 'building'];
  const lowerLine = line.toLowerCase();
  return addressKeywords.some(keyword => lowerLine.includes(keyword)) ||
         patterns.postalCode.test(line);
};

// Parse full name into first and last name
const parseName = (fullName) => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName };
};

// Main parsing function
export const parseBusinessCard = (ocrText) => {
  if (!ocrText || typeof ocrText !== 'string') {
    return createEmptyContact();
  }

  const lines = ocrText.split('\n').map(line => line.trim()).filter(Boolean);

  // Extract structured data using patterns
  const emails = extractEmails(ocrText);
  const phones = extractPhones(ocrText);
  const website = extractWebsites(ocrText);
  const socialLinks = extractSocialLinks(ocrText);

  // Identify name, title, and company from remaining lines
  let fullName = '';
  let jobTitle = '';
  let company = '';
  const addressParts = [];

  // Filter out lines that are emails, phones, websites
  const textLines = lines.filter(line => {
    const lower = line.toLowerCase();
    // Skip if line is mainly an email, phone, or URL
    if (patterns.email.test(line) && line.match(patterns.email)?.[0]?.length > line.length * 0.5) {
      return false;
    }
    if (lower.includes('www.') || lower.includes('http')) {
      return false;
    }
    // Skip very short lines that are just phone numbers
    if (line.replace(/[\d\s\-().+]/g, '').length < 3) {
      return false;
    }
    return true;
  });

  for (const line of textLines) {
    if (isLikelyAddress(line)) {
      addressParts.push(line);
    } else if (isLikelyCompany(line) && !company) {
      company = line;
    } else if (isLikelyJobTitle(line) && !jobTitle) {
      jobTitle = line;
    } else if (!fullName && !isLikelyJobTitle(line) && !isLikelyCompany(line)) {
      // First non-classified line is likely the name
      // Usually names are at the top and don't contain numbers
      if (!/\d/.test(line) && line.length > 2 && line.length < 50) {
        fullName = line;
      }
    }
  }

  // If no name found, try the first line
  if (!fullName && textLines.length > 0) {
    fullName = textLines[0];
  }

  // Parse address
  const address = parseAddress(addressParts.join(', '));

  const { firstName, lastName } = parseName(fullName);

  return {
    fullName,
    firstName,
    lastName,
    jobTitle,
    company,
    emails,
    phones,
    address,
    website,
    socialLinks,
    notes: '',
    tags: [],
  };
};

// Parse address string into structured format
const parseAddress = (addressString) => {
  if (!addressString) {
    return {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    };
  }

  // Extract postal code
  const postalMatch = addressString.match(patterns.postalCode);
  const postalCode = postalMatch?.[0] || '';

  // Common US state abbreviations
  const statePattern = /\b([A-Z]{2})\b/g;
  const stateMatch = addressString.match(statePattern);
  const state = stateMatch?.[stateMatch.length - 1] || '';

  // Try to split by commas
  const parts = addressString.split(',').map(p => p.trim());

  return {
    street: parts[0] || '',
    city: parts[1]?.replace(statePattern, '').replace(patterns.postalCode, '').trim() || '',
    state,
    postalCode,
    country: parts.length > 3 ? parts[parts.length - 1] : 'USA',
  };
};

// Create an empty contact object
export const createEmptyContact = () => ({
  fullName: '',
  firstName: '',
  lastName: '',
  jobTitle: '',
  company: '',
  emails: [{ type: 'work', value: '', isPrimary: true }],
  phones: [{ type: 'mobile', value: '', isPrimary: true }],
  address: {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  },
  website: '',
  socialLinks: {
    linkedin: '',
    twitter: '',
  },
  notes: '',
  tags: [],
});

export default parseBusinessCard;
