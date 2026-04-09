# ProctorAI Component Library Guide

## 🎯 Quick Start

Visit `/components-showcase` to see all components in action with live examples.

---

## 📦 Available Components

### Core UI Components

#### 1. Button
**File:** `components/ui/button.tsx`

```tsx
import { Button } from "@/components/ui/button";

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="glass">Glass</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon">🚀</Button>
```

**Props:**
- `variant`: "primary" | "secondary" | "outline" | "ghost" | "danger" | "glass" | "link"
- `size`: "sm" | "md" | "lg" | "icon"
- All standard button HTML attributes

---

#### 2. Card
**File:** `components/ui/card.tsx`

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";

<Card size="sm">
  <CardHeader size="sm">
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent size="sm">
    <p>Card content</p>
  </CardContent>
  <CardFooter size="sm">
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Props:**
- `size`: "default" | "sm"
- `hover`: boolean (default: true)

---

#### 3. Badge
**File:** `components/ui/badge.tsx`

```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="outline">Outline</Badge>
```

**Props:**
- `variant`: "default" | "secondary" | "success" | "warning" | "danger" | "outline"

---

#### 4. Input
**File:** `components/ui/input.tsx`

```tsx
import { Input } from "@/components/ui/input";

<Input type="text" placeholder="Enter text..." />
<Input type="email" placeholder="email@example.com" />
<Input type="password" placeholder="••••••••" />
<Input type="time" step="1" />
```

**Features:**
- Focus rings with primary color
- Hover state transitions
- Consistent 44px height
- Rounded-xl borders

---

#### 5. Textarea
**File:** `components/ui/textarea.tsx`

```tsx
import { Textarea } from "@/components/ui/textarea";

<Textarea 
  placeholder="Type your message..." 
  rows={4}
/>
```

**Features:**
- Min height: 120px
- Resize disabled by default
- Focus rings and hover states

---

### Form Components

#### 6. Field Components
**File:** `components/ui/field.tsx`

```tsx
import { 
  FieldGroup, 
  Field, 
  FieldLabel, 
  FieldDescription, 
  FieldError 
} from "@/components/ui/field";

<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" type="email" />
    <FieldDescription>We'll never share your email</FieldDescription>
  </Field>
  
  <Field>
    <FieldLabel htmlFor="password">Password</FieldLabel>
    <Input id="password" type="password" />
    <FieldError>Password is required</FieldError>
  </Field>
</FieldGroup>
```

**Components:**
- `FieldGroup` - Container for multiple fields
- `Field` - Single field wrapper
- `FieldLabel` - Label element
- `FieldDescription` - Help text
- `FieldError` - Error message

---

### Advanced Components

#### 7. Calendar
**File:** `components/ui/calendar.tsx`

```tsx
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const [date, setDate] = useState<Date | undefined>();

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  captionLayout="dropdown"
/>
```

**Features:**
- Single/multiple/range selection
- Dropdown month/year navigation
- Disabled dates support
- Keyboard navigation
- Custom styling

**Dependencies:**
- `react-day-picker`
- `date-fns`

---

#### 8. Popover
**File:** `components/ui/popover.tsx`

```tsx
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Popover content here</p>
  </PopoverContent>
</Popover>
```

**Features:**
- Radix UI primitive
- Animated entry/exit
- Positioning options
- Portal rendering

**Dependencies:**
- `@radix-ui/react-popover`

---

#### 9. Dropdown Menu
**File:** `components/ui/dropdown-menu.tsx`

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Options</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem>Item 1</DropdownMenuItem>
      <DropdownMenuItem>Item 2</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
```

**Features:**
- Checkbox items
- Radio items
- Nested menus
- Keyboard navigation
- Separators and labels

**Dependencies:**
- `@radix-ui/react-dropdown-menu`

---

## 🎨 Design Tokens

### Colors

```css
/* Primary */
--primary: #6366f1 (Electric Indigo)

