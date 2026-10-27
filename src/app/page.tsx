import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/home/Ticker";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { DrinkFinder } from "@/components/home/DrinkFinder";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Values } from "@/components/home/Values";
import { ProcessStory } from "@/components/home/ProcessStory";
import { FlavorWall } from "@/components/home/FlavorWall";
import { Recipes } from "@/components/home/Recipes";
import { B2BBand } from "@/components/home/B2BBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <CategoryGrid />
      <DrinkFinder />
      <FeaturedProducts />
      <Values />
      <ProcessStory />
      <FlavorWall />
      <Recipes />
      <B2BBand />
    </>
  );
}
