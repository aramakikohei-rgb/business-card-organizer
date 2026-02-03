import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DetailView from '../components/ContactDetail/DetailView';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { useContacts } from '../context/ContactContext';
import { useToast } from '../components/common/Toast';
import { getContact } from '../services/firestore';
import { deleteCardImage } from '../services/storage';

const Contact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateContact, deleteContact } = useContacts();
  const toast = useToast();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadContact();
  }, [id]);

  const loadContact = async () => {
    try {
      setLoading(true);
      const data = await getContact(id);
      if (data) {
        setContact(data);
      } else {
        toast.error('Contact not found');
        navigate('/archive');
      }
    } catch (error) {
      console.error('Error loading contact:', error);
      toast.error('Failed to load contact');
      navigate('/archive');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      await updateContact(id, formData);
      setContact((prev) => ({ ...prev, ...formData }));
      toast.success('Contact updated successfully');
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Delete associated images if they exist
      if (contact.cardImageUrl) {
        try {
          // Extract path from URL or use stored path
          await deleteCardImage(`cards/${contact.cardImageUrl.split('/').pop().split('?')[0]}`);
        } catch (e) {
          console.warn('Could not delete card image:', e);
        }
      }

      await deleteContact(id);
      toast.success('Contact deleted');
      navigate('/archive');
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading text="Loading contact..." />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Contact not found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          The contact you're looking for doesn't exist.
        </p>
        <Link to="/archive">
          <Button>Back to Archive</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm">
        <Link
          to="/archive"
          className="text-gray-500 dark:text-gray-400 hover:text-primary-600"
        >
          Archive
        </Link>
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="text-gray-900 dark:text-white font-medium">
          {contact.fullName || 'Contact'}
        </span>
      </nav>

      {/* Contact Detail View */}
      <DetailView
        contact={contact}
        onUpdate={handleUpdate}
        onDelete={() => setShowDeleteModal(true)}
        loading={saving}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Contact"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {contact.fullName || 'this contact'}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Contact;
