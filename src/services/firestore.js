import { supabase } from './supabase';

const CONTACTS_TABLE = 'contacts';

// Transform database row to frontend format (snake_case to camelCase)
const transformContact = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    firstName: row.first_name,
    lastName: row.last_name,
    jobTitle: row.job_title,
    company: row.company,
    emails: row.emails || [],
    phones: row.phones || [],
    address: row.address || {},
    website: row.website,
    cardImageUrl: row.card_image_url,
    cardThumbnailUrl: row.card_thumbnail_url,
    notes: row.notes,
    tags: row.tags || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    scannedAt: row.scanned_at,
  };
};

// Transform frontend format to database format (camelCase to snake_case)
const transformToDbFormat = (data) => {
  const result = {};

  if (data.fullName !== undefined) result.full_name = data.fullName;
  if (data.firstName !== undefined) result.first_name = data.firstName;
  if (data.lastName !== undefined) result.last_name = data.lastName;
  if (data.jobTitle !== undefined) result.job_title = data.jobTitle;
  if (data.company !== undefined) result.company = data.company;
  if (data.emails !== undefined) result.emails = data.emails;
  if (data.phones !== undefined) result.phones = data.phones;
  if (data.address !== undefined) result.address = data.address;
  if (data.website !== undefined) result.website = data.website;
  if (data.cardImageUrl !== undefined) result.card_image_url = data.cardImageUrl;
  if (data.cardThumbnailUrl !== undefined) result.card_thumbnail_url = data.cardThumbnailUrl;
  if (data.notes !== undefined) result.notes = data.notes;
  if (data.tags !== undefined) result.tags = data.tags;

  return result;
};

// Create a new contact
export const createContact = async (contactData) => {
  try {
    const now = new Date().toISOString();
    const dbData = transformToDbFormat(contactData);

    const { data, error } = await supabase
      .from(CONTACTS_TABLE)
      .insert({
        ...dbData,
        created_at: now,
        updated_at: now,
        scanned_at: now,
      })
      .select()
      .single();

    if (error) throw error;
    return transformContact(data);
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
};

// Get a single contact by ID
export const getContact = async (contactId) => {
  try {
    const { data, error } = await supabase
      .from(CONTACTS_TABLE)
      .select('*')
      .eq('id', contactId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return transformContact(data);
  } catch (error) {
    console.error('Error getting contact:', error);
    throw error;
  }
};

// Get all contacts
export const getAllContacts = async (sortField = 'created_at', sortDirection = 'desc') => {
  try {
    // Map frontend field names to database column names
    const fieldMap = {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      fullName: 'full_name',
      company: 'company',
    };

    const dbField = fieldMap[sortField] || sortField;
    const ascending = sortDirection === 'asc';

    const { data, error } = await supabase
      .from(CONTACTS_TABLE)
      .select('*')
      .order(dbField, { ascending });

    if (error) throw error;
    return (data || []).map(transformContact);
  } catch (error) {
    console.error('Error getting contacts:', error);
    throw error;
  }
};

// Search contacts by name or company
export const searchContacts = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from(CONTACTS_TABLE)
      .select('*')
      .or(`full_name.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`);

    if (error) throw error;
    return (data || []).map(transformContact);
  } catch (error) {
    console.error('Error searching contacts:', error);
    throw error;
  }
};

// Get contacts by tag
export const getContactsByTag = async (tag) => {
  try {
    const { data, error } = await supabase
      .from(CONTACTS_TABLE)
      .select('*')
      .contains('tags', [tag]);

    if (error) throw error;
    return (data || []).map(transformContact);
  } catch (error) {
    console.error('Error getting contacts by tag:', error);
    throw error;
  }
};

// Update a contact
export const updateContact = async (contactId, updates) => {
  try {
    const dbUpdates = transformToDbFormat(updates);
    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from(CONTACTS_TABLE)
      .update(dbUpdates)
      .eq('id', contactId)
      .select()
      .single();

    if (error) throw error;
    return transformContact(data);
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

// Delete a contact
export const deleteContact = async (contactId) => {
  try {
    const { error } = await supabase
      .from(CONTACTS_TABLE)
      .delete()
      .eq('id', contactId);

    if (error) throw error;
    return contactId;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};
