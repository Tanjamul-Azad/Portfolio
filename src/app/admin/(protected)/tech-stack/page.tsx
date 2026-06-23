"use client";

import type { TechItem } from "@/types";
import { useContent } from "@/components/admin/use-content";
import { EditorPage } from "@/components/admin/editor-page";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { SelectField, TextAreaField, TextField } from "@/components/admin/fields";

const CATEGORY_OPTIONS = [
  { value: "language", label: "Language" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "ai", label: "AI / ML" },
  { value: "database", label: "Database" },
  { value: "cloud", label: "Cloud" },
  { value: "tools", label: "Tools" },
  { value: "design", label: "Design" },
] as const;

export default function TechStackEditor() {
  const { data, setData, loading, error, saving, save } = useContent<TechItem[]>("tech-stack");

  return (
    <EditorPage
      title="Tech Stack"
      description="Skills and tools, grouped by category."
      loading={loading}
      error={error}
      saving={saving}
      onSave={() => save()}
    >
      {data && (
        <CollectionEditor<TechItem>
          items={data}
          onChange={setData}
          addLabel="Add technology"
          itemTitle={(t) => `${t.icon} ${t.name}`}
          itemSubtitle={(t) => t.category}
          newItem={() => ({ name: "", icon: "⭐", category: "language", description: "" })}
          renderItem={(t, update) => (
            <>
              <div className="grid gap-3 sm:grid-cols-[1fr_6rem]">
                <TextField label="Name" value={t.name} onChange={(v) => update({ name: v })} />
                <TextField label="Icon (emoji)" value={t.icon} onChange={(v) => update({ icon: v })} />
              </div>
              <SelectField
                label="Category"
                value={t.category}
                onChange={(v) => update({ category: v })}
                options={CATEGORY_OPTIONS}
              />
              <TextAreaField
                label="Description"
                value={t.description}
                onChange={(v) => update({ description: v })}
                rows={2}
              />
            </>
          )}
        />
      )}
    </EditorPage>
  );
}
