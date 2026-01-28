"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Twitter, Linkedin, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPostBySlug, blogPosts } from "@/data";
import { Navbar, Footer } from "@/components/layout";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  const post = getPostBySlug(params.slug as string);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Post not found</h1>
          <Button onClick={() => router.push("/blog")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <main className="bg-neutral-50 dark:bg-black min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <article className="pt-32 pb-20">
        <div className="container px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-amber-500 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight"
              >
                {post.title}
              </motion.h1>

              <motion.div 
                variants={fadeInUp}
                className="flex items-center justify-between flex-wrap gap-4 pb-8 border-b border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex items-center gap-6 text-sm text-neutral-500">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={copyLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                    <a 
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div 
                variants={fadeInUp}
                className="prose prose-lg dark:prose-invert prose-neutral max-w-none mt-12
                  prose-headings:font-bold prose-headings:text-neutral-900 dark:prose-headings:text-white
                  prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                  prose-p:text-neutral-600 dark:prose-p:text-neutral-300 prose-p:leading-relaxed
                  prose-a:text-amber-500 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-neutral-900 dark:prose-strong:text-white
                  prose-code:text-amber-600 dark:prose-code:text-amber-400 prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-neutral-900 dark:prose-pre:bg-neutral-950 prose-pre:border prose-pre:border-neutral-800
                  prose-blockquote:border-l-amber-500 prose-blockquote:bg-amber-500/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r
                  prose-li:text-neutral-600 dark:prose-li:text-neutral-300
                  prose-hr:border-neutral-200 dark:prose-hr:border-neutral-800"
              >
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </article>

      {/* More Posts */}
      <section className="py-16 bg-white dark:bg-neutral-900/50">
        <div className="container px-6 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-sm text-neutral-500 uppercase tracking-widest mb-8">More Posts</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {blogPosts
                .filter(p => p.slug !== post.slug)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link 
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/50 transition-colors group"
                  >
                    <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-amber-500 transition-colors mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-neutral-500 line-clamp-2">{relatedPost.excerpt}</p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
