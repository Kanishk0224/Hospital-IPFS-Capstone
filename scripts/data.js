// ========================================================
// MediCare+ Healthcare System - Demonstration Master Data
// ========================================================

const DEFAULT_SPECIALTIES = [
  {
    id: "cardiology",
    name: "Cardiology",
    icon: "fa-heart-pulse",
    color: "#EF4444",
    bg: "rgba(239, 68, 68, 0.1)",
    description: "Comprehensive care for cardiovascular diseases, hypertension, and heart rhythm disorders.",
    doctorCount: 4
  },
  {
    id: "neurology",
    name: "Neurology",
    icon: "fa-brain",
    color: "#8B5CF6",
    bg: "rgba(139, 92, 246, 0.1)",
    description: "Advanced diagnostics and treatment for disorders of the brain, spinal cord, and nerves.",
    doctorCount: 3
  },
  {
    id: "dermatology",
    name: "Dermatology",
    icon: "fa-allergies",
    color: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.1)",
    description: "Expert skin, hair, and nail health management, allergy screenings, and laser therapies.",
    doctorCount: 4
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    icon: "fa-baby",
    color: "#10B981",
    bg: "rgba(16, 185, 129, 0.1)",
    description: "Holistic healthcare, immunization, and growth monitoring for newborns through teens.",
    doctorCount: 3
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    icon: "fa-bone",
    color: "#3B82F6",
    bg: "rgba(59, 130, 246, 0.1)",
    description: "Treatment for joint replacement, sports injuries, fractures, and spinal rehabilitation.",
    doctorCount: 4
  },
  {
    id: "general",
    name: "General Medicine",
    icon: "fa-stethoscope",
    color: "#14B8A6",
    bg: "rgba(20, 184, 166, 0.1)",
    description: "Primary healthcare, preventive routine checkups, acute illness diagnosis, and chronic disease care.",
    doctorCount: 5
  },
  {
    id: "ophthalmology",
    name: "Ophthalmology",
    icon: "fa-eye",
    color: "#06B6D4",
    bg: "rgba(6, 182, 212, 0.1)",
    description: "Vision correction, cataract surgery, glaucoma management, and complete ocular exams.",
    doctorCount: 2
  },
  {
    id: "dental",
    name: "Dental Care",
    icon: "fa-tooth",
    color: "#6366F1",
    bg: "rgba(99, 102, 241, 0.1)",
    description: "Cosmetic dentistry, root canals, oral surgery, periodontal therapies, and preventative hygiene.",
    doctorCount: 3
  }
];

