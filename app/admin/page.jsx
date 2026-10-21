'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../components/AppContext';
import { Storage } from '../../lib/storageService';

export default function AdminPage() {
  const { doctors, appointments, records, refreshData, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('cardiology');
  const [docQual, setDocQual] = useState('MBBS, MD - AIIMS New Delhi');
  const [docFee, setDocFee] = useState(800);
  const [docRoom, setDocRoom] = useState('OPD Desk 12, Main Pavilion');

  const handleAddDoctor = (e) => {
    e.preventDefault();
    const newDoc = {
      id: 'doc-' + Date.now(),
      name: docName,
      specialty: docSpecialty,
      specialtyName: docSpecialty.charAt(0).toUpperCase() + docSpecialty.slice(1),
      qualification: docQual,
      experience: 8,
      fee: Number(docFee),
      rating: 4.8,
      reviewCount: 20,
      availableToday: true,
      availableStatus: 'Available Today',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
      room: docRoom || 'Outpatient Suite 101',
      about: 'Newly appointed clinical consultant at MediCare+.',
      workingDays: ['Monday', 'Wednesday', 'Friday'],
      consultationHours: '09:00 AM - 04:00 PM',
      slots: ['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM']
    };

    const currentDocs = Storage.getDoctors();
    currentDocs.unshift(newDoc);
    Storage.saveDoctors(currentDocs);
    refreshData();
    setShowAddDoctorModal(false);
    setDocName('');
    showToast(`Added specialist ${newDoc.name}`, 'success');
  };

  return (
    <div className="page-container-lg">
      {/* Banner */}
      <div className="dashboard-welcome-banner">
        <div>
          <span className="badge badge-teal mb-2"><i className="fa-solid fa-shield-halved mr-1"></i> Authorized Medical Administration</span>
          <div className="page-eyebrow"><i className="fa-solid fa-shield-halved"></i> Executive Portal</div>
          <h1 className="welcome-title">Hospital Executive Operations</h1>
          <p className="welcome-subtitle">Oversee medical staff registries, monitor appointments, and manage clinic patient cohorts.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-primary" onClick={() => setShowAddDoctorModal(true)}>
            <i className="fa-solid fa-user-plus mr-1"></i> Add Specialist Doctor
          </button>
          <Link href="/dashboard" className="btn btn-secondary btn-sm">
            <i className="fa-solid fa-repeat mr-1"></i> Patient View
          </Link>
        </div>
      </div>

      {/* Subnav */}
      <div className="admin-subnav-pills">
        <button
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fa-solid fa-chart-line mr-1"></i> Operations Overview
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          <i className="fa-solid fa-user-doctor mr-1"></i> Doctor Management
          <span className="badge badge-subtle ml-1">{doctors.length}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          <i className="fa-regular fa-calendar-check mr-1"></i> All Appointments
          <span className="badge badge-subtle ml-1">{appointments.length}</span>
        </button>
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="metrics-row-grid">
            <div className="metric-stat-card">
              <div className="metric-icon-box icon-blue"><i className="fa-solid fa-user-doctor"></i></div>
              <div><div className="metric-val">{doctors.length}</div><div className="metric-lbl">Registered Specialists</div></div>
            </div>
            <div className="metric-stat-card">
              <div className="metric-icon-box icon-teal"><i className="fa-regular fa-calendar-check"></i></div>
              <div><div className="metric-val">{appointments.length}</div><div className="metric-lbl">Total Bookings</div></div>
            </div>
            <div className="metric-stat-card">
              <div className="metric-icon-box icon-emerald"><i className="fa-solid fa-clock"></i></div>
              <div><div className="metric-val">{appointments.filter(a => a.status === 'Upcoming').length}</div><div className="metric-lbl">Pending / Upcoming</div></div>
            </div>
            <div className="metric-stat-card">
              <div className="metric-icon-box icon-purple"><i className="fa-solid fa-file-waveform"></i></div>
              <div><div className="metric-val">{records.length}</div><div className="metric-lbl">Clinical EHR Records</div></div>
            </div>
          </div>

          <div className="admin-ops-summary-card">
            <h3 className="font-bold text-lg mb-2 text-white">Hospital Operations &amp; Clinical Capacity</h3>
            <p className="text-sm opacity-85 mb-4 leading-relaxed">
              MediCare+ outpatient centers are running at 94% resource utilization. All cardiology, neurology, and general medicine rooms are staffed with board-certified specialists. Decentralized IPFS records replication active across 18 nodes.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="admin-ops-stat-pill"><i className="fa-solid fa-circle-check mr-1"></i> All Hospital Systems Operational</span>
              <span className="admin-ops-stat-pill"><i className="fa-solid fa-cubes mr-1"></i> IPFS Health Ledger Online</span>
              <span className="admin-ops-stat-pill"><i className="fa-solid fa-wifi mr-1"></i> 18 Federated Nodes</span>
              <span className="admin-ops-stat-pill"><i className="fa-solid fa-shield mr-1"></i> HIPAA Compliance Level 4</span>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Management */}
      {activeTab === 'doctors' && (
        <div className="card p-4">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold">Medical Staff Registry</h3>
              <p className="text-xs text-muted">Manage active physicians, fee structures, and assigned outpatient rooms.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddDoctorModal(true)}>
              <i className="fa-solid fa-plus mr-1"></i> Add Specialist
            </button>
          </div>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Experience</th>
                  <th>Fee</th>
                  <th>Assigned Room</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <img src={d.image} alt={d.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <strong className="block text-xs">{d.name}</strong>
                          <span className="text-xxs text-muted">{d.qualification}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{d.specialtyName}</span></td>
                    <td>{d.experience} yrs</td>
                    <td className="font-bold text-primary">₹{d.fee}</td>
                    <td className="text-xs text-muted">{d.room || 'Outpatient Suite 101'}</td>
                    <td><span className="badge badge-success">{d.availableStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Appointments Management */}
      {activeTab === 'appointments' && (
        <div className="card p-4">
          <div className="mb-4">
            <h3 className="text-base font-bold">All Hospital Bookings</h3>
            <p className="text-xs text-muted">Complete ledger of scheduled, fulfilled, and cancelled consultations.</p>
          </div>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Patient</th>
                  <th>Attending Doctor</th>
                  <th>Date &amp; Slot</th>
                  <th>Status</th>
                  <th>Fee</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td className="font-mono text-xs font-bold text-primary">{a.referenceId || a.id}</td>
                    <td>{a.patientName || 'Rahul Sharma'}</td>
                    <td>{a.doctorName}</td>
                    <td>{a.date} ({a.timeSlot})</td>
                    <td>
                      <span className={`badge ${a.status === 'Upcoming' ? 'badge-primary' : a.status === 'Completed' ? 'badge-success' : 'badge-danger'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="font-bold">₹{a.consultationFee || a.fee || 700}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddDoctorModal && (
        <div className="modal-overlay active" role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="fa-solid fa-user-plus text-primary mr-1"></i> Add Hospital Specialist
              </h3>
              <button className="modal-close-btn" onClick={() => setShowAddDoctorModal(false)} aria-label="Close">&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddDoctor}>
                <div className="space-y-3">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Dr. Arthur Vance, MD"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department / Specialty *</label>
                    <select
                      className="form-select"
                      value={docSpecialty}
                      onChange={(e) => setDocSpecialty(e.target.value)}
                    >
                      <option value="cardiology">Cardiology</option>
                      <option value="neurology">Neurology</option>
                      <option value="dermatology">Dermatology</option>
                      <option value="pediatrics">Pediatrics</option>
                      <option value="orthopedics">Orthopedics</option>
                      <option value="general">General Medicine</option>
                      <option value="ophthalmology">Ophthalmology</option>
                      <option value="dental">Dental Care</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Credentials &amp; Fellowships *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={docQual}
                      onChange={(e) => setDocQual(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="form-group">
                      <label className="form-label">Consultation Fee (₹ INR)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={docFee}
                        onChange={(e) => setDocFee(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Assigned Room</label>
                      <input
                        type="text"
                        className="form-input"
                        value={docRoom}
                        onChange={(e) => setDocRoom(e.target.value)}
                        placeholder="Outpatient Suite 101"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-5 pt-3 border-t">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddDoctorModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Save Doctor</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
