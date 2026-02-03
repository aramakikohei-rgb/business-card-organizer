import { useState } from 'react';
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';
import CardPreview from './CardPreview';

const DetailView = ({ contact, onUpdate, onDelete, onToggleFavorite, loading }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (formData) => {
    await onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Card Preview - Sidebar on desktop */}
      <div className="lg:col-span-1">
        <div className="card p-4 space-y-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Original Card
          </h3>
          <CardPreview
            imageUrl={contact.cardImageUrl}
            thumbnailUrl={contact.cardThumbnailUrl}
          />
        </div>
      </div>

      {/* Contact Details - Main content */}
      <div className="lg:col-span-2">
        <div className="card p-6">
          {isEditing ? (
            <ContactForm
              initialData={contact}
              onSubmit={handleSave}
              onCancel={() => setIsEditing(false)}
              loading={loading}
            />
          ) : (
            <ContactInfo
              contact={contact}
              onEdit={() => setIsEditing(true)}
              onToggleFavorite={onToggleFavorite}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailView;
