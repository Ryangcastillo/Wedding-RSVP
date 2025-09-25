import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';

export default function Story() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-center mb-8">Our Story</h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How We Met</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Loren and Billy met during their college years at a local coffee shop. What started as a chance encounter over lattes turned into late-night study sessions and weekend adventures. Their shared love for hiking, good food, and deep conversations brought them closer, and they knew they had found something special.
            </p>
          </CardContent>
        </Card>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>The Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              On a beautiful summer evening, Billy surprised Loren with a picnic at their favorite spot overlooking the city. As the sun set, he got down on one knee and asked the question that would change their lives forever. It was the perfect moment, filled with love and laughter.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Looking Forward</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We&apos;re excited to celebrate this new chapter with all of you. Your presence means the world to us, and we can&apos;t wait to create memories that will last a lifetime.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
