"use client";

import { useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props<T> = {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  itemTitle: (item: T, index: number) => string;
  itemSubtitle?: (item: T, index: number) => string | undefined;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  addLabel?: string;
  emptyLabel?: string;
};

export function CollectionEditor<T>({
  items,
  onChange,
  newItem,
  itemTitle,
  itemSubtitle,
  renderItem,
  addLabel = "Add new",
  emptyLabel = "Nothing here yet. Add your first entry.",
}: Props<T>) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const update = (i: number, patch: Partial<T>) =>
    onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));

  const remove = (i: number) => {
    onChange(items.filter((_, j) => j !== i));
    setOpenIndex(null);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpenIndex(j);
  };

  const add = () => {
    const next = [...items, newItem()];
    onChange(next);
    setOpenIndex(next.length - 1);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 p-6 text-center text-sm text-neutral-500">
          {emptyLabel}
        </p>
      )}

      {items.map((item, i) => {
        const open = openIndex === i;
        const subtitle = itemSubtitle?.(item, i);
        return (
          <div
            key={i}
            className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex items-center gap-2 p-3">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <ChevronDown
                  className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
                />
                <span className="truncate font-medium text-neutral-900 dark:text-white">
                  {itemTitle(item, i) || "Untitled"}
                </span>
                {subtitle && (
                  <span className="truncate text-xs text-neutral-500">· {subtitle}</span>
                )}
              </button>
              <div className="flex shrink-0 gap-0.5">
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => move(i, -1)} disabled={i === 0}>
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                >
                  <ArrowDown className="size-3.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(i)}>
                  <Trash2 className="size-3.5 text-red-500" />
                </Button>
              </div>
            </div>
            {open && (
              <div className="space-y-4 border-t border-neutral-200 p-4 dark:border-neutral-800">
                {renderItem(item, (patch) => update(i, patch), i)}
              </div>
            )}
          </div>
        );
      })}

      <Button type="button" variant="outline" onClick={add}>
        <Plus className="size-4" />
        {addLabel}
      </Button>
    </div>
  );
}