const DEFAULT_DOCTORS = [
  {
    id: "doc-1",
    name: "Dr. Sarah Jenkins",
    gender: "Female",
    qualification: "MD, FACC, Harvard Medical School",
    specialty: "cardiology",
    specialtyName: "Cardiology",
    experience: 14,
    fee: 95,
    rating: 4.9,
    reviewCount: 142,
    availableToday: true,
    availableStatus: "Available Today",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
    room: "Cardio Wing - Suite 402",
    about: "Dr. Sarah Jenkins is an internationally acclaimed board-certified cardiologist with over 14 years of clinical experience specializing in preventive cardiology, coronary artery disease, and non-invasive diagnostic imaging. She completed her fellowship at Massachusetts General Hospital.",
    education: "MD, Harvard Medical School (2010); Fellowship in Cardiovascular Disease, Mass General (2014)",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Friday"],
    consultationHours: "09:00 AM - 04:30 PM",
    slots: ["09:30 AM", "10:30 AM", "11:30 AM", "02:00 PM", "03:30 PM"],
    languages: ["English", "Spanish"]
  },
  {
    id: "doc-2",
    name: "Dr. Marcus Vance",
    gender: "Male",
    qualification: "MD, PhD (Neurology), Johns Hopkins",
    specialty: "neurology",
    specialtyName: "Neurology",
    experience: 16,
    fee: 110,
    rating: 4.8,
    reviewCount: 98,
    availableToday: true,
    availableStatus: "Available Today",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600",
    room: "Neurosciences Center - Room 310",
    about: "Dr. Marcus Vance leads the Neuro-Care clinic at MediCare+, specializing in cognitive health, migraines, movement disorders, and neuro-rehabilitation. He is actively involved in clinical neurology trials and personalized brain wellness therapy.",
    education: "MD, Johns Hopkins University (2008); PhD in Neurobiology (2012)",
    workingDays: ["Monday", "Wednesday", "Thursday", "Saturday"],
    consultationHours: "10:00 AM - 05:00 PM",
    slots: ["10:00 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:30 PM"],
    languages: ["English", "French"]
  },
  {
    id: "doc-3",
    name: "Dr. Elena Rostova",
    gender: "Female",
    qualification: "MD, FAAD (Dermatology), Stanford",
    specialty: "dermatology",
    specialtyName: "Dermatology",
    experience: 11,
    fee: 80,
    rating: 4.95,
    reviewCount: 210,
    availableToday: true,
    availableStatus: "Available Today",
    image: "https://images.unsplash.com/photo-1594824813511-28562d94828b?auto=format&fit=crop&q=80&w=600",
    room: "Derma & Aesthetics - Clinic 104",
    about: "Dr. Elena Rostova provides compassionate, cutting-edge clinical dermatology for chronic skin conditions, eczema, psoriasis, acne therapy, and preventive skin cancer screenings. She believes in holistic, lifestyle-inclusive dermatological care.",
    education: "MD, Stanford University School of Medicine (2013); Chief Resident at UCSF Dermatology",
    workingDays: ["Tuesday", "Wednesday", "Friday", "Saturday"],
    consultationHours: "09:30 AM - 03:30 PM",
    slots: ["09:30 AM", "11:00 AM", "12:00 PM", "02:30 PM", "03:15 PM"],
    languages: ["English", "Russian"]
  },
  {
    id: "doc-4",
    name: "Dr. David Kim",
    gender: "Male",
    qualification: "MD, FAAP, Columbia University",
    specialty: "pediatrics",
    specialtyName: "Pediatrics",
    experience: 12,
    fee: 75,
    rating: 4.9,
    reviewCount: 175,
    availableToday: false,
    availableStatus: "Available Tomorrow",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600",
    room: "Pediatric Pavilion - Room 205",
    about: "Dr. David Kim brings warmth, patience, and evidence-based expertise to pediatric care. He guides parents through child milestones, childhood immunology, asthma care, and adolescent health with a reassuring approach.",
    education: "MD, Columbia University Vagelos College of Physicians and Surgeons (2012)",
    workingDays: ["Monday", "Tuesday", "Thursday", "Friday"],
    consultationHours: "08:30 AM - 04:00 PM",
    slots: ["08:30 AM", "10:00 AM", "11:30 AM", "01:30 PM", "03:00 PM"],
    languages: ["English", "Korean"]
  },
  {
    id: "doc-5",
    name: "Dr. Robert Rodriguez",
    gender: "Male",
    qualification: "MD, FAAOS (Orthopedics), Baylor College",
    specialty: "orthopedics",
    specialtyName: "Orthopedics",
    experience: 18,
    fee: 105,
    rating: 4.85,
    reviewCount: 164,
    availableToday: true,
    availableStatus: "Available Today",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600",
    room: "Orthopedic & Spine Institute - Suite 501",
    about: "Dr. Rodriguez is an orthopedic surgeon specializing in minimally invasive joint restoration, rotator cuff repair, sports injury management, and musculoskeletal trauma. He has worked with national collegiate athletic teams.",
    education: "MD, Baylor College of Medicine (2006); Fellowship in Sports Orthopedics at Steadman Clinic",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    consultationHours: "09:00 AM - 05:00 PM",
    slots: ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"],
    languages: ["English", "Spanish"]
  },
  {
    id: "doc-6",
    name: "Dr. Priya Patel",
    gender: "Female",
    qualification: "MBBS, MD (Internal Medicine), Oxford",
    specialty: "general",
    specialtyName: "General Medicine",
    experience: 9,
    fee: 65,
    rating: 4.92,
    reviewCount: 230,
    availableToday: true,
    availableStatus: "Available Today",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600",
    room: "Outpatient Department - Desk 12",
    about: "Dr. Priya Patel is a dedicated primary care physician focused on preventive wellness, lifestyle medicine, hypertension, metabolic health, and integrated chronic disease management.",
    education: "MBBS, University of Oxford (2015); MD, General Internal Medicine (2018)",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    consultationHours: "08:30 AM - 05:30 PM",
    slots: ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "04:45 PM"],
    languages: ["English", "Hindi", "Gujarati"]
  },
  {
    id: "doc-7",
    name: "Dr. Ethan Brooks",
    gender: "Male",
    qualification: "MD, FACS (Ophthalmology), Yale",
    specialty: "ophthalmology",
    specialtyName: "Ophthalmology",
    experience: 15,
    fee: 90,
    rating: 4.88,
    reviewCount: 112,
    availableToday: false,
    availableStatus: "Available in 2 Days",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=600",
    room: "Vision Care Center - Room 108",
    about: "Dr. Ethan Brooks is a board-certified eye specialist with expertise in advanced cataract extraction, refractive cornea procedures, diabetic retinopathy monitoring, and precision vision therapy.",
    education: "MD, Yale School of Medicine (2009); Residency at Wilmer Eye Institute",
    workingDays: ["Wednesday", "Thursday", "Friday", "Saturday"],
    consultationHours: "09:30 AM - 04:00 PM",
    slots: ["09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM"],
    languages: ["English"]
  },
  {
    id: "doc-8",
    name: "Dr. Chloe Martin",
    gender: "Female",
    qualification: "DDS, MS (Orthodontics), NYU",
    specialty: "dental",
    specialtyName: "Dental Care",
    experience: 10,
    fee: 70,
    rating: 4.96,
    reviewCount: 185,
    availableToday: true,
    availableStatus: "Available Today",
    image: "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?auto=format&fit=crop&q=80&w=600",
    room: "Dental Suite 2 - Level 1",
    about: "Dr. Chloe Martin delivers painless dentistry with gentle care. Her focus encompasses restorative dentistry, cosmetic veneers, aligners, and comprehensive oral surgery in a soothing environment.",
    education: "DDS, New York University College of Dentistry (2014); MS Orthodontics (2017)",
    workingDays: ["Monday", "Tuesday", "Thursday", "Friday"],
    consultationHours: "09:00 AM - 04:30 PM",
    slots: ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"],
    languages: ["English", "German"]
  }
];

