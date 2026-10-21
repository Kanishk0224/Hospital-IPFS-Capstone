import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="section-header-centered">
        <span className="section-tag">About MediCare+</span>
        <h1 className="section-heading-main">Leading Healthcare Technology for Modern Clinical Excellence</h1>
        <p className="section-subtext">
          Founded with the mission of eliminating barriers between patients and specialist doctors through intuitive digital workflows and decentralized health data architecture.
        </p>
      </div>

      {/* Mission Section */}
      <div className="about-mission-grid">
        <div>
          <span className="badge badge-primary mb-2">Our Mission</span>
          <h2 className="text-2xl font-bold mb-3">Pioneering Patient-Centric Medicine &amp; Verifiable Health Ledgers</h2>
          <p className="text-muted leading-relaxed mb-4">
            MediCare+ combines state-of-the-art medical technology with compassionate human care. Engineered as a high-performance Next.js web portal, our platform delivers instantaneous slot reservations, verifiable IPFS cryptographic hashing, and unified clinical records accessible from any device.
          </p>
          <div className="about-checklist">
            <div className="about-check-item">
              <i className="fa-solid fa-circle-check text-emerald mr-2"></i>
              <span>Over 50+ AIIMS New Delhi, CMC Vellore, NIMHANS, and PGIMER trained specialists.</span>
            </div>
            <div className="about-check-item">
              <i className="fa-solid fa-circle-check text-emerald mr-2"></i>
              <span>Decentralized electronic medical records anchored to IPFS (InterPlanetary File System).</span>
            </div>
            <div className="about-check-item">
              <i className="fa-solid fa-circle-check text-emerald mr-2"></i>
              <span>Zero-friction 5-step booking wizard with real-time OPD slot conflict resolution.</span>
            </div>
            <div className="about-check-item">
              <i className="fa-solid fa-circle-check text-emerald mr-2"></i>
              <span>Full compliance with ABDM (Ayushman Bharat Digital Mission) and DISHA guidelines.</span>
            </div>
          </div>
          <div className="mt-6 flex gap-2 flex-wrap">
            <Link href="/doctors" className="btn btn-primary">
              <i className="fa-solid fa-user-doctor mr-1"></i> Meet Our Doctors
            </Link>
            <Link href="/ipfs" className="btn btn-teal">
              <i className="fa-solid fa-cubes mr-1"></i> Explore IPFS Hub
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              <i className="fa-solid fa-envelope mr-1"></i> Contact Triage
            </Link>
          </div>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
            alt="Hospital Facility"
            className="rounded-xl shadow-lg w-full"
            style={{ maxHeight: 420, objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Core Values */}
      <div className="mt-12 pt-10 border-t">
        <div className="section-header-centered">
          <span className="section-tag">Clinical Standards</span>
          <h2 className="section-heading-main">Our Core Healthcare Pillars</h2>
          <p className="section-subtext">The medical and technological principles that guide every patient consultation at MediCare+.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: 'var(--clr-primary-light)', color: 'var(--clr-primary)' }}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h3 className="font-bold text-base mb-2">Cryptographic Privacy</h3>
            <p className="text-xs text-muted leading-relaxed">
              Every prescription and lab report is hashed with SHA-256 and pinned across our federated IPFS nodes, giving patients full sovereignty over their records.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: 'var(--clr-teal-light)', color: 'var(--clr-teal)' }}>
              <i className="fa-solid fa-hand-holding-medical"></i>
            </div>
            <h3 className="font-bold text-base mb-2">Evidence-Based Clinical Care</h3>
            <p className="text-xs text-muted leading-relaxed">
              Our clinical protocols follow strictly peer-reviewed medical guidelines, ensuring optimal recovery rates and minimal unnecessary interventions.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: 'var(--clr-success-bg)', color: 'var(--clr-success)' }}>
              <i className="fa-solid fa-bolt"></i>
            </div>
            <h3 className="font-bold text-base mb-2">Immediate Appointment Access</h3>
            <p className="text-xs text-muted leading-relaxed">
              Zero telephone queues. Book specialist appointments directly from your mobile phone or laptop in less than 2 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Hospital Certifications Bar */}
      <div className="mt-12 p-6 bg-subtle rounded-2xl border text-center">
        <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-4">Accredited &amp; Compliant With International Standards</span>
        <div className="flex justify-center items-center gap-8 flex-wrap text-muted" style={{ fontSize: '1.25rem' }}>
          <div className="flex items-center gap-2"><i className="fa-solid fa-certificate text-primary"></i> <span className="text-sm font-bold">NABH &amp; JCI Accredited</span></div>
          <div className="flex items-center gap-2"><i className="fa-solid fa-shield-check text-emerald"></i> <span className="text-sm font-bold">ABDM &amp; DISHA Compliant</span></div>
          <div className="flex items-center gap-2"><i className="fa-solid fa-award text-amber"></i> <span className="text-sm font-bold">ISO 9001:2020</span></div>
          <div className="flex items-center gap-2"><i className="fa-solid fa-cubes text-teal"></i> <span className="text-sm font-bold">IPFS InterPlanetary Verified</span></div>
        </div>
      </div>
    </div>
  );
}
