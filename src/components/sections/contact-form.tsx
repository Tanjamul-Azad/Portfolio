"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MESSAGE_MAX,
  NAME_MAX,
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations";
import { toast } from "sonner";
import { Shield, Send } from "lucide-react";

export function ContactForm() {
  const [honeypot, setHoneypot] = useState("");
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const messageLength = form.watch("message")?.length ?? 0;

  async function onSubmit(values: ContactFormValues) {
    // Honeypot spam protection - if filled, it's a bot
    if (honeypot) {
      // Silently reject spam
      toast.success("Message sent successfully!");
      form.reset();
      return;
    }
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast.success("Message sent successfully! I'll get back to you soon.");
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Failed to send message. Please try again."
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Honeypot field - hidden from real users, bots will fill it */}
        <div
          className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0"
          aria-hidden="true"
        >
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-600 dark:text-neutral-300">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  autoComplete="name"
                  maxLength={NAME_MAX}
                  {...field}
                  className="bg-neutral-100/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-neutral-900 dark:focus:border-white focus:ring-neutral-900/10 dark:focus:ring-white/10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-600 dark:text-neutral-300">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  {...field}
                  className="bg-neutral-100/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-neutral-900 dark:focus:border-white focus:ring-neutral-900/10 dark:focus:ring-white/10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-baseline justify-between gap-3">
                <FormLabel className="text-neutral-600 dark:text-neutral-300">Message</FormLabel>
                <span
                  className={`text-xs tabular-nums ${
                    messageLength > MESSAGE_MAX
                      ? "text-red-500"
                      : "text-neutral-400 dark:text-neutral-500"
                  }`}
                >
                  {messageLength}/{MESSAGE_MAX}
                </span>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Tell me how I can help"
                  autoComplete="off"
                  maxLength={MESSAGE_MAX}
                  className="min-h-25 resize-y bg-neutral-100/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-neutral-900 dark:focus:border-white focus:ring-neutral-900/10 dark:focus:ring-white/10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button
          type="submit"
          className="group w-full rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 relative overflow-hidden"
          disabled={form.formState.isSubmitting}
        >
          <span className="relative flex items-center justify-center">
            {form.formState.isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                Send Message
              </>
            )}
          </span>
        </Button>
        
        {/* Spam protection notice */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <Shield className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            Protected by spam filters
          </span>
        </div>
      </form>
    </Form>
  );
}
