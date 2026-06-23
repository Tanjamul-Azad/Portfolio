"use client";

import type { AboutContent } from "@/types";
import { useContent } from "@/components/admin/use-content";
import { EditorPage, FormSection } from "@/components/admin/editor-page";
import { StringListField, TextAreaField, TextField } from "@/components/admin/fields";

export default function AboutEditor() {
  const { data, setData, loading, error, saving, save } = useContent<AboutContent>("about");

  const set = (patch: Partial<AboutContent>) => setData((p) => (p ? { ...p, ...patch } : p));
  const setPersonality = (patch: Partial<AboutContent["personality"]>) =>
    setData((p) => (p ? { ...p, personality: { ...p.personality, ...patch } } : p));

  return (
    <EditorPage
      title="About / Bio"
      description="Your bio paragraphs, personality badge, and the highlighted quote."
      loading={loading}
      error={error}
      saving={saving}
      onSave={() => save()}
    >
      {data && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              label="Eyebrow"
              value={data.eyebrow}
              onChange={(v) => set({ eyebrow: v })}
              hint="Small label above the heading"
            />
            <TextField label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} />
          </div>

          <FormSection title="Personality badge" />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              label="Type"
              value={data.personality.type}
              onChange={(v) => setPersonality({ type: v })}
              hint="e.g. INTP-A"
            />
            <TextField
              label="Label"
              value={data.personality.label}
              onChange={(v) => setPersonality({ label: v })}
              hint="e.g. The Logician"
            />
          </div>

          <FormSection title="Bio" />
          <StringListField
            label="Paragraphs"
            value={data.paragraphs}
            onChange={(v) => set({ paragraphs: v })}
            multiline
            addLabel="Add paragraph"
            hint="Wrap words in **double asterisks** to keep them bold/highlighted."
          />
          <TextAreaField
            label="Quote"
            value={data.quote}
            onChange={(v) => set({ quote: v })}
            rows={3}
            hint="Shown in the highlighted blockquote."
          />
        </>
      )}
    </EditorPage>
  );
}
