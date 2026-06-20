import { Link } from "react-router-dom";
import LegalLayout, { Section } from "@/components/legal/LegalLayout";

export default function FAQPage() {
    return (
        <LegalLayout eyebrow="/// Support" title="Frequently Asked Questions">
            <p>
                Everything you need to know about SONIQ blasters, orders and play.
                Still stuck? Reach us any time on the{" "}
                <Link to="/contact" className="text-[#f97316] underline-offset-2 hover:underline">
                    Contact
                </Link>{" "}
                page.
            </p>

            <Section heading="What are SONIQ blasters built for?">
                <p>
                    Year-round, all-weather play. Holi mornings, farmhouse pools,
                    rooftop ambushes, society lawns and backyard showdowns, our
                    blasters are engineered for every season and every celebration,
                    not just summer.
                </p>
            </Section>

            <Section heading="Are they safe for children?">
                <p>
                    Our products are recreational water toys meant for fun under
                    appropriate adult supervision. We recommend them for ages 14 and
                    up. For hygiene and safety, gel-bead products must be kept away
                    from young children and never aimed at the face or eyes.
                </p>
            </Section>

            <Section heading="Do you ship across India?">
                <p>
                    Yes. We ship pan-India through trusted courier partners. Shipping
                    timelines, charges and coverage are detailed on our{" "}
                    <Link to="/returns" className="text-[#f97316] underline-offset-2 hover:underline">
                        Returns &amp; Shipping
                    </Link>{" "}
                    page.
                </p>
            </Section>

            <Section heading="What payment methods do you accept?">
                <p>
                    All major UPI apps, debit and credit cards, net banking and
                    popular wallets, processed through RBI-compliant, PCI-DSS
                    certified payment gateways. Prices are in Indian Rupees (INR),
                    inclusive of applicable GST unless stated otherwise.
                </p>
            </Section>

            <Section heading="Can I return or replace a product?">
                <p>
                    Yes. We accept returns within 7 days of delivery for items that
                    are damaged, defective or not as described, in original,
                    unused condition. Used gel beads/refills are not returnable for
                    hygiene reasons unless defective. See{" "}
                    <Link to="/returns" className="text-[#f97316] underline-offset-2 hover:underline">
                        Returns &amp; Shipping
                    </Link>{" "}
                    for the full policy and how to raise a request.
                </p>
            </Section>

            <Section heading="My blaster arrived damaged or defective. What do I do?">
                <p>
                    Please report it within 48 hours of delivery by emailing{" "}
                    <a href="mailto:support@soniqtoys.in" className="text-[#f97316] underline-offset-2 hover:underline">
                        support@soniqtoys.in
                    </a>{" "}
                    with your order ID and photos or a short video of the issue.
                    We will arrange a replacement or refund at no extra cost.
                </p>
            </Section>

            <Section heading="Where can I buy gel-bead refills?">
                <p>
                    Refills for our gel blasters are sold on this store and restocked
                    regularly. Sign up for drop alerts in the footer to be notified
                    when limited runs and bundles go live.
                </p>
            </Section>

            <Section heading="How do I track my order?">
                <p>
                    Once your order ships, you will receive a tracking link by email
                    and SMS. For any help, contact{" "}
                    <a href="mailto:support@soniqtoys.in" className="text-[#f97316] underline-offset-2 hover:underline">
                        support@soniqtoys.in
                    </a>{" "}
                    with your order ID.
                </p>
            </Section>
        </LegalLayout>
    );
}
