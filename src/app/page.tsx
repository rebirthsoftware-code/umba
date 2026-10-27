import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/home/Ticker";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { DrinkFinder } from "@/components/home/DrinkFinder";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Bento } from "@/components/home/Bento";
import { ProcessStory } from "@/components/home/ProcessStory";
import { FlavorWall } from "@/components/home/FlavorWall";
import { Recipes } from "@/components/home/Recipes";
import { DrinkGallery } from "@/components/home/DrinkGallery";
import { B2BBand } from "@/components/home/B2BBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <CategoryGrid />
      <DrinkFinder />
      <FeaturedProducts />
      <Bento />
      <ProcessStory />
      <FlavorWall />
      <Recipes />
      <DrinkGallery />
      <B2BBand />
    </>
  );
}
