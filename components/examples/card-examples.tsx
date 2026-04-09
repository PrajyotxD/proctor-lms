import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Small Card Example
export function CardSmall() {
  return (
    <Card size="sm" className="mx-auto w-full max-w-sm">
      <CardHeader size="sm">
        <CardTitle>Small Card</CardTitle>
        <CardDescription>This card uses the small size variant.</CardDescription>
      </CardHeader>
      <CardContent size="sm">
        <p>The card component supports a size prop that can be set to &quot;sm&quot; for a more compact appearance.</p>
      </CardContent>
      <CardFooter size="sm">
        <Button variant="outline" size="sm" className="w-full">
          Action
        </Button>
      </CardFooter>
    </Card>
  );
}

// Default Card Example
export function CardDefault() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
        <CardDescription>This is the standard card size with more spacing.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          The default card provides comfortable spacing for content and is ideal for most use cases.
          It includes hover effects by default.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="primary" className="flex-1">
          Primary Action
        </Button>
        <Button variant="outline" className="flex-1">
          Secondary
        </Button>
      </CardFooter>
    </Card>
  );
}

// Card Without Hover
export function CardStatic() {
  return (
    <Card hover={false} className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Static Card</CardTitle>
        <CardDescription>This card has hover effects disabled.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Use <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">hover=false</code> for cards that don&apos;t need interactive effects.
        </p>
      </CardContent>
    </Card>
  );
}

// Card with Custom Styling
export function CardCustom() {
  return (
    <Card className="mx-auto w-full max-w-md border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="gradient-text">Custom Styled Card</CardTitle>
        <CardDescription>Cards can be customized with Tailwind classes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
              ✓
            </div>
            <div>
              <p className="text-sm font-semibold">Feature One</p>
              <p className="text-xs text-muted-foreground">Custom border and gradient background</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              ✓
            </div>
            <div>
              <p className="text-sm font-semibold">Feature Two</p>
              <p className="text-xs text-muted-foreground">Gradient text on title</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Get Started</Button>
      </CardFooter>
    </Card>
  );
}

// Grid of Cards
export function CardGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <Card size="sm">
        <CardHeader size="sm">
          <CardTitle>Card 1</CardTitle>
          <CardDescription>Small card in a grid</CardDescription>
        </CardHeader>
        <CardContent size="sm">
          <p className="text-xs text-muted-foreground">Compact content area</p>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader size="sm">
          <CardTitle>Card 2</CardTitle>
          <CardDescription>Another small card</CardDescription>
        </CardHeader>
        <CardContent size="sm">
          <p className="text-xs text-muted-foreground">Consistent spacing</p>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader size="sm">
          <CardTitle>Card 3</CardTitle>
          <CardDescription>Third card</CardDescription>
        </CardHeader>
        <CardContent size="sm">
          <p className="text-xs text-muted-foreground">Perfect for dashboards</p>
        </CardContent>
      </Card>
    </div>
  );
}