const DEFAULT_PATIENT = {
  id: "pat-101",
  fullName: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 382-9104",
  dob: "1994-06-15",
  gender: "Male",
  bloodGroup: "O+",
  height: "178 cm",
  weight: "72 kg",
  address: "742 Evergreen Terrace, Suite 402, Springfield, IL",
  emergencyName: "Sarah Morgan",
  emergencyPhone: "+1 (555) 912-4011",
  emergencyRelation: "Spouse",
  allergies: "Penicillin (Mild urticaria), Pollen allergy",
  medicalConditions: "Occasional seasonal asthma, Mild hyperlipidemia",
  insuranceProvider: "BlueCross Health Plus (ID: #BCHP-98214)",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
};

const DEFAULT_APPOINTMENTS = [
  {
    id: "MED-2026-8941",
    patientId: "pat-101",
    patientName: "Alex Morgan",
    patientPhone: "+1 (555) 382-9104",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Jenkins",
    specialtyName: "Cardiology",
    doctorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    room: "Cardio Wing - Suite 402",
    date: "2026-10-15",
    time: "10:30 AM",
    type: "In-Person Consultation",
    status: "Upcoming", // Upcoming, Completed, Cancelled
    reason: "Routine cardiac evaluation and ECG follow-up following mild exertion palpitations.",
    fee: 95,
    paymentStatus: "Paid Online",
    notes: "Please arrive 10 minutes prior for blood pressure check. Fasting not required."
  },
  {
    id: "MED-2026-7832",
    patientId: "pat-101",
    patientName: "Alex Morgan",
    patientPhone: "+1 (555) 382-9104",
    doctorId: "doc-6",
    doctorName: "Dr. Priya Patel",
    specialtyName: "General Medicine",
    doctorImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=300",
    room: "Outpatient Department - Desk 12",
    date: "2026-10-22",
    time: "02:00 PM",
    type: "Video Consultation",
    status: "Upcoming",
    reason: "Review of quarterly blood lipid profile and lifestyle modifications.",
    fee: 65,
    paymentStatus: "Pay at Clinic",
    notes: "Join via the secure telehealth room link sent to your registered email."
  },
  {
    id: "MED-2026-6145",
    patientId: "pat-101",
    patientName: "Alex Morgan",
    patientPhone: "+1 (555) 382-9104",
    doctorId: "doc-3",
    doctorName: "Dr. Elena Rostova",
    specialtyName: "Dermatology",
    doctorImage: "https://images.unsplash.com/photo-1594824813511-28562d94828b?auto=format&fit=crop&q=80&w=300",
    room: "Derma & Aesthetics - Clinic 104",
    date: "2026-09-18",
    time: "11:00 AM",
    type: "In-Person Consultation",
    status: "Completed",
    reason: "Contact dermatitis and skin allergy examination on right forearm.",
    fee: 80,
    paymentStatus: "Paid Online",
    notes: "Prescribed topical corticosteroid cream and oral antihistamines."
  },
  {
    id: "MED-2026-5012",
    patientId: "pat-101",
    patientName: "Alex Morgan",
    patientPhone: "+1 (555) 382-9104",
    doctorId: "doc-5",
    doctorName: "Dr. Robert Rodriguez",
    specialtyName: "Orthopedics",
    doctorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300",
    room: "Orthopedic & Spine Institute - Suite 501",
    date: "2026-08-04",
    time: "01:00 PM",
    type: "In-Person Consultation",
    status: "Completed",
    reason: "Left knee strain evaluation after running marathon.",
    fee: 105,
    paymentStatus: "Paid Online",
    notes: "Knee X-ray confirmed no ligament tear. Recommended physical therapy."
  },
  {
    id: "MED-2026-4299",
    patientId: "pat-101",
    patientName: "Alex Morgan",
    patientPhone: "+1 (555) 382-9104",
    doctorId: "doc-2",
    doctorName: "Dr. Marcus Vance",
    specialtyName: "Neurology",
    doctorImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    room: "Neurosciences Center - Room 310",
    date: "2026-07-12",
    time: "03:00 PM",
    type: "Video Consultation",
    status: "Cancelled",
    reason: "Work schedule conflict. Rescheduled to a later date.",
    fee: 110,
    paymentStatus: "Refunded",
    notes: "Patient cancelled 24 hours prior. Full refund processed."
  }
];

