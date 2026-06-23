"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { NowItem, SectionsContent } from "@/types";
import { useContent } from "@/components/admin/use-content";
import { saveContent } from "@/components/admin/client";
import { EditorPage, FormSection } from "@/components/admin/editor-page";
import { StringListField, TextAreaField, TextField } from "@/components/admin/fields";

const CATEGORY_TITLES: Record<NowItem["category"], string> = {
  building: "Currently Building",
  learning: "Active Research / Learning",
  looking: "Looking For",
};

export default function NowEditor() {
  const now = useContent<NowItem[]>("now");
  const sections = useContent<SectionsContent>("sections");
  const [saving, setSaving] = useState(false);

  const loading = now.loading || sections.loading;
  const error = now.error || sections.error;

  const onSave = async () => {
    if (!now.data || !sections.data) return;
    setSaving(true);
    try {
      await saveContent("now", now.data);
      await saveContent("sections", sections.data);
      toast.success("Saved — refresh the site to preview, then commit & push to publish.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const updateNowItems = (index: number, items: string[]) =>
    now.setData((prev) => (prev ? prev.map((it, j) => (j === index ? { ...it, items } : it)) : prev));
  const setNowSec = (patch: Partial<SectionsContent["now"]>) =>
    sections.setData((p) => (p ? { ...p, now: { ...p.now, ...patch } } : p));
  const setContactSec = (patch: Partial<SectionsContent["contact"]>) =>
    sections.setData((p) => (p ? { ...p, contact: { ...p.contact, ...patch } } : p));

  return (
    <EditorPage
      title="Now & Sections"
      description="Your current priorities, plus the heading copy for the Now and Contact sections."
      loading={loading}
      error={error}
      saving={saving}
      onSave={onSave}
    >
      {now.data && sections.data && (
        <>
          <FormSection title="Now — current priorities" />
          {now.data.map((item, i) => (
            <StringListField
              key={item.category}
              label={CATEGORY_TITLES[item.category] ?? item.category}
              value={item.items}
              onChange={(v) => updateNowItems(i, v)}
              multiline
              addLabel="Add item"
            />
          ))}

          <FormSection title="“Now” section header" />
          <TextField label="Eyebrow" value={sections.data.now.eyebrow} onChange={(v) => setNowSec({ eyebrow: v })} />
          <TextField label="Heading" value={sections.data.now.heading} onChange={(v) => setNowSec({ heading: v })} />
          <TextAreaField
            label="Subtext"
            value={sections.data.now.subtext}
            onChange={(v) => setNowSec({ subtext: v })}
            rows={2}
          />

          <FormSection title="Contact section copy" />
          <TextField
            label="Eyebrow"
            value={sections.data.contact.eyebrow}
            onChange={(v) => setContactSec({ eyebrow: v })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              label="Heading line 1"
              value={sections.data.contact.headingLine1}
              onChange={(v) => setContactSec({ headingLine1: v })}
            />
            <TextField
              label="Heading line 2 (accent)"
              value={sections.data.contact.headingLine2}
              onChange={(v) => setContactSec({ headingLine2: v })}
            />
          </div>
          <TextAreaField
            label="Subtext"
            value={sections.data.contact.subtext}
            onChange={(v) => setContactSec({ subtext: v })}
            rows={2}
          />
          <TextField
            label="Response time note"
            value={sections.data.contact.responseTime}
            onChange={(v) => setContactSec({ responseTime: v })}
          />
        </>
      )}
    </EditorPage>
  );
}
