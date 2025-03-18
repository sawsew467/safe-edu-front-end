import React from "react";

import HeroSection from "@/features/marketing/components/hero";
import FeatureSection from "@/features/marketing/components/features";
import ProductSection from "@/features/marketing/components/product";
import ContentPreview from "@/features/marketing/components/content-preview";
import Contact from "@/features/marketing/components/contact";
import Coverage from "@/features/marketing/components/coverage";

function page() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <ProductSection />
      <ContentPreview />
      <Coverage />
      <Contact />
    </>
  );
}

export default page;
