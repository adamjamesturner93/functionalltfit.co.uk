import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 pb-8 pt-24">
      <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Last updated: 29 December 2024</h2>
        <p>
          Welcome to Functionally Fit, a product of The Chronic Yogini Ltd (&quote;we&quote;,
          &quote;us&quote;, or &quote;our&quote;). By using our website or associated services, you
          agree to these Terms of Service. If you do not agree, you may not use the website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Age Restriction</h2>
        <p>
          The website is only available to individuals aged 18 and over. If you are under 18, you
          must have parental or guardian consent to use the website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">End-User Licence Agreement (EULA)</h2>
        <p>
          You are granted a non-exclusive, non-transferable licence to use the website for personal
          purposes. You may not copy, modify, distribute, or reverse-engineer the website. The
          website remains the intellectual property of The Chronic Yogini Ltd.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Subscriptions and Payments</h2>
        <p>
          Functionally Fit offers subscription plans and one-off purchases. Subscriptions renew
          automatically until cancelled. For details, refer to the Purchase, Subscription, and
          Refund Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Nutrition Disclaimer</h2>
        <p>
          The website may provide high-level nutrition advice based on user input (e.g., weight,
          activity level). This advice is general and not tailored to specific medical or dietary
          needs. Always consult a qualified healthcare provider before making significant dietary
          changes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Programme Disclaimer</h2>
        <p>
          Pre-made and personalised programmes offered through the website are based on general
          fitness principles and user-provided data. They do not account for specific medical
          conditions or physical limitations. Consult a medical professional before starting any
          programme.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Personalised Coaching</h2>
        <p>
          1:1 coaching is based on the accuracy of the information you provide. The Chronic Yogini
          Ltd is not liable for inaccuracies in results caused by incorrect or incomplete data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by UK law, The Chronic Yogini Ltd will not be liable for
          indirect or consequential damages arising from the use of the website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Jurisdiction</h2>
        <p>
          These Terms of Service are governed by the laws of England and Wales. Any disputes arising
          from or related to these terms, the website, or associated services will be resolved
          exclusively in the courts of England and Wales.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Contact</h2>
        <p>
          For legal queries, contact us at:{' '}
          <Link
            href="mailto:legal@thechronicyogini.co.uk"
            className="text-blue-600 hover:underline"
          >
            legal@thechronicyogini.co.uk
          </Link>
          . For support, email:{' '}
          <Link href="mailto:tech@thechronicyogini.co.uk" className="text-blue-600 hover:underline">
            tech@thechronicyogini.co.uk
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
