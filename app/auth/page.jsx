'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../components/AppContext';

export default function AuthPage() {
  const { loginUser } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState('login');
  const [role, setRole] = useState('patient'); // 'patient' | 'doctor' | 'admin'
  const [email, setEmail] = useState('rahul.sharma@example.com');
  const [password, setPassword] = useState('Password123!');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Auto-fill demo credentials on role change
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'doctor') {
      setEmail('dr.priya@medicare.org');
    } else if (selectedRole === 'admin') {
      setEmail('admin@medicare.org');
    } else {
      setEmail('rahul.sharma@example.com');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser(role);
    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'doctor') {
      router.push('/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    loginUser('patient', name ? { name, fullName: name } : {});
    router.push('/dashboard');
  };

  const handleQuickDemo = (demoRole) => {
    loginUser(demoRole);
    if (demoRole === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="auth-split-wrapper">
      {/* ── Visual Pane ─────────────────────────────────── */}
      <div className="auth-visual-pane">
        <div className="brand-logo" style={{ color: '#FFFFFF', textDecoration: 'none' }}>
          <div className="brand-icon-wrapper" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <i className="fa-solid fa-heart-pulse"></i>
          </div>
          <span>MediCare<span style={{ color: '#5EEAD4' }}>+</span></span>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="badge badge-subtle" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.25)', marginBottom: '1rem' }}>
            <i className="fa-solid fa-shield-halved mr-1"></i>
            ABDM &amp; DISHA Compliant Hospital Architecture
          </span>
          <h2 style={{ marginTop: '0.75rem', fontSize: '1.75rem', lineHeight: 1.3 }}>
            Next-Generation Healthcare with InterPlanetary Medical Ledgers
          </h2>
          <p style={{ marginTop: '1rem', fontSize: '.9375rem', opacity: 0.9, lineHeight: 1.8 }}>
            Federated clinical infrastructure powered by IPFS content addressing, SHA-256 Merkle-DAG integrity, and verified board-certified practitioners across India.
          </p>

          <div className="auth-visual-features">
            {[
              { icon: 'fa-cubes', color: '#5EEAD4', bg: 'rgba(20,184,166,0.25)', text: '<strong>IPFS Decentralized Ledger:</strong> Tamper-proof CIDs for diagnostic reports &amp; e-prescriptions' },
              { icon: 'fa-user-doctor', color: '#93C5FD', bg: 'rgba(37,99,235,0.25)', text: '<strong>Dedicated Clinical Portals:</strong> Specialized consoles for Patients, Doctors, and Administrators' },
              { icon: 'fa-lock', color: '#A7F3D0', bg: 'rgba(16,185,129,0.25)', text: '<strong>DISHA &amp; ABDM Security:</strong> End-to-end 256-bit envelope encryption' },
              { icon: 'fa-phone-volume', color: '#FDE68A', bg: 'rgba(245,158,11,0.25)', text: '<strong>National Helplines:</strong> 108 (Ambulance), 112 (Emergency), 104 (Health Information)' },
            ].map((item, idx) => (
              <div key={idx} className="auth-visual-feature">
                <div className="auth-visual-feature-icon" style={{ background: item.bg, color: item.color }}>
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <span dangerouslySetInnerHTML={{ __html: item.text }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '.75rem', opacity: 0.65 }}>
          &copy; 2026 MediCare+ Health Systems. InterPlanetary File System Enabled.
        </div>
      </div>

      {/* ── Form Pane ────────────────────────────────────── */}
      <div className="auth-form-pane">
        <div className="auth-form-header">
          <h1>{tab === 'login' ? 'MediCare+ Gateway' : 'Create Patient Account'}</h1>
          <p>{tab === 'login' ? 'Select your portal role below to sign into your tailored workspace.' : 'Register for decentralized health records and OPD appointments.'}</p>
        </div>

        {/* ── 3-Role Category Selector ───────────────────── */}
        <div className="mb-4">
          <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">
            Select Login Mode:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {/* Patient Card */}
            <button
              type="button"
              onClick={() => handleRoleSelect('patient')}
              className={`p-3 rounded-lg border text-left transition-all ${
                role === 'patient'
                  ? 'border-primary bg-primary-light ring-2 ring-primary/20 shadow-sm'
                  : 'border-border bg-subtle hover:bg-subtle-hover'
              }`}
              style={{
                cursor: 'pointer',
                borderWidth: '1.5px',
                borderColor: role === 'patient' ? 'var(--clr-primary)' : 'var(--border)',
                background: role === 'patient' ? 'var(--clr-primary-light)' : 'var(--bg-subtle)'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: role === 'patient' ? 'var(--clr-primary)' : 'rgba(100,116,139,0.2)',
                    color: role === 'patient' ? '#fff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem'
                  }}
                >
                  <i className="fa-solid fa-user"></i>
                </div>
                <span className="font-bold text-xs" style={{ color: role === 'patient' ? 'var(--clr-primary)' : 'var(--text-primary)' }}>
                  Patient
                </span>
              </div>
              <p className="text-muted" style={{ fontSize: '0.6875rem', lineHeight: 1.3, margin: 0 }}>
                Appointments, vitals &amp; IPFS vault
              </p>
            </button>

            {/* Doctor Card */}
            <button
              type="button"
              onClick={() => handleRoleSelect('doctor')}
              className={`p-3 rounded-lg border text-left transition-all ${
                role === 'doctor'
                  ? 'border-primary bg-primary-light ring-2 ring-primary/20 shadow-sm'
                  : 'border-border bg-subtle hover:bg-subtle-hover'
              }`}
              style={{
                cursor: 'pointer',
                borderWidth: '1.5px',
                borderColor: role === 'doctor' ? 'var(--clr-teal)' : 'var(--border)',
                background: role === 'doctor' ? 'rgba(20,184,166,0.1)' : 'var(--bg-subtle)'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: role === 'doctor' ? 'var(--clr-teal)' : 'rgba(100,116,139,0.2)',
                    color: role === 'doctor' ? '#fff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem'
                  }}
                >
                  <i className="fa-solid fa-user-doctor"></i>
                </div>
                <span className="font-bold text-xs" style={{ color: role === 'doctor' ? 'var(--clr-teal)' : 'var(--text-primary)' }}>
                  Doctor
                </span>
              </div>
              <p className="text-muted" style={{ fontSize: '0.6875rem', lineHeight: 1.3, margin: 0 }}>
                OPD queue &amp; IPFS e-prescriptions
              </p>
            </button>

            {/* Admin Card */}
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`p-3 rounded-lg border text-left transition-all ${
                role === 'admin'
                  ? 'border-primary bg-primary-light ring-2 ring-primary/20 shadow-sm'
                  : 'border-border bg-subtle hover:bg-subtle-hover'
              }`}
              style={{
                cursor: 'pointer',
                borderWidth: '1.5px',
                borderColor: role === 'admin' ? '#8B5CF6' : 'var(--border)',
                background: role === 'admin' ? 'rgba(139,92,246,0.1)' : 'var(--bg-subtle)'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: role === 'admin' ? '#8B5CF6' : 'rgba(100,116,139,0.2)',
                    color: role === 'admin' ? '#fff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem'
                  }}
                >
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <span className="font-bold text-xs" style={{ color: role === 'admin' ? '#8B5CF6' : 'var(--text-primary)' }}>
                  Admin
                </span>
              </div>
              <p className="text-muted" style={{ fontSize: '0.6875rem', lineHeight: 1.3, margin: 0 }}>
                Hospital analytics &amp; node cluster
              </p>
            </button>
          </div>
        </div>

        {/* ── 1-Click Instant Demo Login Banner ─────────── */}
        <div
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold block" style={{ color: 'var(--text-primary)' }}>
                <i className="fa-solid fa-bolt text-amber mr-1"></i>
                Instant 1-Click Demo Login as:
              </span>
              <span className="text-xs text-muted">
                {role === 'patient' && 'Rahul Sharma (Patient Portal)'}
                {role === 'doctor' && 'Dr. Priya Patel (AIIMS Senior Consultant)'}
                {role === 'admin' && 'Dr. Sunita Rao (Chief Medical Superintendent)'}
              </span>
            </div>
            <button
              type="button"
              className={`btn btn-sm ${role === 'doctor' ? 'btn-teal' : role === 'admin' ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => handleQuickDemo(role)}
            >
              <i className="fa-solid fa-arrow-right-to-bracket mr-1"></i>
              Launch {role.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="auth-tabs-toggle mb-4">
          <button
            type="button"
            className={`auth-toggle-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            <i className="fa-solid fa-right-to-bracket mr-1"></i> Sign In
          </button>
          <button
            type="button"
            className={`auth-toggle-btn ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
          >
            <i className="fa-solid fa-user-plus mr-1"></i> Register Patient
          </button>
        </div>

        {/* LOGIN FORM */}
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrapper">
                <i className="input-icon-left fa-solid fa-envelope"></i>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@medicare.org"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrapper">
                <i className="input-icon-left fa-solid fa-lock"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                />
                <i
                  className={`input-icon-right fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  style={{ cursor: 'pointer' }}
                ></i>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked /> Remember session
              </label>
              <span className="text-primary font-semibold cursor-pointer">Forgot password?</span>
            </div>

            <button type="submit" className={`btn w-full btn-lg mt-2 ${role === 'doctor' ? 'btn-teal' : 'btn-primary'}`}>
              <i className="fa-solid fa-right-to-bracket"></i>
              Sign In to {role.charAt(0).toUpperCase() + role.slice(1)} Portal
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrapper">
                <i className="input-icon-left fa-solid fa-user"></i>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrapper">
                <i className="input-icon-left fa-solid fa-envelope"></i>
                <input type="email" className="form-input" placeholder="rahul@example.com" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrapper">
                <i className="input-icon-left fa-solid fa-lock"></i>
                <input type={showPassword ? 'text' : 'password'} className="form-input" placeholder="Minimum 8 characters" required />
                <i
                  className={`input-icon-right fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                ></i>
              </div>
            </div>
            <div className="alert alert-info">
              <i className="fa-solid fa-circle-info"></i>
              <span>Patient registration creates an ABDM-linked health ID with decentralized IPFS record capability.</span>
            </div>
            <button type="submit" className="btn btn-teal w-full btn-lg">
              <i className="fa-solid fa-user-plus"></i>
              Register Patient Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
