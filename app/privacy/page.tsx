export default function PrivacyPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4 text-sm text-gray-600">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="space-y-6">
        {/* Introduction */}
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            ROZX ("we", "our", "us") is a digital healthcare platform designed to
            help patients, hospitals, and doctors manage appointments,
            communication, and healthcare services securely.
          </p>
          <p className="mt-2">
            We are committed to protecting your privacy and handling your data
            responsibly and transparently.
          </p>
        </div>

        {/* Information We Collect */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Phone number and/or email address (for authentication)</li>
            <li>Name and basic profile details</li>
            <li>Hospital and doctor registration details</li>
            <li>Appointment and transaction information</li>
            <li>Device, IP address, and session metadata</li>
          </ul>
        </div>

        {/* OTP & Authentication */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            3. OTP & Authentication
          </h2>
          <p>
            We use One-Time Passwords (OTP) for secure login and account
            verification. OTPs may be delivered via:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>WhatsApp</li>
            <li>Email</li>
            <li>SMS (when enabled)</li>
          </ul>
          <p className="mt-2">
            OTPs are time-bound, securely stored, and automatically deleted
            after verification or expiry.
          </p>
        </div>

        {/* Notifications */}
        <div>
          <h2 className="text-xl font-semibold mb-2">4. Notifications</h2>
          <p>
            We may send transactional notifications such as:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>OTP messages</li>
            <li>Welcome messages</li>
            <li>Verification status updates</li>
            <li>Appointment confirmations</li>
            <li>Payment confirmations</li>
          </ul>
          <p className="mt-2">
            These messages are essential to platform functionality and cannot
            be opted out of.
          </p>
        </div>

        {/* Hospital & Doctor Verification */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            5. Hospital & Doctor Verification
          </h2>
          <p>
            Hospitals and doctors may be required to submit registration and
            verification details. These details are reviewed manually or
            systemically to ensure authenticity and compliance.
          </p>
          <p className="mt-2">
            If verification fails, appropriate communication will be sent
            explaining the reason and next steps.
          </p>
        </div>

        {/* Data Usage */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            6. How We Use Your Data
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To authenticate users securely</li>
            <li>To provide healthcare services</li>
            <li>To communicate important updates</li>
            <li>To prevent fraud and abuse</li>
            <li>To improve platform performance</li>
          </ul>
        </div>

        {/* Data Sharing */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            7. Data Sharing & Disclosure
          </h2>
          <p>
            We do <strong>not</strong> sell, rent, or trade your personal data.
          </p>
          <p className="mt-2">
            Data may be shared only with trusted service providers (such as
            messaging and infrastructure providers) strictly for operational
            purposes.
          </p>
        </div>

        {/* Data Security */}
        <div>
          <h2 className="text-xl font-semibold mb-2">8. Data Security</h2>
          <p>
            We use industry-standard security practices including encryption,
            access control, and secure storage to protect your information.
          </p>
        </div>

        {/* Data Retention */}
        <div>
          <h2 className="text-xl font-semibold mb-2">9. Data Retention</h2>
          <p>
            We retain personal data only for as long as necessary to fulfill
            legal, operational, and regulatory requirements.
          </p>
        </div>

        {/* User Rights */}
        <div>
          <h2 className="text-xl font-semibold mb-2">10. Your Rights</h2>
          <p>
            You may request access, correction, or deletion of your personal
            data, subject to legal and operational constraints.
          </p>
        </div>

        {/* Policy Updates */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            11. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be reflected on this page.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data
            practices, please contact us at:
          </p>
          <p className="mt-2 font-medium">
            Email: support@rozx.in
          </p>
        </div>
      </section>
    </main>
  );
}
