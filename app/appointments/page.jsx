'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../components/AppContext';
import { Storage } from '../../lib/storageService';

export default function AppointmentsPage() {
  const { appointments, showToast, refreshData } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [rescheduleModalAppt, setRescheduleModalAppt] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('10:30 AM');

  const filteredAppointments = appointments.filter((a) => {
    if (activeTab === 'all') return true;
    return a.status.toLowerCase() === activeTab.toLowerCase();
  });

  const handleCancel = (id) => {
    if (confirm('Are you sure you want to cancel this clinical consultation?')) {
      Storage.updateAppointment(id, { status: 'Cancelled' });
      refreshData();
      showToast('Appointment cancelled successfully', 'warning');
    }
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!rescheduleModalAppt || !rescheduleDate) return;

    Storage.updateAppointment(rescheduleModalAppt.id, {
      date: rescheduleDate,
      timeSlot: rescheduleSlot,
      status: 'Upcoming'
    });
    refreshData();
    setRescheduleModalAppt(null);
    showToast('Appointment successfully rescheduled!', 'success');
  };

  return (
    <div className="page-container-lg">
      {/* Banner */}
      <div className="dashboard-welcome-banner">
        <div>
          <div className="page-eyebrow"><i className="fa-regular fa-calendar-check"></i> Patient Portal</div>
          <h1 className="welcome-title">My Appointments &amp; Consultations</h1>
          <p className="welcome-subtitle">Review scheduled visits, reschedule consultation slots, or view historical clinical slips.</p>
        </div>
        <Link href="/booking" className="btn btn-primary">
          <i className="fa-solid fa-calendar-plus mr-1"></i> Book New Appointment
        </Link>
      </div>

      {/* Tabs */}
      <div className="tab-pills-row">
        {['all', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => {
          const count = appointments.filter(a => tab === 'all' || a.status.toLowerCase() === tab.toLowerCase()).length;
          return (
            <button
              key={tab}
              className={`tab-pill ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab === 'all' ? 'All Visits' : tab}
              <span className={`badge ${tab === 'Upcoming' ? 'badge-primary' : tab === 'Completed' ? 'badge-success' : tab === 'Cancelled' ? 'badge-danger' : 'badge-subtle'} ml-1`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {filteredAppointments.length === 0 ? (
        <div className="empty-state card p-8">
          <div className="empty-state-icon"><i className="fa-regular fa-calendar-xmark"></i></div>
          <h3>No Appointments Found</h3>
          <p>You have no consultations listed in this tab. Schedule a visit with our specialist physicians.</p>
          <Link href="/booking" className="btn btn-primary btn-sm">
            <i className="fa-solid fa-plus mr-1"></i> Book an Appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((appt) => (
            <div key={appt.id} className="appointment-card">
              <div
                className={`appointment-card-status-bar ${
                  appt.status === 'Upcoming'
                    ? 'status-upcoming'
                    : appt.status === 'Completed'
                    ? 'status-completed'
                    : 'status-cancelled'
                }`}
              ></div>
              <img
                src={appt.doctorImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
                alt={appt.doctorName}
                className="appointment-card-avatar"
              />
              <div className="appointment-card-info">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="appointment-card-doctor">{appt.doctorName}</h4>
                  <span className={`badge ${appt.status === 'Upcoming' ? 'badge-primary' : appt.status === 'Completed' ? 'badge-success' : 'badge-danger'}`}>
                    {appt.status}
                  </span>
                </div>
                <div className="appointment-card-meta">
                  <span><i className="fa-solid fa-stethoscope"></i> {appt.doctorSpecialty}</span>
                  <span><i className="fa-regular fa-calendar"></i> {appt.date}</span>
                  <span><i className="fa-regular fa-clock"></i> {appt.timeSlot}</span>
                  <span><i className="fa-solid fa-hospital"></i> {appt.clinicRoom || 'Suite 402'}</span>
                  <span><i className="fa-solid fa-barcode"></i> Ref: <code className="font-mono">{appt.referenceId || appt.id}</code></span>
                </div>
              </div>
              <div className="appointment-card-actions">
                <button className="btn btn-secondary btn-xs" onClick={() => setSelectedAppt(appt)}>
                  <i className="fa-solid fa-circle-info mr-1"></i> Details
                </button>
                {appt.status === 'Upcoming' && (
                  <>
                    <button
                      className="btn btn-outline-primary btn-xs"
                      onClick={() => {
                        setRescheduleModalAppt(appt);
                        setRescheduleDate(appt.date);
                      }}
                    >
                      <i className="fa-solid fa-calendar-days mr-1"></i> Reschedule
                    </button>
                    <button className="btn btn-outline-danger btn-xs" onClick={() => handleCancel(appt.id)}>
                      <i className="fa-solid fa-ban mr-1"></i> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <div className="modal-overlay active" role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="fa-regular fa-calendar-check text-primary mr-1"></i> Appointment Overview
              </h3>
              <button className="modal-close-btn" onClick={() => setSelectedAppt(null)} aria-label="Close">&times;</button>
            </div>
            <div className="modal-body">
              <div className="receipt-card mb-4">
                <div className="receipt-row">
                  <span className="receipt-label">Reference ID</span>
                  <span className="receipt-id-badge">{selectedAppt.referenceId || selectedAppt.id}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Status</span>
                  <span className={`badge ${selectedAppt.status === 'Upcoming' ? 'badge-primary' : selectedAppt.status === 'Completed' ? 'badge-success' : 'badge-danger'}`}>
                    {selectedAppt.status}
                  </span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Specialist</span>
                  <span className="receipt-value">{selectedAppt.doctorName}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Department</span>
                  <span className="receipt-value">{selectedAppt.doctorSpecialty}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Date &amp; Slot</span>
                  <span className="receipt-value">{selectedAppt.date} at {selectedAppt.timeSlot}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Room / Location</span>
                  <span className="receipt-value">{selectedAppt.clinicRoom || 'Outpatient Suite 402'}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Reported Symptoms</span>
                  <span className="receipt-value text-xs">{selectedAppt.symptoms || 'General consultation'}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Consultation Fee</span>
                  <span className="receipt-value font-bold text-primary">₹{selectedAppt.consultationFee || selectedAppt.fee || 700} (Paid Online)</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">IPFS Receipt CID</span>
                  <span className="receipt-value font-mono text-teal text-xxs break-all">{selectedAppt.ipfsCid || 'bafybeih6m...'}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedAppt(null)}>Close</button>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}><i className="fa-solid fa-print mr-1"></i> Print Slip</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalAppt && (
        <div className="modal-overlay active" role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="fa-solid fa-arrows-rotate text-primary mr-1"></i> Reschedule Consultation
              </h3>
              <button className="modal-close-btn" onClick={() => setRescheduleModalAppt(null)} aria-label="Close">&times;</button>
            </div>
            <div className="modal-body">
              <p className="text-xs text-muted mb-4">
                Rescheduling consultation with <strong>{rescheduleModalAppt.doctorName}</strong>. Choose a new date and available slot.
              </p>
              <form onSubmit={handleRescheduleSubmit}>
                <div className="form-group mb-3">
                  <label className="form-label">New Consultation Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={rescheduleDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-4">
                  <label className="form-label">New Time Slot *</label>
                  <select
                    className="form-select"
                    value={rescheduleSlot}
                    onChange={(e) => setRescheduleSlot(e.target.value)}
                    required
                  >
                    <option value="09:30 AM">09:30 AM (Morning)</option>
                    <option value="10:30 AM">10:30 AM (Morning)</option>
                    <option value="11:30 AM">11:30 AM (Morning)</option>
                    <option value="02:00 PM">02:00 PM (Afternoon)</option>
                    <option value="03:30 PM">03:30 PM (Afternoon)</option>
                    <option value="04:30 PM">04:30 PM (Evening)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setRescheduleModalAppt(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Confirm Reschedule</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