const DEFAULT_MEDICAL_RECORDS = [
  {
    id: "REC-901",
    title: "Annual Comprehensive Health Screening & Vitals",
    date: "2026-09-28",
    doctorName: "Dr. Priya Patel",
    specialty: "General Medicine",
    department: "Internal Medicine",
    diagnosis: "Healthy adult baseline; mild benign elevated LDL cholesterol without vascular signs.",
    symptoms: "Asymptomatic; routine annual executive physical checkup.",
    vitals: {
      bp: "118/76 mmHg",
      heartRate: "70 bpm",
      respiratoryRate: "16 bpm",
      temp: "98.4 °F",
      spO2: "99%",
      bmi: "22.7 kg/m²"
    },
    labSummary: "Lipid Profile: Total Cholesterol 208 mg/dL, HDL 54 mg/dL, LDL 128 mg/dL, Triglycerides 130 mg/dL. Fasting Glucose 92 mg/dL.",
    recommendations: "Adopt Mediterranean dietary habits, increase aerobic exercise to 150 mins/week, repeat lipid panel in 6 months.",
    hasPrescription: true,
    prescriptionId: "RX-88421",
    // IPFS Decentralized Health Ledger Properties
    ipfsCid: "bafybeicz3jlnkvp37x7b5z4wug2vvyqf5q47tqqg3y6r7e6z6c4pwyvaia",
    ipfsCidV0: "QmZtmD2qt8fJpq3CLDHyt5iDTWPnMcDYwEzKn1zsmmstPb",
    ipfsPinStatus: "Pinned on MediCare+ Node",
    ipfsGatewayUrl: "https://ipfs.io/ipfs/bafybeicz3jlnkvp37x7b5z4wug2vvyqf5q47tqqg3y6r7e6z6c4pwyvaia",
    tamperProofHash: "9a7516597951c062c3e414f44a30e7ca4578b7b252086e392576b92a2a2253cf",
    encryptionCipher: "AES-GCM-256 (HIPAA Enveloped)",
    merkleRoot: "bafyreicx2q5y7m7r6v4v4jlwkgphw75n6i3t2lq3q2w7d2v2u3p4q5r6s7",
    merkleBlocks: 6,
    attachments: [
      {
        name: "Executive_Panel_Lab_Report.pdf",
        size: "1.4 MB",
        type: "PDF",
        cid: "bafybeih4j3h4mvdn4hfx37jebvknx5qffl5h35h3j7b4k2j4p3j7b4k2ja",
        gatewayUrl: "https://ipfs.io/ipfs/bafybeih4j3h4mvdn4hfx37jebvknx5qffl5h35h3j7b4k2j4p3j7b4k2ja",
        verified: true
      },
      {
        name: "Resting_ECG_Trace.pdf",
        size: "840 KB",
        type: "PDF",
        cid: "bafybeidw6c7j4k2j4p3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2ja",
        gatewayUrl: "https://ipfs.io/ipfs/bafybeidw6c7j4k2j4p3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2ja",
        verified: true
      }
    ]
  },
  {
    id: "REC-824",
    title: "Acute Contact Dermatitis & Allergic Reaction",
    date: "2026-09-18",
    doctorName: "Dr. Elena Rostova",
    specialty: "Dermatology",
    department: "Dermatology Clinic",
    diagnosis: "Subacute allergic contact dermatitis localized to dorsal forearms.",
    symptoms: "Pruritic erythema with minor papular eruption following gardening without barrier gloves.",
    vitals: {
      bp: "122/80 mmHg",
      heartRate: "74 bpm",
      temp: "98.6 °F",
      spO2: "99%",
      bmi: "22.7 kg/m²"
    },
    labSummary: "Visual dermoscopy confirmed absence of fungal element or secondary microbial infection.",
    recommendations: "Avoid contact with plant allergens. Wash with gentle fragrance-free cleanser.",
    hasPrescription: true,
    prescriptionId: "RX-66120",
    ipfsCid: "bafybeifk4v2p5x3h7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2j4p3a",
    ipfsCidV0: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    ipfsPinStatus: "Pinned on MediCare+ Node",
    ipfsGatewayUrl: "https://ipfs.io/ipfs/bafybeifk4v2p5x3h7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2j4p3a",
    tamperProofHash: "3b68832a82643a6d713c2ca984b2be8b7b252086e392576b92a2a2253cf9a751",
    encryptionCipher: "AES-GCM-256 (HIPAA Enveloped)",
    merkleRoot: "bafyreih5v2p5x3h7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2j4p3b",
    merkleBlocks: 9,
    attachments: [
      {
        name: "Dermatology_Clinical_Photos.pdf",
        size: "2.1 MB",
        type: "PDF",
        cid: "bafybeid7b4k2j4p3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2ja4h",
        gatewayUrl: "https://ipfs.io/ipfs/bafybeid7b4k2j4p3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2ja4h",
        verified: true
      }
    ]
  },
  {
    id: "REC-739",
    title: "Left Knee Strain & Patellofemoral Assessment",
    date: "2026-08-04",
    doctorName: "Dr. Robert Rodriguez",
    specialty: "Orthopedics",
    department: "Orthopedic Institute",
    diagnosis: "Grade 1 quadriceps tendon strain with minor patellofemoral friction, no meniscus damage.",
    symptoms: "Anterior left knee tenderness exacerbated by stair descent.",
    vitals: {
      bp: "120/78 mmHg",
      heartRate: "68 bpm",
      temp: "98.2 °F",
      spO2: "99%",
      bmi: "22.7 kg/m²"
    },
    labSummary: "Radiographs: Left Knee AP & Lateral views demonstrate well-preserved joint spaces without osteophytes.",
    recommendations: "RICE protocol for 5 days. Quad strengthening exercises, isometric hamstring stretching.",
    hasPrescription: false,
    ipfsCid: "bafybeig9m3k4j2p3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2j4p3c",
    ipfsCidV0: "QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx",
    ipfsPinStatus: "Pinned on MediCare+ Node",
    ipfsGatewayUrl: "https://ipfs.io/ipfs/bafybeig9m3k4j2p3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2j4p3c",
    tamperProofHash: "8f42a6c17b352086e392576b92a2a2253cf9a7516597951c062c3e414f44a30e",
    encryptionCipher: "AES-GCM-256 (HIPAA Enveloped)",
    merkleRoot: "bafyreih6x3h7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2j4p3c4d5e",
    merkleBlocks: 13,
    attachments: [
      {
        name: "Knee_AP_Lateral_XRay.pdf",
        size: "3.2 MB",
        type: "PDF",
        cid: "bafybeih5h35h3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2ja4hfx3",
        gatewayUrl: "https://ipfs.io/ipfs/bafybeih5h35h3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2ja4hfx3",
        verified: true
      },
      {
        name: "Physical_Therapy_Protocol.pdf",
        size: "620 KB",
        type: "PDF",
        cid: "bafybeiffl5h35h3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2ja4hf",
        gatewayUrl: "https://ipfs.io/ipfs/bafybeiffl5h35h3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2ja4hf",
        verified: true
      }
    ]
  },
  {
    id: "REC-610",
    title: "Ophthalmic Slit-Lamp Exam & Refraction",
    date: "2026-05-14",
    doctorName: "Dr. Ethan Brooks",
    specialty: "Ophthalmology",
    department: "Eye Center",
    diagnosis: "Mild bilateral myopic astigmatism with computer eye strain (dry eye syndrome).",
    symptoms: "Evening eye fatigue and intermittent blurred vision when viewing displays.",
    vitals: {
      bp: "116/74 mmHg",
      intraocularPressure: "OD 14 mmHg, OS 15 mmHg",
      visualAcuity: "OD 20/25, OS 20/20"
    },
    labSummary: "Fundus examination normal, macula sharp, optic discs pink with cup-to-disc ratio 0.3.",
    recommendations: "Prescribed lubricating ocular drops, 20-20-20 rule during screen use, blue-light filter lenses.",
    hasPrescription: true,
    prescriptionId: "RX-55419",
    ipfsCid: "bafybeih6m2k4j2p3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2j4p3d",
    ipfsCidV0: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    ipfsPinStatus: "Pinned on MediCare+ Node",
    ipfsGatewayUrl: "https://ipfs.io/ipfs/bafybeih6m2k4j2p3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2j4p3d",
    tamperProofHash: "5d41402abc4b2a76b9719d911017c592b2be8b7b252086e392576b92a2a2253c",
    encryptionCipher: "AES-GCM-256 (HIPAA Enveloped)",
    merkleRoot: "bafyreih7y4j2ja4hfx37jebvknx5qffl5h35h3j7b4k2j4p3d5e6f7g8h",
    merkleBlocks: 2,
    attachments: [
      {
        name: "Ophthalmic_Refraction_Sheet.pdf",
        size: "450 KB",
        type: "PDF",
        cid: "bafybeibknx5qffl5h35h3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k",
        gatewayUrl: "https://ipfs.io/ipfs/bafybeibknx5qffl5h35h3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k",
        verified: true
      }
    ]
  }
];

