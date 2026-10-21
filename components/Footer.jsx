'use client';

import React from 'react';
import Link from 'next/link';

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/doctors', label: 'Find Doctors' },
  { href: '/booking', label: 'Book OPD' },
  { href: '/records', label: 'Medical Records' },
  { href: '/ipfs', label: 'IPFS Health Hub' },
  { href: '/about', label: 'About MediCare+' },
  { href: '/contact', label: 'Contact Us' },
];

const SPECIALTIES = [
  { href: '/doctors?specialty=cardiology', label: 'Cardiology' },
  { href: '/doctors?specialty=neurology', label: 'Neurology' },
  { href: '/doctors?specialty=dermatology', label: 'Dermatology' },
  { href: '/doctors?specialty=pediatrics', label: 'Pediatrics' },
  { href: '/doctors?specialty=orthopedics', label: 'Orthopedics' },
  { href: '/doctors?specialty=dental', label: 'Dental Care' },
];

export default function Footer() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-brand">
          <Link href="/" className="brand-logo" style={{ color: '#FFFFFF' }}>
            <div className="brand-icon-wrapper">
              <i className="fa-solid fa-heart-pulse"></i>
            </div>
            <span>MediCare<span style={{ color: '#14B8A6' }}>+</span></span>
          </Link>
          <p>
            MediCare+ is a decentralized hospital appointment and electronic health records system featuring in-browser IPFS content-addressed storage, ABDM compliance, and verified specialists across India.
          </p>
          <div className="footer-social-links">
            <a href="#" title="Twitter / X" aria-label="Follow us on X">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="#" title="LinkedIn" aria-label="Connect on LinkedIn">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="#" title="Facebook" aria-label="Find us on Facebook">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="#" title="GitHub" aria-label="View source on GitHub">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="#" title="YouTube" aria-label="Subscribe on YouTube">
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="footer-col-title">Quick Links</h4>
          <ul className="footer-links-list">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.5rem', color: 'var(--clr-teal)' }}></i>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Specialties */}
        <div>
          <h4 className="footer-col-title">Specialties</h4>
          <ul className="footer-links-list">
            {SPECIALTIES.map((spec) => (
              <li key={spec.href}>
                <Link href={spec.href}>
                  <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.5rem', color: 'var(--clr-teal)' }}></i>
                  {spec.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info - India */}
        <div>
          <h4 className="footer-col-title">Hospital Hub (India)</h4>
          <ul className="footer-links-list">
            <li>
              <span>
                <i className="fa-solid fa-location-dot text-primary"></i>
                Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103
              </span>
            </li>
            <li>
              <a href="tel:+918045678900">
                <i className="fa-solid fa-phone" style={{ color: 'var(--clr-teal)' }}></i>
                +91 (80) 4567-8900
              </a>
            </li>
            <li>
              <a href="mailto:support@medicare.org.in">
                <i className="fa-solid fa-envelope" style={{ color: 'var(--clr-amber)' }}></i>
                support@medicare.org.in
              </a>
            </li>
            <li>
              <span>
                <i className="fa-solid fa-clock" style={{ color: 'var(--clr-emerald)' }}></i>
                24/7 OPD &amp; Emergency Trauma Center
              </span>
            </li>
            <li style={{ marginTop: '0.75rem' }} className="flex gap-2 flex-wrap">
              <a href="tel:108" className="hotline-btn" style={{ padding: '0.5rem 0.85rem', fontSize: '0.75rem', borderRadius: 'var(--r-md)', background: 'var(--clr-danger)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <i className="fa-solid fa-phone-volume"></i>
                Ambulance: 108
              </a>
              <a href="tel:112" className="hotline-btn" style={{ padding: '0.5rem 0.85rem', fontSize: '0.75rem', borderRadius: 'var(--r-md)', background: 'rgba(255,255,255,0.15)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <i className="fa-solid fa-shield"></i>
                Unified: 112
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <span>
          &copy; 2026 MediCare+ Health Systems (Bharat) &mdash; InterPlanetary File System (IPFS) Enabled.
        </span>
        <div className="flex gap-4" style={{ fontSize: '.8125rem' }}>
          <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
          <span>&bull;</span>
          <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          <span>&bull;</span>
          <span style={{ cursor: 'pointer' }}>ABDM / DISHA Standard</span>
        </div>
      </div>
    </footer>
  );
}
