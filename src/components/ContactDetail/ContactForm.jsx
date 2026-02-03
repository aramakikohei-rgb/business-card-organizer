import { useState, useEffect } from 'react';
import Input, { TextArea } from '../common/Input';
import Button from '../common/Button';

const ContactForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
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
    notes: '',
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        emails: initialData.emails?.length
          ? initialData.emails
          : [{ type: 'work', value: '', isPrimary: true }],
        phones: initialData.phones?.length
          ? initialData.phones
          : [{ type: 'mobile', value: '', isPrimary: true }],
        address: initialData.address || formData.address,
        tags: initialData.tags || [],
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-populate firstName and lastName from fullName
    if (field === 'fullName') {
      const parts = value.trim().split(/\s+/);
      setFormData((prev) => ({
        ...prev,
        fullName: value,
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
      }));
    }
  };

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleEmailChange = (index, field, value) => {
    const newEmails = [...formData.emails];
    newEmails[index] = { ...newEmails[index], [field]: value };
    setFormData((prev) => ({ ...prev, emails: newEmails }));
  };

  const handlePhoneChange = (index, field, value) => {
    const newPhones = [...formData.phones];
    newPhones[index] = { ...newPhones[index], [field]: value };
    setFormData((prev) => ({ ...prev, phones: newPhones }));
  };

  const addEmail = () => {
    setFormData((prev) => ({
      ...prev,
      emails: [...prev.emails, { type: 'personal', value: '', isPrimary: false }],
    }));
  };

  const removeEmail = (index) => {
    if (formData.emails.length > 1) {
      setFormData((prev) => ({
        ...prev,
        emails: prev.emails.filter((_, i) => i !== index),
      }));
    }
  };

  const addPhone = () => {
    setFormData((prev) => ({
      ...prev,
      phones: [...prev.phones, { type: 'office', value: '', isPrimary: false }],
    }));
  };

  const removePhone = (index) => {
    if (formData.phones.length > 1) {
      setFormData((prev) => ({
        ...prev,
        phones: prev.phones.filter((_, i) => i !== index),
      }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out empty emails and phones
    const cleanedData = {
      ...formData,
      emails: formData.emails.filter((e) => e.value.trim()),
      phones: formData.phones.filter((p) => p.value.trim()),
    };
    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Basic Information
        </h3>

        <Input
          label="Full Name"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="John Smith"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="John"
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Smith"
          />
        </div>

        <Input
          label="Job Title"
          value={formData.jobTitle}
          onChange={(e) => handleChange('jobTitle', e.target.value)}
          placeholder="Software Engineer"
        />

        <Input
          label="Company"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="Tech Corp Inc."
        />
      </div>

      {/* Contact Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Contact Details
        </h3>

        {/* Emails */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Addresses
          </label>
          {formData.emails.map((email, index) => (
            <div key={index} className="flex items-center space-x-2">
              <select
                value={email.type}
                onChange={(e) => handleEmailChange(index, 'type', e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
              <input
                type="email"
                value={email.value}
                onChange={(e) => handleEmailChange(index, 'value', e.target.value)}
                placeholder="email@example.com"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              {formData.emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmail(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addEmail}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add another email</span>
          </button>
        </div>

        {/* Phones */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Numbers
          </label>
          {formData.phones.map((phone, index) => (
            <div key={index} className="flex items-center space-x-2">
              <select
                value={phone.type}
                onChange={(e) => handlePhoneChange(index, 'type', e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="mobile">Mobile</option>
                <option value="office">Office</option>
                <option value="home">Home</option>
                <option value="fax">Fax</option>
              </select>
              <input
                type="tel"
                value={phone.value}
                onChange={(e) => handlePhoneChange(index, 'value', e.target.value)}
                placeholder="+1-555-123-4567"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              {formData.phones.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePhone(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addPhone}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add another phone</span>
          </button>
        </div>

        <Input
          label="Website"
          value={formData.website}
          onChange={(e) => handleChange('website', e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Address</h3>

        <Input
          label="Street"
          value={formData.address.street}
          onChange={(e) => handleAddressChange('street', e.target.value)}
          placeholder="123 Main Street"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            value={formData.address.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            placeholder="San Francisco"
          />
          <Input
            label="State"
            value={formData.address.state}
            onChange={(e) => handleAddressChange('state', e.target.value)}
            placeholder="CA"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Postal Code"
            value={formData.address.postalCode}
            onChange={(e) => handleAddressChange('postalCode', e.target.value)}
            placeholder="94105"
          />
          <Input
            label="Country"
            value={formData.address.country}
            onChange={(e) => handleAddressChange('country', e.target.value)}
            placeholder="USA"
          />
        </div>
      </div>

      {/* Notes & Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Notes & Tags
        </h3>

        <TextArea
          label="Notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Add any additional notes about this contact..."
          rows={3}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add a tag"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <Button type="button" variant="secondary" onClick={addTag}>
              Add
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:text-primary-900 dark:hover:text-primary-100"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Save Contact
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
