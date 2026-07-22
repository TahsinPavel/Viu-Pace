import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950 p-6">
      <main className="flex flex-col items-center justify-center w-full max-w-3xl gap-8 py-16 px-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 text-center sm:text-left">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={140}
          height={30}
          priority
        />
        <div className="flex flex-col items-center sm:items-start gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            ViuPace Frontend
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-lg">
            Built with Next.js (App Router), TypeScript, Tailwind CSS, and Shadcn UI.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">Documentation</Button>
        </div>
      </main>
    </div>
  );
}

