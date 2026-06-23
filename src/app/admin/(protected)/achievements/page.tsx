"use client";

import type { Achievement } from "@/types";
import { useContent } from "@/components/admin/use-content";
import { EditorPage } from "@/components/admin/editor-page";
import { CollectionEditor } from "@/components/admin/collection-editor";
import {
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
              <TextAreaField
                label="Description"
                value={a.description}
                onChange={(v) => update({ description: v })}
                rows={3}
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
