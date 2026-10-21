// ========================================================
// MediCare+ Healthcare System - Medical Records & Prescriptions
// ========================================================

const Records = {
  currentFilterSpecialty: "all",
  searchQuery: "",

  init() {
    this.bindEvents();
    this.renderRecords();
    this.renderPrescriptionsTab();
  },

  bindEvents() {
    // Search records
    const searchInput = document.getElementById("recordSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderRecords();
      });
    }

    // Filter by specialty
    const specialtySelect = document.getElementById("recordSpecialtyFilter");
    if (specialtySelect) {
      specialtySelect.addEventListener("change", (e) => {
        this.currentFilterSpecialty = e.target.value;
        this.renderRecords();
      });
    }

    // Upload Document Form
    const uploadForm = document.getElementById("uploadDocumentForm");
    if (uploadForm) {
      uploadForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleDocumentUpload(uploadForm);
      });
    }
  },

  openRecordsForDoctor(doctorName) {
    App.navigateTo("records");
    const searchInput = document.getElementById("recordSearchInput");
    if (searchInput) {
      searchInput.value = doctorName;
      this.searchQuery = doctorName.toLowerCase();
      this.renderRecords();
    }
  },

  getFilteredRecords() {
    let list = Storage.getRecords();

    if (this.searchQuery) {
      const q = this.searchQuery;
      list = list.filter(r => 
        r.title.toLowerCase().includes(q) ||
        r.doctorName.toLowerCase().includes(q) ||
        r.diagnosis.toLowerCase().includes(q) ||
        r.specialty.toLowerCase().includes(q)
      );
    }

    if (this.currentFilterSpecialty !== "all") {
      list = list.filter(r => r.specialty.toLowerCase() === this.currentFilterSpecialty.toLowerCase());
    }

    return list;
  },

  renderRecords() {
    const container = document.getElementById("recordsListContainer");
    if (!container) return;

    const records = this.getFilteredRecords();

    if (records.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-state-icon">
            <i class="fa-solid fa-folder-open"></i>
          </div>
          <h3>No Medical Records Found</h3>
          <p>No records match your search criteria. Try modifying your filters or upload a new record.</p>
          <button class="btn btn-outline-primary mt-3" onclick="App.showModal('uploadDocumentModal')">
            <i class="fa-solid fa-cloud-arrow-up"></i> Upload Test Report
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = records.map(rec => `
      <div class="medical-record-card fade-in" data-record-id="${rec.id}">
        <div class="record-card-header">
          <div class="flex items-center gap-3">
            <div class="record-icon-badge">
              <i class="fa-solid fa-file-waveform text-primary"></i>
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="badge badge-primary font-mono">${rec.id}</span>
                <span class="badge badge-teal">${rec.specialty}</span>
                <span class="badge badge-emerald font-mono text-xxs cursor-pointer" data-ipfs-verify="${rec.id}" title="Click to verify cryptographic integrity on IPFS">
                  <i class="fa-solid fa-shield-halved"></i> IPFS: ${rec.ipfsCid ? rec.ipfsCid.substring(0, 11) + '...' : 'Pinned'}
                </span>
                <span class="text-xs text-muted"><i class="fa-regular fa-calendar"></i> ${this.formatDate(rec.date)}</span>
              </div>
              <h3 class="record-title mt-1">${rec.title}</h3>
              <p class="record-doc-text">Attending: <strong class="text-navy">${rec.doctorName}</strong> (${rec.department})</p>
            </div>
          </div>

          <div class="record-header-actions">
            <button class="btn btn-outline-teal btn-sm" data-ipfs-verify="${rec.id}" title="Verify cryptographic integrity on IPFS">
              <i class="fa-solid fa-shield-halved"></i> Verify on IPFS
            </button>
            <button class="btn btn-outline-primary btn-sm" onclick="Records.viewRecordDetail('${rec.id}')">
              <i class="fa-solid fa-magnifying-glass-plus"></i> View Details
            </button>
            ${rec.hasPrescription ? `
              <button class="btn btn-primary btn-sm" onclick="Records.viewPrescription('${rec.prescriptionId}')">
                <i class="fa-solid fa-prescription"></i> Prescription (Rx)
              </button>
            ` : ''}
          </div>
        </div>

        <div class="record-card-body">
          <div class="diagnosis-highlight">
            <span class="label font-bold text-xs text-muted uppercase tracking-wider">Clinical Diagnosis:</span>
            <p class="diagnosis-text">${rec.diagnosis}</p>
          </div>

          ${rec.vitals ? `
            <div class="vitals-strip-grid mt-3">
              ${rec.vitals.bp ? `<div class="vital-chip"><span class="vital-label">BP:</span> <strong>${rec.vitals.bp}</strong></div>` : ''}
              ${rec.vitals.heartRate ? `<div class="vital-chip"><span class="vital-label">Pulse:</span> <strong>${rec.vitals.heartRate}</strong></div>` : ''}
              ${rec.vitals.temp ? `<div class="vital-chip"><span class="vital-label">Temp:</span> <strong>${rec.vitals.temp}</strong></div>` : ''}
              ${rec.vitals.spO2 ? `<div class="vital-chip"><span class="vital-label">SpO2:</span> <strong>${rec.vitals.spO2}</strong></div>` : ''}
              ${rec.vitals.bmi ? `<div class="vital-chip"><span class="vital-label">BMI:</span> <strong>${rec.vitals.bmi}</strong></div>` : ''}
            </div>
          ` : ''}

          <div class="record-meta-row mt-3 flex justify-between items-center flex-wrap gap-2">
            <div class="text-xs text-muted flex items-center gap-2">
              <span><i class="fa-solid fa-circle-check text-emerald mr-1"></i> Hospital Verified</span>
              <span>•</span>
              <span class="text-teal font-semibold"><i class="fa-solid fa-lock text-xs mr-1"></i> ${rec.encryptionCipher || 'AES-GCM-256'}</span>
            </div>
            ${rec.attachments && rec.attachments.length > 0 ? `
              <div class="attachments-count-badge">
                <i class="fa-solid fa-paperclip text-primary"></i> ${rec.attachments.length} Attached Document(s) (IPFS Pinned)
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `).join("");
  },

  viewRecordDetail(recordId) {
    const rec = Storage.getRecords().find(r => r.id === recordId);
    if (!rec) return;

    const modalBody = document.getElementById("recordDetailModalBody");
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="record-detail-sheet">
        <div class="sheet-top-banner">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-blue-100 text-primary rounded-xl text-xl">
              <i class="fa-solid fa-notes-medical"></i>
            </div>
            <div>
              <span class="badge badge-primary font-mono">${rec.id}</span>
              <h2>${rec.title}</h2>
              <p class="text-sm text-muted">${rec.specialty} • ${rec.department}</p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-sm font-semibold"><i class="fa-regular fa-calendar"></i> ${this.formatDate(rec.date)}</span>
            <p class="text-xs text-muted">Consultant: ${rec.doctorName}</p>
          </div>
        </div>

        <div class="sheet-sections mt-4">
          <div class="sheet-box">
            <h4><i class="fa-solid fa-stethoscope text-primary"></i> Diagnosis & Assessment</h4>
            <p class="mt-1 text-base text-navy font-medium">${rec.diagnosis}</p>
          </div>

          <div class="sheet-box mt-3">
            <h4><i class="fa-solid fa-clipboard-question text-teal"></i> Symptoms & Clinical Presentation</h4>
            <p class="mt-1 text-sm text-secondary-color">${rec.symptoms}</p>
          </div>

          ${rec.vitals ? `
            <div class="sheet-box mt-3">
              <h4><i class="fa-solid fa-heart-pulse text-rose-500"></i> Recorded Vitals</h4>
              <div class="vitals-matrix mt-2">
                ${Object.entries(rec.vitals).map(([k, v]) => `
                  <div class="matrix-item">
                    <span class="text-xs text-muted uppercase">${k}</span>
                    <span class="font-bold text-navy text-sm">${v}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ''}

          <div class="sheet-box mt-3">
            <h4><i class="fa-solid fa-vial-circle-check text-indigo-500"></i> Laboratory & Diagnostic Summary</h4>
            <p class="mt-1 text-sm text-secondary-color">${rec.labSummary || 'No abnormal findings reported.'}</p>
          </div>

          <!-- IPFS Decentralized Verification Box -->
          <div class="sheet-box mt-3 p-3 bg-teal-50/50 border border-teal-200 rounded-xl">
            <div class="flex justify-between items-center mb-2 flex-wrap gap-2">
              <h4 class="text-xs font-bold uppercase tracking-wider text-teal-800">
                <i class="fa-solid fa-cubes text-teal-600 mr-1"></i> IPFS Decentralized Health Ledger Verification
              </h4>
              <span class="badge badge-emerald text-xxs"><i class="fa-solid fa-circle-check"></i> Tamper-Proof & Pinned</span>
            </div>
            <div class="font-mono text-xs break-all p-2 bg-surface rounded border border-slate-200 text-slate-800">
              Content Identifier (CIDv1): <strong class="text-primary">${rec.ipfsCid || 'bafybeicz3jlnkvp37x7b5z4wug2vvyqf5q47tqqg3y6r7e6z6c4pwyvaia'}</strong>
            </div>
            <div class="flex flex-wrap gap-2 mt-2 pt-2 border-t border-teal-100 items-center justify-between text-xxs">
              <div class="text-muted">
                <span>Merkle Blocks: <strong class="text-navy">${rec.merkleBlocks || 6}</strong> (256 KB)</span> • 
                <span>Cipher: <strong class="text-teal font-semibold">${rec.encryptionCipher || 'AES-GCM-256'}</strong></span> • 
                <span>SHA-256: <strong class="font-mono">${rec.tamperProofHash ? rec.tamperProofHash.substring(0, 12) + '...' : 'Verified'}</strong></span>
              </div>
              <div class="flex gap-2">
                <button class="btn btn-outline-teal btn-xs" data-ipfs-verify="${rec.id}">
                  <i class="fa-solid fa-shield-halved"></i> Verify Cryptographic Proof
                </button>
                <a href="${rec.ipfsGatewayUrl || 'https://ipfs.io/ipfs/' + rec.ipfsCid}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary btn-xs">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Gateway
                </a>
              </div>
            </div>
          </div>

          <div class="sheet-box mt-3">
            <h4><i class="fa-solid fa-user-doctor text-emerald"></i> Clinical Recommendations & Plan</h4>
            <p class="mt-1 text-sm text-secondary-color">${rec.recommendations || 'Regular follow-up as scheduled.'}</p>
          </div>

          ${rec.attachments && rec.attachments.length > 0 ? `
            <div class="sheet-box mt-3">
              <h4><i class="fa-solid fa-paperclip text-primary"></i> Attached Documents & Diagnostic Imaging (IPFS Pinned)</h4>
              <div class="attachments-list mt-2">
                ${rec.attachments.map(att => `
                  <div class="attachment-item">
                    <div class="flex items-center gap-2">
                      <i class="fa-regular fa-file-pdf text-red-500 text-lg"></i>
                      <div>
                        <span class="text-sm font-semibold">${att.name}</span>
                        <span class="text-xs text-muted block font-mono">${att.size} • CID: ${att.cid ? att.cid.substring(0, 14) + '...' : 'Pinned'}</span>
                      </div>
                    </div>
                    <div class="flex gap-1">
                      ${att.cid ? `
                        <a href="https://ipfs.io/ipfs/${att.cid}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-teal btn-xs" title="Open on IPFS Gateway">
                          <i class="fa-solid fa-cubes"></i> Gateway
                        </a>
                      ` : ''}
                      <button class="btn btn-outline-secondary btn-xs" onclick="App.showToast('Downloading verified document: ${att.name}', 'info')">
                        <i class="fa-solid fa-download"></i> Download
                      </button>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ''}
        </div>

        <div class="sheet-footer mt-5 flex justify-between items-center flex-wrap gap-2">
          <span class="text-xs text-muted"><i class="fa-solid fa-shield-halved text-emerald"></i> HIPAA Compliant • Protected Health Information • IPFS Pinned</span>
          <div class="flex gap-2">
            <button class="btn btn-secondary" onclick="App.closeModal('recordDetailModal')">Close</button>
            <button class="btn btn-outline-teal" data-ipfs-verify="${rec.id}">
              <i class="fa-solid fa-shield-halved"></i> Verify on IPFS
            </button>
            <button class="btn btn-outline-primary" onclick="window.print()">
              <i class="fa-solid fa-print"></i> Print Record
            </button>
            ${rec.hasPrescription ? `
              <button class="btn btn-primary" onclick="App.closeModal('recordDetailModal'); Records.viewPrescription('${rec.prescriptionId}')">
                <i class="fa-solid fa-prescription"></i> Open Rx
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    App.showModal("recordDetailModal");
  },

  renderPrescriptionsTab() {
    const container = document.getElementById("prescriptionsListContainer");
    if (!container) return;

    const prescriptions = Storage.getPrescriptions();

    if (prescriptions.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-state-icon">
            <i class="fa-solid fa-prescription-bottle-medical"></i>
          </div>
          <h3>No Prescriptions Available</h3>
          <p>Any medical prescriptions issued during consultations will be stored here.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = prescriptions.map(rx => `
      <div class="prescription-card fade-in" data-rx-id="${rx.id}">
        <div class="rx-card-header">
          <div class="flex items-center gap-3">
            <div class="rx-symbol-box">℞</div>
            <div>
              <span class="badge badge-primary font-mono">${rx.id}</span>
              <h3 class="font-bold text-navy text-lg">${rx.diagnosis}</h3>
              <p class="text-xs text-muted">Prescribed by <strong>${rx.doctorName}</strong> on ${this.formatDate(rx.date)}</p>
            </div>
          </div>
          <button class="btn btn-outline-primary btn-sm" onclick="Records.viewPrescription('${rx.id}')">
            <i class="fa-solid fa-print"></i> View / Print Rx
          </button>
        </div>

        <div class="rx-card-medicines-table mt-3">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="table-head-row">
                <th class="p-2">Medication</th>
                <th class="p-2">Dosage</th>
                <th class="p-2">Frequency</th>
                <th class="p-2">Duration</th>
                <th class="p-2">Instructions</th>
              </tr>
            </thead>
            <tbody>
              ${rx.medicines.map(m => `
                <tr class="border-b border-slate-100">
                  <td class="p-2 font-semibold text-navy"><i class="fa-solid fa-pills text-teal mr-1"></i> ${m.name}</td>
                  <td class="p-2">${m.dosage} (${m.type})</td>
                  <td class="p-2 font-mono text-xs">${m.frequency}</td>
                  <td class="p-2">${m.duration}</td>
                  <td class="p-2 text-xs text-muted">${m.instructions}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `).join("");
  },

  viewPrescription(rxId) {
    const rx = Storage.getPrescriptionById(rxId);
    if (!rx) {
      App.showToast("Prescription not found.", "error");
      return;
    }

    const modalBody = document.getElementById("prescriptionDetailModalBody");
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="official-prescription-sheet" id="printableRxDocument">
        <!-- Clinic Letterhead Header -->
        <div class="rx-letterhead">
          <div class="flex justify-between items-start border-b-2 border-primary pb-4">
            <div class="clinic-info">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-heart-pulse text-primary text-2xl"></i>
                <h2 class="text-2xl font-black text-navy tracking-tight">MediCare+</h2>
              </div>
              <p class="text-xs font-semibold text-primary uppercase tracking-wider">Health Systems & Multi-Specialty Hospital</p>
              <p class="text-xs text-muted mt-1">${rx.clinic}</p>
              <p class="text-xs text-muted">Phone: +1 (800) 555-CARE • Emergency: 911 • Web: www.medicare-health.org</p>
            </div>
            <div class="doctor-credential-box text-right">
              <h3 class="font-bold text-navy text-lg">${rx.doctorName}</h3>
              <p class="text-xs font-medium text-teal">${rx.doctorDegree}</p>
              <p class="text-xs text-muted font-mono">License: ${rx.licenseNo}</p>
              <span class="badge badge-subtle mt-1">Ref ID: ${rx.id}</span>
            </div>
          </div>
        </div>

        <!-- Patient Demographics Bar -->
        <div class="rx-patient-bar my-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span class="text-muted block">Patient Name:</span>
              <strong class="text-navy text-sm">${rx.patientName}</strong>
            </div>
            <div>
              <span class="text-muted block">Age / Gender:</span>
              <strong class="text-navy">${rx.patientAge} Yrs / ${rx.patientGender}</strong>
            </div>
            <div>
              <span class="text-muted block">Patient ID:</span>
              <strong class="text-navy font-mono">${rx.patientId}</strong>
            </div>
            <div>
              <span class="text-muted block">Date Issued:</span>
              <strong class="text-navy">${this.formatDate(rx.date)}</strong>
            </div>
          </div>
          <div class="mt-2 pt-2 border-t border-slate-200 text-xs">
            <span class="text-muted">Primary Diagnosis: </span>
            <strong class="text-navy">${rx.diagnosis}</strong>
          </div>
        </div>

        <!-- Prescription Body -->
        <div class="rx-content-body my-4">
          <div class="rx-big-symbol font-serif text-3xl font-black text-primary mb-3">℞</div>

          <div class="table-responsive">
            <table class="w-full rx-table text-left text-sm border-collapse">
              <thead>
                <tr class="bg-blue-50 border-y border-blue-200 text-xs text-primary font-bold uppercase">
                  <th class="p-3">#</th>
                  <th class="p-3">Medicine Name & Formulation</th>
                  <th class="p-3">Strength</th>
                  <th class="p-3">Dosage / Frequency</th>
                  <th class="p-3">Duration</th>
                  <th class="p-3">Special Instructions</th>
                </tr>
              </thead>
              <tbody>
                ${rx.medicines.map((med, index) => `
                  <tr class="border-b border-slate-200">
                    <td class="p-3 text-muted font-mono">${index + 1}</td>
                    <td class="p-3 font-bold text-navy">
                      ${med.name}
                      <span class="text-xs font-normal text-muted block">${med.type}</span>
                    </td>
                    <td class="p-3 font-semibold text-primary">${med.dosage}</td>
                    <td class="p-3 font-mono text-xs">${med.frequency}<br><span class="text-muted font-sans">${med.timing}</span></td>
                    <td class="p-3">${med.duration}</td>
                    <td class="p-3 text-xs text-slate-700">${med.instructions}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>

          ${rx.doctorNotes ? `
            <div class="rx-notes-box mt-4 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r text-xs">
              <strong class="text-amber-800"><i class="fa-solid fa-circle-exclamation"></i> Prescribing Physician Notes:</strong>
              <p class="text-amber-900 mt-1">${rx.doctorNotes}</p>
            </div>
          ` : ''}
        </div>

        <!-- Prescription Sign-off & Stamp -->
        <div class="rx-signature-row mt-8 pt-4 border-t border-slate-200 flex justify-between items-end flex-wrap gap-4">
          <div class="demo-watermark-notice text-xs text-muted max-w-sm">
            <div class="p-2.5 bg-teal-50 border border-teal-200 rounded-lg mb-2">
              <div class="flex items-center gap-1.5 text-teal-800 font-bold mb-1">
                <i class="fa-solid fa-cubes"></i> IPFS Tamper-Proof Electronic Prescription
              </div>
              <div class="font-mono text-xxs text-slate-700 break-all">
                CID: <strong class="text-primary">${rx.ipfsCid || 'bafybeidw6c7...'}</strong>
              </div>
              <div class="font-mono text-xxs text-muted mt-0.5 break-all">
                Sig: <span>${rx.digitalSignatureHash || 'SIG-ECDSA-SHA256:0x7a89f92bb456...'}</span>
              </div>
              <div class="flex gap-2 mt-1.5 pt-1.5 border-t border-teal-100">
                <a href="${rx.ipfsGatewayUrl || 'https://ipfs.io/ipfs/' + rx.ipfsCid}" target="_blank" rel="noopener noreferrer" class="text-xxs font-bold text-teal hover:underline">
                  <i class="fa-solid fa-satellite-dish"></i> Verify on Gateway &rarr;
                </a>
              </div>
            </div>
            <p><i class="fa-solid fa-triangle-exclamation text-amber"></i> <em>Demonstration Capstone Prescription - Not for actual medical dispensing.</em></p>
            <p class="text-emerald font-semibold mt-0.5"><i class="fa-solid fa-shield-check"></i> Digitally Signed & Pinned in MediCare+ IPFS Cluster</p>
          </div>
          <div class="doctor-signature-box text-right">
            <div class="signature-line font-serif italic text-lg text-primary">${rx.digitalSignature}</div>
            <div class="w-48 h-0.5 bg-slate-400 ml-auto my-1"></div>
            <p class="text-xs font-bold text-navy">${rx.doctorName}</p>
            <p class="text-xs text-muted font-mono">License: ${rx.licenseNo}</p>
            <p class="text-xs text-muted">Authorized Medical Practitioner</p>
          </div>
        </div>
      </div>

      <div class="modal-footer-actions mt-5 flex justify-end gap-3 no-print">
        <button class="btn btn-secondary" onclick="App.closeModal('prescriptionDetailModal')">
          Close
        </button>
        <button class="btn btn-outline-teal" onclick="IPFS.copyToClipboard('${rx.ipfsCid}')">
          <i class="fa-regular fa-copy"></i> Copy IPFS CID
        </button>
        <button class="btn btn-outline-primary" onclick="App.showToast('Prescription PDF saved to downloads!', 'success')">
          <i class="fa-solid fa-download"></i> Download PDF
        </button>
        <button class="btn btn-primary" onclick="window.print()">
          <i class="fa-solid fa-print"></i> Print Prescription
        </button>
      </div>
    `;

    App.showModal("prescriptionDetailModal");
  },

  async handleDocumentUpload(form) {
    const title = form.querySelector("#uploadDocTitle").value.trim();
    const specialty = form.querySelector("#uploadDocSpecialty").value;
    const date = form.querySelector("#uploadDocDate").value || new Date().toISOString().split('T')[0];
    const notes = form.querySelector("#uploadDocNotes").value.trim();
    const fileInput = form.querySelector("#uploadDocFile");

    if (!title) {
      App.showToast("Please enter a title for the document.", "warning");
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Hashing & Pinning to IPFS...';
    }

    try {
      let ipfsPinResult;
      const hasFile = fileInput && fileInput.files && fileInput.files.length > 0;
      
      if (hasFile) {
        ipfsPinResult = await IPFS.uploadAndPinFile(fileInput.files[0], {
          title,
          type: specialty
        });
      } else {
        const hashObj = await IPFS.computeHashAndCid(title + " " + notes + " " + date);
        ipfsPinResult = {
          cid: hashObj.cid,
          cidV0: hashObj.cidV0,
          sha256: hashObj.sha256Hex,
          size: "1.2 MB",
          fileName: `${title.replace(/\s+/g, '_')}.pdf`,
          merkleBlocks: 4,
          merkleRoot: hashObj.cid,
          gatewayUrl: `https://ipfs.io/ipfs/${hashObj.cid}`,
          encryptionCipher: "AES-GCM-256 (HIPAA Enveloped)"
        };
        Storage.addIpfsPin({
          cid: hashObj.cid,
          cidV0: hashObj.cidV0,
          title: title,
          type: specialty,
          recordId: `PIN-${Math.floor(1000 + Math.random() * 9000)}`,
          size: "1.2 MB",
          pinnedAt: date,
          pinStatus: "Pinned on MediCare+ Node",
          sha256: hashObj.sha256Hex,
          merkleBlocks: 4,
          merkleRoot: hashObj.cid,
          gatewayUrl: `https://ipfs.io/ipfs/${hashObj.cid}`,
          encrypted: true
        });
      }

      const newRecordId = `REC-${Math.floor(100 + Math.random() * 900)}`;
      const newRecord = {
        id: newRecordId,
        title: title,
        date: date,
        doctorName: "Uploaded by Patient (Pending Specialist Review)",
        specialty: specialty,
        department: "Diagnostic Center / External Laboratory",
        diagnosis: notes || "Patient uploaded diagnostic test summary.",
        symptoms: "Self-uploaded medical report for attending clinician review.",
        vitals: null,
        labSummary: notes || "Laboratory diagnostic findings attached.",
        recommendations: "To be evaluated during upcoming clinical consultation.",
        hasPrescription: false,
        ipfsCid: ipfsPinResult.cid,
        ipfsCidV0: ipfsPinResult.cidV0,
        ipfsPinStatus: "Pinned on MediCare+ Node",
        ipfsGatewayUrl: ipfsPinResult.gatewayUrl,
        tamperProofHash: ipfsPinResult.sha256,
        encryptionCipher: "AES-GCM-256 (HIPAA Enveloped)",
        merkleRoot: ipfsPinResult.merkleRoot,
        merkleBlocks: ipfsPinResult.merkleBlocks,
        attachments: [
          {
            name: ipfsPinResult.fileName || `${title.replace(/\s+/g, '_')}.pdf`,
            size: ipfsPinResult.size || "1.2 MB",
            type: "PDF",
            cid: ipfsPinResult.cid,
            gatewayUrl: ipfsPinResult.gatewayUrl,
            verified: true
          }
        ]
      };

      Storage.addRecord(newRecord);
      App.closeModal("uploadDocumentModal");
      App.showToast("Medical document cryptographically hashed & pinned to IPFS!", "success");
      this.renderRecords();
      Dashboard.renderDashboard();
      form.reset();
    } catch (err) {
      App.showToast("Failed to pin document to IPFS: " + err.message, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Upload & Pin to IPFS';
      }
    }
  },

  formatDate(dateStr) {
    if (!dateStr) return "";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", options);
  }
};
