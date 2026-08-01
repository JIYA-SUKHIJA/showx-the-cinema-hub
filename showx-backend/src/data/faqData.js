// src/data/faqData.js

// Shared FAQ knowledge base — checked before every Gemini call.
// Keep questions/keywords broad so common phrasings match.
export const FAQ_DATABASE = [
  {
    keywords: ["refund", "cancel", "cancellation", "money back"],
    question: "How do I claim a refund on canceled tickets?",
    answer: "Cancellations made up to 2 hours before showtime are eligible for a full refund back to your original payment mode.",
  },
  {
    keywords: ["streaming", "rented", "digital stream", "streaming library"],
    question: "Where can I view my rented digital streams?",
    answer: "Once your purchase goes through, click your user profile picture at the top right and click 'Streaming Library'.",
  },
  {
    keywords: ["ticket price", "cost of ticket", "how much", "price of movie"],
    question: "How much do movie tickets cost?",
    answer: "Ticket prices vary by theatre, format (2D/3D/IMAX), and showtime. You can see the exact price for each show on the seat selection screen before booking.",
  },
  {
    keywords: ["seat type", "seat category", "recliner", "premium seat"],
    question: "What seat types are available?",
    answer: "Available seat types depend on the theatre and screen — options may include Standard, Premium, and Recliner seating, shown during seat selection.",
  },
  {
    keywords: ["payment method", "how to pay", "pay online", "razorpay"],
    question: "What payment methods are supported?",
    answer: "ShowX CinemaHub supports secure online payments via Razorpay, including cards, UPI, and net banking.",
  },
  {
    keywords: ["download ticket", "e-ticket", "ticket pdf", "booking history"],
    question: "How do I download my ticket?",
    answer: "Go to your Profile → Booking History, open any confirmed booking, and click 'Download PDF' to get your e-ticket.",
  },
];

// Simple keyword-overlap matcher — good enough for a small, curated FAQ set.
export function matchFAQ(message) {
  const lower = message.toLowerCase();
  for (const entry of FAQ_DATABASE) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry;
    }
  }
  return null;
}