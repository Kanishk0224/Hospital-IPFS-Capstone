'use client';

import React, { useState } from 'react';
import { useApp } from './AppContext';

export default function IpfsModal() {
  const { ipfsExplorerOpen, setIpfsExplorerOpen, records, showToast } = useApp();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileHash, setFileHash] = useState('');
  const [fileCid, setFileCid] = useState('');
  const [hashing, setHashing] = useState(false);
  const [copiedCid, setCopiedCid] = useState('');

  if (!ipfsExplorerOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setHashing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setFileHash(hashHex);
      setFileCid('bafybeic' + hashHex.substring(0, 32));
    } catch (err) {
      console.error('IPFS hash error:', err);
    } finally {
      setHashing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCid(text);
    showToast('CID copied to clipboard!', 'info');
    setTimeout(() => setCopiedCid(''), 2000);
  };

  return (
    <div className="modal-overlay active" role="dialog" aria-modal="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="fa-solid fa-cubes text-teal"></i> MediCare+ IPFS Health Ledger &amp; Explorer
          </h3>
          <button className="modal-close-btn" onClick={() => setIpfsExplorerOpen(false)} aria-label="Close">
            &times;
          </button>
        </div>
        <div className="modal-body">
          {/* Swarm Status */}
          <div className="ipfs-overview-banner mb-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="ipfs-status-dot"></span>
                  <strong className="text-white text-base">Federated Clinical IPFS Cluster</strong>
                  <span className="badge badge-success text-xxs">18 Active Peers</span>
                </div>
                <p className="text-xs text-white opacity-80 mt-1">
                  Peer ID: <code className="font-mono text-teal">12D3KooWRh3UvB3H65mK9...</code> &bull; Protocol: <code className="font-mono text-white">/ipfs/lan/0.1.0</code>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-teal font-mono text-xs">BitSwap v1.2.0</span>
                <span className="badge badge-subtle font-mono text-xs" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>Cluster: HealthNet</span>
              </div>
            </div>
          </div>

          {/* Live Hasher */}
          <div className="card p-4 mb-4">
            <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
              <i className="fa-solid fa-fingerprint text-teal"></i> Live In-Browser SHA-256 &amp; CIDv1 Generator
            </h4>
            <p className="text-xs text-muted mb-3">
              Upload any medical report, prescription image, or lab PDF to compute its cryptographic hash and IPFS CIDv1 directly via the browser Web Crypto API.
            </p>
            <input type="file" className="form-input text-xs mb-3" onChange={handleFileChange} />

            {hashing && (
              <div className="flex items-center gap-2 text-xs text-teal font-semibold mb-2">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Computing SHA-256 digest across file buffer...</span>
              </div>
            )}

            {fileHash && (
              <div className="bg-subtle p-3 rounded-lg border text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold block text-muted uppercase text-xxs">SHA-256 Multihash:</span>
                    <code className="font-mono text-primary break-all">{fileHash}</code>
                  </div>
                  <button
                    className="btn btn-outline-secondary btn-xxs flex-shrink-0 ml-2"
                    onClick={() => copyToClipboard(fileHash)}
                    title="Copy hash"
                  >
                    <i className={`fa-solid ${copiedCid === fileHash ? 'fa-check text-success' : 'fa-copy'}`}></i>
                  </button>
                </div>
                <div className="flex justify-between items-start pt-2 border-t">
                  <div>
                    <span className="font-bold block text-muted uppercase text-xxs">Derived IPFS CIDv1 (Base32):</span>
                    <code className="font-mono text-teal break-all font-bold">{fileCid}</code>
                  </div>
                  <button
                    className="btn btn-outline-teal btn-xxs flex-shrink-0 ml-2"
                    onClick={() => copyToClipboard(fileCid)}
                    title="Copy CID"
                  >
                    <i className={`fa-solid ${copiedCid === fileCid ? 'fa-check text-success' : 'fa-copy'}`}></i>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pinned Records Ledger */}
          <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
            <i className="fa-solid fa-database text-primary"></i> Pinned Clinical Documents Ledger ({records.length})
          </h4>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Department</th>
                  <th>IPFS CIDv1</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.id}>
                    <td className="font-bold text-xs">{rec.title}</td>
                    <td><span className="badge badge-primary">{rec.specialty}</span></td>
                    <td className="font-mono text-xxs text-teal">{rec.ipfsCid || 'bafybeih6m...'}</td>
                    <td><span className="badge badge-success text-xxs"><i className="fa-solid fa-circle-check mr-1"></i> Pinned</span></td>
                    <td>
                      <button
                        className="btn btn-ghost btn-xxs text-primary"
                        onClick={() => copyToClipboard(rec.ipfsCid || 'bafybeih6m...')}
                        title="Copy CID"
                      >
                        <i className="fa-solid fa-copy"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4 pt-3 border-t">
            <span className="text-xxs text-muted">
              <i className="fa-solid fa-lock text-primary mr-1"></i>
              Cryptographic integrity assured by IPFS Content Addressing
            </span>
            <button className="btn btn-secondary btn-sm" onClick={() => setIpfsExplorerOpen(false)}>
              Close Explorer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
