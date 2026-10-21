'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../components/AppContext';

export default function RecordsPage() {
  const { records, prescriptions, setIpfsExplorerOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedRx, setSelectedRx] = useState(null);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || r.specialty === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="page-container-lg">
      {/* Banner */}
      <div className="dashboard-welcome-banner">
        <div>
          <div className="page-eyebrow"><i className="fa-solid fa-file-waveform"></i> Electronic Health Record (EHR)</div>
          <h1 className="welcome-title">Medical Records &amp; Prescriptions</h1>
          <p className="welcome-subtitle">Access consultation history, diagnostic findings, recorded vitals, and verified pharmacy prescriptions.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href="/ipfs" className="btn btn-outline-teal">
            <i className="fa-solid fa-cubes mr-1"></i> IPFS Health Hub
          </Link>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <i className="fa-solid fa-print mr-1"></i> Print Summary
          </button>
        </div>
      </div>

      {/* IPFS Banner */}
      <div className="ipfs-overview-banner flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 'var(--r-lg)', background: 'rgba(20,184,166,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-teal)' }}>
            <i className="fa-solid fa-cubes text-xl"></i>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-white text-base">IPFS Decentralized Health Ledger</h3>
              <span className="badge badge-success text-xxs"><i className="fa-solid fa-circle-check"></i> Tamper-Proof</span>
              <span className="badge badge-teal text-xxs font-mono"><i className="fa-solid fa-network-wired"></i> 18 Nodes</span>
            </div>
            <p className="text-xs text-white opacity-80 mt-0.5">
              All clinical records are SHA-256 multihashed and pinned across the hospital IPFS swarm cluster.
            </p>
          </div>
        </div>
        <button className="btn btn-teal btn-sm flex-shrink-0" onClick={() => setIpfsExplorerOpen(true)}>
          <i className="fa-solid fa-satellite-dish mr-1"></i> Inspect Ledger
        </button>
      </div>

      {/* Controls */}
      <div className="directory-controls-bar">
        <div className="flex flex-wrap items-center gap-3">
          <div className="search-input-wrapper">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              className="form-input"
              placeholder="Search records by title, doctor, diagnosis, or symptom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted whitespace-nowrap">Filter Dept:</label>
            <select
              className="form-select text-sm"
              style={{ width: 'auto', padding: '.5rem .9rem' }}
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Ophthalmology">Ophthalmology</option>
            </select>
          </div>
        </div>
      </div>

      {/* Consultation Summaries Grid */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="fa-solid fa-file-waveform text-primary"></i> Consultation Summaries &amp; Diagnostic Reports
        </h2>
        {filteredRecords.length === 0 ? (
          <div className="empty-state card p-8">
            <div className="empty-state-icon"><i className="fa-solid fa-file-circle-xmark"></i></div>
            <h3>No Records Found</h3>
            <p>No medical records match your search criteria.</p>
          </div>
        ) : (
          <div className="records-grid">
            {filteredRecords.map((rec) => (
              <div key={rec.id} className="record-card" onClick={() => setSelectedRecord(rec)}>
                <div className="record-card-header">
                  <div className="record-card-icon" style={{ background: 'var(--clr-primary-light)', color: 'var(--clr-primary)' }}>
                    <i className="fa-solid fa-file-medical"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="record-card-title">{rec.title}</h4>
                    <span className="record-card-date">{rec.date}</span>
                  </div>
                </div>
                <div className="record-card-body">
                  <div className="record-card-meta">
                    <div className="record-meta-row">
                      <i className="fa-solid fa-user-doctor"></i>
                      <span>{rec.doctorName} ({rec.specialty})</span>
                    </div>
                    <div className="record-meta-row">
                      <i className="fa-solid fa-stethoscope"></i>
                      <span className="font-semibold text-primary">{rec.diagnosis}</span>
                    </div>
                  </div>
                  {rec.vitals && (
                    <div className="flex gap-2 flex-wrap mt-3">
                      <span className="badge badge-subtle">BP: {rec.vitals.bloodPressure}</span>
                      <span className="badge badge-subtle">HR: {rec.vitals.heartRate}</span>
                      <span className="badge badge-subtle">SpO2: {rec.vitals.spo2}</span>
                    </div>
                  )}
                </div>
                <div className="record-card-footer">
                  <span className="ipfs-record-badge">
                    <i className="fa-solid fa-cubes"></i> IPFS CID: {rec.ipfsCid ? rec.ipfsCid.substring(0, 10) + '...' : 'Pinned'}
                  </span>
                  <span className="text-xs text-primary font-bold">View EHR &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Official Prescriptions */}
      <div className="mt-10 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="fa-solid fa-prescription-bottle-medical text-teal"></i> Official Medical Prescriptions (Rx)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="prescription-card card">
              <div className="prescription-card-header">
                <div>
                  <span className="badge badge-teal mb-1">Official Clinical Rx</span>
                  <h4 className="font-bold text-base text-white">{rx.doctorName}</h4>
                  <p className="text-xs text-white opacity-80">{rx.doctorSpecialty} &bull; {rx.date}</p>
                </div>
                <div className="rx-symbol">Rx</div>
              </div>
              <div className="prescription-card-body">
                <div className="receipt-row">
                  <span className="receipt-label">Diagnosis</span>
                  <span className="receipt-value">{rx.diagnosis}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Medicines Count</span>
                  <span className="receipt-value font-bold">{rx.medicines?.length || 0} items prescribed</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">IPFS CID Stamp</span>
                  <span className="receipt-value font-mono text-teal text-xxs break-all">{rx.ipfsCid}</span>
                </div>
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
                  <button className="btn btn-primary btn-xs" onClick={() => setSelectedRx(rx)}>
                    <i className="fa-solid fa-file-prescription mr-1"></i> View Full Rx Sheet
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="modal-overlay active" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="fa-solid fa-file-waveform text-primary mr-1"></i> Clinical Consultation Summary
              </h3>
              <button className="modal-close-btn" onClick={() => setSelectedRecord(null)} aria-label="Close">&times;</button>
            </div>
            <div className="modal-body">
              <div className="receipt-card mb-4">
                <div className="receipt-row">
                  <span className="receipt-label">Report Title</span>
                  <span className="receipt-value font-bold">{selectedRecord.title}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Physician</span>
                  <span className="receipt-value">{selectedRecord.doctorName} ({selectedRecord.specialty})</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Consultation Date</span>
                  <span className="receipt-value">{selectedRecord.date}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Clinical Diagnosis</span>
                  <span className="receipt-value text-primary font-bold">{selectedRecord.diagnosis}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">IPFS CIDv1</span>
                  <span className="receipt-value font-mono text-teal text-xxs break-all">{selectedRecord.ipfsCid}</span>
                </div>
              </div>

              {selectedRecord.notes && (
                <div className="mb-4">
                  <h4 className="font-bold text-xs text-muted uppercase mb-1">Physician Clinical Assessment</h4>
                  <p className="text-xs bg-subtle p-3 rounded-lg border leading-relaxed">{selectedRecord.notes}</p>
                </div>
              )}

              {selectedRecord.vitals && (
                <div className="mb-4">
                  <h4 className="font-bold text-xs text-muted uppercase mb-2">Recorded Vitals</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-subtle rounded-lg border">
                      <span className="text-xxs text-muted block uppercase">Blood Pressure</span>
                      <strong className="text-xs font-mono">{selectedRecord.vitals.bloodPressure}</strong>
                    </div>
                    <div className="p-2 bg-subtle rounded-lg border">
                      <span className="text-xxs text-muted block uppercase">Heart Rate</span>
                      <strong className="text-xs font-mono">{selectedRecord.vitals.heartRate}</strong>
                    </div>
                    <div className="p-2 bg-subtle rounded-lg border">
                      <span className="text-xxs text-muted block uppercase">Blood Oxygen</span>
                      <strong className="text-xs font-mono">{selectedRecord.vitals.spo2}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedRecord(null)}>Close</button>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}><i className="fa-solid fa-print mr-1"></i> Print EHR</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Full Sheet Modal */}
      {selectedRx && (
        <div className="modal-overlay active" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="fa-solid fa-prescription text-teal mr-1"></i> Official Medical Prescription (Rx)
              </h3>
              <button className="modal-close-btn" onClick={() => setSelectedRx(null)} aria-label="Close">&times;</button>
            </div>
            <div className="modal-body">
              <div className="border p-4 rounded-xl bg-white text-navy mb-4">
                <div className="flex justify-between items-start border-b pb-3 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-primary">MediCare+ Clinical Center</h3>
                    <p className="text-xs text-muted">Licensure: #MD-92814-IL &bull; 500 Healthcare Blvd, Suite 100</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold block text-primary">{selectedRx.id}</span>
                    <span className="text-xs text-muted">{selectedRx.date}</span>
                  </div>
                </div>

                <div className="mb-3 text-xs">
                  <strong>Prescribing Doctor:</strong> {selectedRx.doctorName} ({selectedRx.doctorSpecialty})<br />
                  <strong>Diagnosis:</strong> {selectedRx.diagnosis}
                </div>

                <div className="data-table-container mb-3">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRx.medicines?.map((m, i) => (
                        <tr key={i}>
                          <td className="font-bold">{m.name}</td>
                          <td>{m.dosage || m.strength}</td>
                          <td>{m.frequency}</td>
                          <td>{m.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 pt-2 border-t text-xxs text-muted font-mono break-all">
                  Digital Signature: {selectedRx.digitalSignatureHash || 'SHA256:4a8b19e07823e5912...'}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedRx(null)}>Close</button>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}><i className="fa-solid fa-print mr-1"></i> Print Rx</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
