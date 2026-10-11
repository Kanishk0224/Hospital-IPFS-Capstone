# 🏥 MediCare+ | Hospital Appointment & Medical Record Management System
### *College Capstone Project in Frontend Technologies*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: Production Ready](https://img.shields.io/badge/Status-Complete-emerald.svg)]()
[![Stack: HTML5 • CSS3 • JavaScript ES6+](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20ES6+-teal.svg)]()

**MediCare+** is a modern, responsive, and aesthetically stunning healthcare web platform designed to streamline doctor appointments, clinical consultations, patient demographics, and electronic medical records (EHR). Engineered with a clinical aesthetic—featuring bespoke medical blue (`#2563EB`) and teal (`#14B8A6`) palettes, full light/dark mode support, and realistic demonstration data.

---

## 🌟 Key Modules & Features

### 1. 🏠 Public Landing Page
- **Brand Identity**: Clean MediCare+ branding with floating glassmorphism metrics.
- **Hero Showcase**: High-impact medical imagery, trust badges (*24/7 Clinical Care*, *Board-Certified*, *ISO 9001*).
- **Hospital Statistics**: Animated counter metrics (*50+ Specialists*, *25k+ Patients*, *15+ Specialties*, *99.4% Recovery Index*).
- **Featured Specialties**: Visual cards with doctor counts and direct specialty filtering (Cardiology, Neurology, Dermatology, Pediatrics, Orthopedics, General Medicine, Ophthalmology, Dental Care).
- **Top Doctors**: Star-rated specialist cards with real-time consultation fees, experience badges, and one-click booking.
- **3-Step Workflow**: Visual breakdown of the streamlined scheduling process.
- **Patient Testimonials & Emergency Hotline**: Real patient feedback and 24/7 trauma emergency banner.

### 2. 👨‍⚕️ Find Doctors Directory & Instant Filter Engine
- Real-time search by doctor name, qualification, or condition.
- Specialty filter pills with active pill states.
- Availability toggle (*All Dates* vs *Available Today*).
- Interactive consultation fee range slider ($50 – $200).
- Multi-criteria sorting: *Recommended*, *Experience (High to Low)*, *Fee (Low to High / High to Low)*, *Name (A–Z)*.
- Comprehensive Doctor Profile Modal displaying clinical biography, education credentials, working schedules, consultation hours, and verified patient reviews.

### 3. 🗓️ Interactive 5-Step Appointment Booking Wizard
1. **Step 1: Specialist Selection**: Visual grid of doctor cards with specialty badges.
2. **Step 2: Date Picker**: Calendar picker with automatic past-date restriction (minimum selectable date is today).
3. **Step 3: Time Slot Matrix**: Segmented morning, afternoon, and evening slots with clear color-coded statuses (*Available*, *Selected*, *Booked / Full*).
4. **Step 4: Clinical Visit Details**: Selection between In-Person or Telehealth Video Consultation, symptom description, and visit purpose.
5. **Step 5: Review & Confirmation**: Summary fee breakdown, patient details, and payment selection.
- **Official Confirmation Receipt**: Generates a unique reference code (`MED-2026-XXXX`), appointment slip, and print action.

### 4. 📋 Patient Appointment Management
- Status tabs with live counter badges: **All**, **Upcoming**, **Completed**, and **Cancelled**.
- Real-time status badges with color coding.
- **Reschedule Modal**: Choose a new consultation date and time slot with instant status update.
- **Cancellation Modal**: Confirmation dialog with reason logging.
- **Full Details Sheet**: Comprehensive consultation view including clinic room, preparation instructions, and fee status.

### 5. 📂 Electronic Medical Records (EHR) & Lab Reports
- Consultation history records with attending physician details and department.
- Clinical assessment, presenting symptoms, and recorded vitals chips (Blood Pressure, Heart Rate, Body Temp, SpO2, BMI).
- Diagnostic lab summary and downloadable report attachments.
- **Upload Document Simulation**: Drag-and-drop file upload modal for patient lab reports.

