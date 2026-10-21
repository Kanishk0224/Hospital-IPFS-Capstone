'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '../../components/AppContext';

export default function DoctorsPage() {
  const { doctors } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [availableToday, setAvailableToday] = useState('all');
  const [maxFee, setMaxFee] = useState(1500);
  const [sortBy, setSortBy] = useState('recommended');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => {
        const matchesSearch =
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.qualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.specialtyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = specialty === 'all' || doc.specialty === specialty;
        const matchesAvailability = availableToday === 'all' || doc.availableToday;
        const matchesFee = doc.fee <= maxFee;
        return matchesSearch && matchesSpecialty && matchesAvailability && matchesFee;
      })
      .sort((a, b) => {
        if (sortBy === 'exp-desc') return b.experience - a.experience;
        if (sortBy === 'fee-asc') return a.fee - b.fee;
        if (sortBy === 'fee-desc') return b.fee - a.fee;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return b.rating - a.rating;
      });
  }, [doctors, searchTerm, specialty, availableToday, maxFee, sortBy]);

  const specialtiesList = [
    { id: 'all', label: 'All Specialties' },
    { id: 'cardiology', label: 'Cardiology' },
    { id: 'neurology', label: 'Neurology' },
    { id: 'dermatology', label: 'Dermatology' },
    { id: 'pediatrics', label: 'Pediatrics' },
    { id: 'orthopedics', label: 'Orthopedics' },
    { id: 'general', label: 'General Medicine' },
    { id: 'ophthalmology', label: 'Ophthalmology' },
    { id: 'dental', label: 'Dental Care' },
  ];

  return (
    <div className="page-container-lg">
      {/* Page Header */}
      <div className="dashboard-welcome-banner">
        <div>
          <div className="page-eyebrow"><i className="fa-solid fa-user-doctor"></i> Medical Staff Directory</div>
          <h1 className="welcome-title">Find Trusted Specialist Doctors</h1>
          <p className="welcome-subtitle">Search, filter by medical specialty, experience &amp; fee, then book directly.</p>
        </div>
        <Link href="/booking" className="btn btn-primary">
          <i className="fa-solid fa-calendar-plus mr-1"></i> Quick Booking Wizard
        </Link>
      </div>

      {/* Directory Controls Bar */}
      <div className="directory-controls-bar">
        <div className="flex flex-wrap items-center gap-3">
          <div className="search-input-wrapper">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              className="form-input"
              placeholder="Search doctor by name, qualification, or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted whitespace-nowrap">Availability:</label>
            <select
              className="form-select text-sm"
              style={{ width: 'auto', padding: '.5rem .9rem' }}
              value={availableToday}
              onChange={(e) => setAvailableToday(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="today">Available Today Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted whitespace-nowrap">
              Max Fee: <span className="text-primary font-bold">₹{maxFee}</span>
            </label>
            <input
              type="range"
              min="500"
              max="1500"
              step="50"
              value={maxFee}
              onChange={(e) => setMaxFee(Number(e.target.value))}
              style={{ width: 110 }}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted whitespace-nowrap">Sort By:</label>
            <select
              className="form-select text-sm"
              style={{ width: 'auto', padding: '.5rem .9rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Recommended (Top Rated)</option>
              <option value="exp-desc">Experience (Highest First)</option>
              <option value="fee-asc">Fee (Lowest First)</option>
              <option value="fee-desc">Fee (Highest First)</option>
              <option value="name-asc">Name (A–Z)</option>
            </select>
          </div>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              setSearchTerm('');
              setSpecialty('all');
              setAvailableToday('all');
              setMaxFee(200);
              setSortBy('recommended');
            }}
          >
            <i className="fa-solid fa-rotate-left mr-1"></i> Reset
          </button>
        </div>

        {/* Specialty Filter Pills */}
        <div className="filter-pills-row">
          {specialtiesList.map((item) => (
            <button
              key={item.id}
              className={`filter-pill ${specialty === item.id ? 'active' : ''}`}
              onClick={() => setSpecialty(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result Counter */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-semibold text-muted">
          Showing <strong>{filteredDoctors.length}</strong> board-certified specialists
        </span>
        <span className="text-xs text-muted">
          <i className="fa-solid fa-check-double text-teal mr-1"></i> All doctors verified &amp; credentialed
        </span>
      </div>

      {/* Doctor Grid */}
      <div className="doctors-grid">
        {filteredDoctors.map((doc) => (
          <div key={doc.id} className="doctor-card">
            <div className="doctor-card-image-wrapper">
              <img src={doc.image} alt={doc.name} />
              <span className="doctor-card-specialty-badge badge badge-primary">{doc.specialtyName}</span>
              <span className="doctor-card-availability">
                <span className={`status-dot ${doc.availableToday ? 'online' : 'busy'}`}></span>
                {doc.availableStatus}
              </span>
            </div>
            <div className="doctor-card-body">
              <h3 className="doctor-card-name">{doc.name}</h3>
              <p className="doctor-card-qual">{doc.qualification}</p>
              <div className="doctor-card-stats">
                <div className="doctor-card-stat"><i className="fa-solid fa-briefcase"></i> {doc.experience} yrs exp</div>
                <div className="doctor-card-stat"><i className="fa-solid fa-star" style={{ color: '#F59E0B' }}></i> {doc.rating} ({doc.reviewCount})</div>
              </div>
              <div className="doctor-card-footer">
                <div className="doctor-card-fee">₹{doc.fee} <span>/ session</span></div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-secondary btn-xs"
                    onClick={() => setSelectedDoctor(doc)}
                  >
                    View Bio
                  </button>
                  <Link href={`/booking?doctorId=${doc.id}`} className="btn btn-primary btn-xs">
                    Book
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Bio Modal */}
      {selectedDoctor && (
        <div className="modal-overlay active" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="fa-solid fa-user-doctor text-primary"></i> Doctor Profile &amp; Qualifications
              </h3>
              <button className="modal-close-btn" onClick={() => setSelectedDoctor(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="doctor-profile-header">
                <img src={selectedDoctor.image} alt={selectedDoctor.name} className="doctor-profile-img" />
                <div className="doctor-profile-info">
                  <h2>{selectedDoctor.name}</h2>
                  <p>{selectedDoctor.qualification}</p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className="badge badge-teal">{selectedDoctor.specialtyName}</span>
                    <span className="badge badge-success">{selectedDoctor.experience} Years Experience</span>
                    <span className="badge badge-primary">₹{selectedDoctor.fee} INR</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-sm text-primary mb-1">Clinical Biography</h4>
                  <p className="text-xs text-muted leading-relaxed">{selectedDoctor.about}</p>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary mb-1">Education &amp; Fellowships</h4>
                  <p className="text-xs text-muted">{selectedDoctor.education}</p>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary mb-1">Consultation Hours &amp; Clinic Room</h4>
                  <p className="text-xs text-muted">{selectedDoctor.room} &bull; {selectedDoctor.consultationHours}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDoctor(null)}>Close</button>
                <Link
                  href={`/booking?doctorId=${selectedDoctor.id}`}
                  className="btn btn-primary btn-sm"
                  onClick={() => setSelectedDoctor(null)}
                >
                  Book with {selectedDoctor.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
