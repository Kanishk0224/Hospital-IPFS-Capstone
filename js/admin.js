// ========================================================
// MediCare+ Healthcare System - Administrative Portal
// ========================================================

const Admin = {
  currentTab: "overview", // "overview", "doctors", "appointments", "patients"
  editingDoctorId: null,

  init() {
    this.bindEvents();
    this.renderAdminPortal();
  },

  bindEvents() {
    // Admin Subtabs
    const adminNav = document.getElementById("adminSubNav");
    if (adminNav) {
      adminNav.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-admin-tab]");
        if (btn) {
          adminNav.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.currentTab = btn.getAttribute("data-admin-tab");
          this.switchTab(this.currentTab);
        }
      });
    }

    // Add Doctor Form Submit
    const addDoctorForm = document.getElementById("adminAddDoctorForm");
    if (addDoctorForm) {
      addDoctorForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveDoctor(addDoctorForm);
      });
    }

    // Appointment Status Filter in Admin
    const statusFilter = document.getElementById("adminAppStatusFilter");
    if (statusFilter) {
      statusFilter.addEventListener("change", () => {
        this.renderAdminAppointments();
      });
    }
  },

  switchTab(tab) {
    document.querySelectorAll(".admin-tab-panel").forEach(panel => {
      if (panel.id === `adminPanel_${tab}`) {
        panel.classList.remove("hidden");
      } else {
        panel.classList.add("hidden");
      }
    });

    if (tab === "overview") this.renderOverview();
    else if (tab === "doctors") this.renderDoctorManagement();
    else if (tab === "appointments") this.renderAdminAppointments();
    else if (tab === "patients") this.renderPatientManagement();
  },

  renderAdminPortal() {
    this.renderOverview();
    this.renderDoctorManagement();
    this.renderAdminAppointments();
    this.renderPatientManagement();
  },

  renderOverview() {
    const doctors = Storage.getDoctors();
    const appointments = Storage.getAppointments();
    const records = Storage.getRecords();

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setEl("adminStatDoctorsCount", doctors.length);
    setEl("adminStatAppointmentsCount", appointments.length);
    setEl("adminStatUpcomingCount", appointments.filter(a => a.status === "Upcoming").length);
    setEl("adminStatRecordsCount", records.length);
  },

  // ----------------------------------------------------
  // DOCTOR MANAGEMENT
  // ----------------------------------------------------
  renderDoctorManagement() {
    const container = document.getElementById("adminDoctorListTableBody");
    if (!container) return;

    const doctors = Storage.getDoctors();

    container.innerHTML = doctors.map(doc => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <td class="p-3">
          <div class="flex items-center gap-3">
            <img src="${doc.image}" alt="${doc.name}" class="w-10 h-10 rounded-full object-cover">
            <div>
              <span class="font-bold text-navy block text-sm">${doc.name}</span>
              <span class="text-xs text-muted">${doc.qualification}</span>
            </div>
          </div>
        </td>
        <td class="p-3">
          <span class="doctor-specialty-tag specialty-${doc.specialty}">${doc.specialtyName}</span>
        </td>
        <td class="p-3 text-sm font-semibold">${doc.experience} Years</td>
        <td class="p-3 text-sm font-bold text-navy">$${doc.fee}</td>
        <td class="p-3">
          <button 
            class="badge ${doc.availableToday ? 'badge-success' : 'badge-subtle'} cursor-pointer"
            onclick="Admin.toggleDoctorAvailability('${doc.id}')"
            title="Click to toggle availability"
          >
            ${doc.availableToday ? 'Available Today' : 'Scheduled'}
          </button>
        </td>
        <td class="p-3 text-right">
          <div class="flex justify-end gap-2">
            <button class="btn btn-outline-secondary btn-xs" onclick="Admin.openEditDoctor('${doc.id}')" title="Edit Doctor Profile">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button class="btn btn-outline-danger btn-xs" onclick="Admin.deleteDoctor('${doc.id}')" title="Remove Doctor">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join("");
  },

  openAddDoctorModal() {
    this.editingDoctorId = null;
    const form = document.getElementById("adminAddDoctorForm");
    if (form) form.reset();

    const title = document.getElementById("adminDoctorModalTitle");
    if (title) title.textContent = "Add New Hospital Specialist";

    App.showModal("adminDoctorModal");
  },

  openEditDoctor(doctorId) {
    const doc = Storage.getDoctorById(doctorId);
    if (!doc) return;

    this.editingDoctorId = doctorId;
    const form = document.getElementById("adminAddDoctorForm");
    if (!form) return;

    const fill = (id, val) => {
      const el = form.querySelector(`#${id}`);
      if (el) el.value = val;
    };

    fill("docFormName", doc.name);
    fill("docFormSpecialty", doc.specialty);
    fill("docFormQualification", doc.qualification);
    fill("docFormExperience", doc.experience);
    fill("docFormFee", doc.fee);
    fill("docFormRoom", doc.room);
    fill("docFormHours", doc.consultationHours);
    fill("docFormImage", doc.image);
    fill("docFormAbout", doc.about);

    const title = document.getElementById("adminDoctorModalTitle");
    if (title) title.textContent = `Edit Profile: ${doc.name}`;

    App.showModal("adminDoctorModal");
  },

  saveDoctor(form) {
    const getVal = (id) => form.querySelector(`#${id}`).value.trim();

    const name = getVal("docFormName");
    const specialty = getVal("docFormSpecialty");
    const qualification = getVal("docFormQualification");
    const experience = parseInt(getVal("docFormExperience"), 10) || 5;
    const fee = parseInt(getVal("docFormFee"), 10) || 80;
    const room = getVal("docFormRoom") || "Consultation Room 101";
    const hours = getVal("docFormHours") || "09:00 AM - 04:30 PM";
    const image = getVal("docFormImage") || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600";
    const about = getVal("docFormAbout") || "Experienced specialist dedicated to compassionate patient care.";

    const specialties = Storage.getSpecialties();
    const specObj = specialties.find(s => s.id === specialty);
    const specialtyName = specObj ? specObj.name : "General Medicine";

    if (this.editingDoctorId) {
      const existing = Storage.getDoctorById(this.editingDoctorId);
      const updated = {
        ...existing,
        name,
        specialty,
        specialtyName,
        qualification,
        experience,
        fee,
        room,
        consultationHours: hours,
        image,
        about
      };
      Storage.updateDoctor(updated);
      App.showToast(`Dr. ${name}'s profile updated!`, "success");
    } else {
      const newDoc = {
        id: `doc-${Date.now()}`,
        name,
        specialty,
        specialtyName,
        qualification,
        experience,
        fee,
        room,
        consultationHours: hours,
        image,
        about,
        rating: 5.0,
        reviewCount: 1,
        availableToday: true,
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        slots: ["09:00 AM", "10:30 AM", "01:00 PM", "03:00 PM"]
      };
      Storage.addDoctor(newDoc);
      App.showToast(`Dr. ${name} added to the MediCare+ registry!`, "success");
    }

    App.closeModal("adminDoctorModal");
    this.renderDoctorManagement();
    this.renderOverview();
    Doctors.renderDoctorDirectory();
  },

  deleteDoctor(doctorId) {
    const doc = Storage.getDoctorById(doctorId);
    if (!doc) return;

    if (confirm(`Are you sure you want to remove ${doc.name} from the active doctor registry?`)) {
      Storage.deleteDoctor(doctorId);
      App.showToast(`${doc.name} removed from registry.`, "info");
      this.renderDoctorManagement();
      this.renderOverview();
      Doctors.renderDoctorDirectory();
    }
  },

  toggleDoctorAvailability(doctorId) {
    const doc = Storage.getDoctorById(doctorId);
    if (!doc) return;

    doc.availableToday = !doc.availableToday;
    Storage.updateDoctor(doc);
    App.showToast(`Updated status for ${doc.name}: ${doc.availableToday ? 'Available Today' : 'Scheduled'}`, "info");
    this.renderDoctorManagement();
    Doctors.renderDoctorDirectory();
  },

  // ----------------------------------------------------
  // APPOINTMENT MANAGEMENT
  // ----------------------------------------------------
  renderAdminAppointments() {
    const container = document.getElementById("adminAppointmentsTableBody");
    if (!container) return;

    const filterVal = document.getElementById("adminAppStatusFilter")?.value || "all";
    let list = Storage.getAppointments();

    if (filterVal !== "all") {
      list = list.filter(a => a.status === filterVal);
    }

    container.innerHTML = list.map(app => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors text-xs">
        <td class="p-3 font-mono font-bold text-primary">${app.id}</td>
        <td class="p-3">
          <strong>${app.patientName}</strong>
          <span class="block text-muted">${app.patientPhone}</span>
        </td>
        <td class="p-3">
          <span class="font-semibold text-navy">${app.doctorName}</span>
          <span class="block text-muted">${app.specialtyName}</span>
        </td>
        <td class="p-3">
          ${app.date}
          <span class="block font-semibold text-teal">${app.time}</span>
        </td>
        <td class="p-3">
          <span class="badge ${app.status === 'Upcoming' ? 'badge-success' : app.status === 'Completed' ? 'badge-info' : 'badge-danger'}">
            ${app.status}
          </span>
        </td>
        <td class="p-3 font-semibold text-navy">$${app.fee}</td>
        <td class="p-3 text-right">
          <div class="flex justify-end gap-1">
            ${app.status === 'Upcoming' ? `
              <button class="btn btn-outline-primary btn-xs" onclick="Admin.setAppStatus('${app.id}', 'Completed')" title="Mark as Completed">
                <i class="fa-solid fa-check"></i> Complete
              </button>
              <button class="btn btn-outline-danger btn-xs" onclick="Admin.setAppStatus('${app.id}', 'Cancelled')" title="Cancel Appointment">
                <i class="fa-solid fa-ban"></i>
              </button>
            ` : `
              <button class="btn btn-outline-secondary btn-xs" onclick="Admin.setAppStatus('${app.id}', 'Upcoming')" title="Re-open / Set Upcoming">
                <i class="fa-solid fa-rotate-left"></i> Reopen
              </button>
            `}
          </div>
        </td>
      </tr>
    `).join("");
  },

  setAppStatus(appId, newStatus) {
    Storage.updateAppointmentStatus(appId, newStatus, newStatus === 'Cancelled' ? 'Cancelled by Clinic Administration' : '');
    App.showToast(`Appointment ${appId} marked as ${newStatus}.`, "info");
    this.renderAdminAppointments();
    this.renderOverview();
    Appointments.renderAppointments();
    Dashboard.renderDashboard();
  },

  // ----------------------------------------------------
  // PATIENT DIRECTORY
  // ----------------------------------------------------
  renderPatientManagement() {
    const container = document.getElementById("adminPatientListTableBody");
    if (!container) return;

    const patient = Storage.getPatient();

    container.innerHTML = `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors text-sm">
        <td class="p-3">
          <div class="flex items-center gap-3">
            <img src="${patient.avatar}" alt="${patient.fullName}" class="w-10 h-10 rounded-full object-cover">
            <div>
              <strong class="text-navy block">${patient.fullName}</strong>
              <span class="font-mono text-xs text-muted">ID: ${patient.id}</span>
            </div>
          </div>
        </td>
        <td class="p-3">
          ${patient.email}
          <span class="block text-xs text-muted">${patient.phone}</span>
        </td>
        <td class="p-3">
          <span class="badge badge-subtle">${patient.gender}, ${patient.bloodGroup}</span>
        </td>
        <td class="p-3 text-xs text-muted">
          ${patient.emergencyName} (${patient.emergencyPhone})
        </td>
        <td class="p-3">
          <span class="badge badge-success">Active Registered</span>
        </td>
      </tr>
    `;
  }
};
