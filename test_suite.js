// Comprehensive End-to-End Test Suite for SkillProof
const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('====================================================');
  console.log(' 🛡️ Starting SkillProof End-to-End System Tests');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(` ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(` ❌ FAIL: ${testName} - ${details}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthData.status === 'OK', '1. System Health API is operating');

    // 2. Student Registration
    const newStudentEmail = `test_student_${Date.now()}@skillproof.edu`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jordan Lee',
        email: newStudentEmail,
        password: 'password123',
        confirmPassword: 'password123',
        role: 'student',
      }),
    });
    const regData = await regRes.json();
    assert(regData.success && regData.token, '2. Student Registration with password hashing & JWT token');

    const studentToken = regData.token;

    // 3. Student Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newStudentEmail,
        password: 'password123',
      }),
    });
    const loginData = await loginRes.json();
    assert(loginData.success && loginData.user.role === 'student', '3. Student Login & credentials validation');

    // 4. Update Profile
    const profileUpdateRes = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        college: 'Massachusetts Institute of Technology',
        degree: 'B.S.',
        branch: 'Computer Science and Engineering',
        graduationYear: 2026,
        bio: 'Passionate about verifiable systems and distributed ledgers.',
      }),
    });
    const profileUpdateData = await profileUpdateRes.json();
    assert(
      profileUpdateData.success && profileUpdateData.user.college === 'Massachusetts Institute of Technology',
      '4. Student Profile Update & Completeness Metric'
    );

    // 5. Add Skill
    const skillRes = await fetch(`${BASE_URL}/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        name: 'TypeScript & Next.js',
        category: 'Web Development',
        proficiency: 'Advanced',
      }),
    });
    const skillData = await skillRes.json();
    assert(skillData.success && skillData.skill.name === 'TypeScript & Next.js', '5. Add Skill CRUD');
    const skillId = skillData.skill._id;

    // 6. Add Certificate
    const certRes = await fetch(`${BASE_URL}/certificates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        title: 'Certified Kubernetes Application Developer (CKAD)',
        organization: 'Linux Foundation',
        issueDate: '2026-02-01',
        credentialId: 'CKAD-991204',
        credentialUrl: 'https://credly.com/org/linux-foundation',
        description: 'Design, build, and configure cloud-native applications for Kubernetes.',
      }),
    });
    const certData = await certRes.json();
    assert(certData.success && certData.certificate.verificationStatus === 'Not Submitted', '6. Add Certificate');
    const certId = certData.certificate._id;

    // 7. Add Project
    const projRes = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        title: 'DeFi Vault Protocol',
        description: 'Multi-sig algorithmic smart contract vault with timelocks.',
        technologies: 'Solidity, Hardhat, React, TypeScript',
        githubUrl: 'https://github.com/jordanlee/defi-vault',
        liveUrl: 'https://defi-vault-demo.app',
      }),
    });
    const projData = await projRes.json();
    assert(projData.success && projData.project.title === 'DeFi Vault Protocol', '7. Add Project');
    const projId = projData.project._id;

    // 8. Add Internship
    const internRes = await fetch(`${BASE_URL}/internships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        company: 'Cloudflare',
        role: 'Systems Engineering Intern',
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        description: 'Edge worker caching optimizations.',
      }),
    });
    const internData = await internRes.json();
    assert(internData.success && internData.internship.company === 'Cloudflare', '8. Add Internship');

    // 9. Add Achievement
    const achRes = await fetch(`${BASE_URL}/achievements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        title: 'National Collegiate Cyber Defense Champion',
        category: 'Coding Competitions',
        organization: 'CCDC',
        date: '2025-11-20',
        description: '1st place collegiate defense against real-world red team penetration.',
      }),
    });
    const achData = await achRes.json();
    assert(achData.success && achData.achievement.title.includes('Cyber Defense'), '9. Add Achievement');

    // 10. Submit Certificate for Verification
    const submitCertRes = await fetch(`${BASE_URL}/certificates/${certId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({}),
    });
    const submitCertData = await submitCertRes.json();
    assert(
      submitCertData.success && submitCertData.certificate.verificationStatus === 'Pending',
      '10. Submit Certificate for Verification'
    );

    // 11. Check Student's My Requests
    const myReqRes = await fetch(`${BASE_URL}/verification/my-requests`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const myReqData = await myReqRes.json();
    assert(
      myReqData.success && myReqData.requests.some((r) => r.itemId.toString() === certId.toString()),
      '11. View My Verification Requests'
    );

    // 12. Login as Verifier / Admin
    const verifierLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'verifier@skillproof.edu',
        password: 'admin123',
      }),
    });
    const verifierLoginData = await verifierLoginRes.json();
    assert(
      verifierLoginData.success && verifierLoginData.user.role === 'verifier',
      '12. Verifier / Admin Login'
    );
    const verifierToken = verifierLoginData.token;

    // 13. Verifier View Pending Queue
    const pendingRes = await fetch(`${BASE_URL}/verification/pending`, {
      headers: { Authorization: `Bearer ${verifierToken}` },
    });
    const pendingData = await pendingRes.json();
    const matchingReq = pendingData.requests.find((r) => r.itemId.toString() === certId.toString());
    assert(pendingData.success && matchingReq, '13. Verifier View Pending Queue');

    // 14. Verifier Approve Request
    const approveRes = await fetch(`${BASE_URL}/verification/${matchingReq._id}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${verifierToken}`,
      },
      body: JSON.stringify({
        remarks: 'Official certificate badge validated against CNCF registry.',
      }),
    });
    const approveData = await approveRes.json();
    assert(approveData.success && approveData.request.status === 'Verified', '14. Verifier Approve Request');

    // 15. Verify Updated Certificate Status on Student side
    const certCheckRes = await fetch(`${BASE_URL}/certificates/${certId}`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const certCheckData = await certCheckRes.json();
    assert(
      certCheckData.success && certCheckData.certificate.verificationStatus === 'Verified',
      '15. Certificate Status updated to Verified with Remarks'
    );

    // 16. Public Profile View by Username
    const publicProfileRes = await fetch(`${BASE_URL}/users/${loginData.user.username}`);
    const publicProfileData = await publicProfileRes.json();
    assert(
      publicProfileData.success &&
        publicProfileData.user.name === 'Jordan Lee' &&
        publicProfileData.verifiedOnly.certificates.some((c) => c._id.toString() === certId.toString()),
      '16. Public Profile Page with Verified Credentials'
    );

    // 17. Search Students Directory
    const searchRes = await fetch(`${BASE_URL}/search?q=Jordan`);
    const searchData = await searchRes.json();
    assert(
      searchData.success && searchData.profiles.some((p) => p.name === 'Jordan Lee'),
      '17. Search API querying students by name'
    );

    // 18. Search by Technology
    const searchTechRes = await fetch(`${BASE_URL}/search?technology=Solidity`);
    const searchTechData = await searchTechRes.json();
    assert(
      searchTechData.success && searchTechData.profiles.some((p) => p.name === 'Jordan Lee'),
      '18. Search API querying students by technology in projects'
    );

    // 19. Unauthorized Access Protection
    const unauthorizedRes = await fetch(`${BASE_URL}/verification/pending`, {
      headers: { Authorization: `Bearer ${studentToken}` }, // Student trying to access verifier endpoint
    });
    assert(unauthorizedRes.status === 403, '19. Role-based authorization blocks Student from Verifier routes (403)');

    // 20. Invalid Login Rejection
    const invalidLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alex@skillproof.edu',
        password: 'wrong_password_xyz',
      }),
    });
    const invalidLoginData = await invalidLoginRes.json();
    assert(!invalidLoginData.success && invalidLoginRes.status === 401, '20. Invalid Login returns 401 Unauthorized');

    console.log('\n====================================================');
    console.log(` 🎯 Tests Completed: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================');
  } catch (err) {
    console.error('Test Suite Fatal Error:', err);
  }
};

runTests();
