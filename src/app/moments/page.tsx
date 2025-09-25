import { HeroCarousel } from '@/shared/components/hero-carousel';

export default function Moments() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-center mb-8">Our Moments</h1>
        <p className="text-center text-lg text-muted-foreground mb-12">
          Relive the special moments that led us here. From our first date to the engagement, these are the memories we cherish.
        </p>
        <HeroCarousel />
      </div>
    </div>
  );
}
