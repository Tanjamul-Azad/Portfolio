"use client";

import type { Experience } from "@/types";
import { useContent } from "@/components/admin/use-content";
import { EditorPage } from "@/components/admin/editor-page";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { StringListField, TagsField, TextField } from "@/components/admin/fields";
import { generateId } from "@/lib/admin/slugify";

export default function ExperiencesEditor() {
  const { data, setData, loading, error, saving, save } = useContent<Experience[]>("experiences");

  return (
    <EditorPage
      title="Experience"
      description="Roles and projects shown in the Experience timeline."
      loading={loading}
      error={error}
      saving={saving}
      onSave={() => save()}
    >
      {data && (
        <CollectionEditor<Experience>
          items={data}
          onChange={setData}
          addLabel="Add experience"
          itemTitle={(e) => e.company}
          itemSubtitle={(e) => `${e.role} · ${e.period}`}
          newItem={() => ({
            id: generateId(data.map((e) => e.id)),
            company: "",
            role: "",
            period: "",
            description: [],
            technologies: [],
          })}
          renderItem={(e, update) => (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Company / project" value={e.company} onChange={(v) => update({ company: v })} />
                <TextField label="Role" value={e.role} onChange={(v) => update({ role: v })} />
              </div>
              <TextField label="Period" value={e.period} onChange={(v) => update({ period: v })} hint="e.g. 2025 - 2026" />
              <StringListField
                label="Highlights"
                value={e.description}
                onChange={(v) => update({ description: v })}
                multiline
                addLabel="Add highlight"
                placeholder="What you did / achieved"
              />
              <TagsField
                label="Technologies"
                value={e.technologies ?? []}
                onChange={(v) => update({ technologies: v })}
              />
            </>
          )}
        />
      )}
    </EditorPage>
  );
}
