'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from './AppContext';

export default function Header() {
  const { currentUser, theme, toggleTheme, logout, setIpfsExplorerOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  // Track scroll for header shadow enhancement
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    if (!notifOpen) return;
    const handleClick = (e) => {
      if (!e.target.closest('.notification-bell-wrapper')) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notifOpen]);

  const isUser = currentUser && currentUser.role !== 'guest';
  const role = currentUser?.role || 'guest';

  // Build role-specific navigation links
  let navLinks = [];
  if (role === 'doctor') {
    navLinks = [
      { href: '/dashboard', label: 'Doctor OPD', icon: 'fa-user-doctor' },
      { href: '/appointments', label: 'Patient Queue', icon: 'fa-calendar-check' },
      { href: '/records', label: 'Health EHR', icon: 'fa-file-waveform' },
      { href: '/ipfs', label: 'IPFS Swarm', icon: 'fa-cubes' },
      { href: '/doctors', label: 'Colleagues', icon: 'fa-hospital-user' }
    ];
  } else if (role === 'admin') {
    navLinks = [
      { href: '/dashboard', label: 'Executive Hub', icon: 'fa-hospital' },
      { href: '/admin', label: 'Admin Portal', icon: 'fa-shield-halved' },
      { href: '/doctors', label: 'Doctors Roster', icon: 'fa-user-doctor' },
      { href: '/ipfs', label: 'IPFS Cluster', icon: 'fa-cubes' }
    ];
  } else if (role === 'patient') {
    navLinks = [
      { href: '/dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
      { href: '/doctors', label: 'Find Doctors', icon: 'fa-user-doctor' },
      { href: '/booking', label: 'Book OPD', icon: 'fa-calendar-plus' },
      { href: '/appointments', label: 'Appointments', icon: 'fa-calendar-check' },
      { href: '/records', label: 'Health Records', icon: 'fa-file-waveform' },
      { href: '/ipfs', label: 'IPFS Hub', icon: 'fa-cubes' }
    ];
  } else {
    // Guest
    navLinks = [
      { href: '/', label: 'Home', icon: 'fa-house-medical' },
      { href: '/doctors', label: 'Find Doctors', icon: 'fa-user-doctor' },
      { href: '/booking', label: 'Book OPD', icon: 'fa-calendar-plus' },
      { href: '/ipfs', label: 'IPFS Ledger', icon: 'fa-cubes' },
      { href: '/about', label: 'About', icon: 'fa-circle-info' }
    ];
  }

  return (
    <>
      <header
        className="site-header"
        id="mainHeader"
        style={scrolled ? { boxShadow: '0 1px 0 var(--border), 0 8px 24px rgba(15,23,42,0.10)' } : undefined}
      >
        <div className="navbar-container">
          {/* Brand */}
          <Link href="/" className="brand-logo">
            <div className="brand-icon-wrapper">
              <i className="fa-solid fa-heart-pulse"></i>
            </div>
            <span>MediCare<span className="brand-text-accent">+</span></span>
          </Link>

          {/* Desktop Nav - Left Aligned */}
          <nav aria-label="Main Navigation">
            <ul className="desktop-nav-menu">
              {navLinks.map((link) => {
                const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`nav-link ${active ? 'active' : ''}`}
                      title={link.label}
                    >
                      <i className={`fa-solid ${link.icon}`}></i>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Actions */}
          <div className="nav-actions-group">
            {/* IPFS Hub direct access button */}
            <Link
              href="/ipfs"
              className="ipfs-nav-btn"
              title="IPFS Decentralized Health Ledger — Click to View Hub"
            >
              <span className="ipfs-status-dot"></span>
              <span>IPFS: <strong>Online</strong></span>
            </Link>

            {/* Theme Toggle */}
            <button
              className="theme-toggle-btn"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>

            {/* Notification Bell (logged-in only) */}
            {isUser && (
              <div className="notification-bell-wrapper">
                <button
                  className="notification-bell-btn"
                  onClick={() => setNotifOpen(!notifOpen)}
                  aria-label="Notifications"
                  aria-expanded={notifOpen}
                >
                  <i className="fa-regular fa-bell"></i>
                  <span className="notification-count-badge">3</span>
                </button>

                {notifOpen && (
                  <div className="notification-dropdown open" role="menu">
                    <div className="notif-header">
                      <h4><i className="fa-solid fa-bell text-primary"></i> Clinical Alerts</h4>
                      <button className="btn btn-secondary btn-xs" onClick={() => setNotifOpen(false)}>
                        Dismiss
                      </button>
                    </div>
                    <ul className="notif-list">
                      <li className="notif-item unread">
                        <div className="notif-icon-box" style={{ background: 'rgba(37,99,235,0.12)', color: '#2563EB' }}>
                          <i className="fa-regular fa-calendar-check"></i>
                        </div>
                        <div className="notif-text">
                          <h5>OPD Appointment Confirmed</h5>
                          <p>Dr. Priya Patel (AIIMS - General Medicine) on Oct 24 at 10:00 AM.</p>
                          <span className="notif-time">10 mins ago</span>
                        </div>
                      </li>
                      <li className="notif-item unread">
                        <div className="notif-icon-box" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
                          <i className="fa-solid fa-vial-circle-check"></i>
                        </div>
                        <div className="notif-text">
                          <h5>IPFS CID Verified</h5>
                          <p>Lipid Profile &amp; CBC test results synchronized via IPFS CID bafybeicz...</p>
                          <span className="notif-time">2 hours ago</span>
                        </div>
                      </li>
                      <li className="notif-item">
                        <div className="notif-icon-box" style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>
                          <i className="fa-solid fa-pills"></i>
                        </div>
                        <div className="notif-text">
                          <h5>Prescription Active</h5>
                          <p>Atorvastatin 10mg (₹350/refill) — 7 days remaining.</p>
                          <span className="notif-time">Yesterday</span>
                        </div>
                      </li>
                    </ul>
                    <div className="notif-footer">
                      <Link href="/records" className="text-xs text-primary font-bold" onClick={() => setNotifOpen(false)}>
                        View All Clinical Records &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Guest / User Profile */}
            {!isUser ? (
              <div className="nav-guest-only">
                <Link href="/auth" className="btn btn-secondary btn-sm">
                  <i className="fa-solid fa-right-to-bracket"></i> Sign In
                </Link>
                <Link href="/auth" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/profile" className="flex items-center gap-2 cursor-pointer" title="View your profile">
                  <img
                    src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                    alt={currentUser?.name || "User"}
                    style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--clr-primary)', flexShrink: 0 }}
                  />
                  <div className="hidden md:block text-left" style={{ lineHeight: 1.2 }}>
                    <span className="text-xs font-bold block">{currentUser?.name}</span>
                    <span className="text-primary font-semibold" style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{currentUser?.role}</span>
                  </div>
                </Link>
                <button
                  className="btn btn-outline-secondary btn-xs btn-icon"
                  title="Sign out"
                  onClick={logout}
                  aria-label="Sign out"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer open" role="navigation" aria-label="Mobile Navigation">
            <ul className="mobile-nav-list">
              {navLinks.map((link) => {
                const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`nav-link ${active ? 'active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className={`fa-solid ${link.icon} mr-2`}></i>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {/* Mobile auth actions */}
            {!isUser && (
              <div className="flex gap-2 mt-3 pt-3 border-t">
                <Link href="/auth" className="btn btn-outline-primary btn-sm flex-1 text-center" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/auth" className="btn btn-primary btn-sm flex-1 text-center" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
