"use client";

import type { ResearchStatus, ResearchWork } from "@/types";
import { useContent } from "@/components/admin/use-content";
import { EditorPage } from "@/components/admin/editor-page";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { SelectField, TagsField, TextAreaField, TextField } from "@/components/admin/fields";
import { generateId } from "@/lib/admin/slugify";

const STATUS_OPTIONS: readonly { value: ResearchStatus; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "in-progress", label: "In progress" },
  { value: "under-review", label: "Under review" },
  { value: "accepted", label: "Accepted" },
  { value: "published", label: "Published" },
];

export default function ResearchEditor() {
  const { data, setData, loading, error, saving, save } = useContent<ResearchWork[]>("research");

  return (
    <EditorPage
      title="Research"
      description="Papers, paper ideas and ongoing studies. The venue reads as a target until the status is Accepted or Published. The section hides itself when empty."
      loading={loading}
      error={error}
      saving={saving}
      onSave={() => save()}
    >
      {data && (
        <CollectionEditor<ResearchWork>
          items={data}
          onChange={setData}
          addLabel="Add research work"
          itemTitle={(r) => r.title || "New research work"}
          itemSubtitle={(r) => [STATUS_OPTIONS.find((o) => o.value === r.status)?.label, r.venue].filter(Boolean).join(" · ") || undefined}
          newItem={() => ({
            id: generateId(data.map((r) => r.id)),
            title: "",
            summary: "",
            status: "idea",
            area: "",
            venue: "",
            year: "",
            authors: "",
            tags: [],
            paperUrl: "",
            codeUrl: "",
          })}
          renderItem={(r, update) => (
            <>
              <TextField label="Title" value={r.title} onChange={(v) => update({ title: v })} />
              <TextAreaField label="Summary" value={r.summary} onChange={(v) => update({ summary: v })} rows={3} />
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField label="Status" value={r.status} options={STATUS_OPTIONS} onChange={(v) => update({ status: v })} />
                <TextField label="Area" value={r.area ?? ""} onChange={(v) => update({ area: v })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  label="Venue (target or published)"
                  placeholder="e.g. EMNLP 2026, IEEE IoT Journal"
                  value={r.venue ?? ""}
                  onChange={(v) => update({ venue: v })}
                />
                <TextField label="Year" value={r.year ?? ""} onChange={(v) => update({ year: v })} />
              </div>
              <TextField label="Authors (optional)" value={r.authors ?? ""} onChange={(v) => update({ authors: v })} />
              <TagsField label="Tags" value={r.tags} onChange={(v) => update({ tags: v })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Paper / preprint URL" value={r.paperUrl ?? ""} onChange={(v) => update({ paperUrl: v })} />
                <TextField label="Code URL" value={r.codeUrl ?? ""} onChange={(v) => update({ codeUrl: v })} />
              </div>
            </>
          )}
        />
      )}
    </EditorPage>
  );
}
