'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../../components/AppContext';
import { Storage } from '../../lib/storageService';

function BookingWizard() {
  const { doctors, currentUser, showToast, refreshData } = useApp();
  const searchParams = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctorId');

  const [step, setStep] = useState(1);
  const [selectedDocId, setSelectedDocId] = useState(preselectedDoctorId || (doctors[0]?.id || 'doc-1'));
  const [bookingDate, setBookingDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [visitType, setVisitType] = useState('In-Clinic');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    if (preselectedDoctorId) setSelectedDocId(preselectedDoctorId);
  }, [preselectedDoctorId]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const doctor = doctors.find((d) => d.id === selectedDocId) || doctors[0];
  const timeSlots = doctor?.slots || ['09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM'];

  const handleConfirm = () => {
    const refCode = 'MED-2026-' + Math.floor(1000 + Math.random() * 9000);
    const newAppt = {
      id: 'apt-' + Date.now(),
      referenceId: refCode,
      patientId: currentUser?.id || 'pat-101',
      patientName: currentUser?.name || 'Alex Morgan',
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialtyName,
      doctorImage: doctor.image,
      clinicRoom: doctor.room,
      date: bookingDate,
      timeSlot: selectedSlot || timeSlots[0],
      consultationFee: doctor.fee,
      status: 'Upcoming',
      type: visitType,
      symptoms: symptoms || 'Routine Consultation',
      notes: notes || 'None',
      createdAt: new Date().toISOString(),
      ipfsCid: 'bafybeih' + Math.random().toString(36).substring(2, 12),
    };

    Storage.addAppointment(newAppt);
    refreshData();
    setConfirmedBooking(newAppt);
    showToast(`Appointment confirmed! Reference: ${refCode}`, 'success');
  };

  const STEPS = [
    { num: 1, label: 'Specialist', icon: 'fa-user-doctor' },
    { num: 2, label: 'Date',       icon: 'fa-calendar' },
    { num: 3, label: 'Time Slot',  icon: 'fa-clock' },
    { num: 4, label: 'Symptoms',   icon: 'fa-stethoscope' },
    { num: 5, label: 'Confirm',    icon: 'fa-check' },
  ];

  if (confirmedBooking) {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div className="card p-6 text-center">
          <div className="receipt-success-icon">
            <i className="fa-solid fa-check"></i>
          </div>
          <h2 className="text-2xl font-bold mb-1">Appointment Confirmed!</h2>
          <p className="text-sm text-muted mb-6">
            Your appointment has been registered and anchored on the MediCare+ EHR ledger.
          </p>

          <div className="alert alert-success mb-4" style={{ textAlign: 'left' }}>
            <i className="fa-solid fa-circle-check"></i>
            <span>A confirmation reference has been assigned. Please save it for your records.</span>
          </div>

          <div className="receipt-card">
            <div className="receipt-row">
              <span className="receipt-label">Reference ID</span>
              <span className="receipt-id-badge">{confirmedBooking.referenceId}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Attending Doctor</span>
              <span className="receipt-value">{confirmedBooking.doctorName} ({confirmedBooking.doctorSpecialty})</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Date &amp; Time</span>
              <span className="receipt-value">{confirmedBooking.date} at {confirmedBooking.timeSlot}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Consultation Type</span>
              <span className="receipt-value">{confirmedBooking.type}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Clinic Room</span>
              <span className="receipt-value">{confirmedBooking.clinicRoom}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Consultation Fee</span>
              <span className="receipt-value text-primary font-bold">₹{confirmedBooking.consultationFee} INR</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">IPFS Receipt CID</span>
              <span className="receipt-value font-mono text-teal break-all" style={{ fontSize: '0.6875rem' }}>{confirmedBooking.ipfsCid}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-5">
            <button className="btn btn-secondary btn-sm no-print" onClick={() => window.print()}>
              <i className="fa-solid fa-print"></i> Print Slip
            </button>
            <Link href="/appointments" className="btn btn-primary btn-sm">
              <i className="fa-regular fa-calendar-check"></i> View My Appointments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Page Header */}
      <div className="dashboard-welcome-banner">
        <div>
          <div className="page-eyebrow"><i className="fa-regular fa-calendar-plus"></i> Appointment Booking</div>
          <h1 className="welcome-title">Schedule a Doctor Consultation</h1>
          <p className="welcome-subtitle">Complete the 5-step intuitive booking process for in-clinic or telemedicine sessions.</p>
        </div>
        <Link href="/doctors" className="btn btn-secondary btn-sm">
          <i className="fa-solid fa-arrow-left"></i> Back to Directory
        </Link>
      </div>

      {/* 5-Step Progress */}
      <div className="wizard-progress-bar">
        {STEPS.map((node) => (
          <div
            key={node.num}
            className={`wizard-step-node ${step === node.num ? 'active' : step > node.num ? 'completed' : ''}`}
          >
            <div className="node-circle">
              {step > node.num ? <i className="fa-solid fa-check" style={{ fontSize: '0.75rem' }}></i> : node.num}
            </div>
            <span className="node-label">{node.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: Select Specialist */}
      {step === 1 && (
        <div className="booking-step-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold">Step 1: Select Your Specialist</h3>
              <p className="text-sm text-muted mt-1">Choose the physician you would like to consult with.</p>
            </div>
            <span className="badge badge-primary">1 of 5</span>
          </div>
          <div className="booking-doctor-selector-grid">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className={`booking-doctor-card ${selectedDocId === doc.id ? 'selected' : ''}`}
                onClick={() => setSelectedDocId(doc.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedDocId(doc.id)}
              >
                <img src={doc.image} alt={doc.name} />
                <div className="booking-doctor-card-info">
                  <h4>{doc.name}</h4>
                  <p>{doc.specialtyName} &bull; ₹{doc.fee}</p>
                </div>
                {selectedDocId === doc.id && (
                  <div style={{ marginLeft: 'auto', color: 'var(--clr-primary)', flexShrink: 0 }}>
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button className="btn btn-primary" onClick={() => setStep(2)}>
              Continue to Date <i className="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Choose Date */}
      {step === 2 && (
        <div className="booking-step-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold">Step 2: Choose Consultation Date</h3>
              <p className="text-sm text-muted mt-1">Select an upcoming clinic appointment day.</p>
            </div>
            <span className="badge badge-primary">2 of 5</span>
          </div>

          {/* Selected doctor preview */}
          <div className="card mb-5 p-4 flex items-center gap-3">
            <img src={doctor?.image} alt={doctor?.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--clr-primary)', flexShrink: 0 }} />
            <div>
              <h4 className="font-bold text-sm">{doctor?.name}</h4>
              <p className="text-xs text-muted">{doctor?.specialtyName} &bull; {doctor?.room} &bull; ₹{doctor?.fee} INR</p>
            </div>
            <button className="btn btn-ghost btn-sm ml-auto" onClick={() => setStep(1)} title="Change doctor">
              <i className="fa-solid fa-pen-to-square text-primary"></i>
            </button>
          </div>

          <div className="form-group" style={{ maxWidth: 340 }}>
            <label className="form-label">Appointment Date *</label>
            <input
              type="date"
              className="form-input"
              value={bookingDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setBookingDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between gap-3 mt-6 pt-4 border-t">
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              <i className="fa-solid fa-arrow-left"></i> Back
            </button>
            <button className="btn btn-primary" onClick={() => setStep(3)} disabled={!bookingDate}>
              Choose Time Slot <i className="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Time Slot */}
      {step === 3 && (
        <div className="booking-step-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold">Step 3: Choose Time Slot</h3>
              <p className="text-sm text-muted mt-1">Select an open consultation window for <strong>{bookingDate}</strong>.</p>
            </div>
            <span className="badge badge-primary">3 of 5</span>
          </div>
          <div className="time-slot-grid">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={`time-slot-btn ${(selectedSlot || timeSlots[0]) === slot ? 'selected' : ''}`}
                onClick={() => setSelectedSlot(slot)}
              >
                <i className="fa-regular fa-clock"></i>
                {slot}
              </button>
            ))}
          </div>
          <div className="flex justify-between gap-3 mt-6 pt-4 border-t">
            <button className="btn btn-secondary" onClick={() => setStep(2)}>
              <i className="fa-solid fa-arrow-left"></i> Back
            </button>
            <button className="btn btn-primary" onClick={() => setStep(4)}>
              Add Symptoms <i className="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Symptoms */}
      {step === 4 && (
        <div className="booking-step-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold">Step 4: Clinical Visit Details</h3>
              <p className="text-sm text-muted mt-1">Describe your reason for consultation and visit preferences.</p>
            </div>
            <span className="badge badge-primary">4 of 5</span>
          </div>
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Consultation Type *</label>
              <select className="form-select" value={visitType} onChange={(e) => setVisitType(e.target.value)}>
                <option value="In-Clinic">🏥 In-Clinic Consultation</option>
                <option value="Telemedicine">💻 Telemedicine (Video Call)</option>
                <option value="Home Visit">🏠 Home Visit</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Primary Symptoms / Health Concerns *</label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="e.g. Recurrent chest pressure, shortness of breath on exertion, dizziness..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Notes for Physician <span className="text-muted font-normal">(Optional)</span></label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="Allergies, previous medications, surgical history, or any special requirements..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between gap-3 mt-6 pt-4 border-t">
            <button className="btn btn-secondary" onClick={() => setStep(3)}>
              <i className="fa-solid fa-arrow-left"></i> Back
            </button>
            <button className="btn btn-primary" onClick={() => setStep(5)}>
              Review Summary <i className="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Review & Confirm */}
      {step === 5 && (
        <div className="booking-step-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold">Step 5: Review &amp; Confirm Booking</h3>
              <p className="text-sm text-muted mt-1">Verify all clinical details before final registration.</p>
            </div>
            <span className="badge badge-success">Final Step</span>
          </div>

          <div className="card p-4 mb-4">
            <div className="flex items-center gap-3 pb-3 mb-3 border-b">
              <img src={doctor?.image} alt={doctor?.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--clr-primary)' }} />
              <div>
                <h4 className="font-bold">{doctor?.name}</h4>
                <p className="text-xs text-muted">{doctor?.specialtyName} &bull; {doctor?.room}</p>
              </div>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Scheduled Slot</span>
              <span className="receipt-value font-bold">{bookingDate} at {selectedSlot || timeSlots[0]}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Visit Modality</span>
              <span className="receipt-value">{visitType}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Patient Name</span>
              <span className="receipt-value">{currentUser?.name || 'Alex Morgan'}</span>
            </div>
            {symptoms && (
              <div className="receipt-row">
                <span className="receipt-label">Primary Symptoms</span>
                <span className="receipt-value" style={{ maxWidth: 260 }}>{symptoms}</span>
              </div>
            )}
            <div className="receipt-row">
              <span className="receipt-label">Consultation Fee</span>
              <span className="receipt-value text-primary font-bold">₹{doctor?.fee} INR</span>
            </div>
          </div>

          <div className="alert alert-info mb-4">
            <i className="fa-solid fa-circle-info"></i>
            <span>By confirming, your appointment will be securely registered and an IPFS receipt will be generated.</span>
          </div>

          <div className="flex justify-between gap-3 pt-4 border-t">
            <button className="btn btn-secondary" onClick={() => setStep(4)}>
              <i className="fa-solid fa-arrow-left"></i> Edit Details
            </button>
            <button className="btn btn-primary btn-lg" onClick={handleConfirm}>
              <i className="fa-solid fa-check-circle"></i> Confirm &amp; Book Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-primary" style={{ fontSize: '2rem' }}></i>
          <p className="text-muted mt-3">Loading Booking Wizard...</p>
        </div>
      </div>
    }>
      <BookingWizard />
    </Suspense>
  );
}
