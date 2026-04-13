# To-Do List Web App Specification

## Project Overview
- **Project name**: TaskFlow
- **Type**: Single-page web application
- **Core functionality**: Simple task management with add, complete, and delete features
- **Target users**: Students and beginners

## UI/UX Specification

### Layout Structure
- **Container**: Centered card (max-width: 480px)
- **Sections**:
  - Header: App title + subtitle
  - Input area: Text input + add button (horizontal)
  - Task list: Scrollable list area

### Responsive Breakpoints
- **Desktop**: Full layout with comfortable spacing
- **Mobile** (< 480px): Full-width, adjusted padding

### Visual Design

#### Color Palette
- **Primary**: `#3B82F6` (Blue)
- **Primary Hover**: `#2563EB` (Darker Blue)
- **Secondary**: `#EFF6FF` (Light Blue Background)
- **Accent**: `#10B981` (Green - completed state)
- **Danger**: `#EF4444` (Red - delete)
- **Background**: `#F8FAFC` (Off-white)
- **Card Background**: `#FFFFFF` (White)
- **Text Primary**: `#1E293B` (Dark slate)
- **Text Secondary**: `#64748B` (Gray)
- **Border**: `#E2E8F0` (Light gray)

#### Typography
- **Font Family**: "Inter", system-ui, sans-serif
- **Title**: 28px, font-weight 700
- **Subtitle**: 14px, font-weight 400
- **Task text**: 16px, font-weight 500
- **Button text**: 16px, font-weight 600

#### Spacing System
- **Card padding**: 32px
- **Section gap**: 24px
- **Task item padding**: 16px
- **Task item margin**: 8px

#### Visual Effects
- **Card shadow**: `0 10px 40px rgba(59, 130, 246, 0.15)`
- **Button shadow**: `0 4px 12px rgba(59, 130, 246, 0.3)`
- **Border radius**: 12px (cards), 8px (buttons), 50% (checkboxes)

### Components

#### Input Area
- Text input: Full width minus button, rounded, subtle border
- Add button: Blue background, white text, icon (+)

#### Task Item
- Container: White background, subtle border, rounded
- Checkbox: Custom circular, blue when checked
- Text: Left of checkbox, strikethrough when completed
- Delete button: Red on hover, trash icon

#### States
- **Default**: Clean, minimal
- **Hover**: Slight scale or shadow increase
- **Completed**: Strikethrough text, muted color
- **Empty state**: Friendly message with icon

### Animations
- Task add: Fade in + slide up
- Task delete: Fade out + slide
- Hover: 0.2s ease transition
- Checkbox: Scale bounce on check

## Functionality Specification

### Core Features
1. Add new task (Enter key or button click)
2. Mark task as complete (toggle checkbox)
3. Delete task (click delete button)
4. Empty state message when no tasks

### User Interactions
- Type task in input → Press Enter or click Add → Task appears in list
- Click checkbox → Task marked complete with visual feedback
- Click delete → Task removed with animation

### Edge Cases
- Empty input: Prevent adding, show subtle feedback
- Whitespace only: Trim and validate

## Acceptance Criteria
- [ ] Blue and white theme applied consistently
- [ ] Responsive on mobile and desktop
- [ ] Add task works with Enter and button
- [ ] Complete toggle works smoothly
- [ ] Delete removes task properly
- [ ] Empty state shows friendly message
- [ ] All hover effects visible
- [ ] Clean spacing and alignment throughout