const DEFAULT_PRESCRIPTIONS = [
  {
    id: "RX-88421",
    recordId: "REC-901",
    date: "2026-09-28",
    doctorName: "Dr. Priya Patel",
    doctorDegree: "MBBS, MD (Internal Medicine)",
    licenseNo: "MD-92814-IL",
    clinic: "MediCare+ Central Medical Center, 500 Healthcare Blvd",
    patientName: "Alex Morgan",
    patientAge: 32,
    patientGender: "Male",
    patientId: "pat-101",
    diagnosis: "Preventive lipid management & general health optimization",
    medicines: [
      {
        name: "Atorvastatin Calcium",
        dosage: "10 mg",
        type: "Tablet",
        frequency: "Once daily (0-0-1)",
        timing: "At bedtime",
        duration: "90 Days",
        instructions: "Take with or without food. Avoid grapefruit juice."
      },
      {
        name: "Omega-3 Acid Ethyl Esters",
        dosage: "1000 mg",
        type: "Capsule",
        frequency: "Twice daily (1-0-1)",
        timing: "After meals",
        duration: "90 Days",
        instructions: "Take with a full glass of water after breakfast and dinner."
      },
      {
        name: "Vitamin D3 (Cholecalciferol)",
        dosage: "2000 IU",
        type: "Softgel",
        frequency: "Once daily (1-0-0)",
        timing: "Morning after meal",
        duration: "60 Days",
        instructions: "Take with a healthy fat-containing breakfast."
      }
    ],
    doctorNotes: "Monitor liver enzymes in 12 weeks. Maintain regular low-impact cardio exercises.",
    digitalSignature: "Priya Patel, MD",
    digitalSignatureHash: "SIG-ECDSA-SHA256:0x7a89f92bb45601c2389e81b671a5c689f012de9a8",
    ipfsCid: "bafybeidw6c7j4k2j4p3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2ja",
    ipfsPinStatus: "Pinned on MediCare+ Node",
    ipfsGatewayUrl: "https://ipfs.io/ipfs/bafybeidw6c7j4k2j4p3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2ja",
    encryptionCipher: "AES-GCM-256 (Enveloped)",
    verified: true
  },
  {
    id: "RX-66120",
    recordId: "REC-824",
    date: "2026-09-18",
    doctorName: "Dr. Elena Rostova",
    doctorDegree: "MD, FAAD (Dermatology)",
    licenseNo: "MD-71044-CA",
    clinic: "MediCare+ Derma Care Unit",
    patientName: "Alex Morgan",
    patientAge: 32,
    patientGender: "Male",
    patientId: "pat-101",
    diagnosis: "Acute contact dermatitis of bilateral forearms",
    medicines: [
      {
        name: "Hydrocortisone Butyrate Cream",
        dosage: "0.1% w/w",
        type: "Topical Cream",
        frequency: "Twice daily (1-0-1)",
        timing: "Morning & Night",
        duration: "7 Days",
        instructions: "Apply thin layer gently to affected areas only. Do not occlude."
      },
      {
        name: "Cetirizine Hydrochloride",
        dosage: "10 mg",
        type: "Tablet",
        frequency: "Once daily (0-0-1)",
        timing: "Night time",
        duration: "10 Days",
        instructions: "For relief of pruritus and itchiness. May cause mild drowsiness."
      },
      {
        name: "Ceramide Barrier Repair Lotion",
        dosage: "250 ml",
        type: "Emollient",
        frequency: "3 times daily",
        timing: "As needed",
        duration: "30 Days",
        instructions: "Liberally apply within 3 minutes of bathing to lock skin moisture."
      }
    ],
    doctorNotes: "If redness spreads or weeping develops, contact clinic immediately.",
    digitalSignature: "Elena Rostova, MD",
    digitalSignatureHash: "SIG-ECDSA-SHA256:0x3c54d19aa82715e4782c19a421b8e954c231ef6b2",
    ipfsCid: "bafybeiffl5h35h3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2ja4hf",
    ipfsPinStatus: "Pinned on MediCare+ Node",
    ipfsGatewayUrl: "https://ipfs.io/ipfs/bafybeiffl5h35h3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k2ja4hf",
    encryptionCipher: "AES-GCM-256 (Enveloped)",
    verified: true
  },
  {
    id: "RX-55419",
    recordId: "REC-610",
    date: "2026-05-14",
    doctorName: "Dr. Ethan Brooks",
    doctorDegree: "MD, FACS (Ophthalmology)",
    licenseNo: "MD-44819-NY",
    clinic: "MediCare+ Vision & Eye Center",
    patientName: "Alex Morgan",
    patientAge: 32,
    patientGender: "Male",
    patientId: "pat-101",
    diagnosis: "Digital asthenopia and dry eye syndrome",
    medicines: [
      {
        name: "Carboxymethylcellulose Sodium Drops",
        dosage: "0.5% w/v",
        type: "Ophthalmic Drops",
        frequency: "1-2 drops (3 times/day)",
        timing: "Morning, Noon, Evening",
        duration: "30 Days",
        instructions: "Discard single-use vials 12 hours after opening. Do not touch eye tip."
      }
    ],
    doctorNotes: "Wear prescribed computer blue-light glasses for prolonged VDT work.",
    digitalSignature: "Ethan Brooks, MD",
    digitalSignatureHash: "SIG-ECDSA-SHA256:0x9f18a24c568902d1847e32c819a0f472e816ab9c4",
    ipfsCid: "bafybeibknx5qffl5h35h3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k",
    ipfsPinStatus: "Pinned on MediCare+ Node",
    ipfsGatewayUrl: "https://ipfs.io/ipfs/bafybeibknx5qffl5h35h3j7b4k2ja4hfx37jebvknx5qffl5h35h3j7b4k",
    encryptionCipher: "AES-GCM-256 (Enveloped)",
    verified: true
  }
];

