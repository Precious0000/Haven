import React, { createContext, useContext, useState } from 'react';

export type Medication = {
  id: string;
  name: string;
  strength: string;
  frequency: string;
  time: string;
  note?: string;
  /** Pills left. */
  supply?: number;
  refillRequested?: boolean;
};

export type Settings = {
  name: string;
  email: string;
  phone: string;
  address: string;
  voiceAssistance: boolean;
  touchVibration: boolean;
  speakAloud: boolean;
  theme: string;
  fontScale: number;
  pace: 'Gentle' | 'Standard';
  notifications: boolean;
  language: string;
  medications: Medication[];
};

// Sample values from the design (the third medication and all supply numbers are made-up samples).
// TODO: load these from, and save them to, your backend.
const DEFAULTS: Settings = {
  name: 'Linda Agbaje',
  email: 'Lindaagbaje@hotmail.com',
  phone: '',
  address: '',
  voiceAssistance: true,
  touchVibration: false,
  speakAloud: true,
  theme: 'Ivory',
  fontScale: 0.25,
  pace: 'Standard',
  notifications: false,
  language: 'English',
  medications: [
    { id: '1', name: 'Metformin', strength: '500 mg', frequency: 'Once daily', time: '9:30 am', note: 'With morning breakfast', supply: 18 },
    { id: '2', name: 'Lisinopril', strength: '10 mg', frequency: 'Once daily', time: '9:30 am', note: 'With 1 full glass of water', supply: 6 },
    { id: '3', name: 'Atorvastatin', strength: '20 mg', frequency: 'Once daily', time: '7:30 pm', note: '', supply: 25 },
  ],
};

type Ctx = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  addMedication: (m: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, patch: Partial<Medication>) => void;
  removeMedication: (id: string) => void;
};

const SettingsContext = createContext<Ctx>({
  settings: DEFAULTS,
  update: () => {},
  addMedication: () => {},
  updateMedication: () => {},
  removeMedication: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  const value: Ctx = {
    settings,
    update: (patch) => setSettings((s) => ({ ...s, ...patch })),
    addMedication: (m) => setSettings((s) => ({ ...s, medications: [...s.medications, { ...m, id: String(Date.now()) }] })),
    updateMedication: (id, patch) =>
      setSettings((s) => ({ ...s, medications: s.medications.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
    removeMedication: (id) => setSettings((s) => ({ ...s, medications: s.medications.filter((m) => m.id !== id) })),
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
