// components/Hero.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="min-h-[85vh] flex flex-col justify-center items-start gap-6 px-6">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
      >
        StackIt: Where <br />
        <span className="text-gold">Curiosity Meets Community.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-muted max-w-2xl text-lg sm:text-xl"
      >
        Ask questions. Share knowledge. Upvote the best answers.
        Collaborate with developers, students, and creators — all in one place.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="flex gap-4 mt-2"
      >
        <Link href="/ask">
          <Button size="lg" className="font-medium">Get Started</Button>
        </Link>
        <Link href="/questions">
          <Button variant="outline" size="lg" className="font-medium">
            Browse Questions
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default Hero;
