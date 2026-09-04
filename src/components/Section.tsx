import { motion } from "motion/react";
import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  description,
  children,
  className = "",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 ${className}`}>
      {(eyebrow || title) && (
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 max-w-2xl"
        >
          {eyebrow && <p className="text-xs uppercase tracking-[0.28em] text-primary">{eyebrow}</p>}
          {title && (
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              {title}
            </h2>
          )}
          {description && <p className="mt-3 text-muted-foreground">{description}</p>}
        </motion.header>
      )}
      {children}
    </section>
  );
}
