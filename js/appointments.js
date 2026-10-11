// ========================================================
// MediCare+ Healthcare System - Patient Appointments Management
// ========================================================

const Appointments = {
  currentTab: "all", // "all", "Upcoming", "Completed", "Cancelled"
  activeAppointmentIdForAction: null,

  init() {
    this.bindEvents();
    this.renderAppointments();
  },

  bindEvents() {
    // Tab switching
    const tabsContainer = document.getElementById("appointmentTabsList");
    if (tabsContainer) {
      tabsContainer.addEventListener("click", (e) => {
        const tabBtn = e.target.closest("[data-app-tab]");
        if (tabBtn) {
          tabsContainer.querySelectorAll(".tab-pill").forEach(t => t.classList.remove("active"));
          tabBtn.classList.add("active");
          this.currentTab = tabBtn.getAttribute("data-app-tab");
          this.renderAppointments();
        }
      });
    }

    // Cancel appointment form submit
    const cancelForm = document.getElementById("cancelAppointmentForm");
    if (cancelForm) {
      cancelForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.confirmCancellation();
      });
    }

    // Reschedule appointment form submit
    const rescheduleForm = document.getElementById("rescheduleAppointmentForm");
    if (rescheduleForm) {
      rescheduleForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.confirmReschedule();
      });
    }
  },

  renderAppointments() {
    const container = document.getElementById("appointmentsListContainer");
    if (!container) return;

    const allApps = Storage.getAppointments();

    // Update tab badge counters
    const countAll = allApps.length;
    const countUpcoming = allApps.filter(a => a.status === "Upcoming").length;
    const countCompleted = allApps.filter(a => a.status === "Completed").length;
    const countCancelled = allApps.filter(a => a.status === "Cancelled").length;

    const setBadge = (id, count) => {
      const el = document.getElementById(id);
      if (el) el.textContent = count;
    };
    setBadge("countTabAll", countAll);
    setBadge("countTabUpcoming", countUpcoming);
    setBadge("countTabCompleted", countCompleted);
    setBadge("countTabCancelled", countCancelled);

    // Filter appointments according to active tab
    let filtered = allApps;
    if (this.currentTab !== "all") {
      filtered = allApps.filter(a => a.status === this.currentTab);
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-state-icon">
            <i class="fa-regular fa-calendar-xmark"></i>
          </div>
          <h3>No ${this.currentTab === 'all' ? '' : this.currentTab} Appointments</h3>
          <p>You currently do not have any appointments in this category.</p>
          <button class="btn btn-primary mt-3" onclick="Booking.startNew()">
            <i class="fa-regular fa-calendar-plus"></i> Book a New Appointment
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(app => {
      let statusBadgeClass = "badge-primary";
      if (app.status === "Upcoming") statusBadgeClass = "badge-success";
      else if (app.status === "Completed") statusBadgeClass = "badge-info";
      else if (app.status === "Cancelled") statusBadgeClass = "badge-danger";

      return `
        <div class="appointment-card fade-in" data-app-id="${app.id}">
          <div class="app-card-left">
            <img src="${app.doctorImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}" alt="${app.doctorName}" class="app-doc-avatar">
            <div class="app-info">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="badge ${statusBadgeClass}">${app.status.toUpperCase()}</span>
                <span class="text-xs text-muted font-mono">ID: ${app.id}</span>
                <span class="badge badge-subtle">${app.type}</span>
              </div>
              <h3 class="app-doc-name">${app.doctorName}</h3>
              <p class="app-specialty-text">${app.specialtyName} • ${app.room}</p>
              <p class="app-reason-snippet"><i class="fa-solid fa-notes-medical text-teal"></i> ${app.reason}</p>
            </div>
          </div>

          <div class="app-card-center">
            <div class="app-datetime-box">
              <div class="date-row">
                <i class="fa-regular fa-calendar text-primary"></i>
                <span class="font-semibold">${this.formatDate(app.date)}</span>
              </div>
              <div class="time-row">
                <i class="fa-regular fa-clock text-teal"></i>
                <span class="font-bold text-navy">${app.time}</span>
              </div>
              <div class="fee-row">
                <span class="text-xs text-muted">Fee: $${app.fee} (${app.paymentStatus})</span>
              </div>
            </div>
          </div>

          <div class="app-card-actions">
            <button class="btn btn-outline-secondary btn-sm" onclick="Appointments.viewDetails('${app.id}')">
              <i class="fa-regular fa-eye"></i> Details
            </button>

            ${app.status === 'Upcoming' ? `
              <button class="btn btn-outline-primary btn-sm" onclick="Appointments.openRescheduleModal('${app.id}')">
                <i class="fa-solid fa-arrows-rotate"></i> Reschedule
              </button>
              <button class="btn btn-outline-danger btn-sm" onclick="Appointments.openCancelModal('${app.id}')">
                <i class="fa-solid fa-xmark"></i> Cancel
              </button>
            ` : ''}

            ${app.status === 'Completed' ? `
              <button class="btn btn-primary btn-sm" onclick="Records.openRecordsForDoctor('${app.doctorName}')">
                <i class="fa-solid fa-file-prescription"></i> View Rx
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join("");
  },

  viewDetails(appointmentId) {
    const app = Storage.getAppointments().find(a => a.id === appointmentId);
    if (!app) return;

    const modalBody = document.getElementById("appointmentDetailModalBody");
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="appointment-detail-sheet">
        <div class="sheet-header">
          <div class="flex items-center gap-3">
            <img src="${app.doctorImage}" class="sheet-doc-img" alt="${app.doctorName}">
            <div>
              <span class="badge ${app.status === 'Upcoming' ? 'badge-success' : app.status === 'Completed' ? 'badge-info' : 'badge-danger'}">
                ${app.status.toUpperCase()}
              </span>
              <h3>${app.doctorName}</h3>
              <p class="text-sm text-muted">${app.specialtyName}</p>
            </div>
          </div>
          <div class="text-right">
            <span class="font-mono font-bold text-sm text-primary">${app.id}</span>
            <p class="text-xs text-muted">Created: ${app.createdAt ? this.formatDate(app.createdAt.split('T')[0]) : 'Recent'}</p>
          </div>
        </div>

        <div class="detail-rows-grid mt-4">
          <div class="detail-row-item">
            <span class="detail-label"><i class="fa-regular fa-calendar text-primary"></i> Consultation Date</span>
            <span class="detail-val font-semibold">${this.formatDate(app.date)}</span>
          </div>
          <div class="detail-row-item">
            <span class="detail-label"><i class="fa-regular fa-clock text-teal"></i> Time Slot</span>
            <span class="detail-val font-semibold">${app.time}</span>
          </div>
          <div class="detail-row-item">
            <span class="detail-label"><i class="fa-solid fa-location-dot text-rose-500"></i> Clinic Room</span>
            <span class="detail-val">${app.room}</span>
          </div>
          <div class="detail-row-item">
            <span class="detail-label"><i class="fa-solid fa-headset text-indigo-500"></i> Session Mode</span>
            <span class="detail-val">${app.type}</span>
          </div>
          <div class="detail-row-item">
            <span class="detail-label"><i class="fa-solid fa-money-bill-wave text-emerald"></i> Consultation Fee</span>
            <span class="detail-val">$${app.fee} (${app.paymentStatus})</span>
          </div>
          <div class="detail-row-item">
            <span class="detail-label"><i class="fa-solid fa-user text-primary"></i> Patient Name</span>
            <span class="detail-val">${app.patientName} (${app.patientPhone})</span>
          </div>
          <div class="detail-row-item col-span-full">
            <span class="detail-label"><i class="fa-solid fa-file-lines text-teal"></i> Symptoms / Reason for Visit</span>
            <span class="detail-val">${app.reason}</span>
          </div>
          <div class="detail-row-item col-span-full">
            <span class="detail-label"><i class="fa-solid fa-clipboard-check text-primary"></i> Clinical Preparation Instructions</span>
            <span class="detail-val text-sm">${app.notes || 'Arrive 10 minutes prior with ID and medical insurance card.'}</span>
          </div>
          ${app.cancellationReason ? `
            <div class="detail-row-item col-span-full bg-red-50 p-3 rounded-lg border border-red-200">
              <span class="detail-label text-danger"><i class="fa-solid fa-triangle-exclamation"></i> Cancellation Reason</span>
              <span class="detail-val text-danger">${app.cancellationReason}</span>
            </div>
          ` : ''}
        </div>

        <div class="sheet-actions mt-5 flex justify-end gap-3">
          <button class="btn btn-secondary" onclick="App.closeModal('appointmentDetailModal')">
            Close
          </button>
          ${app.status === 'Upcoming' ? `
            <button class="btn btn-outline-danger" onclick="App.closeModal('appointmentDetailModal'); Appointments.openCancelModal('${app.id}')">
              Cancel Appointment
            </button>
            <button class="btn btn-primary" onclick="App.closeModal('appointmentDetailModal'); Appointments.openRescheduleModal('${app.id}')">
              Reschedule
            </button>
          ` : ''}
        </div>
      </div>
    `;

    App.showModal("appointmentDetailModal");
  },

  openCancelModal(appointmentId) {
    this.activeAppointmentIdForAction = appointmentId;
    const app = Storage.getAppointments().find(a => a.id === appointmentId);
    if (!app) return;

    const infoTarget = document.getElementById("cancelAppointmentInfo");
    if (infoTarget) {
      infoTarget.innerHTML = `
        <div class="warning-callout">
          <p>Are you sure you want to cancel appointment <strong>${app.id}</strong> with <strong>${app.doctorName}</strong> on <strong>${this.formatDate(app.date)} at ${app.time}</strong>?</p>
        </div>
      `;
    }

    const reasonInput = document.getElementById("cancelReasonInput");
    if (reasonInput) reasonInput.value = "";

    App.showModal("cancelAppointmentModal");
  },

  confirmCancellation() {
    if (!this.activeAppointmentIdForAction) return;
    const reasonInput = document.getElementById("cancelReasonInput");
    const reason = reasonInput ? reasonInput.value.trim() : "Patient requested cancellation.";

    Storage.updateAppointmentStatus(this.activeAppointmentIdForAction, "Cancelled", reason);
    App.closeModal("cancelAppointmentModal");
    App.showToast("Appointment successfully cancelled.", "info");
    this.renderAppointments();
    Dashboard.renderDashboard();
  },

  openRescheduleModal(appointmentId) {
    this.activeAppointmentIdForAction = appointmentId;
    const app = Storage.getAppointments().find(a => a.id === appointmentId);
    if (!app) return;

    const dateInput = document.getElementById("rescheduleDateInput");
    if (dateInput) {
      const today = new Date();
      const minDate = today.toISOString().split('T')[0];
      dateInput.min = minDate;
      dateInput.value = app.date;
    }

    const slotSelect = document.getElementById("rescheduleTimeSelect");
    if (slotSelect) {
      slotSelect.value = app.time;
    }

    const docTarget = document.getElementById("rescheduleDoctorInfo");
    if (docTarget) {
      docTarget.innerHTML = `
        <div class="flex items-center gap-3 p-3 bg-slate-100 rounded-lg">
          <img src="${app.doctorImage}" class="w-12 h-12 rounded-full object-cover" alt="${app.doctorName}">
          <div>
            <h4 class="font-bold text-sm">${app.doctorName}</h4>
            <p class="text-xs text-muted">${app.specialtyName} • Current: ${this.formatDate(app.date)} (${app.time})</p>
          </div>
        </div>
      `;
    }

    App.showModal("rescheduleAppointmentModal");
  },

  confirmReschedule() {
    if (!this.activeAppointmentIdForAction) return;
    const dateInput = document.getElementById("rescheduleDateInput");
    const slotSelect = document.getElementById("rescheduleTimeSelect");

    if (!dateInput.value || !slotSelect.value) {
      App.showToast("Please select a new date and time slot.", "warning");
      return;
    }

    Storage.rescheduleAppointment(this.activeAppointmentIdForAction, dateInput.value, slotSelect.value);
    App.closeModal("rescheduleAppointmentModal");
    App.showToast("Appointment rescheduled successfully!", "success");
    this.renderAppointments();
    Dashboard.renderDashboard();
  },

  formatDate(dateStr) {
    if (!dateStr) return "";
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", options);
  }
};
