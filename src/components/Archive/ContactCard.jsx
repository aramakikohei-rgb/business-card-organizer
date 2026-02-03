import { Link } from 'react-router-dom';

const ContactCard = ({ contact }) => {
  const primaryEmail = contact.emails?.find((e) => e.isPrimary) || contact.emails?.[0];
  const primaryPhone = contact.phones?.find((p) => p.isPrimary) || contact.phones?.[0];

  return (
    <div className="card group hover:shadow-lg transition-shadow">
      {/* Card Image or Placeholder */}
      <Link to={`/contact/${contact.id}`} className="block">
        <div className="aspect-[1.75/1] bg-gray-100 dark:bg-gray-700 overflow-hidden">
          {contact.cardThumbnailUrl || contact.cardImageUrl ? (
            <img
              src={contact.cardThumbnailUrl || contact.cardImageUrl}
              alt={`${contact.fullName}'s card`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">
                  {(contact.fullName || '?')[0].toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <Link to={`/contact/${contact.id}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate hover:text-primary-600 transition-colors">
              {contact.fullName || 'Unknown'}
            </h3>
            {contact.jobTitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {contact.jobTitle}
              </p>
            )}
            {contact.company && (
              <p className="text-sm text-gray-500 dark:text-gray-500 truncate">
                {contact.company}
              </p>
            )}
          </Link>

        </div>

        {/* Quick Actions */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex space-x-2">
          {primaryEmail && (
            <a
              href={`mailto:${primaryEmail.value}`}
              className="flex-1 flex items-center justify-center py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>
          )}
          {primaryPhone && (
            <a
              href={`tel:${primaryPhone.value}`}
              className="flex-1 flex items-center justify-center py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
