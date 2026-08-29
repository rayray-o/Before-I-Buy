"use client";

import { PurchaseItem } from "@/lib/types";
import ItemCard from "./ItemCard";
import { ShoppingBag } from "lucide-react";

interface RegistryProps {
  items: PurchaseItem[];
  onOpen: (id: string) => void;
}

export default function Registry({ items, onOpen }: RegistryProps) {
  if (items.length === 0) {
    return (
      <div className="card-surface flex flex-col items-center justify-center text-center py-16 px-6">
        <div className="rounded-full bg-paper-200 p-4 mb-4">
          <ShoppingBag size={24} className="text-ink-faint" />
        </div>
        <h3 className="font-display italic text-xl text-ink mb-1">
          Nothing cooling right now
        </h3>
        <p className="text-sm text-ink-light max-w-sm">
          Felt an urge to buy something? Log it above and let the cooling-off
          period do its job.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onOpen={onOpen} />
      ))}
    </div>
  );
}
