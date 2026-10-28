import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/home/Ticker";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CoffeeStory } from "@/components/home/CoffeeStory";
import { Values } from "@/components/home/Values";
import { ProcessStory } from "@/components/home/ProcessStory";
import { B2BBand } from "@/components/home/B2BBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <CategoryGrid />
      <CoffeeStory />
      <FeaturedProducts />
      <Values />
      <ProcessStory />
      <B2BBand />
    </>
  );
}