/* Semantic */
--emerald: #10b981 (Success)
--amber: #f59e0b (Warning)
--rose: #f43f5e (Danger)

/* Backgrounds */
Light: #fafbfc
Dark: #0a0e1a (Deep Night)

/* Cards */
Light: #ffffff
Dark: #141824
```

### Typography

```css
.text-display  → 2-3.5rem, weight: 700
.text-h1       → 1.75-2.5rem, weight: 700
.text-h2       → 1.5-2rem, weight: 600
.text-h3       → 1.25rem, weight: 600
.text-body-lg  → 1rem, weight: 500
.text-body     → 0.875rem, weight: 500
.text-caption  → 0.75rem, weight: 500
.text-xs       → 0.6875rem, weight: 500
```

### Spacing

All spacing uses 8px grid system:
- `gap-2` = 8px
- `gap-4` = 16px
- `gap-6` = 24px
- `gap-8` = 32px

### Border Radius

- `rounded-xl` = 0.75rem (12px) - Inputs, buttons
- `rounded-2xl` = 1rem (16px) - Cards, containers

---

## 📋 Example Patterns

### Date & Time Picker

```tsx
import { DatePickerTime } from "@/components/examples/date-time-picker";

<DatePickerTime />
```

**Features:**
- Calendar popover
- Time input with seconds
- Date formatting
- Responsive layout

---

### Dropdown with Checkboxes

```tsx
import { DropdownMenuCheckboxes } from "@/components/examples/dropdown-menu-example";

<DropdownMenuCheckboxes />
```

---

### Card Examples

```tsx
import { 
  CardSmall, 
  CardDefault, 
  CardStatic, 
  CardCustom, 
  CardGrid 
} from "@/components/examples/card-examples";

<CardSmall />
<CardDefault />
<CardGrid />
```

---

## 🚀 Usage Tips

### 1. Form Validation

```tsx
<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input 
    id="email" 
    type="email"
    className={errors.email ? "border-destructive" : ""}
  />
  {errors.email && (
    <FieldError>{errors.email.message}</FieldError>
  )}
</Field>
```

### 2. Loading States

```tsx
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      Loading...
    </>
  ) : (
    "Submit"
  )}
</Button>
```

### 3. Icon Buttons

```tsx
import { Search } from "lucide-react";

<Button size="icon" variant="ghost">
  <Search className="h-4 w-4" />
</Button>
```

### 4. Card Grids

```tsx
<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
  <Card size="sm">...</Card>
  <Card size="sm">...</Card>
  <Card size="sm">...</Card>
</div>
```

### 5. Status Badges

```tsx
const getStatusBadge = (score: number) => {
  if (score >= 80) return <Badge variant="success">Excellent</Badge>;
  if (score >= 60) return <Badge variant="warning">Good</Badge>;
  return <Badge variant="danger">Poor</Badge>;
};
```

---

## 🎯 Best Practices

### Do's ✅
- Use semantic color variants (success, warning, danger)
- Apply consistent spacing (multiples of 4px)
- Add hover states to interactive elements
- Use proper typography scale
- Implement focus rings for accessibility
- Test in both light and dark modes

### Don'ts ❌
- Don't use arbitrary color values
- Don't mix different border radius values
- Don't forget hover/focus states
- Don't ignore responsive breakpoints
- Don't overuse animations
- Don't skip accessibility attributes

---

## 📚 Resources

- **Component Showcase**: `/components-showcase`
- **Design System Docs**: `UI-UPGRADE.md`
- **shadcn/ui**: https://ui.shadcn.com
- **Radix UI**: https://www.radix-ui.com
- **Lucide Icons**: https://lucide.dev

---

## 🔧 Installation

All components are already installed. To add new Radix UI primitives:

```bash
npm install @radix-ui/react-[primitive-name]
```

---

**Last Updated**: 2026-04-10
**Version**: 2.0.0
