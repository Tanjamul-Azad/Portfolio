"use client";

import type { SiteConfig } from "@/types";
import { useContent } from "@/components/admin/use-content";
import { EditorPage, FormSection } from "@/components/admin/editor-page";
import { ImageField, TextAreaField, TextField } from "@/components/admin/fields";

export default function SiteEditor() {
  const { data, setData, loading, error, saving, save } = useContent<SiteConfig>("site");

  const set = (patch: Partial<SiteConfig>) => setData((p) => (p ? { ...p, ...patch } : p));
  const setLinks = (patch: Partial<SiteConfig["links"]>) =>
    setData((p) => (p ? { ...p, links: { ...p.links, ...patch } } : p));
  const setContact = (patch: Partial<SiteConfig["contact"]>) =>
    setData((p) => (p ? { ...p, contact: { ...p.contact, ...patch } } : p));
  const setAuthor = (patch: Partial<SiteConfig["author"]>) =>
    setData((p) => (p ? { ...p, author: { ...p.author, ...patch } } : p));

  return (
    <EditorPage
      title="Site & SEO"
      description="Global identity, social links, contact details, and search/social preview."
      loading={loading}
      error={error}
      saving={saving}
      onSave={() => save()}
    >
      {data && (
        <>
          <TextField label="Short name" value={data.name} onChange={(v) => set({ name: v })} />
          <TextField label="Page title (SEO)" value={data.title} onChange={(v) => set({ title: v })} />
          <TextAreaField
            label="Meta description (SEO)"
            value={data.description}
            onChange={(v) => set({ description: v })}
            rows={3}
          />
          <TextField label="Site URL" value={data.url} onChange={(v) => set({ url: v })} hint="https://yourdomain.com" />
          <ImageField
            label="Social / OG image"
            folder="misc"
            value={data.ogImage}
            onChange={(v) => set({ ogImage: v })}
            hint="Shown when your link is shared. 1200×630 works best."
          />

          <FormSection title="Social links" />
          <TextField label="GitHub" value={data.links.github} onChange={(v) => setLinks({ github: v })} />
          <TextField label="LinkedIn" value={data.links.linkedin} onChange={(v) => setLinks({ linkedin: v })} />
          <TextField label="Facebook" value={data.links.facebook} onChange={(v) => setLinks({ facebook: v })} />
          <TextField label="Twitter / X" value={data.links.twitter} onChange={(v) => setLinks({ twitter: v })} />
          <TextField
            label="Résumé / CV"
            value={data.links.resume}
            onChange={(v) => setLinks({ resume: v })}
            hint="Path in /public or a full URL"
          />

          <FormSection title="Contact" />
          <TextField label="Email" value={data.contact.email} onChange={(v) => setContact({ email: v })} />
          <TextField label="WhatsApp" value={data.contact.whatsapp} onChange={(v) => setContact({ whatsapp: v })} />

          <FormSection title="Author" />
          <TextField label="Full name" value={data.author.name} onChange={(v) => setAuthor({ name: v })} />
          <TextField label="Role" value={data.author.role} onChange={(v) => setAuthor({ role: v })} />
          <TextField label="Location" value={data.author.location} onChange={(v) => setAuthor({ location: v })} />
          <TextField
            label="Twitter handle"
            value={data.author.twitterHandle}
            onChange={(v) => setAuthor({ twitterHandle: v })}
          />
        </>
      )}
    </EditorPage>
  );
}
