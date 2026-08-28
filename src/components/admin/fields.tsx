"use client";

import { useState, type ReactNode } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Eye, Pencil, Trash2, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadFile } from "./client";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <Label className="text-neutral-700 dark:text-neutral-300">{label}</Label>}
      {children}
      {hint && <p className="text-xs text-neutral-500 dark:text-neutral-500">{hint}</p>}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 3,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
}) {
  return (
    <Field label={label} hint={hint}>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </Field>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 accent-amber-500"
      />
      <span>
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
        {hint && <span className="block text-xs text-neutral-500">{hint}</span>}
      </span>
    </label>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label?: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string }[];
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="border-input dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-white dark:bg-neutral-900">
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** Markdown textarea with a toggleable live preview. */
export function MarkdownField({
  label,
  value,
  onChange,
  hint,
  rows = 14,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  rows?: number;
}) {
  const [preview, setPreview] = useState(false);
  return (
    <Field hint={hint}>
      <div className="flex items-center justify-between">
        {label && <Label className="text-neutral-700 dark:text-neutral-300">{label}</Label>}
        <Button type="button" variant="ghost" size="xs" onClick={() => setPreview((p) => !p)}>
          {preview ? <Pencil className="size-3" /> : <Eye className="size-3" />}
          {preview ? "Edit" : "Preview"}
        </Button>
      </div>
      {preview ? (
        <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none rounded-md border border-input p-4 min-h-40">
          <Markdown>{value || "_Nothing to preview yet._"}</Markdown>
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="font-mono text-xs leading-relaxed"
          placeholder="Write in Markdown — # headings, **bold**, - lists, etc."
        />
      )}
    </Field>
  );
}

/** Editable list of plain strings (bullet points, paragraphs). */
export function StringListField({
  label,
  value,
  onChange,
  hint,
  multiline = false,
  placeholder,
  addLabel = "Add item",
}: {
  label?: string;
  value: string[];
  onChange: (v: string[]) => void;
  hint?: string;
  multiline?: boolean;
  placeholder?: string;
  addLabel?: string;
}) {
  const update = (i: number, v: string) => onChange(value.map((x, j) => (j === i ? v : x)));
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
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex items-start gap-1.5">
            {multiline ? (
              <Textarea
                value={item}
                onChange={(e) => update(i, e.target.value)}
                rows={2}
                placeholder={placeholder}
              />
            ) : (
              <Input value={item} onChange={(e) => update(i, e.target.value)} placeholder={placeholder} />
            )}
            <div className="flex shrink-0 gap-0.5">
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
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => onChange([...value, ""])}>
        {addLabel}
      </Button>
    </Field>
  );
}

/** Chip-style tag editor. */
export function TagsField({
  label,
  value,
  onChange,
  hint,
}: {
  label?: string;
  value: string[];
  onChange: (v: string[]) => void;
  hint?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft("");
  };
  return (
    <Field label={label} hint={hint}>
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {value.map((t, i) => (
            <span
              key={t + i}
              className="inline-flex items-center gap-1 rounded-full bg-neutral-200 px-2.5 py-1 text-xs dark:bg-neutral-800"
            >
              {t}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="text-neutral-500 hover:text-red-500"
                aria-label={`Remove ${t}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Type a tag and press Enter"
        />
        <Button type="button" variant="outline" size="sm" onClick={add}>
          Add
        </Button>
      </div>
    </Field>
  );
}

/** Image/video field: live preview + upload to /public, or paste a URL. */
export function ImageField({
  label,
  value,
  onChange,
  folder,
  hint,
  accept = "image/*",
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  folder: string;
  hint?: string;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const isVideo = /\.(mp4|webm)$/i.test(value);

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const path = await uploadFile(file, folder);
      onChange(path);
      toast.success("Uploaded.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Field label={label} hint={hint}>
      {value && (
        <div className="mb-2 overflow-hidden rounded-md border border-input bg-neutral-100 dark:bg-neutral-900 w-fit">
          {isVideo ? (
            <video src={encodeURI(value)} muted loop autoPlay playsInline className="h-32 w-auto object-cover" />
          ) : (
             
            <img src={value} alt="" className="h-32 w-auto object-cover" />
          )}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/... or https://..."
        />
        <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
          <label className="cursor-pointer">
            <Upload className="size-3.5" />
            {uploading ? "Uploading…" : "Upload"}
            <input
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => onPick(e.target.files?.[0])}
            />
          </label>
        </Button>
      </div>
    </Field>
  );
}


/** A reorderable list of uploaded images — a gallery editor. */
export function ImageListField({
  label,
  value,
  onChange,
  folder,
  hint,
}: {
  label?: string;
  value: string[];
  onChange: (v: string[]) => void;
  folder: string;
  hint?: string;
}) {
  const [uploading, setUploading] = useState(false);

  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const onPick = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadFile(file, folder));
      }
      onChange([...value, ...uploaded]);
      toast.success(uploaded.length > 1 ? `Uploaded ${uploaded.length} photos.` : "Uploaded.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Field label={label} hint={hint}>
      {value.length > 0 && (
        <div className="mb-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="group relative aspect-square overflow-hidden rounded-md border border-input bg-neutral-100 dark:bg-neutral-900"
            >
               
              <img src={src} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-xs"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                >
                  <ArrowUp className="size-3" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-xs"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                >
                  <ArrowDown className="size-3" />
                </Button>
                <Button type="button" variant="destructive" size="icon-xs" onClick={() => remove(i)}>
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
        <label className="cursor-pointer">
          <Upload className="size-3.5" />
          {uploading ? "Uploading…" : "Add photos"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onPick(e.target.files)}
          />
        </label>
      </Button>
    </Field>
  );
}
