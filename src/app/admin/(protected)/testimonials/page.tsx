"use client";

import type { Testimonial } from "@/types";
import { useContent } from "@/components/admin/use-content";
import { EditorPage } from "@/components/admin/editor-page";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { Field, ImageField, TextAreaField, TextField } from "@/components/admin/fields";
import { Input } from "@/components/ui/input";
import { generateId } from "@/lib/admin/slugify";

export default function TestimonialsEditor() {
  const { data, setData, loading, error, saving, save } = useContent<Testimonial[]>("testimonials");

  return (
    <EditorPage
      title="Testimonials"
      description="Quotes from people you've worked with. The section hides itself when empty."
      loading={loading}
      error={error}
      saving={saving}
      onSave={() => save()}
    >
      {data && (
        <CollectionEditor<Testimonial>
          items={data}
          onChange={setData}
          addLabel="Add testimonial"
          itemTitle={(t) => t.name || "New testimonial"}
          itemSubtitle={(t) => [t.role, t.company].filter(Boolean).join(", ") || undefined}
          newItem={() => ({
            id: generateId(data.map((t) => t.id)),
            name: "",
            role: "",
            company: "",
            content: "",
            rating: 5,
          })}
          renderItem={(t, update) => (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Name" value={t.name} onChange={(v) => update({ name: v })} />
                <TextField label="Company" value={t.company} onChange={(v) => update({ company: v })} />
              </div>
              <TextField label="Role" value={t.role} onChange={(v) => update({ role: v })} />
              <ImageField
                label="Avatar (optional)"
                folder="misc"
                value={t.image ?? ""}
                onChange={(v) => update({ image: v })}
              />
              <TextAreaField label="Quote" value={t.content} onChange={(v) => update({ content: v })} rows={3} />
              <Field label="Rating (1–5, optional)">
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={t.rating ?? ""}
                  onChange={(e) =>
                    update({ rating: e.target.value === "" ? undefined : Number(e.target.value) })
                  }
                />
              </Field>
            </>
          )}
        />
      )}
    </EditorPage>
  );
}
