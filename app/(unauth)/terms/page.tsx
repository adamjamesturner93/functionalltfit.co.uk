import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. Introduction and Acceptance of Terms</h2>
        <p>
          By using FitLife, you agree to these terms. If you do not agree, please do not use our
          service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">2. Description of Service</h2>
        <p>
          FitLife is a fitness application that provides workout plans, health advice, and tracking
          tools.
        </p>
      </section>

      {/* Add more sections as outlined in the previous response */}

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">12. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at:{' '}
          <Link href="mailto:legal@fitlife.com" className="text-blue-600 hover:underline">
            legal@fitlife.com
          </Link>
        </p>
      </section>
    </div>
  );
}
