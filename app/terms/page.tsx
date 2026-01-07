export default function TermsPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p className="mb-4 text-sm text-gray-600">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="space-y-6">
        {/* Acceptance */}
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ROZX (“Platform”, “Service”, “we”, “us”, “our”),
            you agree to be bound by these Terms & Conditions. If you do not
            agree, you must not use the platform.
          </p>
        </div>

        {/* Platform Overview */}
        <div>
          <h2 className="text-xl font-semibold mb-2">2. Platform Overview</h2>
          <p>
            ROZX is a digital healthcare platform that enables patients,
            hospitals, and doctors to manage appointments, communication,
            verification workflows, and related healthcare services.
          </p>
          <p className="mt-2">
            ROZX does not provide medical advice or treatment. Medical services
            are provided solely by registered healthcare professionals.
          </p>
        </div>

        {/* User Eligibility */}
        <div>
          <h2 className="text-xl font-semibold mb-2">3. User Eligibility</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You must be at least 18 years old to use ROZX.</li>
            <li>
              Hospitals and doctors must provide accurate and verifiable
              registration details.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your
              account.
            </li>
          </ul>
        </div>

        {/* Account & OTP */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            4. Account Registration & OTP Authentication
          </h2>
          <p>
            ROZX uses One-Time Passwords (OTP) for authentication and
            verification. OTPs may be sent via WhatsApp, email, or SMS depending
            on availability.
          </p>
          <p className="mt-2">
            You agree not to misuse OTP services or attempt unauthorized access
            to any account.
          </p>
        </div>

        {/* Verification */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            5. Verification & Approval
          </h2>
          <p>
            Hospitals and doctors may be subject to manual or automated
            verification processes. ROZX reserves the right to approve, reject,
            or request additional information.
          </p>
          <p className="mt-2">
            Verification decisions are final and based on compliance,
            authenticity, and platform policies.
          </p>
        </div>

        {/* User Responsibilities */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            6. User Responsibilities
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide accurate and complete information</li>
            <li>Use the platform for lawful purposes only</li>
            <li>Do not attempt to disrupt or misuse platform services</li>
            <li>Respect patient confidentiality and privacy</li>
          </ul>
        </div>

        {/* Payments */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            7. Payments & Transactions
          </h2>
          <p>
            Payments made through ROZX are processed via third-party payment
            providers. ROZX does not store sensitive payment information.
          </p>
          <p className="mt-2">
            Any disputes related to medical fees are between the patient and the
            healthcare provider unless otherwise stated.
          </p>
        </div>

        {/* Communication */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            8. Communication & Notifications
          </h2>
          <p>
            By using ROZX, you consent to receive transactional communications
            including OTPs, verification updates, appointment notifications,
            and service-related messages.
          </p>
        </div>

        {/* Suspension */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            9. Suspension & Termination
          </h2>
          <p>
            ROZX reserves the right to suspend or terminate accounts that
            violate these Terms, applicable laws, or platform policies.
          </p>
        </div>

        {/* Limitation of Liability */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            10. Limitation of Liability
          </h2>
          <p>
            ROZX shall not be liable for any indirect, incidental, or
            consequential damages arising from the use of the platform.
          </p>
          <p className="mt-2">
            ROZX is not responsible for the quality, outcome, or legality of
            medical services provided by healthcare professionals.
          </p>
        </div>

        {/* Privacy */}
        <div>
          <h2 className="text-xl font-semibold mb-2">11. Privacy</h2>
          <p>
            Your use of ROZX is also governed by our Privacy Policy, which
            explains how we collect and use your information.
          </p>
        </div>

        {/* Changes */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            12. Changes to Terms
          </h2>
          <p>
            ROZX may update these Terms & Conditions at any time. Continued use
            of the platform constitutes acceptance of the updated terms.
          </p>
        </div>

        {/* Governing Law */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            13. Governing Law
          </h2>
          <p>
            These Terms are governed by and construed in accordance with the
            laws of India.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-semibold mb-2">14. Contact Us</h2>
          <p>
            For any questions regarding these Terms & Conditions, please
            contact:
          </p>
          <p className="mt-2 font-medium">
            Email: support@rozx.in
          </p>
        </div>
      </section>
    </main>
  );
}
