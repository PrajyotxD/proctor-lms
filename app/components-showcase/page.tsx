import { CardSmall, CardDefault, CardStatic, CardCustom, CardGrid } from "@/components/examples/card-examples";
import { DatePickerTime } from "@/components/examples/date-time-picker";
import { DropdownMenuCheckboxes } from "@/components/examples/dropdown-menu-example";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";

export default function ComponentsShowcase() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="text-center">
        <Badge className="mb-4">Component Library</Badge>
        <h1 className="text-display mb-4">ProctorAI Design System</h1>
        <p className="text-body-lg mx-auto max-w-2xl text-balance text-muted-foreground">
          A comprehensive collection of high-tech SaaS components built with shadcn/ui patterns
        </p>
      </section>

      {/* Buttons */}
      <section className="space-y-6">
        <div>
          <h2 className="text-h2 mb-2">Buttons</h2>
          <p className="text-body text-muted-foreground">7 variants with 4 size options</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>All available button styles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="glass">Glass</Button>
              <Button variant="link">Link</Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">🚀</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Badges */}
      <section className="space-y-6">
        <div>
          <h2 className="text-h2 mb-2">Badges</h2>
          <p className="text-body text-muted-foreground">Semantic status indicators</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Badge Variants</CardTitle>
            <CardDescription>Color-coded status badges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cards */}
      <section className="space-y-6">
        <div>
          <h2 className="text-h2 mb-2">Cards</h2>
          <p className="text-body text-muted-foreground">Flexible container components with size variants</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <CardSmall />
          <CardDefault />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <CardStatic />
          <CardCustom />
        </div>
        
        <CardGrid />
      </section>

      {/* Forms */}
      <section className="space-y-6">
        <div>
          <h2 className="text-h2 mb-2">Form Components</h2>
          <p className="text-body text-muted-foreground">Inputs, textareas, and field wrappers</p>
        </div>
        
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Form Example</CardTitle>
            <CardDescription>Complete form with field components</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input id="name" placeholder="John Doe" />
                <FieldDescription>Enter your full legal name</FieldDescription>
              </Field>
              
              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input id="email" type="email" placeholder="john@example.com" />
              </Field>
              
              <Field>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <Textarea id="message" placeholder="Type your message here..." />
                <FieldDescription>Maximum 500 characters</FieldDescription>
              </Field>
              
              <Button className="w-full">Submit Form</Button>
            </FieldGroup>
          </CardContent>
        </Card>
      </section>

      {/* Date & Time Picker */}
      <section className="space-y-6">
        <div>
          <h2 className="text-h2 mb-2">Date & Time Picker</h2>
          <p className="text-body text-muted-foreground">Calendar popover with time input</p>
        </div>
        
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Schedule Exam</CardTitle>
            <CardDescription>Select date and time for the exam</CardDescription>
          </CardHeader>
          <CardContent>
            <DatePickerTime />
          </CardContent>
        </Card>
      </section>

      {/* Dropdown Menu */}
      <section className="space-y-6">
        <div>
          <h2 className="text-h2 mb-2">Dropdown Menu</h2>
          <p className="text-body text-muted-foreground">Contextual menus with checkboxes and radio items</p>
        </div>
        
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Menu Example</CardTitle>
            <CardDescription>Dropdown with checkbox items</CardDescription>
          </CardHeader>
          <CardContent>
            <DropdownMenuCheckboxes />
          </CardContent>
        </Card>
      </section>

      {/* Typography */}
      <section className="space-y-6">
        <div>
          <h2 className="text-h2 mb-2">Typography</h2>
          <p className="text-body text-muted-foreground">8-level type scale with Geist Sans</p>
        </div>
        
        <Card>
          <CardContent className="space-y-4 py-8">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Display</p>
              <h1 className="text-display">The quick brown fox</h1>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">H1</p>
              <h1 className="text-h1">The quick brown fox</h1>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">H2</p>
              <h2 className="text-h2">The quick brown fox</h2>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">H3</p>
              <h3 className="text-h3">The quick brown fox</h3>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Body Large</p>
              <p className="text-body-lg">The quick brown fox jumps over the lazy dog</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Body</p>
              <p className="text-body">The quick brown fox jumps over the lazy dog</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Caption</p>
              <p className="text-caption">The quick brown fox jumps over the lazy dog</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Extra Small</p>
              <p className="text-xs">The quick brown fox jumps over the lazy dog</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Colors */}
      <section className="space-y-6">
        <div>
          <h2 className="text-h2 mb-2">Color Palette</h2>
          <p className="text-body text-muted-foreground">High-tech SaaS color system</p>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="mb-3 h-16 rounded-xl bg-primary" />
              <p className="text-sm font-semibold">Primary</p>
              <p className="text-xs text-muted-foreground">#6366f1</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="mb-3 h-16 rounded-xl bg-emerald-500" />
              <p className="text-sm font-semibold">Success</p>
              <p className="text-xs text-muted-foreground">#10b981</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="mb-3 h-16 rounded-xl bg-amber-500" />
              <p className="text-sm font-semibold">Warning</p>
              <p className="text-xs text-muted-foreground">#f59e0b</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="mb-3 h-16 rounded-xl bg-rose-500" />
              <p className="text-sm font-semibold">Danger</p>
              <p className="text-xs text-muted-foreground">#f43f5e</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
