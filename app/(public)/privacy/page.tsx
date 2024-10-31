import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p>
          At FitLife, we are committed to protecting your privacy and ensuring
          you have a positive experience on our website and in using our apps
          and services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          2. Information Collected
        </h2>
        <p>
          We collect information that you provide directly to us, such as when
          you create or modify your account, request services, contact customer
          support, or otherwise communicate with us.
        </p>
      </section>

      {/* Add more sections as outlined in the previous response */}

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:{" "}
          <Link
            href="mailto:privacy@fitlife.com"
            className="text-blue-600 hover:underline"
          >
            privacy@fitlife.com
          </Link>
        </p>
      </section>
    </div>
  );
}
