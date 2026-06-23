"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "./fields";

/** Editable list of structured objects (e.g. project features, challenges, results). */
export function ObjectListField<T>({
  label,
  hint,
  value,
  onChange,
  newItem,
  renderRow,
  addLabel = "Add",
}: {
  label?: string;
  hint?: string;
  value: T[];
  onChange: (v: T[]) => void;
  newItem: () => T;
  renderRow: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  addLabel?: string;
}) {
  const update = (i: number, patch: Partial<T>) =>
    onChange(value.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-3">
        {value.map((item, i) => (
          <div
            key={i}
            className="rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950/40"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">#{i + 1}</span>
              <div className="flex gap-0.5">
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => move(i, -1)} disabled={i === 0}>
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                >
                  <ArrowDown className="size-3.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(i)}>
                  <Trash2 className="size-3.5 text-red-500" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">{renderRow(item, (patch) => update(i, patch))}</div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => onChange([...value, newItem()])}>
        <Plus className="size-3.5" />
        {addLabel}
      </Button>
    </Field>
  );
}
