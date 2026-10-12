import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

const IMAGE_ALTS = [
  "Flood resilience project photograph from Nepal, slide 1",
  "Flood resilience project photograph from Nepal, slide 2",
  "Flood resilience project photograph from Nepal, slide 3",
  "Flood resilience project photograph from Nepal, slide 4",
  "Flood resilience project photograph from Nepal, slide 5",
  "Flood resilience project photograph from Nepal, slide 6",
  "Flood resilience project photograph from Nepal, slide 7",
  "Flood resilience project photograph from Nepal, slide 8",
];
const IMAGES = IMAGE_ALTS.map((alt, index) => ({ src: `/flood-images/flood-${index + 1}.jpeg`, alt }));

const INTERVAL_MS = 4500;

export function FloodImageCarousel() {
  const { t } = useI18n();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    timer.current = window.setInterval(() => setCurrent((slide) => (slide + 1) % IMAGES.length), INTERVAL_MS);
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
      timer.current = null;
    };
  }, [paused, reducedMotion]);

  const goTo = (index: number) => setCurrent((index + IMAGES.length) % IMAGES.length);
  const previous = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  return (
    <section
      aria-label={t("carousel.label")}
      className="relative overflow-hidden rounded-xl border bg-card shadow-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="relative aspect-[16/8] min-h-56 sm:min-h-72 lg:min-h-80">
        {IMAGES.map((image, index) => (
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${index === current ? "opacity-100" : "pointer-events-none opacity-0"}`}
            loading={index === 0 ? "eager" : "lazy"}
            aria-hidden={index !== current}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/60 to-transparent px-4 pb-4 pt-12">
          <p className="text-sm font-medium text-white">{t("carousel.caption")}</p>
          <span className="shrink-0 text-xs text-white/90">{current + 1} / {IMAGES.length}</span>
        </div>
        <button type="button" onClick={previous} aria-label={t("carousel.previous")} className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-white">
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={next} aria-label={t("carousel.next")} className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-white">
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div className="flex items-center justify-center gap-2 px-4 py-3" role="tablist" aria-label={t("carousel.selectSlide")}>
        {IMAGES.map((image, index) => (
          <button
            key={image.src}
            type="button"
            role="tab"
            aria-selected={index === current}
            aria-label={`${t("carousel.slide")} ${index + 1}`}
            onClick={() => goTo(index)}
            className={`size-2.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${index === current ? "bg-teal" : "bg-muted-foreground/40 hover:bg-muted-foreground/70"}`}
          />
        ))}
      </div>
    </section>
  );
}
