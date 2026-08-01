import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "ViuPace transformed how our engineering team tracks execution velocity. We cut sprint bottlenecks by over 40% in our first month.",
    author: "Sarah Lin",
    role: "VP of Engineering at FinScale",
    avatar: "SL",
    rating: 5,
  },
  {
    quote: "The real-time telemetry and clean UI make it indispensable. Having our top right dashboard available instantly gives us full clarity.",
    author: "Marcus Vance",
    role: "Co-Founder & CTO at CloudPulse",
    avatar: "MV",
    rating: 5,
  },
  {
    quote: "Setup took less than 2 minutes. The automated workflows and alerts saved our team hundreds of engineering hours.",
    author: "Elena Rostova",
    role: "Head of Product at DataFlow",
    avatar: "ER",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-24 bg-zinc-50/60 border-b border-zinc-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Loved by Modern Teams
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Trusted by fast-moving companies worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between bg-white p-8 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-700 leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-zinc-100 mt-6">
                <Avatar className="h-10 w-10 border border-zinc-200">
                  <AvatarFallback className="bg-blue-600 text-white font-semibold text-xs">
                    {item.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">{item.author}</h4>
                  <p className="text-xs text-zinc-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
