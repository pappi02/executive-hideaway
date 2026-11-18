/**
 * Copy for the resort's leisure areas: food, the bar & lounge, and games.
 *
 * The games list mirrors the five games the owner has confirmed as available
 * (Gents Games & Entertainment, docs/PHASE_0_DISCOVERY.md §3). Keep the same
 * rules here: no table or equipment counts, and no prices, which stay
 * enquiry-only until the owner confirms them.
 */

export type LeisureArea = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Tailwind object-position class for the crop. */
  imagePosition: string;
  cta: { label: string; href: string };
};

export const leisureAreas: LeisureArea[] = [
  {
    id: "food",
    number: "01",
    eyebrow: "Food & Dining",
    title: "The Kitchen",
    description:
      "Breakfast through to dinner: Kenyan classics, dishes from the grill and the sea, light plates and something sweet to finish.",
    image: "/images/menu/grill.jpg",
    imageAlt: "Steaks cooking over an open flame grill",
    imagePosition: "object-[70%_60%]",
    cta: { label: "View the food menu", href: "/menu" },
  },
  {
    id: "bar-lounge",
    number: "02",
    eyebrow: "Bar & Lounge",
    title: "The Lounge",
    description:
      "Low light, deep seating and an unhurried pace. Beers, spirits, classic cocktails and wine by the glass or bottle.",
    image: "/images/venue/throne-chairs-lounge-decanter.webp",
    imageAlt: "The lounge: gold-trimmed throne chairs, a grey sofa and a whisky decanter set on the coffee table",
    imagePosition: "object-[center_62%]",
    cta: { label: "View the drinks menu", href: "/menu" },
  },
  {
    id: "games",
    number: "03",
    eyebrow: "Games & Activities",
    title: "The Games Room",
    description:
      "Pool, chess, cards, table tennis and darts. Settle in for a quiet game or a friendly rivalry.",
    image: "/images/venue/pool-table-lounge.webp",
    imageAlt: "The pool table in the lounge, with high-backed chairs and sofas behind it",
    imagePosition: "object-[center_60%]",
    cta: { label: "Explore games", href: "/games" },
  },
];

export type Game = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  players: string;
  duration: string;
  equipment: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
};

export const games: Game[] = [
  {
    id: "pool",
    name: "Pool",
    tagline: "Precision meets competition at the table.",
    description:
      "Line up your shot and challenge a friend. Whether you're learning the basics or refining your technique, pool rewards concentration, positioning and tactical thinking.",
    players: "2, or teams in doubles",
    duration: "30–60 minutes a game",
    equipment: "Cues and balls provided",
    image: "/images/venue/pool-table-throne-chairs.webp",
    imageAlt: "The pool table racked with two cues, in front of the gold throne chairs",
    imagePosition: "object-[center_60%]",
  },
  {
    id: "chess",
    name: "Chess",
    tagline: "Think ahead, outplay your opponent.",
    description:
      "A two-player game of planning and anticipation, as relaxed or as serious as you make it. New to chess? Our team can walk you through how the pieces move.",
    players: "2",
    duration: "15–45 minutes for a casual game",
    equipment: "Boards and sets provided",
    image: "/images/venue/chess-board.webp",
    imageAlt: "A chess set laid out for a new game on a round lounge table",
    imagePosition: "object-center",
  },
  {
    id: "cards",
    name: "Cards",
    tagline: "Casual, social and group-friendly.",
    description:
      "A relaxed way to spend time together between other activities. Ask our team which card games are available during your visit.",
    players: "2 or more",
    duration: "Varies by game",
    equipment: "Standard decks provided",
    image: "/images/games/games-spread.webp",
    imageAlt: "Playing cards, dominoes and chess pieces on a wooden table",
    imagePosition: "object-[center_85%]",
  },
  {
    id: "table-tennis",
    name: "Table Tennis",
    tagline: "Fast reflexes, head-to-head rallies.",
    description:
      "Fast-paced and competitive, for singles or doubles. Knock the ball around casually or play a serious rally.",
    players: "2 for singles, 4 for doubles",
    duration: "10–20 minutes a game",
    equipment: "Paddles and balls provided",
    image: "/images/games/table-tennis-clean.webp",
    imageAlt: "A table tennis table with paddles and a ball",
    imagePosition: "object-center",
  },
  {
    id: "darts",
    name: "Darts",
    tagline: "Steady aim, friendly rivalry.",
    description:
      "A classic game of precision and focus: easy to pick up, satisfying to master. Good for a casual round or a running rivalry.",
    players: "2 or more",
    duration: "10–15 minutes a game",
    equipment: "Darts provided",
    image: "/images/games/darts.webp",
    imageAlt: "Darts in a dartboard",
    imagePosition: "object-center",
  },
];

export type ComingSoonGroup = {
  id: string;
  title: string;
  note?: string;
  games: { name: string; description: string }[];
};

/**
 * Proposed games that are not yet confirmed at the venue (the Gents project's
 * draft, unverified records). Listed as "coming soon" only: describe the game,
 * never what is on site. Move a game into `games` above once the owner
 * confirms it and the venue facts (players, duration, equipment) are known.
 */
export const comingSoonGames: ComingSoonGroup[] = [
  {
    id: "table-games",
    title: "Table Games",
    games: [
      { name: "Snooker", description: "Long tables, small pockets, patient break-building." },
      { name: "Foosball", description: "Spin the rods and score: table football, head to head." },
      { name: "Air Hockey", description: "A puck on a cushion of air, and very little time to react." },
    ],
  },
  {
    id: "board-games",
    title: "Board Games",
    games: [
      { name: "Draughts", description: "Diagonal moves, forced captures, kings in the back row." },
      { name: "Backgammon", description: "Dice, tactics and a race to bear off first." },
      { name: "Scrabble", description: "Build words and chase the premium squares." },
      { name: "Ludo", description: "Race your pieces home and send rivals back to start." },
      { name: "Monopoly", description: "Buy, trade and build your way around the board." },
    ],
  },
  {
    id: "social-games",
    title: "Cards & Social Games",
    games: [
      { name: "UNO", description: "Match colours or numbers and be first to empty your hand." },
      { name: "Dominoes", description: "Match the ends, block the table, play out your tiles." },
      { name: "Jenga", description: "Pull a block, stack it on top, and hope the tower holds." },
      { name: "Connect Four", description: "Line up four discs before your opponent does." },
    ],
  },
  {
    id: "outdoor-leisure",
    title: "Outdoor & Leisure",
    games: [
      { name: "Mini Golf", description: "A short putting course with ramps, bends and a few tricky holes." },
      { name: "Swimming Pool", description: "A pool to swim, cool off and relax beside." },
    ],
  },
  {
    id: "live-entertainment",
    title: "Live Entertainment",
    games: [
      { name: "Live Band & Salsa Dancers", description: "A live band on stage with salsa dancers leading the floor." },
    ],
  },
  {
    id: "casino-style",
    title: "Casino-Style Games",
    note: "For fun only: play chips with no cash value, no wagering and no prizes.",
    games: [
      { name: "Roulette", description: "Call your numbers and watch the wheel." },
      { name: "Blackjack", description: "Beat the dealer to 21 without going over." },
      { name: "Poker (Texas Hold'em)", description: "Two cards each, five on the table, and a lot of reading the room." },
    ],
  },
];
