/* Shared launch/early-access signup submit.

   Every email-capture surface (product-page NotifyMe, cart drawer, Arsenal
   compact form, footer "Drop Alerts") posts through here to the SAME Formspree
   form the standalone coming-soon teaser uses, so all signups collect in one
   place. The `source` field distinguishes where each signup came from.

   ─── SWAP POINT ─────────────────────────────────────────────────────────────
   To move off Formspree (Mailchimp/Klaviyo/serverless), change ONLY this file;
   every caller keeps working. */

export const FORMSPREE_ENDPOINT = "https://formspree.io/f/mwvjgyor";

/* Post an arbitrary payload to Formspree. Used by every form on the site
   (email signups AND the contact message form). Throws on failure with a
   readable message. */
export async function postToFormspree(payload) {
    const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
            data && data.errors && data.errors[0] && data.errors[0].message;
        throw new Error(msg || "Something went wrong. Please try again.");
    }
    return true;
}

export async function postSignup({ email, source, product }) {
    return postToFormspree({ email, source, ...(product ? { product } : {}) });
}
