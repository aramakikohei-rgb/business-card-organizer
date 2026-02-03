import Button from '../common/Button';

const ContactInfo = ({ contact, onEdit, onDelete }) => {
  const primaryEmail = contact.emails?.find((e) => e.isPrimary) || contact.emails?.[0];
  const primaryPhone = contact.phones?.find((p) => p.isPrimary) || contact.phones?.[0];

  const formatAddress = () => {
    const { street, city, state, postalCode, country } = contact.address || {};
    const parts = [street, city, state, postalCode, country].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-600">
              {(contact.fullName || '?')[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {contact.fullName || 'Unknown'}
            </h2>
            {contact.jobTitle && (
              <p className="text-gray-600 dark:text-gray-400">{contact.jobTitle}</p>
            )}
            {contact.company && (
              <p className="text-gray-500 dark:text-gray-500">{contact.company}</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {primaryEmail && (
          <a
            href={`mailto:${primaryEmail.value}`}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email
          </a>
        )}
        {primaryPhone && (
          <a
            href={`tel:${primaryPhone.value}`}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call
          </a>
        )}
        {contact.website && (
          <a
            href={contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Website
          </a>
        )}
      </div>

      {/* Contact Details */}
      <div className="space-y-4">
        {/* Emails */}
        {contact.emails?.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Email
            </h3>
            {contact.emails.map((email, index) => (
              <div key={index} className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <a
                    href={`mailto:${email.value}`}
                    className="text-gray-900 dark:text-white hover:text-primary-600"
                  >
                    {email.value}
                  </a>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 capitalize">
                    ({email.type})
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Phones */}
        {contact.phones?.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Phone
            </h3>
            {contact.phones.map((phone, index) => (
              <div key={index} className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <a
                    href={`tel:${phone.value}`}
                    className="text-gray-900 dark:text-white hover:text-primary-600"
                  >
                    {phone.value}
                  </a>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 capitalize">
                    ({phone.type})
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Address */}
        {formatAddress() && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Address
            </h3>
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-900 dark:text-white">{formatAddress()}</p>
            </div>
          </div>
        )}

        {/* Tags */}
        {contact.tags?.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {contact.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {contact.notes && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Notes
            </h3>
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
              {contact.notes}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
        <Button onClick={onEdit}>Edit Contact</Button>
      </div>
    </div>
  );
};

export default ContactInfo;
