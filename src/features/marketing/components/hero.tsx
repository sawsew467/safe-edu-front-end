import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";

import { Button } from "@/components/ui/button";

function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
      <div className="container px-4 md:px-6 m-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Bảo vệ học sinh, xây dựng môi trường học đường an toàn
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                SafeEdu - Nền tảng giáo dục toàn diện giúp nhận diện và phòng
                chống bạo lực học đường, ma túy và thúc đẩy bình đẳng giới.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                className="gap-1 bg-[#8BC34A] hover:bg-[#7CB342]"
                size="lg"
              >
                Khám phá ngay <ChevronRight className="h-4 w-4" />
              </Button>
              {/* <Button size="lg" variant="outline">
                Tìm hiểu thêm
              </Button> */}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-[300px] h-[600px] md:w-[350px] md:h-[700px] rounded-3xl overflow-hidden border-8 border-gray-800 shadow-xl">
              <div className="absolute top-0 w-full h-6 bg-gray-800 rounded-t-lg" />
              <div className="relative h-full w-full bg-white overflow-hidden">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    fill
                    alt="SafeEdu App Screenshot"
                    className="object-cover"
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Simulator%20Screenshot%20-%20iPhone%2015%20Pro%20Max%20-%202025-03-17%20at%2020.49.12-XkXaCpSXJrcBhLpas4EI62zldq8Upe.png"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 w-full h-6 bg-gray-800 rounded-b-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
