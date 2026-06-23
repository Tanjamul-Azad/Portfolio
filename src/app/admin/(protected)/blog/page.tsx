"use client";

import { toast } from "sonner";
import type { BlogPost } from "@/types";
import { useContent } from "@/components/admin/use-content";
import { EditorPage } from "@/components/admin/editor-page";
import { CollectionEditor } from "@/components/admin/collection-editor";
import {
  CheckboxField,
  Field,
  MarkdownField,
  TagsField,
  TextAreaField,
  TextField,
} from "@/components/admin/fields";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/admin/slugify";

export default function BlogEditor() {
  const { data, setData, loading, error, saving, save } = useContent<BlogPost[]>("blog");

  const onSave = () => {
    const items = data ?? [];
    if (items.some((p) => !p.title.trim() || !p.slug.trim())) {
      toast.error("Every post needs a title and a slug.");
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
      title="Blog"
      description="Write and manage blog posts. Content is Markdown."
      loading={loading}
      error={error}
      saving={saving}
      onSave={onSave}
    >
      {data && (
        <CollectionEditor<BlogPost>
          items={data}
          onChange={setData}
          addLabel="Add post"
          itemTitle={(p) => p.title}
          itemSubtitle={(p) => p.date}
          newItem={() => ({
            slug: "",
            title: "",
            excerpt: "",
            content: "",
            date: new Date().toISOString().slice(0, 10),
            readTime: "5 min read",
            tags: [],
            featured: false,
          })}
          renderItem={(p, update) => (
            <>
              <TextField
                label="Title"
                value={p.title}
                onChange={(v) => update({ title: v, ...(p.slug ? {} : { slug: slugify(v) }) })}
              />
              <Field label="Slug (URL)" hint="Appears in /blog/<slug>. Lowercase, unique.">
                <Input value={p.slug} onChange={(e) => update({ slug: e.target.value })} />
              </Field>
              <TextAreaField label="Excerpt" value={p.excerpt} onChange={(v) => update({ excerpt: v })} rows={2} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Date">
                  <Input type="date" value={p.date} onChange={(e) => update({ date: e.target.value })} />
                </Field>
                <TextField label="Read time" value={p.readTime} onChange={(v) => update({ readTime: v })} />
              </div>
              <TagsField label="Tags" value={p.tags} onChange={(v) => update({ tags: v })} />
              <CheckboxField label="Featured" checked={!!p.featured} onChange={(v) => update({ featured: v })} />
              <MarkdownField label="Content" value={p.content} onChange={(v) => update({ content: v })} />
            </>
          )}
        />
      )}
    </EditorPage>
  );
}
