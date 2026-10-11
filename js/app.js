// ========================================================
// MediCare+ Healthcare System - Global Controller & Router
// ========================================================

const App = {
  currentView: "home",

  init() {
    // 1. Initialize Storage
    Storage.init();

    // 2. Setup Theme
    this.initTheme();

    // 3. Initialize Modules
    Auth.init();
    Doctors.init();
    Booking.init();
    Appointments.init();
    Records.init();
    Dashboard.init();
    Admin.init();

    // 4. Setup Global Events & Router
    this.bindGlobalEvents();
    this.handleRoute();

    // Render Home Page Specialties & Top Doctors
    this.renderHomeSpecialties();
    this.renderHomeTopDoctors();
    this.renderHomeTestimonials();
  },

  bindGlobalEvents() {
    // Hash change router
    window.addEventListener("hashchange", () => this.handleRoute());

    // Navigation links with data-nav-target
    document.querySelectorAll("[data-nav-target]").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.getAttribute("data-nav-target");
        this.navigateTo(target);
      });
    });

    // Theme toggle buttons
    document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
      btn.addEventListener("click", () => this.toggleTheme());
    });

    // Mobile nav hamburger toggle
    const hamburger = document.getElementById("mobileNavToggle");
    const mobileMenu = document.getElementById("mobileNavDrawer");
    if (hamburger && mobileMenu) {
      hamburger.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");
        const isOpen = mobileMenu.classList.contains("open");
        hamburger.setAttribute("aria-expanded", isOpen);
      });

      // Close mobile menu when clicking outside or link
      mobileMenu.querySelectorAll("a, button").forEach(el => {
        el.addEventListener("click", () => {
          mobileMenu.classList.remove("open");
        });
      });
    }

    // Dashboard Mobile Sidebar Toggle
    const sidebarToggle = document.getElementById("dashboardSidebarToggle");
    const dashboardSidebar = document.getElementById("dashboardSidebar");
    if (sidebarToggle && dashboardSidebar) {
      sidebarToggle.addEventListener("click", () => {
        dashboardSidebar.classList.toggle("open");
      });
    }

    // Modal close buttons
    document.querySelectorAll("[data-modal-close]").forEach(btn => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal-overlay");
        if (modal) modal.classList.remove("active");
      });
    });

    // Close modal on backdrop click
    document.querySelectorAll(".modal-overlay").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active");
        }
      });
    });

    // ESC key closes active modal
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const activeModal = document.querySelector(".modal-overlay.active");
        if (activeModal) activeModal.classList.remove("active");
      }
    });

    // Reset demo data button
    const resetDataBtn = document.getElementById("resetAllDemoDataBtn");
    if (resetDataBtn) {
      resetDataBtn.addEventListener("click", () => {
        if (confirm("Reset all appointment bookings, doctors, and patient edits to initial demonstration state?")) {
          Storage.resetAllData();
          this.showToast("Demonstration database reset to factory state.", "info");
          setTimeout(() => window.location.reload(), 600);
        }
      });
    }
  },

  handleRoute() {
    let hash = window.location.hash.replace("#", "").trim();
    if (!hash) hash = "home";

    // Handle parameterized routes e.g. doctor-profile/doc-1
    if (hash.startsWith("doc-profile-")) {
      const docId = hash.replace("doc-profile-", "");
      Doctors.viewProfile(docId);
      hash = "doctors";
    }

    this.navigateTo(hash, false);
  },

  navigateTo(viewId, updateHash = true) {
    const validViews = ["home", "doctors", "booking", "appointments", "records", "dashboard", "profile", "auth", "admin", "about", "contact"];
    const target = validViews.includes(viewId) ? viewId : "home";
    this.currentView = target;

    if (updateHash) {
      window.location.hash = target;
    }

    // Hide all view sections
    document.querySelectorAll(".app-view").forEach(view => {
      view.classList.add("hidden");
    });

    // Show target view
    const targetEl = document.getElementById(`view_${target}`);
    if (targetEl) {
      targetEl.classList.remove("hidden");
    }

    // Active state in desktop nav
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.getAttribute("data-nav-target") === target) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Active state in dashboard sidebar
    document.querySelectorAll(".sidebar-nav-item").forEach(item => {
      if (item.getAttribute("data-nav-target") === target) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // View-specific initializations
    if (target === "dashboard") {
      Dashboard.renderDashboard();
    } else if (target === "appointments") {
      Appointments.renderAppointments();
    } else if (target === "records") {
      Records.renderRecords();
      Records.renderPrescriptionsTab();
    } else if (target === "profile") {
      Dashboard.renderProfile();
    } else if (target === "doctors") {
      Doctors.renderDoctorDirectory();
    } else if (target === "booking") {
      Booking.renderStep1Doctors();
    } else if (target === "admin") {
      Admin.renderAdminPortal();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Close mobile drawers if open
    const mobileMenu = document.getElementById("mobileNavDrawer");
    if (mobileMenu) mobileMenu.classList.remove("open");
    const dashboardSidebar = document.getElementById("dashboardSidebar");
    if (dashboardSidebar) dashboardSidebar.classList.remove("open");
  },

  // ----------------------------------------------------
  // THEME MANAGEMENT (Light / Dark Mode)
  // ----------------------------------------------------
  initTheme() {
    const savedTheme = Storage.getTheme();
    document.documentElement.setAttribute("data-theme", savedTheme);
    this.updateThemeIcons(savedTheme);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    Storage.setTheme(next);
    this.updateThemeIcons(next);
    this.showToast(`Switched to ${next} mode`, "info");
  },

  updateThemeIcons(theme) {
    document.querySelectorAll(".theme-toggle-btn i").forEach(icon => {
      if (theme === "dark") {
        icon.className = "fa-solid fa-sun text-amber";
      } else {
        icon.className = "fa-solid fa-moon text-slate-700";
      }
    });
  },

  // ----------------------------------------------------
  // TOAST NOTIFICATIONS
  // ----------------------------------------------------
  showToast(message, type = "info", duration = 3500) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    let iconClass = "fa-solid fa-circle-info";
    if (type === "success") iconClass = "fa-solid fa-circle-check";
    else if (type === "error") iconClass = "fa-solid fa-circle-exclamation";
    else if (type === "warning") iconClass = "fa-solid fa-triangle-exclamation";

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type} fade-in`;
    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // ----------------------------------------------------
  // MODAL CONTROLS
  // ----------------------------------------------------
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  // ----------------------------------------------------
  // HOME PAGE CONTENT RENDERERS
  // ----------------------------------------------------
  renderHomeSpecialties() {
    const container = document.getElementById("homeSpecialtiesGrid");
    if (!container) return;

    const list = Storage.getSpecialties();
    container.innerHTML = list.map(spec => `
      <div class="specialty-card" onclick="Doctors.currentFilters.specialty='${spec.id}'; App.navigateTo('doctors')">
        <div class="specialty-icon-wrapper" style="background-color: ${spec.bg}; color: ${spec.color}">
          <i class="fa-solid ${spec.icon}"></i>
        </div>
        <h3 class="specialty-title">${spec.name}</h3>
        <p class="specialty-desc">${spec.description}</p>
        <div class="specialty-card-footer">
          <span class="doctor-badge">${spec.doctorCount} Doctors</span>
          <span class="explore-link">Explore <i class="fa-solid fa-arrow-right"></i></span>
        </div>
      </div>
    `).join("");
  },

  renderHomeTopDoctors() {
    const container = document.getElementById("homeTopDoctorsGrid");
    if (!container) return;

    const doctors = Storage.getDoctors().slice(0, 4);
    container.innerHTML = doctors.map(doc => `
      <div class="doctor-card fade-in">
        <div class="doctor-card-header">
          <div class="doctor-avatar-wrapper">
            <img src="${doc.image}" alt="${doc.name}" class="doctor-avatar-img">
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
              <i class="fa-solid fa-money-bill-wave text-emerald"></i>
              <span class="font-bold text-navy">$${doc.fee}</span>
              <span class="text-xs text-muted">/ visit</span>
            </div>
          </div>
        </div>

        <div class="doctor-card-footer">
          <button class="btn btn-outline-primary btn-sm flex-1" onclick="Doctors.viewProfile('${doc.id}')">
            View Profile
          </button>
          <button class="btn btn-primary btn-sm flex-1" onclick="Booking.startWithDoctor('${doc.id}')">
            Book Now
          </button>
        </div>
      </div>
    `).join("");
  },

  renderHomeTestimonials() {
    const container = document.getElementById("homeTestimonialsGrid");
    if (!container) return;

    container.innerHTML = DEFAULT_TESTIMONIALS.map(t => `
      <div class="testimonial-card">
        <div class="rating-stars mb-3 text-amber">
          ${'★'.repeat(t.rating)}
        </div>
        <p class="testimonial-comment">"${t.comment}"</p>
        <div class="testimonial-author mt-4">
          <img src="${t.avatar}" alt="${t.name}" class="author-avatar">
          <div>
            <h4 class="author-name">${t.name}</h4>
            <span class="author-role">${t.role}</span>
          </div>
        </div>
      </div>
    `).join("");
  }
};

// Bootstrap application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
