import { Link } from "react-router-dom";
import LegalLayout, { Section } from "@/components/legal/LegalLayout";

export default function ContactPage() {
    return (
        <LegalLayout eyebrow="/// Support" title="Contact Us">
            <p>
                Questions about a product, an order or a partnership? We would love
                to hear from you. Pick the right channel below and our team will get
                back to you as quickly as we can.
            </p>

            <Section heading="Customer support">
                <p>
                    For orders, shipping, returns and product help, email{" "}
                    <a href="mailto:support@soniqtoys.in" className="text-[#f97316] underline-offset-2 hover:underline">
                        support@soniqtoys.in
                    </a>
                    . Please include your order ID where relevant so we can help
                    faster. We aim to respond within one business day.
                </p>
            </Section>

            <Section heading="Grievance officer">
                <p>
                    In accordance with the Consumer Protection (E-Commerce) Rules,
                    2020 and the Information Technology Act, 2000, complaints can be
                    addressed to our Grievance Officer at{" "}
                    <a href="mailto:grievance@soniqtoys.in" className="text-[#f97316] underline-offset-2 hover:underline">
                        grievance@soniqtoys.in
                    </a>
                    . We acknowledge complaints within 24 hours and work to resolve
                    them within the timelines prescribed by law.
                </p>
            </Section>

            <Section heading="Consumer helpline">
                <p>
                    You may also reach the Government of India National Consumer
                    Helpline at <span className="font-medium text-[#1a1a1a]">1915</span>.
                </p>
            </Section>

            <Section heading="Business &amp; partnerships">
                <p>
                    For wholesale, dealership, media or collaboration enquiries,
                    write to{" "}
                    <a href="mailto:hello@soniqtoys.in" className="text-[#f97316] underline-offset-2 hover:underline">
                        hello@soniqtoys.in
                    </a>
                    .
                </p>
            </Section>

            <Section heading="Common questions">
                <p>
                    Many answers are already on our{" "}
                    <Link to="/faq" className="text-[#f97316] underline-offset-2 hover:underline">
                        FAQ
                    </Link>{" "}
                    and{" "}
                    <Link to="/returns" className="text-[#f97316] underline-offset-2 hover:underline">
                        Returns &amp; Shipping
                    </Link>{" "}
                    pages, it is often the fastest way to get what you need.
                </p>
            </Section>
        </LegalLayout>
    );
}
