// Storage & State Management for Next.js Hospital Management Portal (India Edition)
import {
  DEFAULT_SPECIALTIES,
  DEFAULT_DOCTORS,
  DEFAULT_APPOINTMENTS,
  DEFAULT_MEDICAL_RECORDS,
  DEFAULT_PRESCRIPTIONS,
  DEFAULT_PATIENTS,
  DEFAULT_CURRENT_USER,
  DEFAULT_DOCTOR_USER,
  DEFAULT_ADMIN_USER,
  DEFAULT_IPFS_NODE
} from './clinicalData';

const KEYS = {
  DOCTORS: 'medicare_doctors_in_v4',
  APPOINTMENTS: 'medicare_appointments_in_v4',
  RECORDS: 'medicare_records_in_v4',
  PRESCRIPTIONS: 'medicare_prescriptions_in_v4',
  PATIENTS: 'medicare_patients_in_v4',
  CURRENT_USER: 'medicare_current_user_in_v4',
  THEME: 'medicare_theme_in_v4',
  IPFS_NODE: 'medicare_ipfs_node_in_v4',
  IPFS_PINS: 'medicare_ipfs_pins_in_v4'
};

export const Storage = {
  isBrowser() {
    return typeof window !== 'undefined';
  },

  init() {
    if (!this.isBrowser()) return;
    try {
      if (!localStorage.getItem(KEYS.DOCTORS)) {
        localStorage.setItem(KEYS.DOCTORS, JSON.stringify(DEFAULT_DOCTORS));
      }
      if (!localStorage.getItem(KEYS.APPOINTMENTS)) {
        localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(DEFAULT_APPOINTMENTS));
      }
      if (!localStorage.getItem(KEYS.RECORDS)) {
        localStorage.setItem(KEYS.RECORDS, JSON.stringify(DEFAULT_MEDICAL_RECORDS));
      }
      if (!localStorage.getItem(KEYS.PRESCRIPTIONS)) {
        localStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(DEFAULT_PRESCRIPTIONS));
      }
      if (!localStorage.getItem(KEYS.PATIENTS)) {
        localStorage.setItem(KEYS.PATIENTS, JSON.stringify(DEFAULT_PATIENTS));
      }
      if (!localStorage.getItem(KEYS.CURRENT_USER)) {
        localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(DEFAULT_CURRENT_USER));
      }
      if (!localStorage.getItem(KEYS.IPFS_NODE)) {
        localStorage.setItem(KEYS.IPFS_NODE, JSON.stringify(DEFAULT_IPFS_NODE));
      }
    } catch (e) {
      console.warn('Storage init fallback:', e);
    }
  },

  getDoctors() {
    if (!this.isBrowser()) return DEFAULT_DOCTORS;
    try {
      const data = localStorage.getItem(KEYS.DOCTORS);
      return data ? JSON.parse(data) : DEFAULT_DOCTORS;
    } catch {
      return DEFAULT_DOCTORS;
    }
  },

  saveDoctors(doctors) {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.DOCTORS, JSON.stringify(doctors));
  },

  getAppointments() {
    if (!this.isBrowser()) return DEFAULT_APPOINTMENTS;
    try {
      const data = localStorage.getItem(KEYS.APPOINTMENTS);
      return data ? JSON.parse(data) : DEFAULT_APPOINTMENTS;
    } catch {
      return DEFAULT_APPOINTMENTS;
    }
  },

  saveAppointments(appointments) {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
  },

  addAppointment(appt) {
    const list = this.getAppointments();
    list.unshift(appt);
    this.saveAppointments(list);
    return appt;
  },

  updateAppointment(id, updates) {
    const list = this.getAppointments();
    const idx = list.findIndex(a => a.id === id || a.referenceId === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.saveAppointments(list);
      return list[idx];
    }
    return null;
  },

  getRecords() {
    if (!this.isBrowser()) return DEFAULT_MEDICAL_RECORDS;
    try {
      const data = localStorage.getItem(KEYS.RECORDS);
      return data ? JSON.parse(data) : DEFAULT_MEDICAL_RECORDS;
    } catch {
      return DEFAULT_MEDICAL_RECORDS;
    }
  },

  saveRecords(records) {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
  },

  addRecord(record) {
    const list = this.getRecords();
    list.unshift(record);
    this.saveRecords(list);
    return record;
  },

  getPrescriptions() {
    if (!this.isBrowser()) return DEFAULT_PRESCRIPTIONS;
    try {
      const data = localStorage.getItem(KEYS.PRESCRIPTIONS);
      return data ? JSON.parse(data) : DEFAULT_PRESCRIPTIONS;
    } catch {
      return DEFAULT_PRESCRIPTIONS;
    }
  },

  savePrescriptions(prescriptions) {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
  },

  addPrescription(rx) {
    const list = this.getPrescriptions();
    list.unshift(rx);
    this.savePrescriptions(list);
    return rx;
  },

  getCurrentUser() {
    if (!this.isBrowser()) return DEFAULT_CURRENT_USER;
    try {
      const data = localStorage.getItem(KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : DEFAULT_CURRENT_USER;
    } catch {
      return DEFAULT_CURRENT_USER;
    }
  },

  saveCurrentUser(user) {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  },

  getTheme() {
    if (!this.isBrowser()) return 'light';
    return localStorage.getItem(KEYS.THEME) || 'light';
  },

  setTheme(theme) {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.THEME, theme);
  },

  getIpfsNode() {
    if (!this.isBrowser()) return DEFAULT_IPFS_NODE;
    try {
      const data = localStorage.getItem(KEYS.IPFS_NODE);
      return data ? JSON.parse(data) : DEFAULT_IPFS_NODE;
    } catch {
      return DEFAULT_IPFS_NODE;
    }
  },

  resetAllData() {
    if (!this.isBrowser()) return;
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    this.init();
  }
};
