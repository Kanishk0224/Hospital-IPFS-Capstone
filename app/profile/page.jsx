'use client';

import React, { useState } from 'react';
import { useApp } from '../../components/AppContext';

export default function ProfilePage() {
  const { currentUser, showToast } = useApp();
  const [name, setName] = useState(currentUser?.name || 'Rahul Sharma');
  const [email, setEmail] = useState(currentUser?.email || 'rahul.sharma@example.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [bloodGroup, setBloodGroup] = useState(currentUser?.bloodGroup || 'O+');
  const [emergencyContact, setEmergencyContact] = useState('Priya Sharma (+91 98765 11223)');
  const [allergies, setAllergies] = useState('Penicillin (Mild rash), Dust Mites');

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Patient demographic profile updated successfully!', 'success');
  };

  return (
    <div className="page-container">
      <div className="dashboard-welcome-banner">
        <div>
          <div className="page-eyebrow"><i className="fa-regular fa-id-badge"></i> Demographics &amp; Clinical Data &bull; ABHA ID: 91-4829-1029</div>
          <h1 className="welcome-title">Patient Medical Profile</h1>
          <p className="welcome-subtitle">Maintain updated emergency contacts, known allergies, blood profile, and personal health demographics.</p>
        </div>
      </div>

      <div className="profile-view-wrapper">
        <div className="profile-summary-card">
          <div className="profile-avatar-wrapper">
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
              alt="Avatar"
            />
            <span className="profile-online-dot"><i className="fa-solid fa-check"></i></span>
          </div>
          <h3 className="text-xl font-bold mb-1">{name}</h3>
          <p className="text-xs text-muted font-mono mb-3">Patient ID: #{currentUser?.id || 'pat-101'}</p>
          <div className="flex justify-center gap-2 flex-wrap mb-4">
            <span className="badge badge-primary">Blood: <strong>{bloodGroup}</strong></span>
            <span className="badge badge-success"><i className="fa-solid fa-shield-check mr-1"></i> ABHA Verified</span>
          </div>

          <div className="bg-subtle p-3 rounded-xl border text-left text-xs mb-3 space-y-1">
            <div className="flex justify-between">
              <span className="text-muted">Primary Physician:</span>
              <strong className="text-primary">Dr. Priya Patel (AIIMS)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Insurance Policy:</span>
              <strong className="font-mono">Star Health Premier (#SH-882914-IN)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">IPFS Ledger Key:</span>
              <strong className="font-mono text-teal">0x4F...91C2</strong>
            </div>
          </div>

          <div className="pt-3 border-t text-left text-xs text-muted">
            <p><i className="fa-solid fa-shield-halved text-primary mr-1"></i> Protected by ABDM &amp; DISHA standards with 256-bit IPFS envelope encryption.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-base font-bold flex items-center gap-2">
                <i className="fa-solid fa-user-pen text-primary"></i> Personal Demographics
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select
                      className="form-select"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                    >
                      <option value="O+">O+ (Universal Red Cell Donor)</option>
                      <option value="O-">O- (Universal Donor)</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+ (Universal Recipient)</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div className="form-group sm:col-span-2">
                    <label className="form-label">Emergency Contact (Name &amp; Phone)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="Relationship, Name, Phone"
                    />
                  </div>
                  <div className="form-group sm:col-span-2">
                    <label className="form-label">Known Allergies &amp; Drug Sensitivities</label>
                    <input
                      type="text"
                      className="form-input"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="e.g. Penicillin, NSAIDs, Sulfa"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                  <button type="submit" className="btn btn-primary">
                    <i className="fa-solid fa-floppy-disk mr-1"></i> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
