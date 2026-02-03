import * as XLSX from 'xlsx';

// Export contact as vCard (VCF) format
export const exportToVCard = (contact) => {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
  ];

  // Full name
  if (contact.fullName) {
    lines.push(`FN:${contact.fullName}`);
  }

  // Structured name
  if (contact.lastName || contact.firstName) {
    lines.push(`N:${contact.lastName || ''};${contact.firstName || ''};;;`);
  }

  // Organization and title
  if (contact.company) {
    lines.push(`ORG:${contact.company}`);
  }
  if (contact.jobTitle) {
    lines.push(`TITLE:${contact.jobTitle}`);
  }

  // Emails
  if (contact.emails?.length > 0) {
    contact.emails.forEach((email) => {
      if (email.value) {
        const type = email.type?.toUpperCase() || 'WORK';
        lines.push(`EMAIL;TYPE=${type}:${email.value}`);
      }
    });
  }

  // Phone numbers
  if (contact.phones?.length > 0) {
    contact.phones.forEach((phone) => {
      if (phone.value) {
        const type = phone.type?.toUpperCase() || 'CELL';
        const typeMap = {
          MOBILE: 'CELL',
          OFFICE: 'WORK',
          HOME: 'HOME',
          FAX: 'FAX',
        };
        lines.push(`TEL;TYPE=${typeMap[type] || type}:${phone.value}`);
      }
    });
  }

  // Address
  if (contact.address) {
    const { street, city, state, postalCode, country } = contact.address;
    if (street || city || state || postalCode || country) {
      lines.push(`ADR;TYPE=WORK:;;${street || ''};${city || ''};${state || ''};${postalCode || ''};${country || ''}`);
    }
  }

  // Website
  if (contact.website) {
    lines.push(`URL:${contact.website}`);
  }

  // Notes
  if (contact.notes) {
    // Escape special characters in notes
    const escapedNotes = contact.notes.replace(/\n/g, '\\n').replace(/,/g, '\\,');
    lines.push(`NOTE:${escapedNotes}`);
  }

  lines.push('END:VCARD');

  return lines.join('\r\n');
};

// Download vCard file
export const downloadVCard = (contact) => {
  const vcardContent = exportToVCard(contact);
  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${contact.fullName || 'contact'}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export contacts to CSV format
export const exportToCSV = (contacts) => {
  const headers = [
    'Full Name',
    'First Name',
    'Last Name',
    'Job Title',
    'Company',
    'Email (Work)',
    'Email (Personal)',
    'Phone (Mobile)',
    'Phone (Office)',
    'Street',
    'City',
    'State',
    'Postal Code',
    'Country',
    'Website',
    'Notes',
    'Tags',
  ];

  const escapeCSV = (value) => {
    if (!value) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = contacts.map((contact) => {
    const workEmail = contact.emails?.find((e) => e.type === 'work')?.value || '';
    const personalEmail = contact.emails?.find((e) => e.type === 'personal')?.value ||
      contact.emails?.find((e) => e.type !== 'work')?.value || '';
    const mobilePhone = contact.phones?.find((p) => p.type === 'mobile')?.value || '';
    const officePhone = contact.phones?.find((p) => p.type === 'office')?.value ||
      contact.phones?.find((p) => p.type !== 'mobile')?.value || '';

    return [
      contact.fullName,
      contact.firstName,
      contact.lastName,
      contact.jobTitle,
      contact.company,
      workEmail,
      personalEmail,
      mobilePhone,
      officePhone,
      contact.address?.street,
      contact.address?.city,
      contact.address?.state,
      contact.address?.postalCode,
      contact.address?.country,
      contact.website,
      contact.notes,
      contact.tags?.join('; '),
    ].map(escapeCSV);
  });

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  return csvContent;
};

// Download CSV file
export const downloadCSV = (contacts, filename = 'contacts') => {
  const csvContent = exportToCSV(contacts);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export all contacts as individual vCards in a single file
export const exportAllToVCard = (contacts) => {
  const vcards = contacts.map(exportToVCard).join('\r\n');
  const blob = new Blob([vcards], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'contacts.vcf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export contacts to Excel format
export const exportToExcel = (contacts) => {
  const headers = [
    'Full Name',
    'First Name',
    'Last Name',
    'Job Title',
    'Company',
    'Email (Work)',
    'Email (Personal)',
    'Phone (Mobile)',
    'Phone (Office)',
    'Street',
    'City',
    'State',
    'Postal Code',
    'Country',
    'Website',
    'Notes',
    'Tags',
  ];

  const rows = contacts.map((contact) => {
    const workEmail = contact.emails?.find((e) => e.type === 'work')?.value || '';
    const personalEmail = contact.emails?.find((e) => e.type === 'personal')?.value ||
      contact.emails?.find((e) => e.type !== 'work')?.value || '';
    const mobilePhone = contact.phones?.find((p) => p.type === 'mobile')?.value || '';
    const officePhone = contact.phones?.find((p) => p.type === 'office')?.value ||
      contact.phones?.find((p) => p.type !== 'mobile')?.value || '';

    return [
      contact.fullName || '',
      contact.firstName || '',
      contact.lastName || '',
      contact.jobTitle || '',
      contact.company || '',
      workEmail,
      personalEmail,
      mobilePhone,
      officePhone,
      contact.address?.street || '',
      contact.address?.city || '',
      contact.address?.state || '',
      contact.address?.postalCode || '',
      contact.address?.country || '',
      contact.website || '',
      contact.notes || '',
      contact.tags?.join('; ') || '',
    ];
  });

  // Create worksheet data with headers
  const wsData = [headers, ...rows];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  const colWidths = [
    { wch: 20 }, // Full Name
    { wch: 12 }, // First Name
    { wch: 12 }, // Last Name
    { wch: 20 }, // Job Title
    { wch: 20 }, // Company
    { wch: 25 }, // Email (Work)
    { wch: 25 }, // Email (Personal)
    { wch: 15 }, // Phone (Mobile)
    { wch: 15 }, // Phone (Office)
    { wch: 25 }, // Street
    { wch: 15 }, // City
    { wch: 8 },  // State
    { wch: 10 }, // Postal Code
    { wch: 12 }, // Country
    { wch: 25 }, // Website
    { wch: 30 }, // Notes
    { wch: 20 }, // Tags
  ];
  ws['!cols'] = colWidths;

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Contacts');

  return wb;
};

// Download Excel file
export const downloadExcel = (contacts, filename = 'contacts') => {
  const wb = exportToExcel(contacts);

  // Generate Excel file and trigger download
  XLSX.writeFile(wb, `${filename}.xlsx`);
};
