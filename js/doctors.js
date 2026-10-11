// ========================================================
// MediCare+ Healthcare System - Doctors Directory & Profile
// ========================================================

const Doctors = {
  currentFilters: {
    search: "",
    specialty: "all",
    availability: "all",
    maxFee: 200,
    sortBy: "recommended"
  },

  init() {
    this.renderDoctorDirectory();
    this.bindFilters();
  },

  bindFilters() {
    // Search input
    const searchInput = document.getElementById("doctorSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.currentFilters.search = e.target.value.toLowerCase().trim();
        this.renderDoctorDirectory();
      });
    }

    // Specialty filter buttons
    const filterContainer = document.getElementById("specialtyFilterPills");
    if (filterContainer) {
      filterContainer.addEventListener("click", (e) => {
        const pill = e.target.closest("[data-specialty-filter]");
        if (pill) {
          filterContainer.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
          pill.classList.add("active");
          this.currentFilters.specialty = pill.getAttribute("data-specialty-filter");
          this.renderDoctorDirectory();
        }
      });
    }

    // Availability filter
    const availSelect = document.getElementById("availabilityFilterSelect");
    if (availSelect) {
      availSelect.addEventListener("change", (e) => {
        this.currentFilters.availability = e.target.value;
        this.renderDoctorDirectory();
      });
    }

    // Max Fee range slider
    const feeSlider = document.getElementById("maxFeeRange");
    const feeValueDisplay = document.getElementById("maxFeeDisplay");
    if (feeSlider) {
      feeSlider.addEventListener("input", (e) => {
        this.currentFilters.maxFee = parseInt(e.target.value, 10);
        if (feeValueDisplay) feeValueDisplay.textContent = `$${e.target.value}`;
        this.renderDoctorDirectory();
      });
    }

    // Sort selector
    const sortSelect = document.getElementById("doctorSortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentFilters.sortBy = e.target.value;
        this.renderDoctorDirectory();
      });
    }

    // Reset filters button
    const resetBtn = document.getElementById("resetDoctorFiltersBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.resetFilters();
      });
    }
  },

  resetFilters() {
    this.currentFilters = {
      search: "",
      specialty: "all",
      availability: "all",
      maxFee: 200,
      sortBy: "recommended"
    };

    const searchInput = document.getElementById("doctorSearchInput");
    if (searchInput) searchInput.value = "";

    const feeSlider = document.getElementById("maxFeeRange");
    const feeValueDisplay = document.getElementById("maxFeeDisplay");
    if (feeSlider) {
      feeSlider.value = "200";
      if (feeValueDisplay) feeValueDisplay.textContent = "$200";
    }

    const availSelect = document.getElementById("availabilityFilterSelect");
    if (availSelect) availSelect.value = "all";

    const sortSelect = document.getElementById("doctorSortSelect");
    if (sortSelect) sortSelect.value = "recommended";

    const filterContainer = document.getElementById("specialtyFilterPills");
    if (filterContainer) {
      filterContainer.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
      const allPill = filterContainer.querySelector("[data-specialty-filter='all']");
      if (allPill) allPill.classList.add("active");
    }

    this.renderDoctorDirectory();
  },

  getFilteredDoctors() {
    let list = Storage.getDoctors();

    // 1. Search Query
    if (this.currentFilters.search) {
      const q = this.currentFilters.search;
      list = list.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.specialtyName.toLowerCase().includes(q) ||
        d.qualification.toLowerCase().includes(q) ||
        d.about.toLowerCase().includes(q)
      );
    }

    // 2. Specialty Filter
    if (this.currentFilters.specialty && this.currentFilters.specialty !== "all") {
      list = list.filter(d => d.specialty === this.currentFilters.specialty);
    }

    // 3. Availability Filter
    if (this.currentFilters.availability === "today") {
      list = list.filter(d => d.availableToday);
    }

    // 4. Max Fee Filter
    list = list.filter(d => d.fee <= this.currentFilters.maxFee);

    // 5. Sorting
    switch (this.currentFilters.sortBy) {
      case "exp-desc":
        list.sort((a, b) => b.experience - a.experience);
        break;
      case "fee-asc":
        list.sort((a, b) => a.fee - b.fee);
        break;
      case "fee-desc":
        list.sort((a, b) => b.fee - a.fee);
        break;
      case "rating-desc":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // recommended
        list.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
        break;
    }

    return list;
  },

  renderDoctorDirectory() {
    const container = document.getElementById("doctorListContainer");
    const countDisplay = document.getElementById("doctorResultCount");
    if (!container) return;

    const doctors = this.getFilteredDoctors();

    if (countDisplay) {
      countDisplay.textContent = `${doctors.length} specialist doctor${doctors.length === 1 ? '' : 's'} available`;
    }

    if (doctors.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card col-span-full">
          <div class="empty-state-icon">
            <i class="fa-solid fa-user-doctor"></i>
          </div>
          <h3>No Doctors Match Your Filter</h3>
          <p>Try adjusting your search criteria, selecting another specialty, or increasing the fee limit.</p>
          <button class="btn btn-secondary mt-3" onclick="Doctors.resetFilters()">
            <i class="fa-solid fa-rotate-left"></i> Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = doctors.map(doc => `
      <div class="doctor-card fade-in" data-doctor-id="${doc.id}">
        <div class="doctor-card-header">
          <div class="doctor-avatar-wrapper">
            <img src="${doc.image}" alt="${doc.name}" class="doctor-avatar-img" loading="lazy">
            <span class="status-indicator-badge ${doc.availableToday ? 'status-online' : 'status-busy'}">
              ${doc.availableToday ? 'Available Today' : 'Scheduled'}
            </span>
          </div>
          <div class="doctor-badge-rating">
            <i class="fa-solid fa-star text-amber"></i>
            <span>${doc.rating.toFixed(1)}</span>
            <span class="rating-count">(${doc.reviewCount})</span>
          </div>
        </div>

        <div class="doctor-card-body">
          <span class="doctor-specialty-tag specialty-${doc.specialty}">${doc.specialtyName}</span>
          <h3 class="doctor-name">${doc.name}</h3>
          <p class="doctor-qualification">${doc.qualification}</p>

          <div class="doctor-meta-grid">
            <div class="meta-item">
              <i class="fa-solid fa-briefcase text-primary"></i>
              <span>${doc.experience} Years Exp.</span>
            </div>
            <div class="meta-item">
              <i class="fa-solid fa-hospital text-teal"></i>
              <span>${doc.room.split('-')[0].trim()}</span>
            </div>
            <div class="meta-item">
              <i class="fa-solid fa-money-bill-wave text-emerald"></i>
              <span class="font-bold text-navy">$${doc.fee}</span>
              <span class="text-xs text-muted">/ consultation</span>
            </div>
            <div class="meta-item">
              <i class="fa-solid fa-clock text-amber"></i>
              <span class="text-xs">${doc.consultationHours}</span>
            </div>
          </div>
        </div>

        <div class="doctor-card-footer">
          <button class="btn btn-outline-primary btn-sm flex-1" onclick="Doctors.viewProfile('${doc.id}')">
            <i class="fa-regular fa-id-card"></i> View Profile
          </button>
          <button class="btn btn-primary btn-sm flex-1" onclick="Booking.startWithDoctor('${doc.id}')">
            <i class="fa-regular fa-calendar-check"></i> Book Now
          </button>
        </div>
      </div>
    `).join("");
  },

  viewProfile(doctorId) {
    const doc = Storage.getDoctorById(doctorId);
    if (!doc) return;

    const modalBody = document.getElementById("doctorProfileModalBody");
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="doctor-profile-modal-grid">
        <div class="doctor-profile-sidebar">
          <div class="profile-photo-card">
            <img src="${doc.image}" alt="${doc.name}" class="profile-detail-img">
            <div class="profile-quick-stats">
              <div class="stat-box">
                <span class="stat-number">${doc.rating.toFixed(1)} <i class="fa-solid fa-star text-amber"></i></span>
                <span class="stat-label">${doc.reviewCount} Reviews</span>
              </div>
              <div class="stat-box">
                <span class="stat-number">${doc.experience}+</span>
                <span class="stat-label">Years Exp.</span>
              </div>
              <div class="stat-box">
                <span class="stat-number">$${doc.fee}</span>
                <span class="stat-label">Per Session</span>
              </div>
            </div>
          </div>

          <div class="clinic-location-card mt-3">
            <h4><i class="fa-solid fa-location-dot text-primary"></i> Clinic Location</h4>
            <p class="text-sm font-medium mt-1">${doc.room}</p>
            <p class="text-xs text-muted">MediCare+ Main Health Pavilion, 500 Healthcare Blvd.</p>
          </div>

          <div class="languages-card mt-3">
            <h4><i class="fa-solid fa-language text-teal"></i> Languages Spoken</h4>
            <div class="tags-row mt-2">
              ${(doc.languages || ["English"]).map(lang => `<span class="badge badge-subtle">${lang}</span>`).join(" ")}
            </div>
          </div>
        </div>

        <div class="doctor-profile-main">
          <div class="profile-header-info">
            <span class="doctor-specialty-tag specialty-${doc.specialty}">${doc.specialtyName}</span>
            <h2 class="profile-doctor-name">${doc.name}</h2>
            <p class="profile-doctor-qual">${doc.qualification}</p>
          </div>

          <div class="profile-section mt-4">
            <h3 class="section-title"><i class="fa-solid fa-user-doctor text-primary"></i> About the Specialist</h3>
            <p class="profile-bio-text">${doc.about}</p>
          </div>

          <div class="profile-section mt-4">
            <h3 class="section-title"><i class="fa-solid fa-graduation-cap text-teal"></i> Education & Credentials</h3>
            <p class="text-sm text-secondary-color">${doc.education}</p>
          </div>

          <div class="profile-section mt-4">
            <h3 class="section-title"><i class="fa-solid fa-calendar-days text-primary"></i> Consultation Schedule</h3>
            <div class="working-days-grid mt-2">
              ${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => {
                const isWorking = doc.workingDays && doc.workingDays.includes(day);
                return `
                  <div class="day-slot-pill ${isWorking ? 'day-active' : 'day-inactive'}">
                    <span class="day-name">${day.slice(0, 3)}</span>
                    <span class="day-status">${isWorking ? 'Open' : 'Off'}</span>
                  </div>
                `;
              }).join("")}
            </div>
            <p class="text-xs text-muted mt-2">Clinic Hours: ${doc.consultationHours}</p>
          </div>

          <div class="profile-section mt-4">
            <h3 class="section-title"><i class="fa-solid fa-comment-medical text-amber"></i> Patient Feedback & Reviews</h3>
            <div class="sample-reviews-list mt-2">
              <div class="sample-review-item">
                <div class="review-header">
                  <span class="reviewer-name">Patient Review (Verified)</span>
                  <span class="review-stars">★★★★★</span>
                </div>
                <p class="review-text">"${doc.name} was incredibly thorough, attentive, and explained the diagnosis in easily understandable terms. Highly recommended!"</p>
              </div>
            </div>
          </div>

          <div class="profile-action-bar mt-5">
            <button class="btn btn-secondary" onclick="App.closeModal('doctorProfileModal')">
              Close
            </button>
            <button class="btn btn-primary" onclick="App.closeModal('doctorProfileModal'); Booking.startWithDoctor('${doc.id}')">
              <i class="fa-regular fa-calendar-check"></i> Book Appointment with ${doc.name}
            </button>
          </div>
        </div>
      </div>
    `;

    App.showModal("doctorProfileModal");
  }
};
