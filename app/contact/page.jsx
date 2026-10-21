'use client';

import React, { useState } from 'react';
import { useApp } from '../../components/AppContext';

export default function ContactPage() {
  const { showToast } = useApp();
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Thank you! Your message has been sent to our clinical triage team.', 'success');
    e.target.reset();
  };

  const faqs = [
    {
      q: 'How fast can I get a doctor appointment confirmed?',
      a: 'Appointments booked through MediCare+ are confirmed instantly in real-time. You receive an immediate reference ID and clinical slip.'
    },
    {
      q: 'Are telemedicine consultations available 24/7?',
      a: 'Yes! Our general triage desk and on-call physicians conduct virtual consultations around the clock through secure browser-based sessions.'
    },
    {
      q: 'How do I access my electronic health records and lab reports?',
      a: 'Navigate to the Medical Records tab in your portal. All lab panels, consultation summaries, and prescriptions are hashed on IPFS and downloadable anytime.'
    },
    {
      q: 'Can I cancel or reschedule my appointment free of charge?',
      a: 'Yes, cancellations and rescheduling are completely free of charge up to 2 hours before your scheduled appointment time.'
    }
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="section-header-centered">
        <span className="section-tag">Reach Out</span>
        <h1 className="section-heading-main">Contact MediCare+ Health Center</h1>
        <p className="section-subtext">Our patient experience team and clinical triage desks are available 24/7 to answer your inquiries and assist with bookings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Form Card */}
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-1">Send Us a Direct Message</h3>
          <p className="text-xs text-muted mb-4">Our clinical triage team typically responds within 30 minutes.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="form-label">Full Name *</label>
              <input type="text" className="form-input" required placeholder="First and Last Name" />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Email Address *</label>
              <input type="email" className="form-input" required placeholder="you@example.com" />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Subject</label>
              <select className="form-select">
                <option value="appointment">Appointment Query &amp; Scheduling</option>
                <option value="records">Medical Records &amp; IPFS Access</option>
                <option value="billing">Insurance &amp; Billing Inquiries</option>
                <option value="feedback">Doctor Feedback &amp; Review</option>
                <option value="other">General Inquiry</option>
              </select>
            </div>
            <div className="form-group mb-4">
              <label className="form-label">Message *</label>
              <textarea className="form-textarea" rows="4" required placeholder="How can our clinical team assist you today?"></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full btn-lg">
              <i className="fa-solid fa-paper-plane mr-1"></i> Send Message
            </button>
          </form>
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          <div className="contact-info-card">
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-primary"></i> Main Medical Pavilion &amp; Campus
            </h4>
            <p className="text-sm text-muted leading-relaxed">
              MediCare+ Super Specialty Health City, Outer Ring Road<br />
              Bellandur, Bengaluru, Karnataka 560103<br />
              <span className="text-xs text-primary font-bold mt-1 inline-block">Metro Shuttle &amp; Multi-Level OPD Parking Available at Gate 2</span>
            </p>
          </div>

          <div className="contact-info-card">
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
              <i className="fa-solid fa-phone text-teal"></i> Patient Helpline &amp; Appointments
            </h4>
            <p className="text-sm text-muted leading-relaxed">
              Hospital Desk: <strong>+91 (80) 4567-8900</strong><br />
              National Health Helpline: <strong>104</strong><br />
              Email Desk: <a href="mailto:support@medicare.org.in" className="text-primary font-bold">support@medicare.org.in</a>
            </p>
          </div>

          <div className="contact-info-card">
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
              <i className="fa-solid fa-clock text-amber"></i> Clinical Operating Hours
            </h4>
            <p className="text-sm text-muted leading-relaxed">
              Outpatient Specialist Clinics: Mon - Sat: 8:30 AM - 6:00 PM<br />
              Telemedicine Consultations: 24/7 Everyday<br />
              Emergency &amp; Trauma Resuscitation: 24/7 / 365 Days Uninterrupted
            </p>
          </div>

          <div className="card p-4 border" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'var(--clr-danger-bg)' }}>
            <div className="flex items-center gap-2 text-danger font-bold text-sm mb-1">
              <i className="fa-solid fa-truck-medical"></i> 24/7 Emergency &amp; Ambulance Dispatch
            </div>
            <p className="text-xs text-muted mb-3">
              For acute medical emergencies, cardiac trauma, or critical care ambulance dispatch in India:
            </p>
            <div className="flex gap-2 flex-wrap">
              <a href="tel:108" className="btn btn-danger btn-xs">
                <i className="fa-solid fa-phone"></i> National Ambulance: 108
              </a>
              <a href="tel:112" className="btn btn-secondary btn-xs">
                <i className="fa-solid fa-shield"></i> National Unified: 112
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="pt-8 border-t">
        <div className="section-header-centered">
          <span className="section-tag">Help &amp; Answers</span>
          <h2 className="section-heading-main">Frequently Asked Questions</h2>
          <p className="section-subtext">Find quick answers to common questions about doctor bookings and electronic medical records.</p>
        </div>

        <div className="space-y-3" style={{ maxWidth: 760, marginInline: 'auto' }}>
          {faqs.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                type="button"
                className="w-full p-4 text-left flex justify-between items-center bg-transparent border-0 font-bold text-sm text-navy cursor-pointer"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{faq.q}</span>
                <i className={`fa-solid ${openFaq === i ? 'fa-chevron-up text-primary' : 'fa-chevron-down text-muted'}`}></i>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 pt-1 text-xs text-muted leading-relaxed border-t bg-subtle">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
