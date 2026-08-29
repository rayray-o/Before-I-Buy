"use client";

import { useState } from "react";
import { Plus, Link2, DollarSign, X, ChevronDown } from "lucide-react";
import { Category, PurchaseItem } from "@/lib/types";
import { CATEGORY_LIST, COOLING_PRESETS, genId } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/categoryMeta";

interface AddPurchaseFormProps {
  onAdd: (item: PurchaseItem) => void;
}

const emptyForm = {
  name: "",
  url: "",
  price: "",
  category: "Tech & Gadgets" as Category,
  note: "",
  coolingHours: 14 * 24,
};

export default function AddPurchaseForm({ onAdd }: AddPurchaseFormProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  function reset() {
    setForm(emptyForm);
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const priceNum = parseFloat(form.price);

    if (!form.name.trim()) {
      setError("Give the item a name so future-you recognizes it.");
      return;
    }
    if (!form.price || isNaN(priceNum) || priceNum <= 0) {
      setError("Enter a valid price greater than $0.");
      return;
    }
    if (!form.note.trim() || form.note.trim().length < 10) {
      setError("Write at least a short rationalization note — that's the point.");
      return;
    }

    const newItem: PurchaseItem = {
      id: genId("item"),
      name: form.name.trim(),
      url: form.url.trim() || undefined,
      price: priceNum,
      category: form.category,
      note: form.note.trim(),
      createdAt: Date.now(),
      coolingHours: form.coolingHours,
      status: "cooling",
      votes: [],
      alternatives: [],
    };

    onAdd(newItem);
    reset();
    setOpen(false);
  }

  return (
    <div className="card-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group w-full flex items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5 hover:bg-paper-100 transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className="shrink-0 rounded-full bg-ink text-paper-50 p-2 transition-transform duration-300 group-hover:scale-110">
            <Plus size={18} strokeWidth={2.5} />
          </span>
          <span className="text-left">
            <span className="block font-display text-lg sm:text-xl italic text-ink">
              Delay a purchase
            </span>
            <span className="block text-sm text-ink-light">
              Log the urge before you act on it
            </span>
          </span>
        </span>
        <ChevronDown
          size={20}
          className={`text-ink-faint transition-transform duration-300 shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <form onSubmit={handleSubmit} className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 space-y-4 border-t border-line">
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <div className="sm:col-span-2">
                <label htmlFor="pname" className="block text-xs font-medium uppercase tracking-wide text-ink-light mb-1.5">
                  Product name
                </label>
                <input
                  id="pname"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Mechanical keyboard, weighted blanket…"
                  className="w-full rounded-xl border border-line bg-paper-50 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="purl" className="block text-xs font-medium uppercase tracking-wide text-ink-light mb-1.5">
                  Product URL <span className="normal-case text-ink-faint">(optional)</span>
                </label>
                <div className="relative">
                  <Link2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                  <input
                    id="purl"
                    type="url"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    placeholder="https://…"
                    className="w-full rounded-xl border border-line bg-paper-50 pl-9 pr-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pprice" className="block text-xs font-medium uppercase tracking-wide text-ink-light mb-1.5">
                  Price
                </label>
                <div className="relative">
                  <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
                  <input
                    id="pprice"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    className="ledger-num w-full rounded-xl border border-line bg-paper-50 pl-9 pr-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pcooling" className="block text-xs font-medium uppercase tracking-wide text-ink-light mb-1.5">
                  Cooling-off period
                </label>
                <select
                  id="pcooling"
                  value={form.coolingHours}
                  onChange={(e) => setForm({ ...form, coolingHours: Number(e.target.value) })}
                  className="w-full rounded-xl border border-line bg-paper-50 px-3.5 py-2.5 text-sm text-ink focus:border-ink transition-colors"
                >
                  {COOLING_PRESETS.map((p) => (
                    <option key={p.hours} value={p.hours}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wide text-ink-light mb-1.5">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_LIST.map((cat) => {
                    const meta = CATEGORY_META[cat];
                    const active = form.category === cat;
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setForm({ ...form, category: cat })}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
                          active
                            ? "bg-ink text-paper-50 border-ink"
                            : "bg-paper-50 text-ink-light border-line hover:border-ink-faint"
                        }`}
                      >
                        <meta.icon size={13} />
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="pnote" className="block text-xs font-medium uppercase tracking-wide text-ink-light mb-1.5">
                  Rationalization note — why do I think I need this?
                </label>
                <textarea
                  id="pnote"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={3}
                  placeholder="Be honest with yourself. This note is what the community — and future you — will judge."
                  className="w-full rounded-xl border border-line bg-paper-50 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink transition-colors resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-coral-600 bg-coral-50 border border-coral-100 rounded-lg px-3 py-2">
                <X size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                className="rounded-full bg-coral-500 hover:bg-coral-600 active:scale-[0.98] text-paper-50 text-sm font-semibold px-6 py-2.5 transition-all shadow-sm"
              >
                Start cooling-off period
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
                className="text-sm text-ink-light hover:text-ink px-3 py-2.5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
