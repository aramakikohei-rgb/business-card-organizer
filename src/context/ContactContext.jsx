import { createContext, useContext, useReducer, useEffect } from 'react';
import * as firestoreService from '../services/firestore';

// Action types
const ACTIONS = {
  SET_CONTACTS: 'SET_CONTACTS',
  ADD_CONTACT: 'ADD_CONTACT',
  UPDATE_CONTACT: 'UPDATE_CONTACT',
  DELETE_CONTACT: 'DELETE_CONTACT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SELECTED_CONTACT: 'SET_SELECTED_CONTACT',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_VIEW_MODE: 'SET_VIEW_MODE',
  SET_SORT: 'SET_SORT',
};

// Initial state
const initialState = {
  contacts: [],
  selectedContact: null,
  loading: false,
  error: null,
  searchQuery: '',
  viewMode: 'grid', // 'grid' or 'list'
  sortField: 'createdAt',
  sortDirection: 'desc',
};

// Reducer
const contactReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_CONTACTS:
      return { ...state, contacts: action.payload, loading: false, error: null };
    case ACTIONS.ADD_CONTACT:
      return { ...state, contacts: [action.payload, ...state.contacts] };
    case ACTIONS.UPDATE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.id === action.payload.id ? { ...contact, ...action.payload } : contact
        ),
        selectedContact:
          state.selectedContact?.id === action.payload.id
            ? { ...state.selectedContact, ...action.payload }
            : state.selectedContact,
      };
    case ACTIONS.DELETE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.filter((contact) => contact.id !== action.payload),
        selectedContact:
          state.selectedContact?.id === action.payload ? null : state.selectedContact,
      };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_SELECTED_CONTACT:
      return { ...state, selectedContact: action.payload };
    case ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case ACTIONS.SET_VIEW_MODE:
      return { ...state, viewMode: action.payload };
    case ACTIONS.SET_SORT:
      return {
        ...state,
        sortField: action.payload.field,
        sortDirection: action.payload.direction,
      };
    default:
      return state;
  }
};

// Create context
const ContactContext = createContext(null);

// Provider component
export const ContactProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contactReducer, initialState);

  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts();
  }, [state.sortField, state.sortDirection]);

  // Fetch all contacts
  const fetchContacts = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const contacts = await firestoreService.getAllContacts(
        state.sortField,
        state.sortDirection
      );
      dispatch({ type: ACTIONS.SET_CONTACTS, payload: contacts });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Add a new contact
  const addContact = async (contactData, imageUrl, thumbnailUrl) => {
    try {
      const newContact = await firestoreService.createContact({
        ...contactData,
        cardImageUrl: imageUrl || '',
        cardThumbnailUrl: thumbnailUrl || '',
      });
      dispatch({ type: ACTIONS.ADD_CONTACT, payload: newContact });
      return newContact;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Update a contact
  const updateContact = async (contactId, updates) => {
    try {
      await firestoreService.updateContact(contactId, updates);
      dispatch({ type: ACTIONS.UPDATE_CONTACT, payload: { id: contactId, ...updates } });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Delete a contact
  const deleteContact = async (contactId) => {
    try {
      await firestoreService.deleteContact(contactId);
      dispatch({ type: ACTIONS.DELETE_CONTACT, payload: contactId });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Set selected contact
  const setSelectedContact = (contact) => {
    dispatch({ type: ACTIONS.SET_SELECTED_CONTACT, payload: contact });
  };

  // Set search query
  const setSearchQuery = (query) => {
    dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: query });
  };

  // Set view mode
  const setViewMode = (mode) => {
    dispatch({ type: ACTIONS.SET_VIEW_MODE, payload: mode });
  };

  // Set sort
  const setSort = (field, direction) => {
    dispatch({ type: ACTIONS.SET_SORT, payload: { field, direction } });
  };

  // Filter contacts based on search query
  const filteredContacts = state.contacts.filter((contact) => {
    if (!state.searchQuery) return true;
    const query = state.searchQuery.toLowerCase();
    return (
      (contact.fullName || '').toLowerCase().includes(query) ||
      (contact.company || '').toLowerCase().includes(query) ||
      (contact.jobTitle || '').toLowerCase().includes(query) ||
      (contact.emails || []).some((e) => e.value.toLowerCase().includes(query))
    );
  });

  const value = {
    ...state,
    filteredContacts,
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,
    setSelectedContact,
    setSearchQuery,
    setViewMode,
    setSort,
  };

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
};

// Custom hook to use the contact context
export const useContacts = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
};

export default ContactContext;
