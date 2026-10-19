import React, { createContext, useContext, useState } from 'react';

export type Contact = {
  id: string;
  name: string;
  role: string;
  phone: string;
  group: 'family' | 'care';
};

// Sample contacts from the design. TODO: load and save these with your backend.
const INITIAL: Contact[] = [
  { id: '1', name: 'Laura Agbaje', role: 'Daughter', phone: '+234 814 159 4007', group: 'family' },
  { id: '2', name: 'Kenny Agbaje', role: 'Son', phone: '+234 814 159 4007', group: 'family' },
  { id: '3', name: 'Dr. Jane Ini', role: 'Physician', phone: '+234 814 159 4007', group: 'care' },
  { id: '4', name: 'Sarah Miles', role: 'Caregiver', phone: '+234 814 159 4007', group: 'care' },
];

export const RELATIONSHIPS = ['Son', 'Daughter', 'Spouse', 'Sibling', 'Friend', 'Neighbour', 'Physician', 'Caregiver', 'Other'];

type Ctx = {
  contacts: Contact[];
  addContact: (c: { name: string; role: string; phone: string }) => void;
};

const ContactsContext = createContext<Ctx>({ contacts: INITIAL, addContact: () => {} });

export function ContactsProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL);

  const addContact: Ctx['addContact'] = ({ name, role, phone }) => {
    const group = role === 'Physician' || role === 'Caregiver' ? 'care' : 'family';
    setContacts((list) => [...list, { id: String(Date.now()), name, role, phone, group }]);
  };

  return <ContactsContext.Provider value={{ contacts, addContact }}>{children}</ContactsContext.Provider>;
}

export const useContacts = () => useContext(ContactsContext);
