export type Category =
  | "Tech & Gadgets"
  | "Fashion & Apparel"
  | "Home & Decor"
  | "Beauty"
  | "Hobby & Gaming"
  | "Fitness & Outdoors"
  | "Other";

export type ObjectionTag =
  | "Hype Train"
  | "Overpriced"
  | "You already own this"
  | "Hidden Fees"
  | "Fast Fashion"
  | "Will collect dust"
  | "Better alt exists";

export type ResolutionReason =
  | "Price dropped, felt urgent"
  | "Saw someone else with it"
  | "Stressful day, wanted comfort"
  | "Ran out of patience"
  | "It's genuinely useful"
  | "Gift for someone else"
  | "Other";

export type ItemStatus = "cooling" | "saved" | "bought";

export interface Alternative {
  id: string;
  authorName: string;
  type: "Cheaper Link" | "DIY Option" | "Will Lend Mine";
  description: string;
  url?: string;
  createdAt: number;
}

export interface Vote {
  choice: "buy" | "dont-buy";
  tags: ObjectionTag[];
}

export interface PurchaseItem {
  id: string;
  name: string;
  url?: string;
  price: number;
  category: Category;
  note: string;
  createdAt: number;
  coolingHours: number;
  status: ItemStatus;
  votes: Vote[];
  alternatives: Alternative[];
  resolution?: {
    reason: ResolutionReason;
    resolvedAt: number;
  };
}

export interface GlobalStats {
  totalDelayed: number;
  totalSaved: number;
  totalBlown: number;
  activeCount: number;
  savedCount: number;
  blownCount: number;
}
