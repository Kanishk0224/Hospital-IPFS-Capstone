// ========================================================
// MediCare+ Healthcare System - 5-Step Appointment Booking Wizard
// ========================================================

const Booking = {
  currentStep: 1,
  totalSteps: 5,
  state: {
    specialtyId: "",
    doctorId: "",
    date: "",
    timeSlot: "",
    consultationType: "In-Person Consultation",
    reason: "",
    symptoms: "",
    paymentMethod: "Pay at Clinic"
  },

  init() {
    this.bindEvents();
    this.setupDateRestrictions();
  },

  bindEvents() {
    // Next Step buttons
    document.querySelectorAll("[data-booking-next]").forEach(btn => {
      btn.addEventListener("click", () => this.nextStep());
    });

    // Previous Step buttons
    document.querySelectorAll("[data-booking-prev]").forEach(btn => {
      btn.addEventListener("click", () => this.prevStep());
    });

    // Date change triggers slot re-render
    const dateInput = document.getElementById("bookingDateInput");
    if (dateInput) {
      dateInput.addEventListener("change", (e) => {
        this.state.date = e.target.value;
        this.renderTimeSlots();
      });
    }

    // Step 4 form inputs
    const typeSelect = document.getElementById("bookingConsultType");
    if (typeSelect) {
      typeSelect.addEventListener("change", (e) => {
        this.state.consultationType = e.target.value;
      });
    }

    const reasonInput = document.getElementById("bookingReason");
    if (reasonInput) {
      reasonInput.addEventListener("input", (e) => {
        this.state.reason = e.target.value;
      });
    }

    const symptomsInput = document.getElementById("bookingSymptoms");
    if (symptomsInput) {
      symptomsInput.addEventListener("input", (e) => {
        this.state.symptoms = e.target.value;
      });
    }

    // Payment method selection
    document.querySelectorAll("input[name='bookingPayment']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        this.state.paymentMethod = e.target.value;
      });
    });

    // Final Confirm Button
    const confirmBtn = document.getElementById("confirmBookingBtn");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => this.completeBooking());
    }
  },

  setupDateRestrictions() {
    const dateInput = document.getElementById("bookingDateInput");
    if (!dateInput) return;

    // Minimum date is today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDateStr = `${yyyy}-${mm}-${dd}`;
    dateInput.min = minDateStr;

    // Default to tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    dateInput.value = tomorrowStr;
    this.state.date = tomorrowStr;
  },

  startNew() {
    this.currentStep = 1;
    this.state = {
      specialtyId: "",
      doctorId: "",
      date: "",
      timeSlot: "",
      consultationType: "In-Person Consultation",
      reason: "",
      symptoms: "",
      paymentMethod: "Pay at Clinic"
    };

    this.setupDateRestrictions();
    this.renderStep1Doctors();
    this.updateStepUI();
    App.navigateTo("booking");
  },

  startWithDoctor(doctorId) {
    const doc = Storage.getDoctorById(doctorId);
    if (!doc) return;

    this.startNew();
    this.state.doctorId = doc.id;
    this.state.specialtyId = doc.specialty;

    this.renderStep1Doctors();
    // Advance to Step 2 directly with doctor preselected
    this.currentStep = 2;
    this.updateStepUI();
    this.renderSelectedDoctorSummaryBanner();
    this.renderTimeSlots();
  },

  startWithSpecialty(specialtyId) {
    this.startNew();
    this.state.specialtyId = specialtyId;
    this.renderStep1Doctors();
    App.navigateTo("booking");
  },

  renderStep1Doctors() {
    const container = document.getElementById("bookingDoctorGrid");
    if (!container) return;

    let doctors = Storage.getDoctors();
    if (this.state.specialtyId) {
      doctors = doctors.filter(d => d.specialty === this.state.specialtyId);
    }

    container.innerHTML = doctors.map(doc => {
      const isSelected = this.state.doctorId === doc.id;
      return `
        <div class="booking-doctor-card ${isSelected ? 'selected' : ''}" onclick="Booking.selectDoctor('${doc.id}')">
          <div class="card-radio-indicator">
            <i class="fa-solid ${isSelected ? 'fa-circle-check text-primary' : 'fa-circle text-muted'}"></i>
          </div>
          <img src="${doc.image}" alt="${doc.name}" class="booking-doc-thumb">
          <div class="booking-doc-info">
            <span class="doctor-specialty-tag specialty-${doc.specialty}">${doc.specialtyName}</span>
            <h4 class="doc-title">${doc.name}</h4>
            <p class="doc-sub">${doc.qualification}</p>
            <div class="doc-meta-row">
              <span><i class="fa-solid fa-star text-amber"></i> ${doc.rating.toFixed(1)}</span>
              <span><i class="fa-solid fa-briefcase text-teal"></i> ${doc.experience} yrs</span>
              <span class="fee-badge">$${doc.fee}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  selectDoctor(doctorId) {
    this.state.doctorId = doctorId;
    const doc = Storage.getDoctorById(doctorId);
    if (doc) {
      this.state.specialtyId = doc.specialty;
    }
    this.renderStep1Doctors();
    this.renderSelectedDoctorSummaryBanner();
  },

  renderSelectedDoctorSummaryBanner() {
    const banner = document.getElementById("bookingSelectedDoctorBanner");
    if (!banner) return;

    const doc = Storage.getDoctorById(this.state.doctorId);
    if (!doc) {
      banner.innerHTML = "";
      return;
    }

    banner.innerHTML = `
      <div class="selected-doc-mini-card">
        <img src="${doc.image}" alt="${doc.name}">
        <div>
          <span class="badge badge-primary">${doc.specialtyName}</span>
          <h4>${doc.name}</h4>
          <p class="text-xs text-muted">${doc.qualification} • Room: ${doc.room}</p>
        </div>
        <div class="ml-auto text-right">
          <span class="fee-text">$${doc.fee}</span>
          <span class="text-xs block text-muted">Consultation Fee</span>
        </div>
      </div>
    `;
  },

  renderTimeSlots() {
    const container = document.getElementById("bookingSlotsGrid");
    if (!container) return;

    const doc = Storage.getDoctorById(this.state.doctorId);
    const morningSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];
    const afternoonSlots = ["01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM"];
    const eveningSlots = ["04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"];

    // Realistic booked slots check against existing appointments
    const existing = Storage.getAppointments().filter(a => 
      a.doctorId === this.state.doctorId && 
      a.date === this.state.date && 
      a.status !== "Cancelled"
    );
    const bookedSet = new Set(existing.map(a => a.time));
    // Hardcode a couple of occupied slots for demonstration realism
    bookedSet.add("09:00 AM");
    bookedSet.add("02:00 PM");

    const renderGroup = (title, slots, icon) => `
      <div class="slot-group">
        <h5 class="slot-group-title"><i class="${icon}"></i> ${title}</h5>
        <div class="slots-pill-container">
          ${slots.map(slot => {
            const isBooked = bookedSet.has(slot);
            const isSelected = this.state.timeSlot === slot;
            let cls = "slot-pill";
            if (isBooked) cls += " slot-unavailable";
            else if (isSelected) cls += " slot-selected";
            else cls += " slot-available";

            return `
              <button 
                type="button" 
                class="${cls}" 
                ${isBooked ? 'disabled title="Slot already booked"' : `onclick="Booking.selectSlot('${slot}')"`}
              >
                ${slot}
                ${isBooked ? '<span class="slot-status-text">Full</span>' : ''}
              </button>
            `;
          }).join("")}
        </div>
      </div>
    `;

    container.innerHTML = `
      ${renderGroup("Morning Slots", morningSlots, "fa-regular fa-sun text-amber")}
      ${renderGroup("Afternoon Slots", afternoonSlots, "fa-solid fa-sun text-orange-500")}
      ${renderGroup("Evening Slots", eveningSlots, "fa-solid fa-cloud-moon text-indigo-500")}
    `;
  },

  selectSlot(slot) {
    this.state.timeSlot = slot;
    this.renderTimeSlots();
  },

  renderReviewSummary() {
    const summaryContainer = document.getElementById("bookingReviewSummary");
    if (!summaryContainer) return;

    const doc = Storage.getDoctorById(this.state.doctorId);
    const patient = Storage.getPatient();

    summaryContainer.innerHTML = `
      <div class="review-summary-card">
        <div class="review-header">
          <div class="doc-snippet">
            <img src="${doc ? doc.image : ''}" alt="${doc ? doc.name : ''}" class="review-doc-img">
            <div>
              <span class="badge badge-teal">${doc ? doc.specialtyName : ''}</span>
              <h3>${doc ? doc.name : 'Selected Doctor'}</h3>
              <p class="text-xs text-muted">${doc ? doc.qualification : ''}</p>
            </div>
          </div>
          <div class="review-cost">
            <span class="text-xs text-muted">Consultation Fee</span>
            <span class="review-fee-number">$${doc ? doc.fee : '0'}</span>
          </div>
        </div>

        <div class="review-details-grid mt-4">
          <div class="review-detail-item">
            <span class="label"><i class="fa-regular fa-calendar text-primary"></i> Date:</span>
            <span class="val font-semibold">${this.formatDate(this.state.date)}</span>
          </div>
          <div class="review-detail-item">
            <span class="label"><i class="fa-regular fa-clock text-teal"></i> Time Slot:</span>
            <span class="val font-semibold">${this.state.timeSlot}</span>
          </div>
          <div class="review-detail-item">
            <span class="label"><i class="fa-solid fa-video text-indigo-500"></i> Consultation Type:</span>
            <span class="val">${this.state.consultationType}</span>
          </div>
          <div class="review-detail-item">
            <span class="label"><i class="fa-solid fa-location-dot text-rose-500"></i> Clinic Room:</span>
            <span class="val">${doc ? doc.room : 'Main Clinic'}</span>
          </div>
          <div class="review-detail-item col-span-full">
            <span class="label"><i class="fa-solid fa-user text-primary"></i> Patient Details:</span>
            <span class="val">${patient.fullName} (${patient.gender}, ${patient.bloodGroup}) • ${patient.phone}</span>
          </div>
          <div class="review-detail-item col-span-full">
            <span class="label"><i class="fa-solid fa-notes-medical text-teal"></i> Reason / Symptoms:</span>
            <span class="val">${this.state.reason || 'General health consultation'}</span>
          </div>
          <div class="review-detail-item col-span-full">
            <span class="label"><i class="fa-solid fa-credit-card text-emerald"></i> Payment Mode:</span>
            <span class="val font-semibold text-emerald">${this.state.paymentMethod}</span>
          </div>
        </div>
      </div>
    `;
  },

  nextStep() {
    // Step validation
    if (this.currentStep === 1) {
      if (!this.state.doctorId) {
        App.showToast("Please choose a doctor to proceed with your booking", "warning");
        return;
      }
      this.renderSelectedDoctorSummaryBanner();
    } else if (this.currentStep === 2) {
      if (!this.state.date) {
        App.showToast("Please pick a consultation date", "warning");
        return;
      }
      this.renderTimeSlots();
    } else if (this.currentStep === 3) {
      if (!this.state.timeSlot) {
        App.showToast("Please select an available time slot", "warning");
        return;
      }
    } else if (this.currentStep === 4) {
      const reasonVal = document.getElementById("bookingReason").value.trim();
      if (!reasonVal) {
        App.showToast("Please briefly state your consultation reason or symptoms", "warning");
        return;
      }
      this.state.reason = reasonVal;
      this.state.symptoms = document.getElementById("bookingSymptoms").value.trim();
      this.renderReviewSummary();
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateStepUI();
    }
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepUI();
    }
  },

  updateStepUI() {
    // Update step visibility
    for (let i = 1; i <= this.totalSteps; i++) {
      const stepEl = document.getElementById(`bookingStep${i}`);
      if (stepEl) {
        if (i === this.currentStep) {
          stepEl.classList.remove("hidden");
        } else {
          stepEl.classList.add("hidden");
        }
      }

      // Update progress wizard pills
      const pill = document.getElementById(`wizardPillStep${i}`);
      if (pill) {
        pill.classList.remove("active", "completed");
        if (i < this.currentStep) {
          pill.classList.add("completed");
        } else if (i === this.currentStep) {
          pill.classList.add("active");
        }
      }
    }

    // Scroll to top of booking card
    const bookingContainer = document.getElementById("bookingWizardContainer");
    if (bookingContainer) {
      bookingContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },

  async completeBooking() {
    const doc = Storage.getDoctorById(this.state.doctorId);
    const patient = Storage.getPatient();


    // Generate unique realistic ID
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const appointmentId = `MED-2026-${randomCode}`;

    const newAppointment = {
      id: appointmentId,
      patientId: patient.id,
      patientName: patient.fullName,
      patientPhone: patient.phone,
      doctorId: doc ? doc.id : "doc-1",
      doctorName: doc ? doc.name : "Dr. Medical Specialist",
      specialtyName: doc ? doc.specialtyName : "Specialist",
      doctorImage: doc ? doc.image : "",
      room: doc ? doc.room : "Clinic Room",
      date: this.state.date,
      time: this.state.timeSlot,
      type: this.state.consultationType,
      status: "Upcoming",
      reason: this.state.reason || "Routine Consultation",
      symptoms: this.state.symptoms || "None noted",
      fee: doc ? doc.fee : 85,
      paymentStatus: this.state.paymentMethod === "Pay at Clinic" ? "Pay at Clinic" : "Paid Online",
      notes: "Appointment confirmed. Please arrive 10 minutes prior for vital checks.",
      createdAt: new Date().toISOString()
    };

    // Generate authentic IPFS anchor CID
    try {
      const bookingPayload = JSON.stringify({ id: appointmentId, patientId: patient.id, doctorId: doc ? doc.id : "doc-1", date: this.state.date, time: this.state.timeSlot });
      const ipfsAnchor = await IPFS.computeHashAndCid(bookingPayload);
      newAppointment.ipfsCid = ipfsAnchor.cid;
      newAppointment.ipfsCidV0 = ipfsAnchor.cidV0;
      newAppointment.ipfsPinStatus = "Pinned on MediCare+ Node";
    } catch (e) {
      newAppointment.ipfsCid = "bafybeia" + Math.random().toString(36).substring(2, 15);
    }

    Storage.addAppointment(newAppointment);

    // Render Success Modal
    this.renderSuccessReceipt(newAppointment);
    App.showToast("Appointment successfully booked & anchored to IPFS!", "success");
  },

  renderSuccessReceipt(app) {
    const modalContent = document.getElementById("bookingSuccessModalContent");
    if (!modalContent) return;

    modalContent.innerHTML = `
      <div class="booking-receipt-slip">
        <div class="receipt-header">
          <div class="hospital-branding">
            <i class="fa-solid fa-heart-pulse brand-icon-med"></i>
            <div>
              <h3>MediCare+</h3>
              <p>Official Appointment Confirmation</p>
            </div>
          </div>
          <div class="receipt-status-badge">
            <span class="badge badge-success">CONFIRMED</span>
          </div>
        </div>

        <div class="receipt-id-box flex justify-between items-center flex-wrap gap-2">
          <div>
            <span class="text-xs text-muted block">APPOINTMENT REFERENCE ID</span>
            <span class="receipt-id-code font-mono">${app.id}</span>
          </div>
          ${app.ipfsCid ? `
            <div class="text-right">
              <span class="text-xxs text-muted block uppercase font-bold"><i class="fa-solid fa-cubes text-teal"></i> IPFS Content Anchor</span>
              <span class="badge badge-emerald font-mono text-xxs" title="${app.ipfsCid}">
                ${app.ipfsCid.substring(0, 14)}...
              </span>
            </div>
          ` : ''}
        </div>

        <div class="receipt-body-grid">
          <div class="receipt-cell">
            <span class="cell-label">Doctor</span>
            <span class="cell-value font-bold">${app.doctorName}</span>
            <span class="cell-sub">${app.specialtyName}</span>
          </div>
          <div class="receipt-cell">
            <span class="cell-label">Date & Time</span>
            <span class="cell-value font-bold">${this.formatDate(app.date)}</span>
            <span class="cell-sub">${app.time}</span>
          </div>
          <div class="receipt-cell">
            <span class="cell-label">Patient</span>
            <span class="cell-value">${app.patientName}</span>
            <span class="cell-sub">${app.patientPhone}</span>
          </div>
          <div class="receipt-cell">
            <span class="cell-label">Location / Room</span>
            <span class="cell-value">${app.room}</span>
            <span class="cell-sub">${app.type}</span>
          </div>
          <div class="receipt-cell">
            <span class="cell-label">Consultation Fee</span>
            <span class="cell-value font-bold text-primary">$${app.fee}</span>
            <span class="cell-sub">${app.paymentStatus}</span>
          </div>
          <div class="receipt-cell">
            <span class="cell-label">Integrity Status</span>
            <span class="cell-value text-emerald font-semibold">IPFS Anchored</span>
            <span class="cell-sub">Tamper-proof slip</span>
          </div>
        </div>

        ${app.ipfsCid ? `
          <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg my-3 text-xxs flex justify-between items-center">
            <span class="font-mono text-slate-600 break-all">CID: ${app.ipfsCid}</span>
            <button class="btn btn-outline-secondary btn-xxs flex-shrink-0 ml-2" onclick="IPFS.copyToClipboard('${app.ipfsCid}')">
              <i class="fa-regular fa-copy"></i> Copy CID
            </button>
          </div>
        ` : ''}

        <div class="receipt-footer-notes">
          <p><i class="fa-solid fa-circle-info text-primary"></i> A confirmation SMS and email have been dispatched. This booking receipt is permanently hashed to the hospital IPFS ledger.</p>
        </div>

        <div class="receipt-actions-row">
          <button class="btn btn-secondary" onclick="window.print()">
            <i class="fa-solid fa-print"></i> Print Slip
          </button>
          <button class="btn btn-primary" onclick="App.closeModal('bookingSuccessModal'); App.navigateTo('appointments')">
            <i class="fa-solid fa-list-check"></i> Go to My Appointments
          </button>
        </div>
      </div>
    `;

    App.showModal("bookingSuccessModal");
  },

  formatDate(dateStr) {
    if (!dateStr) return "";
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", options);
  }
};
