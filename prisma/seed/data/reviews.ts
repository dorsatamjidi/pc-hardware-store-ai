export const reviewerFirstNames = [
  "James", "Maria", "David", "Sara", "Michael", "Emma", "Daniel", "Olivia", "Chris", "Priya",
  "Ahmed", "Laura", "Kevin", "Nina", "Tom", "Grace", "Omar", "Julia", "Ryan", "Sofia",
  "Mark", "Hannah", "Jason", "Wei", "Carlos", "Ana", "Ben", "Zoe", "Ivan", "Lucy",
] as const;

export const reviewerLastInitials = [
  "K.", "M.", "R.", "T.", "S.", "L.", "B.", "D.", "P.", "N.", "G.", "H.", "V.", "C.", "W.",
] as const;

interface ReviewTemplate {
  minRating: number;
  maxRating: number;
  titles: string[];
  bodies: string[];
}

/** `{name}` is replaced with the product name when a review is generated. */
export const reviewTemplates: ReviewTemplate[] = [
  {
    minRating: 5,
    maxRating: 5,
    titles: ["Exceeded expectations", "Perfect, no complaints", "Exactly what I needed", "Couldn't be happier"],
    bodies: [
      "The {name} has been rock solid since day one. Installation was straightforward and it's performed flawlessly.",
      "Really impressed with the {name}. Great build quality and it does exactly what it promises.",
      "Upgraded from an older part and the difference is night and day. Highly recommend the {name}.",
      "Been running the {name} for a few months now with zero issues. Would buy again.",
    ],
  },
  {
    minRating: 4,
    maxRating: 4,
    titles: ["Great value", "Very happy with this", "Solid choice", "Does the job well"],
    bodies: [
      "The {name} works great overall. Minor nitpicks but nothing that affects day-to-day use.",
      "Good performance for the price. The {name} has kept up with everything I've thrown at it.",
      "Happy with the {name} so far. Setup was easy and it's been reliable.",
      "Solid pick if you're comparing options in this range — the {name} delivers on the essentials.",
    ],
  },
  {
    minRating: 3,
    maxRating: 3,
    titles: ["Does what it says, nothing more", "Decent but not amazing", "Mixed feelings", "It's fine"],
    bodies: [
      "The {name} is fine — it works, but I expected a bit more given the price.",
      "Average experience with the {name}. Not bad, but there are probably better options out there.",
      "It gets the job done. The {name} isn't exciting but it hasn't let me down either.",
      "A reasonable middle-of-the-road choice. The {name} works as described.",
    ],
  },
  {
    minRating: 2,
    maxRating: 2,
    titles: ["Had some issues", "Below expectations", "Wouldn't buy again", "Underwhelming"],
    bodies: [
      "Ran into a few problems with the {name} that I didn't expect at this price point.",
      "The {name} works but the experience has been inconsistent. Wouldn't be my first recommendation.",
      "Not thrilled with the {name} — performance is behind what I expected from the specs.",
      "Had to troubleshoot more than I'd like with the {name}. It works now but the setup was frustrating.",
    ],
  },
  {
    minRating: 1,
    maxRating: 1,
    titles: ["Disappointed", "Would not recommend", "Not worth it"],
    bodies: [
      "Unfortunately the {name} didn't work as expected out of the box and support wasn't much help.",
      "Regret this purchase. The {name} had problems I couldn't resolve.",
      "Expected more from the {name} given the price. Looking at alternatives now.",
    ],
  },
];
