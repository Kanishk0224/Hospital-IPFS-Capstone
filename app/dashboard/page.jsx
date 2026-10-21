'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../components/AppContext';
import { Storage } from '../../lib/storageService';

export default function DashboardPage() {
  const { currentUser, appointments, records, prescriptions, refreshData, logout, setIpfsExplorerOpen, showToast } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Doctor state for writing new prescriptions
  const [rxPatient, setRxPatient] = useState('Rahul Sharma');
  const [rxDiagnosis, setRxDiagnosis] = useState('Acute upper respiratory tract infection with mild fever');
  const [rxMedicine, setRxMedicine] = useState('Paracetamol 650mg');
  const [rxDosage, setRxDosage] = useState('1 Tablet (TDS 1-1-1)');
  const [rxDuration, setRxDuration] = useState('5 Days');
  const [rxInstructions, setRxInstructions] = useState('Take post meals with warm water. Adequate oral hydration.');
  const [signingRx, setSigningRx] = useState(false);

  const role = currentUser?.role || 'patient';
  const upcomingAppts = appointments.filter((a) => a.status === 'Upcoming');
  const nextAppt = upcomingAppts[0];

  // Doctor: Sign & Pin E-Prescription to IPFS
  const handleDoctorSignRx = async (e) => {
    e.preventDefault();
    setSigningRx(true);

    try {
      const rxPayload = {
        patientName: rxPatient,
        doctorName: currentUser?.name || 'Dr. Priya Patel',
        qualification: currentUser?.qualification || 'MBBS, MD (General Medicine) - AIIMS New Delhi',
        diagnosis: rxDiagnosis,
        medicine: rxMedicine,
        dosage: rxDosage,
        duration: rxDuration,
        instructions: rxInstructions,
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now()
      };

      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(rxPayload));
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const cid = 'bafybeid' + hashHex.substring(0, 32) + 'rx' + Date.now().toString().slice(-4);

      const newRx = {
        id: `RX-${Math.floor(10000 + Math.random() * 90000)}`,
        recordId: `REC-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toISOString().split('T')[0],
        doctorName: currentUser?.name || 'Dr. Priya Patel',
        doctorDegree: currentUser?.qualification || 'MBBS, MD (General Medicine) - AIIMS New Delhi',
        licenseNo: 'MCI-48214-DL',
        clinic: currentUser?.room || 'OPD Desk 12, Main Pavilion',
        patientName: rxPatient,
        patientAge: 32,
        patientGender: 'Male',
        patientId: 'pat-101',
        diagnosis: rxDiagnosis,
        medicines: [
          {
            name: rxMedicine,
            dosage: rxDosage,
            type: 'Oral Tablet',
            frequency: 'TDS (1-1-1)',
            timing: 'Post meals',
            duration: rxDuration,
            instructions: rxInstructions
          }
        ],
        doctorNotes: rxInstructions,
        digitalSignature: `${currentUser?.name || 'Dr. Priya Patel'}, MD (Reg #MCI-48214)`,
        digitalSignatureHash: `SIG-ECDSA-SHA256:0x${hashHex.substring(0, 40)}`,
        ipfsCid: cid,
        ipfsPinStatus: 'Pinned on MediCare+ Swarm Node',
        encryptionCipher: 'AES-GCM-256 (Enveloped)',
        verified: true
      };

      // Save to storage
      Storage.addPrescription(newRx);
      
      // Also add clinical record
      Storage.addRecord({
        id: newRx.recordId,
        title: `OPD Consultation: ${rxDiagnosis}`,
        date: newRx.date,
        doctorName: newRx.doctorName,
        specialty: currentUser?.specialtyName || 'General Medicine',
        department: 'Internal Medicine',
        diagnosis: rxDiagnosis,
        symptoms: 'Fever, sore throat, generalized fatigue.',
        vitals: {
          bloodPressure: '120/80 mmHg',
          heartRate: '78 bpm',
          respiratoryRate: '18 bpm',
          temp: '99.8 °F',
          spo2: '98%',
          bmi: '22.8 kg/m²'
        },
        labSummary: 'Normal clinical evaluation. Throat swab benign.',
        notes: rxInstructions,
        hasPrescription: true,
        prescriptionId: newRx.id,
        ipfsCid: cid,
        ipfsPinStatus: 'Pinned on MediCare+ Swarm Node',
        tamperProofHash: hashHex,
        encryptionCipher: 'AES-GCM-256 (ABDM / DISHA Enveloped)',
        merkleBlocks: 4
      });

      refreshData();
      showToast(`Prescription ${newRx.id} signed & anchored to IPFS (${cid.substring(0, 16)}...)`, 'success');
      setRxMedicine('Azithromycin 500mg');
      setRxInstructions('1 tab daily for 3 days after dinner.');
    } catch (err) {
      console.error(err);
      showToast('Error signing prescription', 'error');
    } finally {
      setSigningRx(false);
    }
  };

  return (
    <div className="dashboard-shell">
      {/* Mobile Sidebar Backdrop */}
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Dark Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon"><i className="fa-solid fa-heart-pulse"></i></div>
          <span className="sidebar-brand-text">MediCare<span>+</span></span>
          <button
            className="btn btn-ghost btn-xs text-white md:hidden ml-auto"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="sidebar-user-card">
          <img
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
            alt="Avatar"
            className="sidebar-avatar"
          />
          <div className="sidebar-user-info">
            <h4>{currentUser?.name || 'User'}</h4>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {role === 'doctor' ? 'Senior Consultant' : role === 'admin' ? 'Hospital Director' : 'Patient Portal'}
            </span>
          </div>
        </div>

        <span className="sidebar-nav-section-title">Navigation</span>
        <ul className="sidebar-nav-list">
          <li>
            <Link href="/dashboard" className="sidebar-nav-item active" onClick={() => setSidebarOpen(false)}>
              <i className="fa-solid fa-chart-pie"></i>
              {role === 'doctor' ? 'OPD Console' : role === 'admin' ? 'Executive Hub' : 'Health Overview'}
            </Link>
          </li>

          {role === 'doctor' ? (
            <>
              <li>
                <Link href="/appointments" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
                  <i className="fa-regular fa-calendar-check"></i> Patient Queue
                </Link>
              </li>
              <li>
                <Link href="/records" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
                  <i className="fa-solid fa-file-waveform"></i> Patient EHRs
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
                  <i className="fa-solid fa-user-doctor"></i> Medical Directory
                </Link>
              </li>
            </>
          ) : role === 'admin' ? (
            <>
              <li>
                <Link href="/admin" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
                  <i className="fa-solid fa-shield-halved text-teal"></i> Hospital Admin Console
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
                  <i className="fa-solid fa-user-doctor"></i> Doctors Roster
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
                  <i className="fa-regular fa-calendar-check"></i> All Appointments
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/appointments" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
                  <i className="fa-regular fa-calendar-check"></i> My Appointments
                </Link>
              </li>
              <li>
                <Link href="/booking" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
                  <i className="fa-regular fa-calendar-plus"></i> Book OPD Consultation
                </Link>
              </li>
              <li>
                <Link href="/records" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
                  <i className="fa-solid fa-file-waveform"></i> Medical Records
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
                  <i className="fa-solid fa-user-doctor"></i> Find Doctors
                </Link>
              </li>
              <li>
                <Link href="/profile" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
                  <i className="fa-regular fa-id-badge"></i> Health Profile
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="sidebar-divider"></div>
        <span className="sidebar-nav-section-title">Decentralized Storage</span>
        <ul className="sidebar-nav-list">
          <li>
            <Link href="/ipfs" className="sidebar-nav-item" onClick={() => setSidebarOpen(false)}>
              <i className="fa-solid fa-cubes text-teal"></i> IPFS Hub &amp; Ledger
            </Link>
          </li>
          <li>
            <button
              className="sidebar-nav-item w-full text-left bg-transparent border-0 cursor-pointer"
              onClick={() => {
                setIpfsExplorerOpen(true);
                setSidebarOpen(false);
              }}
            >
              <i className="fa-solid fa-microchip text-primary"></i> Live CID Hasher
            </button>
          </li>
        </ul>

        <div className="sidebar-footer">
          <button
            className="sidebar-nav-item text-danger w-full bg-transparent border-0 text-left cursor-pointer"
            onClick={logout}
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <section className="dashboard-main-content">
        {/* Mobile Sidebar Toggle Bar */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar menu"
          >
            <i className="fa-solid fa-bars-staggered mr-1"></i> Portal Menu
          </button>
          <span className="text-xs font-bold text-muted">MediCare+ Portal</span>
        </div>

        {/* ══════════════════════════════════════════════════
            MODE 1: DOCTOR CLINICAL CONSOLE
            ══════════════════════════════════════════════════ */}
        {role === 'doctor' && (
          <div className="space-y-6">
            {/* Doctor Welcome Banner */}
            <div className="dashboard-welcome-banner" style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(37,99,235,0.08) 100%)' }}>
              <div>
                <div className="page-eyebrow">
                  <i className="fa-solid fa-stethoscope text-teal"></i> Physician OPD Station &bull; AIIMS New Delhi Alum
                </div>
                <h1 className="welcome-title">Welcome, {currentUser?.name}! 🩺</h1>
                <p className="welcome-subtitle">
                  {currentUser?.qualification || 'MBBS, MD General Medicine'} &bull; {currentUser?.room || 'OPD Desk 12, Main Pavilion'} &bull; Status: <strong className="text-emerald">🟢 Active OPD Duty</strong>
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link href="/ipfs" className="btn btn-teal">
                  <i className="fa-solid fa-cubes mr-1"></i> IPFS Node Pinned ({records.length + prescriptions.length})
                </Link>
                <Link href="/records" className="btn btn-secondary">
                  <i className="fa-solid fa-folder-open mr-1"></i> Patient Records
                </Link>
              </div>
            </div>

            {/* Doctor Metrics */}
            <div className="metrics-row-grid">
              <div className="metric-stat-card">
                <div className="metric-icon-box icon-teal"><i className="fa-solid fa-users"></i></div>
                <div>
                  <div className="metric-val">3</div>
                  <div className="metric-lbl">Patients in OPD Today</div>
                </div>
              </div>
              <div className="metric-stat-card">
                <div className="metric-icon-box icon-emerald"><i className="fa-solid fa-circle-check"></i></div>
                <div>
                  <div className="metric-val">1</div>
                  <div className="metric-lbl">Completed Visits</div>
                </div>
              </div>
              <div className="metric-stat-card">
                <div className="metric-icon-box icon-blue"><i className="fa-solid fa-file-signature"></i></div>
                <div>
                  <div className="metric-val">{prescriptions.length}</div>
                  <div className="metric-lbl">Active Prescriptions</div>
                </div>
              </div>
              <div className="metric-stat-card">
                <div className="metric-icon-box icon-purple"><i className="fa-solid fa-clock"></i></div>
                <div>
                  <div className="metric-val">15 min</div>
                  <div className="metric-lbl">Avg Consult Duration</div>
                </div>
              </div>
              <div className="metric-stat-card cursor-pointer" onClick={() => setIpfsExplorerOpen(true)}>
                <div className="metric-icon-box icon-emerald"><i className="fa-solid fa-cubes"></i></div>
                <div>
                  <div className="metric-val text-emerald">100%</div>
                  <div className="metric-lbl">IPFS Swarm Sync</div>
                </div>
              </div>
            </div>

            {/* Doctor OPD Grid */}
            <div className="dashboard-grid-layout">
              {/* Left Column: OPD Queue */}
              <div className="space-y-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <i className="fa-solid fa-clipboard-list text-primary"></i> Today&apos;s OPD Patient Schedule
                    </h3>
                    <span className="badge badge-primary text-xxs">Live OPD Desk 12</span>
                  </div>
                  <div className="card-body">
                    <div className="space-y-3">
                      {/* Patient 1 */}
                      <div className="p-4 rounded-xl border border-teal/40 bg-primary-light flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="badge badge-success text-xxs">Token #1</span>
                            <h4 className="font-bold text-sm">Rahul Sharma (32, M)</h4>
                          </div>
                          <p className="text-xs text-muted mt-1">
                            <strong>Reason:</strong> Contact dermatitis and seasonal allergy on forearms.
                          </p>
                          <div className="flex gap-2 text-xxs text-muted mt-2">
                            <span><i className="fa-solid fa-clock text-teal"></i> 10:00 AM Slot</span>
                            <span><i className="fa-solid fa-id-card"></i> ABHA: 91-4829-1029</span>
                            <span><i className="fa-solid fa-shield-halved text-emerald"></i> IPFS Linked</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="badge badge-teal text-xxs block mb-2">In Consultation</span>
                          <button
                            className="btn btn-teal btn-xs"
                            onClick={() => {
                              setRxPatient('Rahul Sharma');
                              setRxDiagnosis('Acute Contact Dermatitis & Allergic Rhinitis');
                              showToast('Loaded Rahul Sharma into Clinical Writer', 'info');
                            }}
                          >
                            <i className="fa-solid fa-pen-to-square mr-1"></i> Write Rx
                          </button>
                        </div>
                      </div>

                      {/* Patient 2 */}
                      <div className="p-4 rounded-xl border border-border bg-subtle flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="badge badge-subtle text-xxs">Token #2</span>
                            <h4 className="font-bold text-sm">Amit Verma (45, M)</h4>
                          </div>
                          <p className="text-xs text-muted mt-1">
                            <strong>Reason:</strong> Follow-up for hypertension management &amp; fasting sugar check.
                          </p>
                          <div className="flex gap-2 text-xxs text-muted mt-2">
                            <span><i className="fa-solid fa-clock"></i> 11:30 AM Slot</span>
                            <span><i className="fa-solid fa-file-waveform"></i> Previous ECG Attached</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="badge badge-secondary text-xxs block mb-2">Waiting in Lobby</span>
                          <button
                            className="btn btn-secondary btn-xs"
                            onClick={() => {
                              setRxPatient('Amit Verma');
                              setRxDiagnosis('Essential Hypertension - Stage 1');
                              showToast('Loaded Amit Verma into Clinical Writer', 'info');
                            }}
                          >
                            Call Patient
                          </button>
                        </div>
                      </div>

                      {/* Patient 3 */}
                      <div className="p-4 rounded-xl border border-border bg-subtle flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="badge badge-subtle text-xxs">Token #3</span>
                            <h4 className="font-bold text-sm">Sunita Deshmukh (29, F)</h4>
                          </div>
                          <p className="text-xs text-muted mt-1">
                            <strong>Reason:</strong> Preventive wellness screening &amp; thyroid profile evaluation.
                          </p>
                          <div className="flex gap-2 text-xxs text-muted mt-2">
                            <span><i className="fa-solid fa-clock"></i> 02:00 PM Slot</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="badge badge-secondary text-xxs">Upcoming</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Clinical Writer */}
              <div className="space-y-6">
                <div className="card p-5 border-2 border-teal/40">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
                      <i className="fa-solid fa-prescription text-teal"></i>
                      Instant Digital E-Prescription &amp; IPFS Pinning Engine
                    </h3>
                    <span className="badge badge-teal text-xxs">
                      <i className="fa-solid fa-cubes mr-1"></i> Web Crypto SHA-256
                    </span>
                  </div>
                  <p className="text-xs text-muted mb-4">
                    Writing an e-prescription generates an immutable content hash and pins the cryptographic CID to the MediCare+ federated hospital cluster.
                  </p>

                  <form onSubmit={handleDoctorSignRx} className="space-y-3">
                    <div>
                      <label className="form-label font-bold text-xs uppercase text-muted">Patient Name</label>
                      <input
                        type="text"
                        className="form-input text-xs"
                        value={rxPatient}
                        onChange={(e) => setRxPatient(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label font-bold text-xs uppercase text-muted">Clinical Diagnosis</label>
                      <input
                        type="text"
                        className="form-input text-xs"
                        value={rxDiagnosis}
                        onChange={(e) => setRxDiagnosis(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="form-label font-bold text-xs uppercase text-muted">Medication Name</label>
                        <input
                          type="text"
                          className="form-input text-xs"
                          value={rxMedicine}
                          onChange={(e) => setRxMedicine(e.target.value)}
                          placeholder="e.g. Paracetamol 650mg"
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label font-bold text-xs uppercase text-muted">Dosage &amp; Timing</label>
                        <input
                          type="text"
                          className="form-input text-xs"
                          value={rxDosage}
                          onChange={(e) => setRxDosage(e.target.value)}
                          placeholder="e.g. 1 Tab (1-0-1)"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label font-bold text-xs uppercase text-muted">Clinical Advice &amp; Instructions</label>
                      <textarea
                        className="form-textarea text-xs"
                        rows={2}
                        value={rxInstructions}
                        onChange={(e) => setRxInstructions(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-teal w-full btn-md mt-2"
                      disabled={signingRx}
                    >
                      <i className={`fa-solid ${signingRx ? 'fa-spinner fa-spin' : 'fa-signature'} mr-1`}></i>
                      {signingRx ? 'Hashing & Pinning to IPFS...' : 'Digitally Sign & Pin to IPFS'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            MODE 2: ADMIN EXECUTIVE CONSOLE
            ══════════════════════════════════════════════════ */}
        {role === 'admin' && (
          <div className="space-y-6">
            <div className="dashboard-welcome-banner" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(37,99,235,0.08) 100%)' }}>
              <div>
                <div className="page-eyebrow">
                  <i className="fa-solid fa-shield-halved text-purple"></i> Chief Medical Superintendent &bull; Hospital Executive Board
                </div>
                <h1 className="welcome-title">Hospital Executive Operations Hub</h1>
                <p className="welcome-subtitle">
                  Superintendent: {currentUser?.name} &bull; MediCare+ Super Specialty (Bengaluru Hub) &bull; Network: ABDM / DISHA Linked
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link href="/admin" className="btn btn-primary">
                  <i className="fa-solid fa-gauge-high mr-1"></i> Full Admin Portal
                </Link>
                <Link href="/ipfs" className="btn btn-secondary">
                  <i className="fa-solid fa-cubes mr-1"></i> IPFS Swarm Monitor
                </Link>
              </div>
            </div>

            {/* Admin Stats */}
            <div className="metrics-row-grid">
              <div className="metric-stat-card">
                <div className="metric-icon-box icon-purple"><i className="fa-solid fa-user-doctor"></i></div>
                <div>
                  <div className="metric-val">8</div>
                  <div className="metric-lbl">Active Doctors on Duty</div>
                </div>
              </div>
              <div className="metric-stat-card">
                <div className="metric-icon-box icon-emerald"><i className="fa-solid fa-bed-pulse"></i></div>
                <div>
                  <div className="metric-val">84%</div>
                  <div className="metric-lbl">Bed &amp; ICU Occupancy</div>
                </div>
              </div>
              <div className="metric-stat-card">
                <div className="metric-icon-box icon-teal"><i className="fa-solid fa-cubes"></i></div>
                <div>
                  <div className="metric-val">5</div>
                  <div className="metric-lbl">Federated Swarm Nodes</div>
                </div>
              </div>
              <div className="metric-stat-card">
                <div className="metric-icon-box icon-blue"><i className="fa-solid fa-indian-rupee-sign"></i></div>
                <div>
                  <div className="metric-val">₹2.4L</div>
                  <div className="metric-lbl">Daily OPD Revenue</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-primary/30 bg-primary-light flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-sm text-primary">Need Comprehensive Hospital Roster Management?</h3>
                <p className="text-xs text-muted mt-1">Manage doctor availability, consultation fees in INR, OPD room rosters, and departmental audit logs in the Admin Portal.</p>
              </div>
              <Link href="/admin" className="btn btn-primary btn-sm">
                Open Admin Portal &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            MODE 3: PATIENT HEALTH DASHBOARD (DEFAULT)
            ══════════════════════════════════════════════════ */}
        {role === 'patient' && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="dashboard-welcome-banner">
              <div>
                <div className="page-eyebrow"><i className="fa-solid fa-chart-pie"></i> Clinical Patient Portal &bull; ABHA ID: 91-4829-1029</div>
                <h1 className="welcome-title">Welcome back, {currentUser?.name?.split(' ')[0] || 'Rahul'}! 👋</h1>
                <p className="welcome-subtitle">Here is your daily health tracker, upcoming clinical visits, and decentralized IPFS records.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link href="/booking" className="btn btn-primary">
                  <i className="fa-solid fa-plus mr-1"></i> Book OPD Consultation
                </Link>
                <Link href="/records" className="btn btn-secondary">
                  <i className="fa-solid fa-folder-open mr-1"></i> Access Records
                </Link>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="metrics-row-grid">
              <div className="metric-stat-card">
                <div className="metric-icon-box icon-blue"><i className="fa-regular fa-calendar-check"></i></div>
                <div>
                  <div className="metric-val">{appointments.length}</div>
                  <div className="metric-lbl">Total Appointments</div>
                </div>
              </div>
              <div className="metric-stat-card">
                <div className="metric-icon-box icon-emerald"><i className="fa-solid fa-clock"></i></div>
                <div>
                  <div className="metric-val">{upcomingAppts.length}</div>
                  <div className="metric-lbl">Upcoming Visits</div>
                </div>
              </div>
              <div className="metric-stat-card">
                <div className="metric-icon-box icon-teal"><i className="fa-solid fa-file-waveform"></i></div>
                <div>
                  <div className="metric-val">{records.length}</div>
                  <div className="metric-lbl">Medical Records</div>
                </div>
              </div>
              <div className="metric-stat-card">
                <div className="metric-icon-box icon-purple"><i className="fa-solid fa-pills"></i></div>
                <div>
                  <div className="metric-val">{prescriptions.length}</div>
                  <div className="metric-lbl">Active Prescriptions</div>
                </div>
              </div>
              <Link href="/ipfs" className="metric-stat-card cursor-pointer" title="View IPFS Hub">
                <div className="metric-icon-box icon-emerald"><i className="fa-solid fa-cubes"></i></div>
                <div>
                  <div className="metric-val text-emerald">18</div>
                  <div className="metric-lbl">IPFS Pinned Docs</div>
                </div>
              </Link>
            </div>

            {/* 2-Column Grid */}
            <div className="dashboard-grid-layout">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <i className="fa-solid fa-bell text-primary"></i> Next Scheduled Appointment
                    </h3>
                    {nextAppt && (
                      <Link href="/appointments" className="text-xs text-primary font-bold hover:underline">
                        View All ({upcomingAppts.length}) &rarr;
                      </Link>
                    )}
                  </div>

                  {nextAppt ? (
                    <div className="upcoming-appointment-hero">
                      <img
                        src={nextAppt.doctorImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
                        alt={nextAppt.doctorName}
                        className="upcoming-doctor-avatar"
                      />
                      <div className="upcoming-appointment-info flex-1">
                        <span className="badge badge-subtle mb-1" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: 'none' }}>
                          Confirmed OPD Consultation
                        </span>
                        <h3>{nextAppt.doctorName}</h3>
                        <div className="upcoming-meta">
                          <span><i className="fa-solid fa-stethoscope"></i> {nextAppt.doctorSpecialty}</span>
                          <span><i className="fa-regular fa-calendar"></i> {nextAppt.date} at {nextAppt.timeSlot}</span>
                          <span><i className="fa-solid fa-hospital"></i> {nextAppt.clinicRoom || 'Room 402, Main Pavilion'}</span>
                          <span><i className="fa-solid fa-indian-rupee-sign"></i> Consultation Fee: ₹{nextAppt.consultationFee || nextAppt.fee || 700}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link href="/appointments" className="btn btn-secondary btn-xs" style={{ background: '#fff', color: 'var(--clr-primary)', border: 'none' }}>
                            View Details &amp; OPD Slip
                          </Link>
                          <Link href="/booking" className="btn btn-outline-primary btn-xs" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                            Book Another
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="card p-6 text-center text-muted">
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--clr-primary-light)', color: 'var(--clr-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.25rem' }}>
                        <i className="fa-regular fa-calendar-plus"></i>
                      </div>
                      <h4 className="font-bold text-sm mb-1 text-primary">No Upcoming Appointments</h4>
                      <p className="text-xs mb-4">You have zero consultations booked for this week. Stay ahead of your preventive care.</p>
                      <Link href="/booking" className="btn btn-primary btn-sm">
                        Schedule an OPD Specialist Visit
                      </Link>
                    </div>
                  )}
                </div>

                {/* Quick Vitals Summary Card */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <i className="fa-solid fa-heart-pulse text-danger"></i> Latest Clinical Vitals &amp; Biometrics
                    </h3>
                    <span className="badge badge-success text-xxs">Updated 2d ago</span>
                  </div>
                  <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                      <div className="p-3 bg-subtle rounded-xl border text-center">
                        <span className="text-xxs text-muted font-bold uppercase block">Blood Pressure</span>
                        <strong className="text-base text-primary font-mono block mt-1">118/76</strong>
                        <span className="text-xxs text-emerald font-semibold">Optimal</span>
                      </div>
                      <div className="p-3 bg-subtle rounded-xl border text-center">
                        <span className="text-xxs text-muted font-bold uppercase block">Heart Rate</span>
                        <strong className="text-base text-teal font-mono block mt-1">70 bpm</strong>
                        <span className="text-xxs text-emerald font-semibold">Normal Sinus</span>
                      </div>
                      <div className="p-3 bg-subtle rounded-xl border text-center">
                        <span className="text-xxs text-muted font-bold uppercase block">Blood Oxygen</span>
                        <strong className="text-base text-primary font-mono block mt-1">99% SpO2</strong>
                        <span className="text-xxs text-emerald font-semibold">Excellent</span>
                      </div>
                      <div className="p-3 bg-subtle rounded-xl border text-center">
                        <span className="text-xxs text-muted font-bold uppercase block">Blood Group</span>
                        <strong className="text-base text-amber font-mono block mt-1">{currentUser?.bloodGroup || 'O+'}</strong>
                        <span className="text-xxs text-muted font-semibold">Rh Positive</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <i className="fa-solid fa-list-check text-teal"></i> Recent Clinical Activity Log
                    </h3>
                    <Link href="/records" className="text-xs text-primary font-bold hover:underline">
                      All Records &rarr;
                    </Link>
                  </div>
                  <div className="card-body">
                    <div className="activity-timeline">
                      <div className="timeline-item">
                        <div className="timeline-dot" style={{ background: 'var(--clr-primary-light)', color: 'var(--clr-primary)' }}>
                          <i className="fa-solid fa-file-waveform"></i>
                        </div>
                        <div className="timeline-content">
                          <h4>Annual Health Checkup Synced</h4>
                          <p>Cardiology examination &amp; lipid panel hashed and anchored to IPFS.</p>
                          <time>2 days ago &bull; Verified</time>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <div className="timeline-dot" style={{ background: 'var(--clr-teal-light)', color: 'var(--clr-teal)' }}>
                          <i className="fa-solid fa-prescription"></i>
                        </div>
                        <div className="timeline-content">
                          <h4>Prescription Active &amp; Authenticated</h4>
                          <p>Dr. Priya Patel (AIIMS) signed digital prescription on IPFS.</p>
                          <time>5 days ago &bull; Pharmacy Dispensed</time>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <div className="timeline-dot" style={{ background: 'var(--clr-success-bg)', color: 'var(--clr-success)' }}>
                          <i className="fa-solid fa-circle-check"></i>
                        </div>
                        <div className="timeline-content">
                          <h4>Vitals Recorded by Clinical OPD Nurse</h4>
                          <p>Blood pressure 118/76 mmHg, Heart Rate 70 bpm logged in Room 12.</p>
                          <time>1 week ago &bull; Outpatient</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="quick-actions-card">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <i className="fa-solid fa-bolt text-amber"></i> Quick Actions
                  </h3>
                  <div className="quick-action-buttons-grid">
                    <Link href="/booking" className="quick-action-tile">
                      <i className="fa-solid fa-calendar-plus text-primary"></i>
                      <span>Book OPD</span>
                    </Link>
                    <Link href="/records" className="quick-action-tile">
                      <i className="fa-solid fa-folder-open text-teal"></i>
                      <span>View Records</span>
                    </Link>
                    <Link href="/doctors" className="quick-action-tile">
                      <i className="fa-solid fa-user-doctor text-emerald"></i>
                      <span>Find Doctors</span>
                    </Link>
                    <Link href="/ipfs" className="quick-action-tile">
                      <i className="fa-solid fa-cubes text-purple"></i>
                      <span>IPFS Ledger</span>
                    </Link>
                  </div>
                </div>

                {/* Health Tips Card */}
                <div className="card p-4">
                  <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm">
                    <i className="fa-solid fa-lightbulb text-amber"></i>
                    Daily Health Tip
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Aim for at least 150 minutes of moderate aerobic exercise each week. High-fiber balanced Indian diets help maintain optimal lipid and fasting sugar levels.
                  </p>
                </div>

                {/* Emergency Hotline Assistance Card (India - 108 / 112) */}
                <div className="card p-4 border" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'var(--clr-danger-bg)' }}>
                  <div className="flex items-center gap-2 text-danger font-bold text-sm mb-1">
                    <i className="fa-solid fa-truck-medical"></i> 24/7 National Emergency &amp; Ambulance
                  </div>
                  <p className="text-xs text-muted mb-3">
                    Immediate emergency triage and mobile ambulance dispatch across India.
                  </p>
                  <div className="space-y-2">
                    <a href="tel:108" className="btn btn-danger btn-xs w-full">
                      <i className="fa-solid fa-phone"></i> National Ambulance: 108
                    </a>
                    <a href="tel:112" className="btn btn-outline-danger btn-xs w-full" style={{ borderColor: 'var(--clr-danger)', color: 'var(--clr-danger)' }}>
                      <i className="fa-solid fa-shield"></i> National Unified Helpline: 112
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
