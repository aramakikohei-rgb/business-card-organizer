import { Link } from 'react-router-dom';

const ContactList = ({ contacts }) => {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No contacts found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Start by scanning or uploading a business card
        </p>
      </div>
    );
  }

  return (
    <div className="card divide-y divide-gray-200 dark:divide-gray-700">
      {contacts.map((contact) => {
        const primaryEmail = contact.emails?.find((e) => e.isPrimary) || contact.emails?.[0];
        const primaryPhone = contact.phones?.find((p) => p.isPrimary) || contact.phones?.[0];

        return (
          <div
            key={contact.id}
            className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            {/* Avatar */}
            <Link to={`/contact/${contact.id}`} className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
                {contact.cardThumbnailUrl || contact.cardImageUrl ? (
                  <img
                    src={contact.cardThumbnailUrl || contact.cardImageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-primary-600">
                    {(contact.fullName || '?')[0].toUpperCase()}
                  </span>
                )}
              </div>
            </Link>

            {/* Info */}
            <Link to={`/contact/${contact.id}`} className="flex-1 min-w-0 ml-4">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate hover:text-primary-600 transition-colors">
                {contact.fullName || 'Unknown'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {[contact.jobTitle, contact.company].filter(Boolean).join(' at ') || 'No details'}
              </p>
            </Link>

            {/* Contact Info */}
            <div className="hidden md:flex items-center space-x-4 ml-4">
              {primaryEmail && (
                <a
                  href={`mailto:${primaryEmail.value}`}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 truncate max-w-[200px]"
                >
                  {primaryEmail.value}
                </a>
              )}
              {primaryPhone && (
                <a
                  href={`tel:${primaryPhone.value}`}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 whitespace-nowrap"
                >
                  {primaryPhone.value}
                </a>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center ml-4">
              <Link
                to={`/contact/${contact.id}`}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
