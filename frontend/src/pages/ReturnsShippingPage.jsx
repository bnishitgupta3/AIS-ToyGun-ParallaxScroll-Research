import { Link } from "react-router-dom";
import LegalLayout, { Section } from "@/components/legal/LegalLayout";

export default function ReturnsShippingPage() {
    return (
        <LegalLayout title="Returns & Shipping Policy" updated="5 October 2026">
            <p>
                This policy explains how we ship orders and handle returns,
                replacements and cancellations. The Up Your Play brand and website
                are operated by Sri Stita Machinery Pvt Ltd. We follow the Consumer
                Protection (E-Commerce) Rules, 2020 and the Consumer Protection Act,
                2019.
            </p>

            <Section heading="1. Shipping & delivery">
                <p>
                    We ship across India through reputed courier partners. Orders are
                    typically dispatched within 1 to 3 business days and delivered
                    within 3 to 8 business days depending on your location. Delivery
                    timelines are indicative; remote PIN codes may take longer.
                    Shipping charges, if any, are shown at checkout.
                </p>
            </Section>

            <Section heading="2. Order tracking">
                <p>
                    Once dispatched, you will receive a tracking link by email, SMS or
                    WhatsApp. For any delivery concern, contact us with your order ID.
                </p>
            </Section>

            <Section heading="3. Replacements, not refunds">
                <p>
                    We want you to love your blaster, so we offer replacements rather
                    than cash refunds. If something arrives damaged, defective, or not
                    as described, we will replace it. We do not provide cash refunds.
                </p>
            </Section>

            <Section heading="4. Replacement window & conditions">
                <p>
                    You may request a replacement within 6 days of delivery for items
                    that are damaged, defective, or not as described. The product must
                    be unused and returned in its original packaging with all
                    accessories. For hygiene and safety, used gel beads and refills are
                    not eligible unless they were defective on arrival.
                </p>
                <p>
                    The fastest way to start is our self-serve{" "}
                    <Link to="/replace">replacement page</Link>: look up your order,
                    pick the item and reason, and we arrange a free pickup and ship
                    your replacement with fresh tracking, at no extra cost. You can
                    also email hello@upyourplay.in with your order ID and clear
                    photos or a video of the issue (an unboxing video helps us process
                    it faster).
                </p>
            </Section>

            <Section heading="5. If a replacement is unavailable">
                <p>
                    If the same item is out of stock, we will offer a replacement with
                    a product of equal value, or issue store credit (a gift card or
                    coupon code you redeem at checkout) of the same amount, valid for
                    12 months from the date of issue.
                </p>
            </Section>

            <Section heading="6. Cancellations">
                <p>
                    You may cancel an order before it is dispatched. As we do not
                    process cash refunds, the value of a prepaid order will be issued
                    as store credit (a gift card or coupon code you redeem at
                    checkout). Once an order has shipped it cannot be cancelled,
                    but the replacement process above still applies.
                </p>
            </Section>

            <Section heading="7. Items not eligible for replacement">
                <p>
                    Replacements do not apply to items damaged through misuse, normal
                    wear, or water damage from improper use, products returned without
                    their original packaging and accessories, or used consumables such
                    as gel beads, unless the item was defective on arrival.
                </p>
            </Section>

            <Section heading="8. Damaged or wrong items on arrival">
                <p>
                    If you receive a damaged or incorrect product, report it within 6
                    days of delivery with supporting photos so we can arrange a free
                    replacement. Reporting transit damage sooner helps us resolve it
                    faster.
                </p>
            </Section>

            <Section heading="9. Contact & grievance">
                <p>
                    Support and grievances: hello@upyourplay.in. You may also reach
                    the National Consumer Helpline at 1915.
                </p>
            </Section>

            <p className="text-[13px] text-[#1a1a1a]/45">
                This document is a template provided for compliance scaffolding and
                should be reviewed by qualified legal counsel before publication.
            </p>
        </LegalLayout>
    );
}