const DEFAULT_IPFS_NODE = {
  peerId: "12D3KooWQr6V7eYvK91f1mC3jL9aB1m6q1w2e3r4t5y6u7i8o9p0",
  agentVersion: "helia/medicare-health-cluster/v2.4.0",
  protocolVersion: "ipfs/0.1.0",
  status: "Online",
  network: "MediCare+ Federated Health Swarm",
  gateway: "https://ipfs.io/ipfs/",
  region: "US-East (Illinois Healthcare Gateway)",
  activePeers: 18,
  totalPins: 14,
  pinnedStorage: "2.42 GB",
  encryption: "AES-GCM-256 (Client-side Enveloped)",
  peersList: [
    { name: "MediCare Central Primary Node", peerId: "12D3KooWQr6V...9p0", location: "Chicago, IL", latency: "4ms", status: "Connected" },
    { name: "Mayo Clinic Research Swarm", peerId: "12D3KooWP81a...4x1", location: "Rochester, MN", latency: "18ms", status: "Connected" },
    { name: "Johns Hopkins Federated Peer", peerId: "12D3KooWN32c...7b2", location: "Baltimore, MD", latency: "24ms", status: "Connected" },
    { name: "London NHS Clinical Gateway", peerId: "12D3KooWQ99z...1m5", location: "London, UK", latency: "78ms", status: "Connected" },
    { name: "Singapore National Health Ledger", peerId: "12D3KooWL44k...8p3", location: "Singapore, SG", latency: "142ms", status: "Connected" }
  ]
};

const DEFAULT_TESTIMONIALS = [
  {
    name: "Eleanor Vance",
    role: "Patient since 2024",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    comment: "MediCare+ completely revolutionized how I book cardiology appointments. Dr. Jenkins took immediate care of my symptoms, and viewing my ECG records online within minutes gave me huge peace of mind."
  },
  {
    name: "James Thornton",
    role: "Verified Patient",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    comment: "The 3-step booking is ultra smooth. Being able to choose my doctor, pick a slot, and have prescriptions printable in standard hospital layout is incredible for my college family coverage."
  },
  {
    name: "Dr. Claire Sterling",
    role: "Medical Reviewer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    comment: "As a clinician, I appreciate how clean the medical history and vitals tracking are. The interface feels trustworthy, accessible, and on par with top-tier hospital systems."
  }
];

const DEFAULT_ADMIN = {
  id: "admin-01",
  fullName: "Dr. Arthur Vance",
  role: "Chief Medical Administrator",
  email: "admin@medicare.org",
  phone: "+1 (555) 900-1122",
  department: "Hospital Executive Operations",
  avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300"
};

