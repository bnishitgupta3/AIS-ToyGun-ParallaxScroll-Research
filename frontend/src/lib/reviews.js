/* ── Product reviews (in-repo) ──
   REAL reviews only — no fabricated content. Populate each product's array with
   genuine early-tester / customer reviews. The Arsenal cards show the star
   average + count, and the product page lists the reviews. When Judge.me is
   connected, point getReviews/getReviewSummary at its API — the UI stays the same.

   NOTE: `verified: true` is reserved for CONFIRMED purchases (a real order).
   These early reviews predate live sales, so they intentionally omit it; Judge.me
   stamps the verified badge automatically for real buyers once checkout is live.

   Entry shape:
     { name, rating (1–5), title?, body, date?, location?, verified? }
*/
export const REVIEWS = {
    "/product/mp5k": [
        { name: "Aarav S.", rating: 5, body: "Great range, no pumping, and super easy to use. Makes water fights way more exciting." },
        { name: "Rohan M.", rating: 5, body: "The compact size is what I like most. Easy to carry around and doesn't feel bulky." },
        { name: "Aditya K.", rating: 4, body: "Looks cool and shoots water quickly. I just wish the tank could hold a little more water." },
        { name: "Karthik R.", rating: 5, body: "Picked this up for some outdoor fun and really liked the automatic firing. No more tiring hand pumps!" },
        { name: "Vihaan P.", rating: 5, body: "The design is pretty impressive in person. The trigger is responsive, and it's straightforward to operate." },
        { name: "Arjun T.", rating: 4, body: "A nice change from ordinary water guns. Refilling takes a bit of practice, but the overall experience is good." },
    ],
    "/product/m416": [
        { name: "Kabir S.", rating: 5, body: "This thing looks fantastic! The rifle-style design really stands out, and it's a blast to use." },
        { name: "Dhruv M.", rating: 4, body: "Good fun for a summer afternoon. It's a little bigger than I expected, but the design is great." },
        { name: "Sai R.", rating: 5, body: "What a difference compared to regular water guns. Just pull the trigger and enjoy without constantly pumping." },
        { name: "Atharv K.", rating: 5, body: "Used it during a water fight with friends, and everyone wanted a turn. Definitely a fun product." },
        { name: "Harsh T.", rating: 4, body: "Nice overall build and an interesting design. I'd prefer a larger water tank for longer play sessions." },
    ],
    "/product/crimson": [],
};

export function getReviews(link) {
    return REVIEWS[link] || [];
}

export function getReviewSummary(link) {
    const list = getReviews(link);
    const count = list.length;
    const avg = count ? list.reduce((s, r) => s + (Number(r.rating) || 0), 0) / count : 0;
    return { count, avg: Math.round(avg * 10) / 10 };
}
