import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import User from './models/User.js';
import Skill from './models/Skill.js';
import Certificate from './models/Certificate.js';
import Project from './models/Project.js';
import Internship from './models/Internship.js';
import Achievement from './models/Achievement.js';
import VerificationRequest from './models/VerificationRequest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
  try {
    const primaryUri = process.env.MONGODB_URI;
    const fallbackUri = 'mongodb://127.0.0.1:27017/skillproof';
    try {
      await mongoose.connect(primaryUri);
      console.log(`[Seeder] Connected to MongoDB: ${mongoose.connection.host}`);
    } catch (authErr) {
      console.warn(`[Seeder] Primary MongoDB Atlas connection failed (${authErr.message}). Falling back to local MongoDB...`);
      await mongoose.connect(fallbackUri);
      console.log(`[Seeder] Connected to local fallback MongoDB: ${mongoose.connection.host}`);
    }

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Skill.deleteMany({}),
      Certificate.deleteMany({}),
      Project.deleteMany({}),
      Internship.deleteMany({}),
      Achievement.deleteMany({}),
      VerificationRequest.deleteMany({}),
    ]);
    console.log('[Seeder] Cleared old data.');

    // Ensure uploads folder has a sample proof image
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create a sample SVG certificate proof file for demonstration
    const sampleProofPath = path.join(uploadDir, 'sample_aws_certificate.svg');
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="550" viewBox="0 0 800 550">
      <defs>
        <linearGradient id="certGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <rect width="800" height="550" rx="16" fill="url(#certGrad)"/>
      <rect x="20" y="20" width="760" height="510" rx="12" fill="none" stroke="url(#goldGrad)" stroke-width="3" stroke-dasharray="8 4"/>
      <circle cx="400" cy="90" r="40" fill="url(#goldGrad)" opacity="0.15"/>
      <text x="400" y="98" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#f59e0b" text-anchor="middle">🛡️ SKILLPROOF VERIFIED CREDENTIAL</text>
      <text x="400" y="160" font-family="Arial, sans-serif" font-size="24" font-weight="600" fill="#f8fafc" text-anchor="middle">CERTIFICATE OF ACHIEVEMENT</text>
      <text x="400" y="195" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">This is officially certified and verified for excellence in engineering</text>
      <line x1="250" y1="220" x2="550" y2="220" stroke="#334155" stroke-width="1.5"/>
      <text x="400" y="260" font-family="Arial, sans-serif" font-size="16" fill="#cbd5e1" text-anchor="middle">Awarded to:</text>
      <text x="400" y="300" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#38bdf8" text-anchor="middle">Alex Rivera</text>
      <text x="400" y="340" font-family="Arial, sans-serif" font-size="15" fill="#e2e8f0" text-anchor="middle">AWS Certified Solutions Architect – Associate</text>
      <text x="400" y="375" font-family="Arial, sans-serif" font-size="13" fill="#64748b" text-anchor="middle">Issuing Authority: Amazon Web Services (AWS) | Credential ID: AWS-99482-ARCH</text>
      <rect x="280" y="420" width="240" height="42" rx="21" fill="url(#goldGrad)"/>
      <text x="400" y="446" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">✓ VERIFIED BY SKILLPROOF BOARD</text>
      <text x="400" y="495" font-family="Arial, sans-serif" font-size="11" fill="#475569" text-anchor="middle">SkillProof Secure Cryptographic Identifier: SP-2026-CERT-8849</text>
    </svg>`;
    fs.writeFileSync(sampleProofPath, svgContent);

    // Create Admin/Verifier user
    const verifier = await User.create({
      name: 'Dr. Marcus Vance',
      email: 'verifier@skillproof.edu',
      password: 'admin123',
      role: 'verifier',
      username: 'dr_marcus_verifier',
      phone: '+1 (555) 234-5678',
      college: 'National Institute of Engineering',
      degree: 'Ph.D. in Computer Science',
      branch: 'Head of Industry Credentialing & Verification',
      bio: 'Lead Verification Officer at SkillProof and Faculty Director of Computing at NIE. Evaluating student engineering achievements and credentials.',
      location: 'San Francisco, CA',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    // Create Student 1 (Alex Rivera)
    const student1 = await User.create({
      name: 'Alex Rivera',
      email: 'alex@skillproof.edu',
      password: 'password123',
      role: 'student',
      username: 'alex_rivera',
      phone: '+1 (555) 987-6543',
      college: 'Stanford University',
      degree: 'Bachelor of Science',
      branch: 'Computer Science & AI',
      graduationYear: 2026,
      location: 'Palo Alto, CA',
      bio: 'Full-stack software developer and AI systems researcher passionate about high-throughput distributed systems and verifiable credential architectures.',
      linkedin: 'https://linkedin.com/in/alexrivera-dev',
      github: 'https://github.com/alexrivera',
      portfolio: 'https://alexrivera.dev',
      profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    });

    // Create Student 2 (Priya Sharma)
    const student2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@skillproof.edu',
      password: 'password123',
      role: 'student',
      username: 'priya_sharma',
      phone: '+1 (555) 432-8765',
      college: 'University of California, Berkeley',
      degree: 'B.Tech',
      branch: 'Electrical Engineering & Computer Sciences',
      graduationYear: 2027,
      location: 'Berkeley, CA',
      bio: 'Cloud architecture enthusiast, Kubernetes contributor, and open source builder. Striving for zero-downtime microservice designs.',
      linkedin: 'https://linkedin.com/in/priya-sharma-cloud',
      github: 'https://github.com/priyasharma',
      portfolio: 'https://priyasharma.io',
      profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    });

    // Seed Skills for Student 1
    const s1Skills = await Skill.create([
      {
        userId: student1._id,
        name: 'React.js & Next.js',
        category: 'Web Development',
        proficiency: 'Expert',
        verificationStatus: 'Verified',
        verificationRemarks: 'Demonstrated extensive production frontend architecture in verified hackathon & internship submissions.',
        verifiedAt: new Date(),
        verifiedBy: verifier._id,
      },
      {
        userId: student1._id,
        name: 'Node.js & Express',
        category: 'Web Development',
        proficiency: 'Expert',
        verificationStatus: 'Verified',
        verificationRemarks: 'Verified through verified internship code review and backend project demonstration.',
        verifiedAt: new Date(),
        verifiedBy: verifier._id,
      },
      {
        userId: student1._id,
        name: 'MongoDB & Mongoose',
        category: 'Database',
        proficiency: 'Advanced',
        verificationStatus: 'Verified',
        verifiedAt: new Date(),
        verifiedBy: verifier._id,
      },
      {
        userId: student1._id,
        name: 'Python & PyTorch',
        category: 'AI/ML',
        proficiency: 'Advanced',
        verificationStatus: 'Verified',
        verifiedAt: new Date(),
        verifiedBy: verifier._id,
      },
      {
        userId: student1._id,
        name: 'Docker & Kubernetes',
        category: 'Cloud',
        proficiency: 'Intermediate',
        verificationStatus: 'Pending',
        proof: '/uploads/sample_aws_certificate.svg',
      },
      {
        userId: student1._id,
        name: 'System Design & Scalability',
        category: 'Programming',
        proficiency: 'Advanced',
        verificationStatus: 'Not Submitted',
      },
    ]);

    // Seed Certificates for Student 1
    const cert1 = await Certificate.create({
      userId: student1._id,
      title: 'AWS Certified Solutions Architect – Associate',
      organization: 'Amazon Web Services (AWS)',
      issueDate: new Date('2025-08-15'),
      credentialId: 'AWS-99482-ARCH',
      credentialUrl: 'https://aws.amazon.com/verification',
      description: 'Validation of comprehensive cloud architecture, high availability, and cost-efficient distributed deployments.',
      proof: '/uploads/sample_aws_certificate.svg',
      verificationStatus: 'Verified',
      verificationRemarks: 'Credential validated via official AWS certificate register.',
      verifiedAt: new Date(),
      verifiedBy: verifier._id,
    });

    const cert2 = await Certificate.create({
      userId: student1._id,
      title: 'Meta Frontend Developer Professional Certificate',
      organization: 'Meta / Coursera',
      issueDate: new Date('2025-05-10'),
      credentialId: 'META-FE-829104',
      credentialUrl: 'https://coursera.org/verify/META-FE-829104',
      description: 'Mastery in React, UI/UX engineering, state management, and modern responsive design practices.',
      proof: '/uploads/sample_aws_certificate.svg',
      verificationStatus: 'Verified',
      verificationRemarks: 'Credential URL and badge verified.',
      verifiedAt: new Date(),
      verifiedBy: verifier._id,
    });

    // Seed Projects for Student 1
    const proj1 = await Project.create({
      userId: student1._id,
      title: 'SkillProof – Verified Credential Network',
      description: 'End-to-end decentralized student skill and achievement verification system with cryptographic verification badges and recruiter search engine.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'JWT'],
      githubUrl: 'https://github.com/alexrivera/skillproof',
      liveUrl: 'https://skillproof-demo.app',
      projectDuration: '4 months',
      projectRole: 'Lead Full-Stack Architect',
      proof: '/uploads/sample_aws_certificate.svg',
      verificationStatus: 'Verified',
      verificationRemarks: 'Code repository inspected and demo tested live.',
      verifiedAt: new Date(),
      verifiedBy: verifier._id,
    });

    const proj2 = await Project.create({
      userId: student1._id,
      title: 'AutoDoc AI – Intelligent Code Documenter',
      description: 'Generates comprehensive architectural documentation and type definitions from raw repository ASTs using modern LLM APIs.',
      technologies: ['Python', 'FastAPI', 'React', 'TypeScript', 'Docker'],
      githubUrl: 'https://github.com/alexrivera/autodoc-ai',
      liveUrl: 'https://autodoc-ai.dev',
      projectDuration: '2 months',
      projectRole: 'Solo Creator',
      verificationStatus: 'Verified',
      verifiedAt: new Date(),
      verifiedBy: verifier._id,
    });

    // Seed Internships for Student 1
    const intern1 = await Internship.create({
      userId: student1._id,
      company: 'Stripe',
      role: 'Software Engineering Intern',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-08-30'),
      currentlyWorking: false,
      description: 'Engineered high-throughput webhook processing infrastructure handling over 40M daily events with 99.999% SLA.',
      technologies: ['Node.js', 'Go', 'Redis', 'Kafka', 'Docker'],
      companyUrl: 'https://stripe.com',
      proof: '/uploads/sample_aws_certificate.svg',
      verificationStatus: 'Verified',
      verificationRemarks: 'Employment and completion letter verified with official HR email confirmation.',
      verifiedAt: new Date(),
      verifiedBy: verifier._id,
    });

    // Seed Achievements for Student 1
    const ach1 = await Achievement.create({
      userId: student1._id,
      title: '1st Place – Silicon Valley Collegiate Hackathon 2025',
      category: 'Hackathons',
      description: 'Built a collaborative peer-to-peer real-time collaborative code editor with cryptographic history verification among 150+ university teams.',
      organization: 'SV Tech Council',
      date: new Date('2025-10-12'),
      proof: '/uploads/sample_aws_certificate.svg',
      credentialUrl: 'https://hackathon.svtech.org/winners-2025',
      verificationStatus: 'Verified',
      verificationRemarks: 'Official winner certificate and press release verified.',
      verifiedAt: new Date(),
      verifiedBy: verifier._id,
    });

    // Seed data for Student 2 (Priya) with PENDING items for the Verifier to review!
    const s2Skill = await Skill.create({
      userId: student2._id,
      name: 'Kubernetes & Helm',
      category: 'Cloud',
      proficiency: 'Advanced',
      verificationStatus: 'Pending',
      proof: '/uploads/sample_aws_certificate.svg',
    });

    const s2Cert = await Certificate.create({
      userId: student2._id,
      title: 'Certified Kubernetes Administrator (CKA)',
      organization: 'The Linux Foundation & CNCF',
      issueDate: new Date('2026-01-20'),
      credentialId: 'CKA-882910-K8S',
      credentialUrl: 'https://www.credly.com/org/the-linux-foundation',
      description: 'Demonstrates deep competency in Kubernetes installation, configuration, networking, storage, and cluster troubleshooting.',
      proof: '/uploads/sample_aws_certificate.svg',
      verificationStatus: 'Pending',
    });

    const s2Project = await Project.create({
      userId: student2._id,
      title: 'KubeWatchDog – Cluster Anomaly Sentinel',
      description: 'Automated Kubernetes operator that detects memory leaks and pod restart loops before causing outages.',
      technologies: ['Go', 'Kubernetes Operator SDK', 'Prometheus', 'Grafana'],
      githubUrl: 'https://github.com/priyasharma/kubewatchdog',
      liveUrl: 'https://kubewatchdog.cloud',
      projectDuration: '3 months',
      projectRole: 'Creator & Maintainer',
      proof: '/uploads/sample_aws_certificate.svg',
      verificationStatus: 'Pending',
    });

    const s2Intern = await Internship.create({
      userId: student2._id,
      company: 'Datadog',
      role: 'Cloud Infrastructure Intern',
      startDate: new Date('2025-05-15'),
      endDate: new Date('2025-08-15'),
      currentlyWorking: false,
      description: 'Assisted core telemetry pipeline team in scaling OpenTelemetry collector clusters across multi-region AWS and GCP.',
      technologies: ['Kubernetes', 'Terraform', 'Go', 'AWS'],
      companyUrl: 'https://datadoghq.com',
      proof: '/uploads/sample_aws_certificate.svg',
      verificationStatus: 'Pending',
    });

    const s2Achievement = await Achievement.create({
      userId: student2._id,
      title: 'Grand Prize Winner – Global Cloud Security Summit 2026',
      category: 'Coding Competitions',
      description: 'Secured 1st rank out of 3,200 participants in CTF cloud infrastructure defense challenges.',
      organization: 'Cloud Security Alliance',
      date: new Date('2026-02-14'),
      proof: '/uploads/sample_aws_certificate.svg',
      verificationStatus: 'Pending',
    });

    // Create VerificationRequests for Student 2 pending items
    await VerificationRequest.create([
      {
        userId: student2._id,
        itemId: s2Cert._id,
        itemType: 'Certificate',
        itemTitle: s2Cert.title,
        proof: s2Cert.proof,
        status: 'Pending',
        submittedAt: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
      },
      {
        userId: student2._id,
        itemId: s2Project._id,
        itemType: 'Project',
        itemTitle: s2Project.title,
        proof: s2Project.proof,
        status: 'Pending',
        submittedAt: new Date(Date.now() - 3600000 * 18), // 18 hours ago
      },
      {
        userId: student2._id,
        itemId: s2Intern._id,
        itemType: 'Internship',
        itemTitle: `${s2Intern.role} at ${s2Intern.company}`,
        proof: s2Intern.proof,
        status: 'Pending',
        submittedAt: new Date(Date.now() - 3600000 * 10), // 10 hours ago
      },
      {
        userId: student2._id,
        itemId: s2Achievement._id,
        itemType: 'Achievement',
        itemTitle: s2Achievement.title,
        proof: s2Achievement.proof,
        status: 'Pending',
        submittedAt: new Date(Date.now() - 3600000 * 4), // 4 hours ago
      },
      {
        userId: student2._id,
        itemId: s2Skill._id,
        itemType: 'Skill',
        itemTitle: s2Skill.name,
        proof: s2Skill.proof,
        status: 'Pending',
        submittedAt: new Date(Date.now() - 3600000 * 1), // 1 hour ago
      },
    ]);

    // Also create 1 historical verified request for Alex
    await VerificationRequest.create({
      userId: student1._id,
      itemId: cert1._id,
      itemType: 'Certificate',
      itemTitle: cert1.title,
      proof: cert1.proof,
      status: 'Verified',
      reviewedBy: verifier._id,
      reviewedAt: new Date(),
      remarks: 'Verified against AWS registry with 100% credential match.',
      submittedAt: new Date(Date.now() - 3600000 * 24 * 10),
    });

    console.log('[Seeder] =============================================');
    console.log('[Seeder] Database Seeded Successfully!');
    console.log('[Seeder] DEMO ACCOUNTS:');
    console.log('[Seeder] 1. Student (Alex Rivera):');
    console.log('[Seeder]    Email:    alex@skillproof.edu');
    console.log('[Seeder]    Password: password123');
    console.log('[Seeder] 2. Student (Priya Sharma - Has 5 Pending Submissions):');
    console.log('[Seeder]    Email:    priya@skillproof.edu');
    console.log('[Seeder]    Password: password123');
    console.log('[Seeder] 3. Verifier/Admin (Dr. Marcus Vance):');
    console.log('[Seeder]    Email:    verifier@skillproof.edu');
    console.log('[Seeder]    Password: admin123');
    console.log('[Seeder] =============================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
