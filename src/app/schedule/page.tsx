import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';

const events = [
  { time: '4:00 PM', title: 'Ceremony', description: 'Join us for the wedding ceremony at the beautiful garden venue.' },
  { time: '5:00 PM', title: 'Cocktail Hour', description: 'Enjoy drinks and appetizers while mingling with friends and family.' },
  { time: '6:00 PM', title: 'Reception', description: 'Dinner, dancing, and celebration begin!' },
  { time: '10:00 PM', title: 'End of Evening', description: 'Thank you for celebrating with us!' },
];

export default function Schedule() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-center mb-8">Wedding Day Schedule</h1>
        <p className="text-center text-lg text-muted-foreground mb-12">
          Here&apos;s what to expect on our special day. We can&apos;t wait to celebrate with you!
        </p>
        <div className="space-y-6">
          {events.map((event, index) => (
            <Card key={index} className="flex items-center p-6">
              <div className="flex-shrink-0 w-20 text-center">
                <p className="font-serif text-xl font-bold text-primary">{event.time}</p>
              </div>
              <div className="ml-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <p className="text-muted-foreground">{event.description}</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
