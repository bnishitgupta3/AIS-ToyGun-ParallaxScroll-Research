import LegalLayout, { Section } from "@/components/legal/LegalLayout";

export default function PrivacyPolicyPage() {
    return (
        <LegalLayout eyebrow="/// Legal" title="Privacy Policy" updated="16 June 2026">
            <p>
                This Privacy Policy describes how UTG Tactical ("we", "us", "our")
                collects, uses, stores, discloses and protects your personal data
                when you visit or purchase from our website. We are committed to
                handling your information in accordance with the Information
                Technology Act, 2000, the IT (Reasonable Security Practices and
                Procedures and Sensitive Personal Data or Information) Rules, 2011,
                and the Digital Personal Data Protection Act, 2023 (DPDP Act).
            </p>

            <Section heading="1. Information we collect">
                <p>
                    We may collect: (a) identity and contact data (name, email,
                    phone, billing and shipping address); (b) order and transaction
                    data; (c) technical data (IP address, device, browser, usage);
                    and (d) any information you voluntarily provide via forms or
                    support requests. We do not collect sensitive personal data
                    beyond what is necessary to process your order.
                </p>
            </Section>

            <Section heading="2. How we use your information">
                <p>
                    Your data is used to process and deliver orders, provide
                    customer support, send service and (with consent) marketing
                    communications, prevent fraud, comply with legal obligations,
                    and improve our products and website.
                </p>
            </Section>

            <Section heading="3. Consent and your rights">
                <p>
                    By using our website you consent to this Policy. Under the DPDP
                    Act you have the right to access, correct, update and erase your
                    personal data, to withdraw consent, and to grievance redressal.
                    You may exercise these rights by contacting our Grievance Officer
                    below.
                </p>
            </Section>

            <Section heading="4. Sharing and disclosure">
                <p>
                    We share data only with trusted service providers (payment
                    gateways, logistics/courier partners, analytics) strictly for
                    fulfilling your order, and where required by law. We never sell
                    your personal data.
                </p>
            </Section>

            <Section heading="5. Payment security">
                <p>
                    Payments are processed through RBI-compliant, PCI-DSS certified
                    payment gateways. We do not store your full card details on our
                    servers.
                </p>
            </Section>

            <Section heading="6. Cookies">
                <p>
                    We use cookies and similar technologies to keep the site
                    functional and to understand usage. You can control cookies
                    through your browser settings.
                </p>
            </Section>

            <Section heading="7. Data retention & security">
                <p>
                    We retain personal data only as long as necessary for the
                    purposes above or as required by law, and apply reasonable
                    security practices to protect it against unauthorised access,
                    alteration or disclosure.
                </p>
            </Section>

            <Section heading="8. Children">
                <p>
                    Our products are recreational water toys intended for use under
                    adult supervision. We do not knowingly collect data from
                    children without verifiable parental consent.
                </p>
            </Section>

            <Section heading="9. Grievance Officer">
                <p>
                    In accordance with the IT Act, 2000 and the DPDP Act, 2023, the
                    Grievance Officer can be reached at:
                </p>
                <p>
                    Grievance Officer, UTG Tactical<br />
                    Email: grievance@utgtactical.in<br />
                    We aim to acknowledge complaints within 24 hours and resolve
                    them within the timelines prescribed by law.
                </p>
            </Section>

            <p className="text-[13px] text-[#1a1a1a]/45">
                This document is a template provided for compliance scaffolding and
                should be reviewed by qualified legal counsel before publication.
            </p>
        </LegalLayout>
    );
}
