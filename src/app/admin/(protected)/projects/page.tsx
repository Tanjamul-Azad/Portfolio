"use client";

import { toast } from "sonner";
import type { Challenge, Project, ProjectFeature, Result } from "@/types";
import { useContent } from "@/components/admin/use-content";
import { EditorPage } from "@/components/admin/editor-page";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { ObjectListField } from "@/components/admin/object-list-field";
import {
  CheckboxField,
  Field,
  ImageField,
  TagsField,
  TextAreaField,
  TextField,
} from "@/components/admin/fields";
import { Input } from "@/components/ui/input";
import { generateId, slugify } from "@/lib/admin/slugify";

export default function ProjectsEditor() {
  const { data, setData, loading, error, saving, save } = useContent<Project[]>("projects");

  const onSave = () => {
    const items = data ?? [];
    if (items.some((p) => !p.title.trim() || !p.slug.trim())) {
      toast.error("Every project needs a title and a slug.");
      return;
    }
    const slugs = items.map((p) => p.slug);
    const dupe = slugs.find((s, i) => slugs.indexOf(s) !== i);
    if (dupe) {
      toast.error(`Duplicate slug: "${dupe}". Slugs must be unique.`);
      return;
    }
    save();
  };

  return (
    <EditorPage
      title="Projects"
      description="Add, edit, reorder, and remove projects. Pinned projects show first on the homepage."
      loading={loading}
      error={error}
      saving={saving}
      onSave={onSave}
    >
      {data && (
        <CollectionEditor<Project>
          items={data}
          onChange={setData}
          addLabel="Add project"
          itemTitle={(p) => p.title}
          itemSubtitle={(p) =>
            [p.pinned ? "Pinned" : null, p.featured ? "Featured" : null]
              .filter(Boolean)
              .join(" · ") || undefined
          }
          newItem={() => ({
            id: generateId(data.map((p) => p.id)),
            slug: "",
            title: "",
            description: "",
            role: "",
            impact: "",
            image: "",
            tags: [],
            featured: false,
            pinned: false,
            features: [],
            challenges: [],
            results: [],
          })}
          renderItem={(p, update) => (
            <>
              <TextField
                label="Title"
                value={p.title}
                onChange={(v) => update({ title: v, ...(p.slug ? {} : { slug: slugify(v) }) })}
              />
              <Field label="Slug (URL)" hint="Appears in /projects/<slug>. Lowercase, unique.">
                <Input value={p.slug} onChange={(e) => update({ slug: e.target.value })} />
              </Field>
              <TextAreaField
                label="Short description"
                value={p.description}
                onChange={(v) => update({ description: v })}
                rows={2}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Your role" value={p.role} onChange={(v) => update({ role: v })} />
                <TextField
                  label="Accent color"
                  value={p.color ?? ""}
                  onChange={(v) => update({ color: v })}
                  hint="Hex, e.g. #3b82f6"
                />
              </div>
              <TextAreaField label="Impact" value={p.impact} onChange={(v) => update({ impact: v })} rows={2} />
              <ImageField
                label="Cover image"
                folder="projects"
                value={p.image ?? ""}
                onChange={(v) => update({ image: v })}
                hint="Upload or paste a URL. Leave blank for a lettered placeholder."
              />
              <TagsField label="Tech tags" value={p.tags} onChange={(v) => update({ tags: v })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Live URL" value={p.liveUrl ?? ""} onChange={(v) => update({ liveUrl: v })} />
                <TextField label="Source URL" value={p.sourceUrl ?? ""} onChange={(v) => update({ sourceUrl: v })} />
              </div>
              <ImageField
                label="Preview video"
                folder="projects"
                value={p.videoUrl ?? ""}
                onChange={(v) => update({ videoUrl: v })}
                accept="video/mp4,video/webm"
                hint="Upload an .mp4/.webm (max 50MB) and it autoplays as the project preview. Or paste an external link (YouTube, etc.) to show a “Watch Demo” button instead. Leave blank to use the cover image."
              />
              <div className="flex flex-wrap gap-6">
                <CheckboxField
                  label="Pinned on homepage"
                  checked={!!p.pinned}
                  onChange={(v) => update({ pinned: v })}
                />
                <CheckboxField label="Featured" checked={!!p.featured} onChange={(v) => update({ featured: v })} />
              </div>

              <div className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <p className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
                  Case study (optional)
                </p>
                <div className="space-y-4">
                  <TextAreaField label="Overview" value={p.overview ?? ""} onChange={(v) => update({ overview: v })} />
                  <TextAreaField label="Problem" value={p.problem ?? ""} onChange={(v) => update({ problem: v })} />
                  <TextAreaField label="Solution" value={p.solution ?? ""} onChange={(v) => update({ solution: v })} />
                  <TextAreaField
                    label="Architecture"
                    value={p.architecture ?? ""}
                    onChange={(v) => update({ architecture: v })}
                  />

                  <ObjectListField<ProjectFeature>
                    label="Key features"
                    value={p.features ?? []}
                    onChange={(v) => update({ features: v })}
                    newItem={() => ({ title: "", description: "" })}
                    addLabel="Add feature"
                    renderRow={(f, u) => (
                      <>
                        <TextField label="Title" value={f.title} onChange={(v) => u({ title: v })} />
                        <TextAreaField
                          label="Description"
                          value={f.description}
                          onChange={(v) => u({ description: v })}
                          rows={2}
                        />
                      </>
                    )}
                  />

                  <ObjectListField<Challenge>
                    label="Challenges & learnings"
                    value={p.challenges ?? []}
                    onChange={(v) => update({ challenges: v })}
                    newItem={() => ({ challenge: "", learned: "" })}
                    addLabel="Add challenge"
                    renderRow={(c, u) => (
                      <>
                        <TextAreaField
                          label="Challenge"
                          value={c.challenge}
                          onChange={(v) => u({ challenge: v })}
                          rows={2}
                        />
                        <TextAreaField
                          label="What I learned"
                          value={c.learned}
                          onChange={(v) => u({ learned: v })}
                          rows={2}
                        />
                      </>
                    )}
                  />

                  <ObjectListField<Result>
                    label="Results / metrics"
                    value={p.results ?? []}
                    onChange={(v) => update({ results: v })}
                    newItem={() => ({ metric: "", value: "", description: "" })}
                    addLabel="Add result"
                    renderRow={(r, u) => (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <TextField label="Metric" value={r.metric} onChange={(v) => u({ metric: v })} />
                          <TextField label="Value" value={r.value} onChange={(v) => u({ value: v })} />
                        </div>
                        <TextAreaField
                          label="Description"
                          value={r.description ?? ""}
                          onChange={(v) => u({ description: v })}
                          rows={2}
                        />
                      </>
                    )}
                  />
                </div>
              </div>
            </>
          )}
        />
      )}
    </EditorPage>
  );
}
