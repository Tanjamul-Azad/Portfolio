import data from "@/content/testimonials.json";
import type { Testimonial } from "@/types";

export const testimonials: Testimonial[] = data as Testimonial[];

export const getTestimonials = () => testimonials;
