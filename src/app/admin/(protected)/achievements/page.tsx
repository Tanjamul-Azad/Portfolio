"use client";

import type { Achievement } from "@/types";
import { useContent } from "@/components/admin/use-content";
import { EditorPage } from "@/components/admin/editor-page";
import { CollectionEditor } from "@/components/admin/collection-editor";
import {
  ImageField,
  ImageListField,
  SelectField,
  TagsField,
  TextAreaField,
  TextField,
} from "@/components/admin/fields";
import { generateId } from "@/lib/admin/slugify";

const TYPE_OPTIONS = [
  { value: "certification", label: "Certification" },
  { value: "award", label: "Award" },
  { value: "achievement", label: "Achievement" },
] as const;

export default function AchievementsEditor() {
  const { data, setData, loading, error, saving, save } = useContent<Achievement[]>("achievements");

  return (
    <EditorPage
      title="Certificates & Awards"
      description="Certifications, awards and achievements shown in the Achievements section."
      loading={loading}
      error={error}
      saving={saving}
      onSave={() => save()}
    >
      {data && (
        <CollectionEditor<Achievement>
          items={data}
          onChange={setData}
          addLabel="Add entry"
          itemTitle={(a) => a.title}
          itemSubtitle={(a) => `${a.type} · ${a.date}`}
          newItem={() => ({
            id: generateId(data.map((a) => a.id)),
            title: "",
            issuer: "",
            date: "",
            type: "certification",
            icon: "🏅",
            description: "",
            skills: [],
          })}
          renderItem={(a, update) => (
            <>
              <TextField label="Title" value={a.title} onChange={(v) => update({ title: v })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Issuer" value={a.issuer} onChange={(v) => update({ issuer: v })} />
                <TextField label="Date" value={a.date} onChange={(v) => update({ date: v })} hint="e.g. 2025 or 2022 – Present" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField
                  label="Type"
                  value={a.type}
                  onChange={(v) => update({ type: v })}
                  options={TYPE_OPTIONS}
                />
                <TextField label="Icon (emoji)" value={a.icon} onChange={(v) => update({ icon: v })} />
              </div>
              <ImageField
                label="Image / certificate (thumbnail)"
                folder="achievements"
                value={a.image ?? ""}
                onChange={(v) => update({ image: v })}
                hint="Shown as the card thumbnail and as the full image in the detail popup. Upload or paste a URL."
              />
              <ImageField
                label="Moment photo (optional)"
                folder="achievements"
                value={a.momentImage ?? ""}
                onChange={(v) => update({ momentImage: v })}
                hint="A photo from receiving it. When set, hovering the card flips it to reveal this photo, and it also appears in the detail popup for touch visitors."
              />
              <TextAreaField
                label="Description"
                value={a.description}
                onChange={(v) => update({ description: v })}
                rows={3}
                hint="Short — this is what shows on the card itself."
              />
              <TextAreaField
                label="Full story (optional)"
                value={a.details ?? ""}
                onChange={(v) => update({ details: v })}
                rows={5}
                hint="Longer write-up shown only when someone opens the detail view — what it involved, the challenge, the impact."
              />
              <ImageListField
                label="Gallery (optional)"
                folder="achievements"
                value={a.gallery ?? []}
                onChange={(v) => update({ gallery: v })}
                hint="Extra photos shown in the detail view, beyond the thumbnail and moment photo above."
              />
              <TextField
                label="Credential URL (optional)"
                value={a.credentialUrl ?? ""}
                onChange={(v) => update({ credentialUrl: v })}
              />
              <TagsField label="Skills" value={a.skills} onChange={(v) => update({ skills: v })} />
            </>
          )}
        />
      )}
    </EditorPage>
  );
}
