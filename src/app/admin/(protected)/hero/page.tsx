"use client";

import type { HeroContent } from "@/types";
import { useContent } from "@/components/admin/use-content";
import { EditorPage, FormSection } from "@/components/admin/editor-page";
import { ObjectListField } from "@/components/admin/object-list-field";
import { CheckboxField, ImageField, TextField } from "@/components/admin/fields";

type HeadlineLine = HeroContent["headlineLines"][number];
type HeroAction = HeroContent["actions"][number];

export default function HeroEditor() {
  const { data, setData, loading, error, saving, save } = useContent<HeroContent>("hero");

  const set = (patch: Partial<HeroContent>) => setData((p) => (p ? { ...p, ...patch } : p));
  const setBadge = (patch: Partial<HeroContent["badge"]>) =>
    setData((p) => (p ? { ...p, badge: { ...p.badge, ...patch } } : p));

  return (
    <EditorPage
      title="Hero"
      description="The first thing visitors see — headline, availability badge, buttons, and profile video."
      loading={loading}
      error={error}
      saving={saving}
      onSave={() => save()}
    >
      {data && (
        <>
          <FormSection title="Availability badge" />
          <div className="grid gap-3 sm:grid-cols-[8rem_1fr]">
            <TextField label="Status" value={data.badge.status} onChange={(v) => setBadge({ status: v })} hint="e.g. OPEN" />
            <TextField label="Text" value={data.badge.text} onChange={(v) => setBadge({ text: v })} />
          </div>

          <FormSection title="Headline" />
          <ObjectListField<HeadlineLine>
            hint="Each line animates in. Tick 'muted' for the greyed-out line."
            value={data.headlineLines}
            onChange={(v) => set({ headlineLines: v })}
            newItem={() => ({ text: "" })}
            addLabel="Add line"
            renderRow={(line, u) => (
              <>
                <TextField label="Line text" value={line.text} onChange={(v) => u({ text: v })} />
                <CheckboxField label="Muted (grey)" checked={!!line.muted} onChange={(v) => u({ muted: v })} />
              </>
            )}
          />

          <FormSection title="Sub-headline" />
          <TextField
            label="Typewriter text"
            value={data.typewriter}
            onChange={(v) => set({ typewriter: v })}
            hint="The looping line typed under your name."
          />

          <FormSection title="Buttons" />
          <ObjectListField<HeroAction>
            value={data.actions}
            onChange={(v) => set({ actions: v })}
            newItem={() => ({ label: "", href: "#" })}
            addLabel="Add button"
            renderRow={(a, u) => (
              <div className="grid gap-2 sm:grid-cols-2">
                <TextField label="Label" value={a.label} onChange={(v) => u({ label: v })} />
                <TextField label="Link" value={a.href} onChange={(v) => u({ href: v })} hint="#section or URL" />
              </div>
            )}
          />

          <FormSection title="Profile media" />
          <ImageField
            label="Profile video or image"
            folder="profile"
            accept="video/*,image/*"
            value={data.profileVideo}
            onChange={(v) => set({ profileVideo: v })}
            hint="MP4/WebM video or an image. Upload or paste a path."
          />
        </>
      )}
    </EditorPage>
  );
}
