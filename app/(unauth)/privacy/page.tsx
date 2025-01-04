import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 pb-8 pt-24">
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Last updated: 29 December 2024</h2>
        <p>
          This Privacy Policy explains how Functionally Fit, a product of The Chronic Yogini Ltd
          collects, uses, and protects your personal data when using the Functionally Fit website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Information We Collect</h2>
        <p>
          We collect data you provide, such as your name, email, fitness goals, and preferences. We
          also collect device data, such as your IP address, for analytics and security purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Sensitive Data Collection</h2>
        <p>
          The website collects certain sensitive health-related data, including weight and body
          measurements, solely for the purpose of providing personalised features and improving the
          user experience. Such data is collected with user consent and stored in compliance with UK
          GDPR. Users may request deletion of their health-related data by contacting
          legal@thechronicyogini.co.uk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Cookies</h2>
        <p>
          Cookies are used to enhance your experience, analyse website usage, and personalise
          content. You can manage cookie preferences in your browser settings.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Usage Metrics</h2>
        <p>
          We collect usage metrics, such as website interactions and video views, to analyse and
          improve the Service. These metrics are anonymised or aggregated wherever possible to
          protect user privacy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Jurisdiction</h2>
        <p>
          This Privacy Policy is governed by the laws of England and Wales. Any disputes regarding
          this policy will be resolved exclusively in the courts of England and Wales.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Your Rights</h2>
        <p>
          Under UK GDPR, you have the right to access, amend, or delete your data. To exercise your
          rights, email:{' '}
          <Link
            href="mailto:legal@thechronicyogini.co.uk"
            className="text-blue-600 hover:underline"
          >
            legal@thechronicyogini.co.uk
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
