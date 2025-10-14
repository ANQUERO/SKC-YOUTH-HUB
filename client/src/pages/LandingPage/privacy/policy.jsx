import React, { useState, useEffect } from 'react';
import style from '@styles/privacy.module.scss';

const Policy = () => {
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
    <section className={style.policyContainer}>
      {/* Header */}
      <div className={style.header}>
        <h1>Privacy Policy</h1>
        <p className={style.lastUpdated}>Last Updated: December 1, 2024</p>
        <p>Welcome to SK Catarman Hub. We are committed to protecting your privacy and ensuring the security of your personal information.</p>
      </div>

      {/* Table of Contents */}
      <div className={style.toc}>
        <h2>Table of Contents</h2>
        <ul>
          <li><a href="#information-collection" onClick={(e) => { e.preventDefault(); scrollToSection('information-collection'); }}>1. Information We Collect</a></li>
          <li><a href="#how-we-use" onClick={(e) => { e.preventDefault(); scrollToSection('how-we-use'); }}>2. How We Use Your Information</a></li>
          <li><a href="#data-sharing" onClick={(e) => { e.preventDefault(); scrollToSection('data-sharing'); }}>3. Data Sharing and Disclosure</a></li>
          <li><a href="#data-security" onClick={(e) => { e.preventDefault(); scrollToSection('data-security'); }}>4. Data Security</a></li>
          <li><a href="#your-rights" onClick={(e) => { e.preventDefault(); scrollToSection('your-rights'); }}>5. Your Rights</a></li>
          <li><a href="#cookies" onClick={(e) => { e.preventDefault(); scrollToSection('cookies'); }}>6. Cookies and Tracking</a></li>
          <li><a href="#third-party" onClick={(e) => { e.preventDefault(); scrollToSection('third-party'); }}>7. Third-Party Services</a></li>
          <li><a href="#children-privacy" onClick={(e) => { e.preventDefault(); scrollToSection('children-privacy'); }}>8. Children's Privacy</a></li>
          <li><a href="#changes" onClick={(e) => { e.preventDefault(); scrollToSection('changes'); }}>9. Changes to This Policy</a></li>
          <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>10. Contact Us</a></li>
        </ul>
      </div>

      {/* Information Collection */}
      <div id="information-collection" className={style.section}>
        <h2>1. Information We Collect</h2>
        
        <h3>Personal Information</h3>
        <p>We may collect the following types of personal information:</p>
        <ul>
          <li>Contact information (name, email address, phone number)</li>
          <li>Demographic information (age, gender, location)</li>
          <li>Account credentials (username, password)</li>
          <li>Profile information and preferences</li>
          <li>Communication preferences</li>
        </ul>

        <h3>Automatically Collected Information</h3>
        <p>When you use our services, we automatically collect:</p>
        <ul>
          <li>IP address and device information</li>
          <li>Browser type and version</li>
          <li>Pages visited and time spent on pages</li>
          <li>Referring website addresses</li>
          <li>Operating system information</li>
        </ul>

        <div className={style.highlight}>
          <p><strong>Note:</strong> We only collect information that is necessary for providing our services and improving your experience.</p>
        </div>
      </div>

      {/* How We Use Information */}
      <div id="how-we-use" className={style.section}>
        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>
        
        <table className={style.dataTable}>
          <thead>
            <tr>
              <th>Purpose</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Service Provision</td>
              <td>To provide and maintain our services, process transactions, and manage your account</td>
            </tr>
            <tr>
              <td>Communication</td>
              <td>To send important updates, respond to inquiries, and provide customer support</td>
            </tr>
            <tr>
              <td>Improvement</td>
              <td>To analyze usage patterns and improve our services and user experience</td>
            </tr>
            <tr>
              <td>Security</td>
              <td>To protect against fraud, unauthorized access, and ensure platform security</td>
            </tr>
            <tr>
              <td>Legal Compliance</td>
              <td>To comply with legal obligations and enforce our terms of service</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Data Sharing */}
      <div id="data-sharing" className={style.section}>
        <h2>3. Data Sharing and Disclosure</h2>
        <p>We do not sell your personal information to third parties. We may share your information in the following circumstances:</p>
        
        <h3>Service Providers</h3>
        <p>We may share information with trusted third-party service providers who assist us in operating our platform, conducting our business, or servicing you.</p>

        <h3>Legal Requirements</h3>
        <p>We may disclose your information when required by law or to protect our rights, property, or safety, or that of our users or others.</p>

        <h3>Business Transfers</h3>
        <p>In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</p>
      </div>

      {/* Data Security */}
      <div id="data-security" className={style.section}>
        <h2>4. Data Security</h2>
        <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <ul>
          <li>Encryption of sensitive data in transit and at rest</li>
          <li>Regular security assessments and updates</li>
          <li>Access controls and authentication mechanisms</li>
          <li>Secure data storage and backup procedures</li>
        </ul>
      </div>

      {/* Your Rights */}
      <div id="your-rights" className={style.section}>
        <h2>5. Your Rights</h2>
        <p>You have the following rights regarding your personal information:</p>
        
        <ul>
          <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
          <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information</li>
          <li><strong>Objection:</strong> Object to processing of your personal information</li>
          <li><strong>Portability:</strong> Request transfer of your data to another service</li>
          <li><strong>Withdrawal:</strong> Withdraw consent where we rely on consent for processing</li>
        </ul>

        <p>To exercise any of these rights, please contact us using the information provided in the "Contact Us" section.</p>
      </div>

      {/* Cookies */}
      <div id="cookies" className={style.section}>
        <h2>6. Cookies and Tracking Technologies</h2>
        <p>We use cookies and similar tracking technologies to track activity on our service and hold certain information.</p>
        
        <h3>Types of Cookies We Use</h3>
        <ul>
          <li><strong>Essential Cookies:</strong> Required for the basic functionality of the website</li>
          <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
          <li><strong>Functionality Cookies:</strong> Enable enhanced functionality and personalization</li>
          <li><strong>Analytics Cookies:</strong> Help us improve our services by collecting usage data</li>
        </ul>

        <p>You can control cookie preferences through your browser settings. However, disabling cookies may affect the functionality of our services.</p>
      </div>

      {/* Third-Party Services */}
      <div id="third-party" className={style.section}>
        <h2>7. Third-Party Services</h2>
        <p>Our service may contain links to third-party websites or services that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
        
        <div className={style.highlight}>
          <p><strong>Important:</strong> We encourage you to review the privacy policies of any third-party sites or services before providing them with your personal information.</p>
        </div>
      </div>

      {/* Children's Privacy */}
      <div id="children-privacy" className={style.section}>
        <h2>8. Children's Privacy</h2>
        <p>Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13.</p>
        
        <p>If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately. We will take steps to remove that information from our servers.</p>
      </div>

      {/* Changes to Policy */}
      <div id="changes" className={style.section}>
        <h2>9. Changes to This Privacy Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
        
        <p>We encourage you to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
      </div>

      {/* Contact Information */}
      <div id="contact" className={style.contactInfo}>
        <h2>10. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <p className={style.email}>Email: privacy@skcatarmanhub.com</p>
        <p>Address: SK Catarman Hub, Catarman, Northern Samar, Philippines</p>
        <p>Phone: +63 (XXX) XXX-XXXX</p>
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

export default Policy;