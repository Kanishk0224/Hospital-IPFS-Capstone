// ========================================================
// MediCare+ Healthcare System - LocalStorage State Manager
// ========================================================

const Storage = {
  KEYS: {
    DOCTORS: "medicare_doctors_v1",
    APPOINTMENTS: "medicare_appointments_v1",
    RECORDS: "medicare_records_v1",
    PRESCRIPTIONS: "medicare_prescriptions_v1",
    PATIENT: "medicare_patient_profile_v1",
    AUTH_USER: "medicare_auth_user_v1",
    THEME: "medicare_theme_v1",
    SPECIALTIES: "medicare_specialties_v1",
    IPFS_NODE: "medicare_ipfs_node_v1",
    IPFS_PINS: "medicare_ipfs_pins_v1"
  },

  init() {
    if (!localStorage.getItem(this.KEYS.DOCTORS)) {
      this.setDoctors(DEFAULT_DOCTORS);
    }
    if (!localStorage.getItem(this.KEYS.APPOINTMENTS)) {
      this.setAppointments(DEFAULT_APPOINTMENTS);
    }
    // Always refresh records/prescriptions if older version without IPFS fields exists
    const existingRecs = localStorage.getItem(this.KEYS.RECORDS);
    if (!existingRecs || !existingRecs.includes("ipfsCid")) {
      this.setRecords(DEFAULT_MEDICAL_RECORDS);
    }
    const existingRx = localStorage.getItem(this.KEYS.PRESCRIPTIONS);
    if (!existingRx || !existingRx.includes("ipfsCid")) {
      this.setPrescriptions(DEFAULT_PRESCRIPTIONS);
    }
    if (!localStorage.getItem(this.KEYS.PATIENT)) {
      this.setPatient(DEFAULT_PATIENT);
    }
    if (!localStorage.getItem(this.KEYS.SPECIALTIES)) {
      localStorage.setItem(this.KEYS.SPECIALTIES, JSON.stringify(DEFAULT_SPECIALTIES));
    }
    if (!localStorage.getItem(this.KEYS.IPFS_NODE)) {
      localStorage.setItem(this.KEYS.IPFS_NODE, JSON.stringify(DEFAULT_IPFS_NODE));
    }
    if (!localStorage.getItem(this.KEYS.IPFS_PINS)) {
      const initialPins = DEFAULT_MEDICAL_RECORDS.map(r => ({
        cid: r.ipfsCid,
        cidV0: r.ipfsCidV0,
        title: r.title,
        type: "Clinical Record",
        recordId: r.id,
        size: "1.4 MB",
        pinnedAt: r.date,
        pinStatus: "Pinned",
        merkleRoot: r.merkleRoot,
        encrypted: true
      }));
      localStorage.setItem(this.KEYS.IPFS_PINS, JSON.stringify(initialPins));
    }
    // Default logged in user for immediate seamless capstone evaluation
    if (!localStorage.getItem(this.KEYS.AUTH_USER)) {
      this.setAuthUser({
        isLoggedIn: true,
        role: "patient", // "patient" or "admin"
        id: DEFAULT_PATIENT.id,
        name: DEFAULT_PATIENT.fullName,
        email: DEFAULT_PATIENT.email,
        avatar: DEFAULT_PATIENT.avatar
      });
    }
  },

  // Doctors
  getDoctors() {
    try {
      const data = localStorage.getItem(this.KEYS.DOCTORS);
      return data ? JSON.parse(data) : DEFAULT_DOCTORS;
    } catch (e) {
      return DEFAULT_DOCTORS;
    }
  },

  getDoctorById(id) {
    const doctors = this.getDoctors();
    return doctors.find(d => d.id === id) || null;
  },

  setDoctors(doctors) {
    localStorage.setItem(this.KEYS.DOCTORS, JSON.stringify(doctors));
  },

  addDoctor(newDoctor) {
    const list = this.getDoctors();
    list.unshift(newDoctor);
    this.setDoctors(list);
    return list;
  },

  updateDoctor(updatedDoctor) {
    const list = this.getDoctors().map(d => d.id === updatedDoctor.id ? updatedDoctor : d);
    this.setDoctors(list);
    return list;
  },

  deleteDoctor(id) {
    const list = this.getDoctors().filter(d => d.id !== id);
    this.setDoctors(list);
    return list;
  },

  // Appointments
  getAppointments() {
    try {
      const data = localStorage.getItem(this.KEYS.APPOINTMENTS);
      return data ? JSON.parse(data) : DEFAULT_APPOINTMENTS;
    } catch (e) {
      return DEFAULT_APPOINTMENTS;
    }
  },

  setAppointments(appointments) {
    localStorage.setItem(this.KEYS.APPOINTMENTS, JSON.stringify(appointments));
  },

  addAppointment(appointment) {
    const list = this.getAppointments();
    list.unshift(appointment);
    this.setAppointments(list);
    return appointment;
  },

  updateAppointmentStatus(id, newStatus, cancellationReason = "") {
    const list = this.getAppointments().map(app => {
      if (app.id === id) {
        return {
          ...app,
          status: newStatus,
          cancellationReason: cancellationReason || app.cancellationReason
        };
      }
      return app;
    });
    this.setAppointments(list);
    return list;
  },

  rescheduleAppointment(id, newDate, newTime) {
    const list = this.getAppointments().map(app => {
      if (app.id === id) {
        return {
          ...app,
          date: newDate,
          time: newTime,
          status: "Upcoming"
        };
      }
      return app;
    });
    this.setAppointments(list);
    return list;
  },

  // Medical Records
  getRecords() {
    try {
      const data = localStorage.getItem(this.KEYS.RECORDS);
      return data ? JSON.parse(data) : DEFAULT_MEDICAL_RECORDS;
    } catch (e) {
      return DEFAULT_MEDICAL_RECORDS;
    }
  },

  setRecords(records) {
    localStorage.setItem(this.KEYS.RECORDS, JSON.stringify(records));
  },

  addRecord(record) {
    const list = this.getRecords();
    list.unshift(record);
    this.setRecords(list);
    return record;
  },

  // Prescriptions
  getPrescriptions() {
    try {
      const data = localStorage.getItem(this.KEYS.PRESCRIPTIONS);
      return data ? JSON.parse(data) : DEFAULT_PRESCRIPTIONS;
    } catch (e) {
      return DEFAULT_PRESCRIPTIONS;
    }
  },

  setPrescriptions(prescriptions) {
    localStorage.setItem(this.KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
  },

  getPrescriptionById(id) {
    return this.getPrescriptions().find(p => p.id === id) || null;
  },

  // Patient Profile
  getPatient() {
    try {
      const data = localStorage.getItem(this.KEYS.PATIENT);
      return data ? JSON.parse(data) : DEFAULT_PATIENT;
    } catch (e) {
      return DEFAULT_PATIENT;
    }
  },

  setPatient(patient) {
    localStorage.setItem(this.KEYS.PATIENT, JSON.stringify(patient));
  },

  // Specialties
  getSpecialties() {
    try {
      const data = localStorage.getItem(this.KEYS.SPECIALTIES);
      return data ? JSON.parse(data) : DEFAULT_SPECIALTIES;
    } catch (e) {
      return DEFAULT_SPECIALTIES;
    }
  },

  // Auth User
  getAuthUser() {
    try {
      const data = localStorage.getItem(this.KEYS.AUTH_USER);
      return data ? JSON.parse(data) : { isLoggedIn: false };
    } catch (e) {
      return { isLoggedIn: false };
    }
  },

  setAuthUser(user) {
    localStorage.setItem(this.KEYS.AUTH_USER, JSON.stringify(user));
  },

  // Theme
  getTheme() {
    return localStorage.getItem(this.KEYS.THEME) || "light";
  },

  setTheme(theme) {
    localStorage.setItem(this.KEYS.THEME, theme);
  },

  // IPFS Node & Pins
  getIpfsNode() {
    try {
      const data = localStorage.getItem(this.KEYS.IPFS_NODE);
      return data ? JSON.parse(data) : DEFAULT_IPFS_NODE;
    } catch (e) {
      return DEFAULT_IPFS_NODE;
    }
  },

  setIpfsNode(node) {
    localStorage.setItem(this.KEYS.IPFS_NODE, JSON.stringify(node));
  },

  getIpfsPins() {
    try {
      const data = localStorage.getItem(this.KEYS.IPFS_PINS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addIpfsPin(pin) {
    const list = this.getIpfsPins();
    list.unshift(pin);
    localStorage.setItem(this.KEYS.IPFS_PINS, JSON.stringify(list));
    return list;
  },

  deleteIpfsPin(cid) {
    const list = this.getIpfsPins().filter(p => p.cid !== cid);
    localStorage.setItem(this.KEYS.IPFS_PINS, JSON.stringify(list));
    return list;
  },

  // Reset to original mock data
  resetAllData() {
    localStorage.removeItem(this.KEYS.DOCTORS);
    localStorage.removeItem(this.KEYS.APPOINTMENTS);
    localStorage.removeItem(this.KEYS.RECORDS);
    localStorage.removeItem(this.KEYS.PRESCRIPTIONS);
    localStorage.removeItem(this.KEYS.PATIENT);
    localStorage.removeItem(this.KEYS.AUTH_USER);
    localStorage.removeItem(this.KEYS.SPECIALTIES);
    localStorage.removeItem(this.KEYS.IPFS_NODE);
    localStorage.removeItem(this.KEYS.IPFS_PINS);
    this.init();
  }
};

