import LegalLayout, { Section } from "@/components/legal/LegalLayout";

export default function TermsPage() {
    return (
        <LegalLayout eyebrow="/// Legal" title="Terms & Conditions" updated="16 June 2026">
            <p>
                These Terms & Conditions govern your access to and use of the SONIQ
                Toys website and the purchase of our products. They are
                governed by the Indian Contract Act, 1872, the Consumer Protection
                Act, 2019, the Consumer Protection (E-Commerce) Rules, 2020, and
                the Information Technology Act, 2000. By using this website or
                placing an order, you agree to these Terms.
            </p>

            <Section heading="1. Eligibility">
                <p>
                    You must be at least 18 years of age (or accessing under the
                    supervision of a parent or guardian) and capable of entering a
                    legally binding contract under Indian law to purchase from us.
                </p>
            </Section>

            <Section heading="2. Products & safety">
                <p>
                    Our products are recreational water guns and gel blasters
                    intended for fun, outdoor play under appropriate supervision.
                    You agree to use them responsibly, lawfully, and in line with
                    the safety instructions provided. Gel-bead products must be kept
                    away from young children and never aimed at the face or eyes.
                </p>
            </Section>

            <Section heading="3. Pricing & payment">
                <p>
                    All prices are listed in Indian Rupees (INR) and are inclusive of
                    applicable GST unless stated otherwise. We reserve the right to
                    correct pricing errors. Orders are confirmed only after
                    successful payment through our authorised payment gateways.
                </p>
            </Section>

            <Section heading="4. Orders & acceptance">
                <p>
                    Your order is an offer to purchase. We reserve the right to
                    accept or decline any order, including for reasons of stock
                    availability, suspected fraud, or pricing errors. A contract is
                    formed only upon our confirmation of dispatch.
                </p>
            </Section>

            <Section heading="5. Intellectual property">
                <p>
                    All content on this website, including the brand name, logos,
                    designs, 3D models, text and imagery, is the property of SONIQ
                    Toys and protected under applicable Indian IP laws. You may
                    not reproduce or use it without written permission.
                </p>
            </Section>

            <Section heading="6. Limitation of liability">
                <p>
                    To the maximum extent permitted by law, we are not liable for any
                    indirect or consequential loss arising from misuse of our
                    products. Nothing in these Terms limits your statutory rights as
                    a consumer under the Consumer Protection Act, 2019.
                </p>
            </Section>

            <Section heading="7. Governing law & jurisdiction">
                <p>
                    These Terms are governed by the laws of India. Subject to the
                    consumer's statutory rights, the courts at our registered place
                    of business shall have jurisdiction over any disputes.
                </p>
            </Section>

            <Section heading="8. Grievance redressal">
                <p>
                    For any complaint, contact our Grievance Officer at
                    grievance@soniqtoys.in. Consumers may also approach the
                    National Consumer Helpline (1915) or the relevant Consumer
                    Disputes Redressal Commission.
                </p>
            </Section>

            <p className="text-[13px] text-[#1a1a1a]/45">
                This document is a template provided for compliance scaffolding and
                should be reviewed by qualified legal counsel before publication.
            </p>
        </LegalLayout>
    );
}
