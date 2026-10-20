import React, { createContext, useContext, useState } from 'react';

export type DoseStatus = 'taken' | 'skipped';
export type DoseLog = { id: string; medId: string; name: string; status: DoseStatus; at: string };
export type Activity = { id: string; type: string; minutes: number; note: string; at: string };
export type NotificationTarget = 'MedicationSchedule' | 'DailyCheckIn' | 'Glucose' | 'BloodPressure';
export type AppNotification = { id: string; title: string; body: string; time: string; read: boolean; target?: NotificationTarget };
export type Report = { id: string; category: string; description: string; notifyFamily: boolean; at: string };

export function nowLabel(): string {
  const d = new Date();
  const h = d.getHours() % 12 || 12;
  const ap = d.getHours() >= 12 ? 'pm' : 'am';
  return `${h}:${String(d.getMinutes()).padStart(2, '0')} ${ap}`;
}

// Sample data. TODO: replace with real data from your backend (the notification texts other than
// "Contacts Updated" and the glucose value are made-up samples).
const NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', title: 'Medication reminder', body: 'Your morning medication is due at 9:30 am.', time: '9:00 am', read: false, target: 'MedicationSchedule' },
  { id: 'n2', title: 'Contacts Updated', body: "Your daily logs have been shared with Laura. She can see you're doing great today!", time: '8:45 am', read: true },
  { id: 'n3', title: 'Glucose reading', body: 'Your latest reading of 95 mg/dL is in the normal range.', time: '8:30 am', read: false, target: 'Glucose' },
  { id: 'n4', title: 'Daily check-in', body: 'Take a moment to tell us how you are feeling today.', time: '7:30 am', read: false, target: 'DailyCheckIn' },
];

const ACTIVITIES: Activity[] = [{ id: 'a1', type: 'Walk', minutes: 20, note: 'Assisted with companion cane', at: '8:15 am' }];

type Ctx = {
  /** Today's status for each medication id. */
  doses: Record<string, DoseStatus>;
  history: DoseLog[];
  /** Pass null to undo. */
  setDose: (med: { id: string; name: string }, status: DoseStatus | null) => void;
  activities: Activity[];
  addActivity: (a: { type: string; minutes: number; note: string }) => void;
  removeActivity: (id: string) => void;
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  reports: Report[];
  addReport: (r: { category: string; description: string; notifyFamily: boolean }) => void;
};

const CareContext = createContext<Ctx>({
  doses: {},
  history: [],
  setDose: () => {},
  activities: [],
  addActivity: () => {},
  removeActivity: () => {},
  notifications: [],
  unreadCount: 0,
  markRead: () => {},
  markAllRead: () => {},
  reports: [],
  addReport: () => {},
});

export function CareProvider({ children }: { children: React.ReactNode }) {
  const [doses, setDoses] = useState<Record<string, DoseStatus>>({});
  const [history, setHistory] = useState<DoseLog[]>([]);
  const [activities, setActivities] = useState<Activity[]>(ACTIVITIES);
  const [notifications, setNotifications] = useState<AppNotification[]>(NOTIFICATIONS);
  const [reports, setReports] = useState<Report[]>([]);

  const value: Ctx = {
    doses,
    history,
    setDose: (med, status) => {
      if (status === null) {
        setDoses((d) => {
          const next = { ...d };
          delete next[med.id];
          return next;
        });
        setHistory((h) => {
          const i = h.findIndex((x) => x.medId === med.id);
          return i < 0 ? h : h.filter((_, j) => j !== i);
        });
        return;
      }
      // TODO: save this dose to your backend.
      setDoses((d) => ({ ...d, [med.id]: status }));
      setHistory((h) => [{ id: `${med.id}-${Date.now()}`, medId: med.id, name: med.name, status, at: nowLabel() }, ...h.filter((x) => x.medId !== med.id)]);
    },
    activities,
    addActivity: (a) => setActivities((l) => [{ ...a, id: String(Date.now()), at: nowLabel() }, ...l]),
    removeActivity: (id) => setActivities((l) => l.filter((x) => x.id !== id)),
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    markRead: (id) => setNotifications((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n))),
    markAllRead: () => setNotifications((l) => l.map((n) => ({ ...n, read: true }))),
    reports,
    // TODO: send the report to your backend and notify the family contacts if asked.
    addReport: (r) => setReports((l) => [{ ...r, id: String(Date.now()), at: nowLabel() }, ...l]),
  };

  return <CareContext.Provider value={value}>{children}</CareContext.Provider>;
}

export const useCare = () => useContext(CareContext);
