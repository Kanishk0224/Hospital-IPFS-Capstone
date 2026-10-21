import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found-section">
      <div className="fade-in" style={{ maxWidth: 520 }}>
        <div style={{
          width: 80, height: 80,
          background: 'var(--clr-danger-bg)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
          border: '3px solid var(--clr-danger-border)',
          fontSize: '2rem', color: 'var(--clr-danger)'
        }}>
          <i className="fa-solid fa-heart-crack"></i>
        </div>
        <div className="not-found-code">404</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', marginTop: '0.5rem' }}>
          Clinical Page Not Found
        </h2>
        <p className="text-muted leading-relaxed mb-6" style={{ fontSize: '1rem' }}>
          The healthcare resource, doctor profile, or medical record file you are looking for has been moved or does not exist.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/" className="btn btn-primary">
            <i className="fa-solid fa-house"></i> Return to Home
          </Link>
          <Link href="/doctors" className="btn btn-outline-primary">
            <i className="fa-solid fa-user-doctor"></i> Find a Doctor
          </Link>
          <Link href="/contact" className="btn btn-outline-secondary">
            <i className="fa-solid fa-headset"></i> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
