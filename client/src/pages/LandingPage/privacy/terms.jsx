import React, { useState, useEffect } from 'react';
import style from '@styles/privacy.module.scss';

const Terms = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={style.termContainer}>
      {/* Header */}
      <div className={style.termsHeader}>
        <h1>Terms of Service</h1>
        <p className={style.effectiveDate}>Effective Date: November 1, 2025</p>
        <p className={style.intro}>
          Welcome to SK Catarman Hub. These Terms of Service govern your use of our platform and services. 
          Please read them carefully before using our services.
        </p>
      </div>

      {/* Acceptance Box */}
      <div className={style.acceptanceBox}>
        <p>By accessing or using SK Catarman Hub, you agree to be bound by these Terms of Service.</p>
      </div>

      {/* Table of Contents */}
      <div className={style.termsToc}>
        <h2>Table of Contents</h2>
        <ol>
          <li><a href="#acceptance" onClick={(e) => { e.preventDefault(); scrollToSection('acceptance'); }}>Acceptance of Terms</a></li>
          <li><a href="#eligibility" onClick={(e) => { e.preventDefault(); scrollToSection('eligibility'); }}>Eligibility</a></li>
          <li><a href="#account" onClick={(e) => { e.preventDefault(); scrollToSection('account'); }}>Account Registration</a></li>
          <li><a href="#user-conduct" onClick={(e) => { e.preventDefault(); scrollToSection('user-conduct'); }}>User Conduct</a></li>
          <li><a href="#content" onClick={(e) => { e.preventDefault(); scrollToSection('content'); }}>User Content</a></li>
          <li><a href="#intellectual-property" onClick={(e) => { e.preventDefault(); scrollToSection('intellectual-property'); }}>Intellectual Property</a></li>
          <li><a href="#prohibited" onClick={(e) => { e.preventDefault(); scrollToSection('prohibited'); }}>Prohibited Activities</a></li>
          <li><a href="#termination" onClick={(e) => { e.preventDefault(); scrollToSection('termination'); }}>Termination</a></li>
          <li><a href="#disclaimer" onClick={(e) => { e.preventDefault(); scrollToSection('disclaimer'); }}>Disclaimer of Warranties</a></li>
          <li><a href="#limitation" onClick={(e) => { e.preventDefault(); scrollToSection('limitation'); }}>Limitation of Liability</a></li>
          <li><a href="#indemnification" onClick={(e) => { e.preventDefault(); scrollToSection('indemnification'); }}>Indemnification</a></li>
          <li><a href="#governing-law" onClick={(e) => { e.preventDefault(); scrollToSection('governing-law'); }}>Governing Law</a></li>
          <li><a href="#changes" onClick={(e) => { e.preventDefault(); scrollToSection('changes'); }}>Changes to Terms</a></li>
          <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact Information</a></li>
        </ol>
      </div>

      {/* Acceptance of Terms */}
      <div id="acceptance" className={style.termsSection}>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing, browsing, or using SK Catarman Hub ("the Platform"), you acknowledge that you have read, 
          understood, and agree to be bound by these Terms of Service and our Privacy Policy.
        </p>
        <p>
          If you do not agree to these terms, you must not access or use our Platform. These terms apply to all 
          visitors, users, and others who access or use the service.
        </p>
      </div>

      {/* Eligibility */}
      <div id="eligibility" className={style.termsSection}>
        <h2>2. Eligibility</h2>
        <p>To use SK Catarman Hub, you must:</p>
        <ul>
          <li>Be at least 13 years of age</li>
          <li>Have the legal capacity to enter into binding contracts</li>
          <li>Not be prohibited from receiving our services under applicable laws</li>
          <li>Provide accurate and complete registration information</li>
        </ul>
        <div className={style.warningBox}>
          <p>
            <strong>Important:</strong> If you are under 18, you must have permission from a parent or legal guardian to use our services.
          </p>
        </div>
      </div>

      {/* Account Registration */}
      <div id="account" className={style.termsSection}>
        <h2>3. Account Registration</h2>
        <p>When you create an account with us, you must:</p>
        <ul>
          <li>Provide accurate, current, and complete information</li>
          <li>Maintain and promptly update your account information</li>
          <li>Maintain the security of your password</li>
          <li>Accept responsibility for all activities that occur under your account</li>
          <li>Notify us immediately of any unauthorized use of your account</li>
        </ul>
        
        <div className={style.infoBox}>
          <p>
            <strong>Note:</strong> You are responsible for safeguarding your password and for any activities or actions under your password.
          </p>
        </div>

        <h3>Account Termination</h3>
        <p>
          We reserve the right to suspend or terminate your account and refuse any and all current or future use 
          of the Platform for any reason at any time.
        </p>
      </div>

      {/* User Conduct */}
      <div id="user-conduct" className={style.termsSection}>
        <h2>4. User Conduct</h2>
        <p>As a user of SK Catarman Hub, you agree to:</p>
        <ul>
          <li>Use the Platform only for lawful purposes</li>
          <li>Respect the rights and dignity of other users</li>
          <li>Not engage in harassment, bullying, or hate speech</li>
          <li>Not impersonate any person or entity</li>
          <li>Not interfere with or disrupt the Platform's functionality</li>
          <li>Comply with all applicable local, national, and international laws and regulations</li>
        </ul>
      </div>

      {/* User Content */}
      <div id="content" className={style.termsSection}>
        <h2>5. User Content</h2>
        <p>
          "User Content" means any and all information and content that a user submits to or uses with the Platform.
        </p>
        
        <h3>Your Responsibilities</h3>
        <p>You are solely responsible for your User Content and the consequences of posting it.</p>
        <ul>
          <li>You retain ownership of your User Content</li>
          <li>You grant us a license to use, modify, and display your content on the Platform</li>
          <li>You ensure your content does not violate any third-party rights</li>
          <li>You have the right to submit the content and grant the licenses herein</li>
        </ul>

        <div className={style.warningBox}>
          <p>
            <strong>Warning:</strong> Do not post confidential or sensitive information. We are not responsible for any disclosure of such information.
          </p>
        </div>
      </div>

      {/* Intellectual Property */}
      <div id="intellectual-property" className={style.termsSection}>
        <h2>6. Intellectual Property</h2>
        <p>
          The Platform and its original content, features, and functionality are owned by SK Catarman Hub and 
          are protected by international copyright, trademark, patent, trade secret, and other intellectual 
          property laws.
        </p>
        
        <h3>Our Rights</h3>
        <ul>
          <li>SK Catarman Hub name and logo are our trademarks</li>
          <li>Platform design, graphics, and source code are our property</li>
          <li>You may not copy, modify, or create derivative works without permission</li>
          <li>You may not reverse engineer or attempt to extract source code</li>
        </ul>

        <h3>Your Rights</h3>
        <ul>
          <li>You retain ownership of your User Content</li>
          <li>You grant us a license to use your content to operate the Platform</li>
          <li>You can delete your content at any time</li>
        </ul>
      </div>

      {/* Prohibited Activities */}
      <div id="prohibited" className={style.termsSection}>
        <h2>7. Prohibited Activities</h2>
        <p>You may not access or use the Platform for any purpose other than that for which we make it available.</p>
        
        <p><strong>Prohibited activities include, but are not limited to:</strong></p>
        <ul>
          <li>Violating any applicable laws or regulations</li>
          <li>Harassing, abusing, or harming another person</li>
          <li>Uploading or transmitting viruses or malicious code</li>
          <li>Collecting or tracking personal information of others</li>
          <li>Interfering with security-related features</li>
          <li>Engaging in unauthorized framing or linking</li>
          <li>Attempting to bypass any measures to restrict access</li>
          <li>Engaging in any automated use of the system</li>
        </ul>
      </div>

      {/* Termination */}
      <div id="termination" className={style.termsSection}>
        <h2>8. Termination</h2>
        <p>We may terminate or suspend your account and bar access to the Platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
        
        <p>If you wish to terminate your account, you may simply discontinue using the Platform or delete your account through the provided means.</p>
        
        <h3>Effects of Termination</h3>
        <ul>
          <li>All provisions of the Terms which by their nature should survive termination shall survive</li>
          <li>Your right to use the Platform will immediately cease</li>
          <li>We may retain your information as required by law</li>
        </ul>
      </div>

      {/* Disclaimer of Warranties */}
      <div id="disclaimer" className={style.termsSection}>
        <h2>9. Disclaimer of Warranties</h2>
        <p>YOUR USE OF THE PLATFORM IS AT YOUR SOLE RISK. THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS.</p>
        
        <p>SK CATARMAN HUB EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.</p>
        
        <ul>
          <li>We make no warranty that the Platform will meet your requirements</li>
          <li>We do not guarantee uninterrupted, timely, secure, or error-free service</li>
          <li>We are not responsible for any harm to your computer system</li>
          <li>We do not warrant the accuracy or completeness of any content</li>
        </ul>
      </div>

      {/* Limitation of Liability */}
      <div id="limitation" className={style.termsSection}>
        <h2>10. Limitation of Liability</h2>
        <p>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SK CATARMAN HUB, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:</p>
        
        <ul>
          <li>Your access to or use of or inability to access or use the Platform</li>
          <li>Any conduct or content of any third party on the Platform</li>
          <li>Any content obtained from the Platform</li>
          <li>Unauthorized access, use or alteration of your transmissions or content</li>
        </ul>
      </div>

      {/* Indemnification */}
      <div id="indemnification" className={style.termsSection}>
        <h2>11. Indemnification</h2>
        <p>You agree to defend, indemnify and hold harmless SK Catarman Hub and its licensees and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of:</p>
        
        <ul>
          <li>Your use and access of the Platform</li>
          <li>A breach of these Terms</li>
          <li>Your violation of any third-party right</li>
          <li>Any claim that your content caused damage to a third party</li>
        </ul>
      </div>

      {/* Governing Law */}
      <div id="governing-law" className={style.termsSection}>
        <h2>12. Governing Law</h2>
        <p>These Terms shall be governed and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions.</p>
        
        <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.</p>
      </div>

      {/* Changes to Terms */}
      <div id="changes" className={style.termsSection}>
        <h2>13. Changes to Terms</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect.</p>
        
        <p>What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Platform after those revisions become effective, you agree to be bound by the revised terms.</p>
      </div>

      {/* Contact Information */}
      <div id="contact" className={style.contactSection}>
        <h2>14. Contact Information</h2>
        <p>If you have any questions about these Terms of Service, please contact us:</p>
        <p className={style.contactEmail}>Email: leester@gmail.com</p>
        <p>Address: Catarman, Cordova, Cebu, Philippines</p>
        <p>Phone: +63 (906)2420480</p>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button className={style.backToTop} onClick={scrollToTop} aria-label="Back to top">
          ↑
        </button>
      )}
    </section>
  );
};

export default Terms;