### 6. 💊 Official Medical Prescription (Rx) Viewer
- Classic clinic letterhead with licensing details (`MD-92814-IL`).
- Standard Rx formulation table: Medicine Name, Type, Strength, Frequency, Duration, and Special Instructions.
- Physician clinical notes and encrypted digital signature verification.
- **Dedicated Print Stylesheet**: Formatted for browser printing without website UI navigation elements.

### 7. 📊 Patient Dashboard & Profile
- Personalized greeting with date and health quote.
- Metric cards for appointments, upcoming visits, EHR records, and active prescriptions.
- Next Scheduled Visit Hero tracker card.
- Health activity timeline.
- Editable demographics: Emergency contact, blood group, allergies, insurance policy details.

### 8. 🛡️ Hospital Executive Administration Portal
- Total hospital metrics and capacity tracking.
- **Doctor Management (CRUD)**: Add new doctor modal, edit existing doctor profiles, remove staff, and toggle availability.
- **All Appointments Oversight**: Filter bookings by status, mark as completed, or cancel.
- **Patient Cohort Directory**: View registered patient demographics and contact details.

### 9. 🌓 Light & Dark Mode
- Smooth CSS variable switching.
- Persisted in `localStorage` across page reloads.

---

## 🛠️ Technology Stack

- **Structure**: Semantic HTML5 (native dialogs, ARIA attributes)
- **Styling**: Vanilla CSS3 with bespoke CSS Custom Properties (`--color-primary: #2563EB`, `--color-secondary: #14B8A6`)
- **Logic & State**: Modular JavaScript (ES6+), `localStorage` persistence
- **Typography**: Google Fonts (*Inter* & *Poppins*)
- **Icons**: Font Awesome 6
- **Server**: Vite (for local development and bundling)

---

## 📁 Project File Structure

```
Hospital Management/
├── index.html               # Main application shell with multi-view router
├── package.json             # NPM dev scripts and Vite configuration
├── README.md                # Capstone documentation
├── css/
│   ├── style.css            # Design tokens, typography, buttons, landing page
│   ├── dashboard.css        # Dashboard, sidebar, booking wizard, prescriptions
│   └── responsive.css       # Mobile & tablet breakpoints, print stylesheet
└── js/
    ├── data.js              # Comprehensive master demo dataset
    ├── storage.js           # LocalStorage state management and persistence
    ├── auth.js              # Authentication, role switching, form validation
    ├── doctors.js           # Doctor directory, search, multi-facet filtering
    ├── booking.js           # 5-step appointment booking wizard
    ├── appointments.js      # Appointment management, reschedule & cancel
    ├── records.js           # EHR records, lab reports, Rx viewer & print
    ├── dashboard.js         # Patient dashboard metrics & profile editor
    ├── admin.js             # Hospital administrator management portal
    └── app.js               # Router, theme toggle, toasts, modal controllers
```

---

## 🚀 Getting Started & Local Development

### Option A: Using NPM & Vite (Recommended)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Open your browser at:
   ```
   http://localhost:5173/
   ```

### Option B: Direct Browser Launch
Because the codebase is written using standard browser-compatible ES6 and CSS, you can also open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari) or serve it with Python (`python -m http.server 8000`).

---

## 🔑 Demonstration Accounts

For effortless presentation and grading, quick-fill buttons are provided on the login page:

| Role | Email | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **Demo Patient** | `alex.morgan@example.com` | `Password123!` | Book visits, view appointments, EHR records, prescriptions, profile |
| **Demo Admin** | `admin@medicare.org` | `Password123!` | Executive dashboard, doctor CRUD, appointment management, patient directory |

*Tip: Click the **Reset Demo Data** button anytime in the mobile menu or console to restore all demo data to factory defaults.*

---

## 📜 Academic Integrity & Capstone Notice
This project is developed as a frontend engineering capstone showcase demonstrating UI/UX best practices, state management, accessibility, responsive design, and professional healthcare aesthetics.
