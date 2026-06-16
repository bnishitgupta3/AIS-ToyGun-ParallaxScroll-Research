import LegalLayout, { Section } from "@/components/legal/LegalLayout";

export default function ReturnsShippingPage() {
    return (
        <LegalLayout eyebrow="/// Legal" title="Returns & Shipping Policy" updated="16 June 2026">
            <p>
                This policy explains how we ship orders and handle returns, refunds
                and cancellations, in line with the Consumer Protection
                (E-Commerce) Rules, 2020 and the Consumer Protection Act, 2019.
            </p>

            <Section heading="1. Shipping & delivery">
                <p>
                    We ship across India through reputed courier partners. Orders are
                    typically dispatched within 1–3 business days and delivered
                    within 3–8 business days depending on your location. Delivery
                    timelines are indicative; remote PIN codes may take longer.
                    Shipping charges, if any, are shown at checkout.
                </p>
            </Section>

            <Section heading="2. Order tracking">
                <p>
                    Once dispatched, you will receive a tracking link via email/SMS.
                    For any delivery concern, contact us with your order ID.
                </p>
            </Section>

            <Section heading="3. Cancellations">
                <p>
                    You may cancel an order before it is dispatched for a full
                    refund. Once shipped, cancellation may not be possible, but you
                    may use the return process below.
                </p>
            </Section>

            <Section heading="4. Returns & replacements">
                <p>
                    We accept returns within 7 days of delivery for items that are
                    damaged, defective, or not as described. Products must be unused,
                    in original packaging with all accessories. For hygiene and
                    safety reasons, used gel beads/refills are not returnable unless
                    defective.
                </p>
                <p>
                    To initiate a return, email support@soniqtoys.in with your
                    order ID and photos/video of the issue. We will arrange a pickup
                    or guide you on the next steps.
                </p>
            </Section>

            <Section heading="5. Refunds">
                <p>
                    Approved refunds are processed to the original payment method
                    within 5–7 business days of the returned item being received and
                    inspected (or the cancellation being confirmed). Banks may take
                    additional time to reflect the amount.
                </p>
            </Section>

            <Section heading="6. Damaged or wrong items">
                <p>
                    If you receive a damaged or incorrect product, please report it
                    within 48 hours of delivery with supporting photos so we can
                    arrange a replacement or refund at no extra cost.
                </p>
            </Section>

            <Section heading="7. Contact & grievance">
                <p>
                    Support: support@soniqtoys.in · Grievance Officer:
                    grievance@soniqtoys.in. You may also reach the National
                    Consumer Helpline at 1915.
                </p>
            </Section>

            <p className="text-[13px] text-[#1a1a1a]/45">
                This document is a template provided for compliance scaffolding and
                should be reviewed by qualified legal counsel before publication.
            </p>
        </LegalLayout>
    );
}
