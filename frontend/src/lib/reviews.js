/* ── Product reviews (in-repo) ──
   REAL reviews only — no fabricated content. Populate each product's array with
   genuine early-tester / customer reviews. The Arsenal cards show the star
   average + count, and the product page lists the reviews. When you switch to an
   automatic source (e.g. Judge.me), point getReviews/getReviewSummary at that
   API instead — the UI stays the same.

   Entry shape:
     {
       name: "Aarav S.",
       rating: 5,                 // 1–5
       title: "Soaks everything",
       body: "Great range, no pumping. Kids loved it on Holi.",
       date: "2026-10-20",        // YYYY-MM-DD
       location: "Hyderabad",     // optional
       verified: true,            // optional — real verified purchase
     }
*/
export const REVIEWS = {
    "/product/mp5k": [],
    "/product/m416": [],
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
