'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage } from '../lib/storageService';
import {
  DEFAULT_CURRENT_USER,
  DEFAULT_DOCTOR_USER,
  DEFAULT_ADMIN_USER
} from '../lib/clinicalData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(DEFAULT_CURRENT_USER);
  const [theme, setTheme] = useState('light');
  const [toast, setToast] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [ipfsExplorerOpen, setIpfsExplorerOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    Storage.init();
    const storedTheme = Storage.getTheme();
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);

    setCurrentUser(Storage.getCurrentUser());
    setDoctors(Storage.getDoctors());
    setAppointments(Storage.getAppointments());
    setRecords(Storage.getRecords());
    setPrescriptions(Storage.getPrescriptions());
    setInitialized(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    Storage.setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const refreshData = () => {
    setDoctors(Storage.getDoctors());
    setAppointments(Storage.getAppointments());
    setRecords(Storage.getRecords());
    setPrescriptions(Storage.getPrescriptions());
    setCurrentUser(Storage.getCurrentUser());
  };

  const loginUser = (role, customData = {}) => {
    let user;
    if (role === 'admin') {
      user = {
        ...DEFAULT_ADMIN_USER,
        ...customData
      };
    } else if (role === 'doctor') {
      user = {
        ...DEFAULT_DOCTOR_USER,
        ...customData
      };
    } else {
      user = {
        ...DEFAULT_CURRENT_USER,
        ...customData
      };
    }
    Storage.saveCurrentUser(user);
    setCurrentUser(user);
    showToast(`Signed in as ${user.name} (${user.role.toUpperCase()} MODE)`, 'success');
  };

  const logout = () => {
    const guestUser = {
      id: 'guest',
      name: 'Guest User',
      email: '',
      role: 'guest'
    };
    Storage.saveCurrentUser(guestUser);
    setCurrentUser(guestUser);
    showToast('Signed out successfully', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        theme,
        toggleTheme,
        toast,
        showToast,
        doctors,
        appointments,
        records,
        prescriptions,
        refreshData,
        loginUser,
        logout,
        ipfsExplorerOpen,
        setIpfsExplorerOpen,
        initialized
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
