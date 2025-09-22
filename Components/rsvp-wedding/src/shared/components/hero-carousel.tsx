import * as React from "react";
import { Card, CardContent } from "./card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

const images = [
  "/file.svg",
  "/globe.svg",
  "/next.svg",
  "/vercel.svg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCSsmmS850q0oN_cB1a1V-18LAOtyy_YCjOj73i3edW6ILOdRLRRM6-U31sjXhft6HI3aPY6oWdIgcriTqrtRx0afRSVt_03pqTXzmcry_YvaFRLUdl87ZzAFbWw7prNqm1KP1A1lOYzqO41Nl6P6I4dz-4CQxUUZelLh-nARsgR_CFfJdR9Idz-nOup5A2tQ_hAzMRPQPXKHIv4oPmL-gprDKaDKULgoUzkLiPeW3uKa9NQ3v81ffMW8Ph08NbuIZ8Raar3KfGXHM"
];

export function HeroCarousel() {
  return (
    <section className="w-full flex flex-col items-center py-10">
      <h1 className="text-4xl font-serif font-bold text-primary mb-6 text-center">Olivia &amp; Liam Wedding Moments</h1>
      <Carousel className="w-full max-w-2xl" opts={{ align: "start" }}>
        <CarouselContent className="-ml-1">
          {images.map((src, index) => (
            <CarouselItem key={index} className="pl-1 basis-1/3">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Photo ${index + 1}`} className="rounded-lg object-cover w-full h-full" />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
