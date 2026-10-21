'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../components/AppContext';
import { DEFAULT_SPECIALTIES } from '../lib/clinicalData';

export default function HomePage() {
  const { doctors } = useApp();
  const topDoctors = doctors.slice(0, 4);

  return (
    <div>
      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-content-left">
            <div className="hero-pill-badge">
              <i className="fa-solid fa-shield-heart"></i>
              <span>Award-Winning Integrated Healthcare &amp; EHR Platform</span>
            </div>
            <h1 className="hero-title">
              Your Health,<br />
              <span className="text-gradient">Our Priority</span>
            </h1>
            <p className="hero-subtitle">
              Book appointments with board-certified specialists, access encrypted electronic medical records, and manage your complete health journey — all in one secure portal.
            </p>
            <div className="hero-cta-group">
              <Link href="/booking" className="btn btn-primary btn-xl">
                <i className="fa-regular fa-calendar-check"></i>
                Book an Appointment
              </Link>
              <Link href="/doctors" className="btn btn-outline-primary btn-xl">
                <i className="fa-solid fa-user-doctor"></i>
                Explore Doctors
              </Link>
            </div>
            <div className="hero-trust-bar">
              <div className="trust-item">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span>24/7 Clinical Care</span>
              </div>
              <div className="trust-item">
                <i className="fa-solid fa-user-shield"></i>
                <span>Board-Certified</span>
              </div>
              <div className="trust-item">
                <i className="fa-solid fa-certificate"></i>
                <span>ISO 9001 Certified</span>
              </div>
              <div className="trust-item">
                <i className="fa-solid fa-lock"></i>
                <span>HIPAA Compliant</span>
              </div>
            </div>
          </div>

          <div className="hero-media-wrapper">
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800"
                alt="Professional Doctor in clinic"
                className="hero-doctor-img"
              />
              <div className="floating-glass-card card-top">
                <div className="floating-card-icon blue-bg">
                  <i className="fa-solid fa-heart-pulse"></i>
                </div>
                <div>
                  <span className="text-sm font-bold block">99.4% Positive</span>
                  <span className="text-xs text-muted">Patient Recovery Index</span>
                </div>
              </div>
              <div className="floating-glass-card card-bottom">
                <div className="floating-card-icon teal-bg">
                  <i className="fa-solid fa-calendar-check"></i>
                </div>
                <div>
                  <span className="text-sm font-bold block">Instant Booking</span>
                  <span className="text-xs text-muted">Zero Waiting Time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Statistics Bar ────────────────────────────────── */}
      <section className="statistics-section">
        <div className="stats-grid stagger-children">
          <div className="stat-counter-card">
            <div className="stat-counter-number">50+</div>
            <div className="stat-counter-label">Specialist Doctors</div>
          </div>
          <div className="stat-counter-card">
            <div className="stat-counter-number">25,000+</div>
            <div className="stat-counter-label">Patients Treated</div>
          </div>
          <div className="stat-counter-card">
            <div className="stat-counter-number">15+</div>
            <div className="stat-counter-label">Medical Specialties</div>
          </div>
          <div className="stat-counter-card">
            <div className="stat-counter-number">99.4%</div>
            <div className="stat-counter-label">Satisfaction Rating</div>
          </div>
        </div>
      </section>

      {/* ── Featured Specialties ──────────────────────────── */}
      <section className="specialties-section">
        <div className="section-header-centered">
          <span className="section-tag">Clinical Departments</span>
          <h2 className="section-heading-main">Featured Medical Specialties</h2>
          <p className="section-subtext">
            Our multi-specialty center provides world-class diagnostic and therapeutic interventions across all major medical fields.
          </p>
        </div>
        <div className="specialties-grid stagger-children">
          {DEFAULT_SPECIALTIES.map((spec) => (
            <Link
              key={spec.id}
              href={`/doctors?specialty=${spec.id}`}
              className="specialty-card"
            >
              <div className="specialty-icon" style={{ background: spec.bg, color: spec.color }}>
                <i className={`fa-solid ${spec.icon}`}></i>
              </div>
              <h3 className="specialty-name">{spec.name}</h3>
              <p className="specialty-count">{spec.doctorCount} Doctors Available</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Top Doctors Showcase ──────────────────────────── */}
      <section className="doctors-showcase-section">
        <div className="section-header-centered">
          <span className="section-tag">Expert Practitioners</span>
          <h2 className="section-heading-main">Meet Our Top-Rated Doctors</h2>
          <p className="section-subtext">
            Consult with verified specialists graduated from prestigious institutions with decades of clinical excellence.
          </p>
        </div>
        <div className="doctors-grid stagger-children">
          {topDoctors.map((doc) => (
            <div key={doc.id} className="doctor-card">
              <div className="doctor-card-image-wrapper">
                <img src={doc.image} alt={doc.name} />
                <span className="doctor-card-specialty-badge badge badge-primary">{doc.specialtyName}</span>
                <span className="doctor-card-availability">
                  <span className="status-dot online"></span>
                  {doc.availableStatus}
                </span>
              </div>
              <div className="doctor-card-body">
                <h3 className="doctor-card-name">{doc.name}</h3>
                <p className="doctor-card-qual">{doc.qualification}</p>
                <div className="doctor-card-stats">
                  <div className="doctor-card-stat">
                    <i className="fa-solid fa-briefcase"></i>
                    {doc.experience} yrs exp
                  </div>
                  <div className="doctor-card-stat">
                    <i className="fa-solid fa-star" style={{ color: '#F59E0B' }}></i>
                    {doc.rating}
                  </div>
                </div>
                <div className="doctor-card-footer">
                  <div className="doctor-card-fee">₹{doc.fee} <span>/ consult</span></div>
                  <Link href={`/booking?doctorId=${doc.id}`} className="btn btn-primary btn-sm">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/doctors" className="btn btn-outline-primary btn-lg">
            View All Specialist Doctors <i className="fa-solid fa-arrow-right ml-1"></i>
          </Link>
        </div>
      </section>

      {/* ── 3-Step Process ────────────────────────────────── */}
      <section className="process-section">
        <div className="section-header-centered">
          <span className="section-tag">Seamless Experience</span>
          <h2 className="section-heading-main">Book an Appointment in 3 Steps</h2>
          <p className="section-subtext">
            Schedule your consultation in under 2 minutes — no phone queues, no paperwork.
          </p>
        </div>
        <div className="process-steps-grid stagger-children">
          <div className="process-card">
            <div className="process-number-badge">1</div>
            <div className="process-icon-box">
              <i className="fa-solid fa-user-doctor"></i>
            </div>
            <h3 className="process-title">Find Your Specialist</h3>
            <p className="process-desc">Search by specialty, symptoms, or doctor credentials to select the ideal clinician for your needs.</p>
          </div>
          <div className="process-card">
            <div className="process-number-badge">2</div>
            <div className="process-icon-box">
              <i className="fa-regular fa-calendar-days"></i>
            </div>
            <h3 className="process-title">Choose Date &amp; Time Slot</h3>
            <p className="process-desc">Pick convenient consultation hours with real-time slot availability — morning, afternoon, or evening.</p>
          </div>
          <div className="process-card">
            <div className="process-number-badge">3</div>
            <div className="process-icon-box">
              <i className="fa-solid fa-receipt"></i>
            </div>
            <h3 className="process-title">Instant Confirmation &amp; EHR</h3>
            <p className="process-desc">Receive immediate appointment slips with reference IDs, synced securely to your IPFS health record.</p>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────── */}
      <section style={{ padding: 'var(--section-padding)', background: 'var(--bg-body)' }}>
        <div style={{ maxWidth: 'var(--content-max)', marginInline: 'auto' }}>
          <div className="section-header-centered">
            <span className="section-tag">Why MediCare+</span>
            <h2 className="section-heading-main">Healthcare, Reimagined for the Digital Age</h2>
            <p className="section-subtext">
              From booking to billing, we have digitized every aspect of your healthcare experience.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }} className="stagger-children">
            {[
              { icon: 'fa-shield-halved', color: 'var(--clr-primary)', bg: 'var(--clr-primary-light)', title: 'ABDM & IPFS Encrypted', desc: 'Your health records are encrypted end-to-end and anchored on a decentralized IPFS ledger for tamper-proof storage.' },
              { icon: 'fa-user-doctor', color: 'var(--clr-teal)', bg: 'var(--clr-teal-light)', title: 'Verified Indian Specialists', desc: 'Every doctor is MCI/NMC board-certified from premier institutions like AIIMS, CMC Vellore, and NIMHANS.' },
              { icon: 'fa-clock', color: 'var(--clr-success)', bg: 'var(--clr-success-bg)', title: '24/7 Availability', desc: 'Emergency care, telemedicine, and OPD consultations are available around the clock.' },
              { icon: 'fa-mobile-screen', color: 'var(--clr-purple)', bg: 'var(--clr-purple-bg)', title: 'Modern Patient Portal', desc: 'Access your records, prescriptions, and appointments anywhere, anytime from any device.' },
            ].map((item, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon-box" style={{ background: item.bg, color: item.color }}>
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' }}>{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Emergency Hotline Banner ──────────────────────── */}
      <section className="emergency-banner-section">
        <div className="emergency-banner-container">
          <div className="emergency-text">
            <h3>
              <i className="fa-solid fa-truck-medical mr-2"></i>
              Need 24/7 Emergency Medical Attention in India?
            </h3>
            <p>Our trauma emergency response wing and cardiac resuscitation unit operate 24 hours a day with national ambulance dispatch.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <a href="tel:108" className="hotline-btn">
              <i className="fa-solid fa-phone-volume"></i>
              Ambulance: 108
            </a>
            <a href="tel:112" className="hotline-btn" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <i className="fa-solid fa-shield"></i>
              Emergency: 112
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
