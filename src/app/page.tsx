import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FlavorWall } from "@/components/home/FlavorWall";
import { WhyUmba } from "@/components/home/WhyUmba";
import { Recipes } from "@/components/home/Recipes";
import { B2BBand } from "@/components/home/B2BBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryGrid />
      <FeaturedProducts />
      <FlavorWall />
      <WhyUmba />
      <Recipes />
      <B2BBand />
    </>
  );
}
