import {
  Cpu,
  Shirt,
  Sofa,
  Sparkles,
  Gamepad2,
  Dumbbell,
  Package,
} from "lucide-react";
import { Category } from "./types";

export const CATEGORY_META: Record<
  Category,
  { icon: typeof Cpu; className: string }
> = {
  "Tech & Gadgets": { icon: Cpu, className: "bg-sky-100 text-sky-700" },
  "Fashion & Apparel": { icon: Shirt, className: "bg-rose-100 text-rose-700" },
  "Home & Decor": { icon: Sofa, className: "bg-amber-100 text-amber-700" },
  Beauty: { icon: Sparkles, className: "bg-fuchsia-100 text-fuchsia-700" },
  "Hobby & Gaming": { icon: Gamepad2, className: "bg-violet-100 text-violet-700" },
  "Fitness & Outdoors": { icon: Dumbbell, className: "bg-emerald-100 text-emerald-700" },
  Other: { icon: Package, className: "bg-stone-200 text-stone-700" },
};
