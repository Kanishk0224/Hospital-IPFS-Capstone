// ========================================================
// MediCare+ Healthcare System - Authentication & Session
// ========================================================

const Auth = {
  init() {
    this.bindEvents();
    this.updateAuthUI();
  },

  bindEvents() {
    // Quick Demo logins
    document.querySelectorAll("[data-demo-login]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const role = btn.getAttribute("data-demo-login");
        this.loginDemo(role);
      });
    });

    // Password toggle buttons
    document.querySelectorAll(".toggle-password-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const inputId = btn.getAttribute("data-target");
        const input = document.getElementById(inputId);
        const icon = btn.querySelector("i");
        if (input) {
          if (input.type === "password") {
            input.type = "text";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
          } else {
            input.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
          }
        }
      });
    });

    // Login Form Submit
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleLogin(loginForm);
      });
    }

    // Register Form Submit
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleRegister(registerForm);
      });
    }

    // Forgot password trigger
    const forgotLink = document.getElementById("forgotPasswordLink");
    if (forgotLink) {
      forgotLink.addEventListener("click", (e) => {
        e.preventDefault();
        App.showModal("forgotPasswordModal");
      });
    }

    // Forgot password form submit
    const forgotForm = document.getElementById("forgotPasswordForm");
    if (forgotForm) {
      forgotForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("forgotEmail").value.trim();
        if (!email || !this.validateEmail(email)) {
          App.showToast("Please enter a valid registered email address", "error");
          return;
        }
        App.closeModal("forgotPasswordModal");
        App.showToast("Password reset instructions sent to " + email, "success");
        forgotForm.reset();
      });
    }

    // Global Logout buttons
    document.querySelectorAll(".logout-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.logout();
      });
    });

    // Switch to Register / Switch to Login tabs
    const tabLogin = document.getElementById("authTabLogin");
    const tabRegister = document.getElementById("authTabRegister");
    if (tabLogin && tabRegister) {
      tabLogin.addEventListener("click", () => this.switchAuthTab("login"));
      tabRegister.addEventListener("click", () => this.switchAuthTab("register"));
    }
  },

  switchAuthTab(tab) {
    const loginBox = document.getElementById("loginSection");
    const regBox = document.getElementById("registerSection");
    const tabLogin = document.getElementById("authTabLogin");
    const tabRegister = document.getElementById("authTabRegister");

    if (tab === "login") {
      loginBox.classList.remove("hidden");
      regBox.classList.add("hidden");
      tabLogin.classList.add("active");
      tabRegister.classList.remove("active");
    } else {
      loginBox.classList.add("hidden");
      regBox.classList.remove("hidden");
      tabLogin.classList.remove("active");
      tabRegister.classList.add("active");
    }
  },

  handleLogin(form) {
    const emailInput = form.querySelector("#loginEmail");
    const passwordInput = form.querySelector("#loginPassword");
    const roleSelect = form.querySelector("#loginRoleSelect");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleSelect ? roleSelect.value : "patient";

    if (!email || !this.validateEmail(email)) {
      this.setInputError(emailInput, "Please enter a valid email address.");
      return;
    }
    this.clearInputError(emailInput);

    if (!password || password.length < 6) {
      this.setInputError(passwordInput, "Password must be at least 6 characters.");
      return;
    }
    this.clearInputError(passwordInput);

    // Simulate login
    let user;
    if (role === "admin" || email.toLowerCase().includes("admin")) {
      user = {
        isLoggedIn: true,
        role: "admin",
        id: DEFAULT_ADMIN.id,
        name: DEFAULT_ADMIN.fullName,
        email: DEFAULT_ADMIN.email,
        avatar: DEFAULT_ADMIN.avatar
      };
    } else {
      const patient = Storage.getPatient();
      user = {
        isLoggedIn: true,
        role: "patient",
        id: patient.id,
        name: patient.fullName,
        email: email || patient.email,
        avatar: patient.avatar
      };
    }

    Storage.setAuthUser(user);
    this.updateAuthUI();
    App.showToast(`Welcome back, ${user.name}!`, "success");

    if (user.role === "admin") {
      App.navigateTo("admin");
    } else {
      App.navigateTo("dashboard");
    }
    form.reset();
  },

  handleRegister(form) {
    const nameInput = form.querySelector("#regName");
    const emailInput = form.querySelector("#regEmail");
    const phoneInput = form.querySelector("#regPhone");
    const passInput = form.querySelector("#regPassword");
    const confirmInput = form.querySelector("#regConfirmPassword");
    const termsInput = form.querySelector("#regTerms");

    let isValid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
      this.setInputError(nameInput, "Please enter your full name (minimum 3 characters).");
      isValid = false;
    } else {
      this.clearInputError(nameInput);
    }

    if (!this.validateEmail(emailInput.value.trim())) {
      this.setInputError(emailInput, "Please enter a valid email address.");
      isValid = false;
    } else {
      this.clearInputError(emailInput);
    }

    if (!phoneInput.value.trim() || phoneInput.value.trim().length < 8) {
      this.setInputError(phoneInput, "Please enter a valid contact phone number.");
      isValid = false;
    } else {
      this.clearInputError(phoneInput);
    }

    if (passInput.value.length < 6) {
      this.setInputError(passInput, "Password must be at least 6 characters.");
      isValid = false;
    } else {
      this.clearInputError(passInput);
    }

    if (passInput.value !== confirmInput.value) {
      this.setInputError(confirmInput, "Passwords do not match.");
      isValid = false;
    } else {
      this.clearInputError(confirmInput);
    }

    if (termsInput && !termsInput.checked) {
      App.showToast("Please agree to the medical terms of service & privacy notice.", "warning");
      isValid = false;
    }

    if (!isValid) return;

    // Create new patient record
    const newPatient = {
      ...Storage.getPatient(),
      fullName: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim()
    };
    Storage.setPatient(newPatient);

    const authUser = {
      isLoggedIn: true,
      role: "patient",
      id: newPatient.id,
      name: newPatient.fullName,
      email: newPatient.email,
      avatar: newPatient.avatar
    };

    Storage.setAuthUser(authUser);
    this.updateAuthUI();
    App.showToast("Account created successfully! Welcome to MediCare+.", "success");
    App.navigateTo("dashboard");
    form.reset();
  },

  loginDemo(role) {
    if (role === "admin") {
      const user = {
        isLoggedIn: true,
        role: "admin",
        id: DEFAULT_ADMIN.id,
        name: DEFAULT_ADMIN.fullName,
        email: DEFAULT_ADMIN.email,
        avatar: DEFAULT_ADMIN.avatar
      };
      Storage.setAuthUser(user);
      this.updateAuthUI();
      App.showToast("Logged in as System Administrator", "info");
      App.navigateTo("admin");
    } else {
      const pat = Storage.getPatient();
      const user = {
        isLoggedIn: true,
        role: "patient",
        id: pat.id,
        name: pat.fullName,
        email: pat.email,
        avatar: pat.avatar
      };
      Storage.setAuthUser(user);
      this.updateAuthUI();
      App.showToast(`Logged in as Patient (${pat.fullName})`, "info");
      App.navigateTo("dashboard");
    }
  },

  logout() {
    Storage.setAuthUser({ isLoggedIn: false, role: "guest" });
    this.updateAuthUI();
    App.showToast("You have been signed out successfully.", "info");
    App.navigateTo("home");
  },

  updateAuthUI() {
    const user = Storage.getAuthUser();
    const guestNavElements = document.querySelectorAll(".nav-guest-only");
    const userNavElements = document.querySelectorAll(".nav-user-only");
    const adminNavElements = document.querySelectorAll(".nav-admin-only");
    const userNameSlots = document.querySelectorAll(".current-user-name");
    const userRoleBadges = document.querySelectorAll(".current-user-role");
    const userAvatars = document.querySelectorAll(".current-user-avatar");

    if (user && user.isLoggedIn) {
      guestNavElements.forEach(el => el.classList.add("hidden"));
      userNavElements.forEach(el => el.classList.remove("hidden"));

      if (user.role === "admin") {
        adminNavElements.forEach(el => el.classList.remove("hidden"));
      } else {
        adminNavElements.forEach(el => el.classList.add("hidden"));
      }

      userNameSlots.forEach(el => el.textContent = user.name);
      userRoleBadges.forEach(el => el.textContent = user.role === "admin" ? "Administrator" : "Patient");
      userAvatars.forEach(el => {
        if (el.tagName === "IMG") el.src = user.avatar;
      });
    } else {
      guestNavElements.forEach(el => el.classList.remove("hidden"));
      userNavElements.forEach(el => el.classList.add("hidden"));
      adminNavElements.forEach(el => el.classList.add("hidden"));
    }
  },

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  setInputError(input, message) {
    input.classList.add("input-error");
    const errorElem = input.parentElement.querySelector(".field-error-msg");
    if (errorElem) {
      errorElem.textContent = message;
      errorElem.classList.remove("hidden");
    }
  },

  clearInputError(input) {
    input.classList.remove("input-error");
    const errorElem = input.parentElement.querySelector(".field-error-msg");
    if (errorElem) {
      errorElem.textContent = "";
      errorElem.classList.add("hidden");
    }
  }
};
