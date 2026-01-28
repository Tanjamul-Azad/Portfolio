import type { Testimonial } from "@/types";

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    role: "Professor of Computer Science",
    company: "University of Dhaka",
    content: "Tanjamul consistently demonstrated exceptional problem-solving skills and a deep understanding of modern web technologies. His capstone project was one of the most polished I've seen in years. He has a rare combination of technical ability and design sensibility.",
    rating: 5,
  },
  {
    id: "2",
    name: "Ahmed Rahman",
    role: "Tech Lead",
    company: "StartupBD",
    content: "Working with Tanjamul on our dashboard project was a pleasure. He delivered clean, maintainable code ahead of schedule and proactively suggested UX improvements that significantly increased user engagement. I'd hire him again in a heartbeat.",
    rating: 5,
  },
  {
    id: "3",
    name: "Maria Santos",
    role: "Product Manager",
    company: "Freelance Client",
    content: "Tanjamul transformed our outdated website into a modern, fast, and beautiful experience. His communication was excellent throughout the project, and he went above and beyond to ensure everything was pixel-perfect. Highly recommended!",
    rating: 5,
  },
];

export const getTestimonials = () => testimonials;
