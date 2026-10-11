// ========================================================
// MediCare+ Healthcare System - Patient Dashboard & Profile
// ========================================================

const Dashboard = {
  init() {
    this.bindEvents();
    this.renderDashboard();
    this.renderProfile();
  },

  bindEvents() {
    // Edit profile form
    const profileForm = document.getElementById("patientProfileForm");
    if (profileForm) {
      profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveProfile(profileForm);
      });
    }

    // Cancel edit profile button
    const cancelEditBtn = document.getElementById("cancelProfileEditBtn");
    if (cancelEditBtn) {
      cancelEditBtn.addEventListener("click", () => {
        this.renderProfile();
        App.showToast("Profile edits cancelled.", "info");
      });
    }
  },

  renderDashboard() {
    const patient = Storage.getPatient();
    const appointments = Storage.getAppointments();
    const records = Storage.getRecords();
    const prescriptions = Storage.getPrescriptions();

    // 1. Patient Welcome Name
    const welcomeName = document.getElementById("dashboardWelcomePatientName");
    if (welcomeName) welcomeName.textContent = patient.fullName;

    const welcomeDate = document.getElementById("dashboardCurrentDate");
    if (welcomeDate) {
      const today = new Date();
      welcomeDate.textContent = today.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // 2. Metric Counters
    const totalApps = appointments.length;
    const upcomingApps = appointments.filter(a => a.status === "Upcoming");
    const completedApps = appointments.filter(a => a.status === "Completed");
    const totalRecords = records.length;
    const totalRx = prescriptions.length;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setVal("statTotalAppointments", totalApps);
    setVal("statUpcomingAppointments", upcomingApps.length);
    setVal("statCompletedAppointments", completedApps.length);
    setVal("statMedicalRecords", totalRecords);
    setVal("statActivePrescriptions", totalRx);

    // 3. Upcoming Appointment Hero Card
    const upcomingContainer = document.getElementById("dashboardUpcomingAppCard");
    if (upcomingContainer) {
      if (upcomingApps.length > 0) {
        const nextApp = upcomingApps[0];
        upcomingContainer.innerHTML = `
          <div class="next-appointment-hero-card">
            <div class="hero-card-tag">
              <span class="badge badge-success"><i class="fa-solid fa-clock"></i> NEXT SCHEDULED VISIT</span>
              <span class="font-mono text-xs text-muted">ID: ${nextApp.id}</span>
            </div>
            <div class="next-app-details-grid mt-3">
              <div class="flex items-center gap-3">
                <img src="${nextApp.doctorImage}" class="w-16 h-16 rounded-xl object-cover shadow-sm" alt="${nextApp.doctorName}">
                <div>
                  <h3 class="font-bold text-navy text-lg">${nextApp.doctorName}</h3>
                  <span class="badge badge-primary">${nextApp.specialtyName}</span>
                  <p class="text-xs text-muted mt-1"><i class="fa-solid fa-location-dot text-rose-500"></i> ${nextApp.room}</p>
                </div>
              </div>

              <div class="datetime-callout">
                <div class="callout-block">
                  <span class="block text-xs text-muted">DATE</span>
                  <strong class="text-primary">${this.formatDate(nextApp.date)}</strong>
                </div>
                <div class="callout-block">
                  <span class="block text-xs text-muted">TIME</span>
                  <strong class="text-teal">${nextApp.time}</strong>
                </div>
              </div>
            </div>

            <div class="next-app-reason-box mt-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs">
              <strong>Reason:</strong> ${nextApp.reason}
            </div>

            <div class="hero-card-actions mt-4 flex gap-2 flex-wrap">
              <button class="btn btn-outline-primary btn-sm" onclick="Appointments.viewDetails('${nextApp.id}')">
                <i class="fa-regular fa-eye"></i> View Full Details
              </button>
              <button class="btn btn-outline-secondary btn-sm" onclick="Appointments.openRescheduleModal('${nextApp.id}')">
                <i class="fa-solid fa-calendar-days"></i> Reschedule
              </button>
              <button class="btn btn-outline-danger btn-sm" onclick="Appointments.openCancelModal('${nextApp.id}')">
                <i class="fa-solid fa-xmark"></i> Cancel
              </button>
            </div>
          </div>
        `;
      } else {
        upcomingContainer.innerHTML = `
          <div class="empty-upcoming-box p-6 text-center border-2 border-dashed border-slate-200 rounded-xl">
            <i class="fa-regular fa-calendar-check text-4xl text-teal mb-2"></i>
            <h4 class="font-bold text-navy">No Upcoming Appointments</h4>
            <p class="text-xs text-muted mt-1">You are all caught up! Book a consultation whenever you need professional medical guidance.</p>
            <button class="btn btn-primary btn-sm mt-3" onclick="Booking.startNew()">
              <i class="fa-solid fa-plus"></i> Book Consultation
            </button>
          </div>
        `;
      }
    }

    // 4. Recent Prescriptions List
    const rxContainer = document.getElementById("dashboardRecentRxList");
    if (rxContainer) {
      if (prescriptions.length === 0) {
        rxContainer.innerHTML = `<p class="text-xs text-muted p-3">No active prescriptions.</p>`;
      } else {
        rxContainer.innerHTML = prescriptions.slice(0, 3).map(rx => `
          <div class="dashboard-rx-item flex justify-between items-center p-3 border-b border-slate-100 last:border-none">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-teal-50 text-teal rounded-lg font-bold text-sm">℞</div>
              <div>
                <h4 class="font-bold text-sm text-navy">${rx.diagnosis}</h4>
                <p class="text-xs text-muted">${rx.doctorName} • ${rx.medicines.length} medications • ${this.formatDate(rx.date)}</p>
              </div>
            </div>
            <button class="btn btn-outline-teal btn-xs" onclick="Records.viewPrescription('${rx.id}')">
              <i class="fa-solid fa-file-prescription"></i> View Rx
            </button>
          </div>
        `).join("");
      }
    }

    // 5. Recent Activity Timeline
    const activityContainer = document.getElementById("dashboardActivityTimeline");
    if (activityContainer) {
      activityContainer.innerHTML = `
        <div class="activity-timeline">
          <div class="timeline-item">
            <div class="timeline-dot bg-blue-500"></div>
            <div class="timeline-content">
              <p class="font-semibold text-xs text-navy">Appointment Confirmed with Dr. Sarah Jenkins</p>
              <span class="text-xxs text-muted">Cardiology • Scheduled for Oct 15</span>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot bg-emerald-500"></div>
            <div class="timeline-content">
              <p class="font-semibold text-xs text-navy">Executive Blood Panel Lab Report Uploaded</p>
              <span class="text-xxs text-muted">Internal Medicine • Completed</span>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot bg-purple-500"></div>
            <div class="timeline-content">
              <p class="font-semibold text-xs text-navy">Prescription RX-88421 Issued</p>
              <span class="text-xxs text-muted">Atorvastatin & Omega-3 • 90 Days</span>
            </div>
          </div>
        </div>
      `;
    }
  },

  renderProfile() {
    const patient = Storage.getPatient();
    const form = document.getElementById("patientProfileForm");
    if (!form) return;

    // Fill form fields
    const fill = (id, val) => {
      const el = form.querySelector(`#${id}`);
      if (el) el.value = val || "";
    };

    fill("profileFullName", patient.fullName);
    fill("profileEmail", patient.email);
    fill("profilePhone", patient.phone);
    fill("profileDob", patient.dob);
    fill("profileGender", patient.gender);
    fill("profileBloodGroup", patient.bloodGroup);
    fill("profileHeight", patient.height);
    fill("profileWeight", patient.weight);
    fill("profileAddress", patient.address);
    fill("profileEmergencyName", patient.emergencyName);
    fill("profileEmergencyPhone", patient.emergencyPhone);
    fill("profileAllergies", patient.allergies);
    fill("profileInsurance", patient.insuranceProvider);

    // Profile Summary Card
    const avatarImg = document.getElementById("profileAvatarPreview");
    if (avatarImg) avatarImg.src = patient.avatar;

    const profileCardName = document.getElementById("profileCardPatientName");
    if (profileCardName) profileCardName.textContent = patient.fullName;

    const profileCardId = document.getElementById("profileCardPatientId");
    if (profileCardId) profileCardId.textContent = `Patient ID: ${patient.id}`;

    const profileCardBlood = document.getElementById("profileCardBloodGroup");
    if (profileCardBlood) profileCardBlood.textContent = patient.bloodGroup;
  },

  saveProfile(form) {
    const getVal = (id) => {
      const el = form.querySelector(`#${id}`);
      return el ? el.value.trim() : "";
    };

    const updated = {
      ...Storage.getPatient(),
      fullName: getVal("profileFullName"),
      email: getVal("profileEmail"),
      phone: getVal("profilePhone"),
      dob: getVal("profileDob"),
      gender: getVal("profileGender"),
      bloodGroup: getVal("profileBloodGroup"),
      height: getVal("profileHeight"),
      weight: getVal("profileWeight"),
      address: getVal("profileAddress"),
      emergencyName: getVal("profileEmergencyName"),
      emergencyPhone: getVal("profileEmergencyPhone"),
      allergies: getVal("profileAllergies"),
      insuranceProvider: getVal("profileInsurance")
    };

    if (!updated.fullName || updated.fullName.length < 3) {
      App.showToast("Please enter a valid full name.", "error");
      return;
    }

    Storage.setPatient(updated);

    // Update session info if patient is active
    const authUser = Storage.getAuthUser();
    if (authUser.role === "patient") {
      authUser.name = updated.fullName;
      authUser.email = updated.email;
      Storage.setAuthUser(authUser);
      Auth.updateAuthUI();
    }

    this.renderProfile();
    this.renderDashboard();
    App.showToast("Patient medical profile saved successfully!", "success");
  },

  formatDate(dateStr) {
    if (!dateStr) return "";
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", options);
  }
};
