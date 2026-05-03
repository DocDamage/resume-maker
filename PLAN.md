# Resume Builder App — Implementation Plan

## 1. Overview & Goals
Build a modern, client-side resume builder web application that allows users to:
- Create and edit professional resumes through an intuitive form-based interface
- Choose from multiple polished templates
- See a live side-by-side preview
- Export the final resume as a PDF
- Auto-save progress to browser storage

**Scope:** Single-page application (SPA), no backend required. All data stays in the browser.

---

## 2. Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | **React 19 + Vite** | Fast dev, modern, excellent ecosystem |
| Language | **TypeScript** | Type safety, better DX |
| Styling | **Tailwind CSS v4** | Utility-first, rapid UI development |
| Components | **shadcn/ui** | Accessible, beautiful primitives (Button, Input, Card, Select, etc.) |
| State | **Zustand** | Lightweight, no boilerplate |
| Forms | **React Hook Form + Zod** | Validated, type-safe forms |
| PDF Export | **html2canvas + jsPDF** | Client-side PDF generation from DOM |
| Icons | **Lucide React** | Clean, consistent iconography |
| Storage | **localStorage** | Persist drafts across sessions |

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                              │
├──────────────────────────┬──────────────────────────────────┤
│      Editor Panel        │         Preview Panel            │
│  ┌────────────────────┐  │  ┌────────────────────────────┐  │
│  │  SectionNav        │  │  │  ResumePreview             │  │
│  │  (Tabs/Sidebar)    │  │  │  (Live DOM → PDF target)   │  │
│  └────────────────────┘  │  └────────────────────────────┘  │
│  ┌────────────────────┐  │                                  │
│  │  Form Sections     │  │                                  │
│  │  • Personal Info   │  │                                  │
│  │  • Experience      │  │                                  │
│  │  • Education       │  │                                  │
│  │  • Skills          │  │                                  │
│  │  • Projects        │  │                                  │
│  │  • Summary         │  │                                  │
│  └────────────────────┘  │                                  │
└──────────────────────────┴──────────────────────────────────┘
                          │
                    ┌─────┴─────┐
                    │  Zustand  │
                    │   Store   │
                    └─────┬─────┘
                          │
                    ┌─────┴─────┐
                    │ localStorage│
                    └───────────┘
```

---

## 4. Core Features

### Phase 1 — MVP
- [ ] **Personal Info**: Name, title, email, phone, location, LinkedIn, portfolio
- [ ] **Professional Summary**: Rich text / markdown-lite bio
- [ ] **Experience**: Add/remove/edit job entries (company, role, dates, bullets)
- [ ] **Education**: Add/remove/edit school entries (institution, degree, dates, GPA)
- [ ] **Skills**: Categorized skill lists (e.g., Languages, Frameworks, Tools)
- [ ] **Live Preview**: Real-time A4-sized preview panel
- [ ] **PDF Export**: One-click download
- [ ] **Auto-save**: localStorage persistence

### Phase 2 — Polish
- [ ] **3 Resume Templates**: Modern, Classic, Minimal
- [ ] **Drag & Drop**: Reorder experience/education entries
- [ ] **Reorder Sections**: Choose section order (e.g., Skills before Education)
- [ ] **Color Themes**: Primary accent color picker
- [ ] **Font Selection**: Serif / Sans-serif toggle
- [ ] **Import/Export JSON**: Save resume as JSON file, load later

### Phase 3 — Nice-to-Have
- [ ] **ATS Score Checker**: Basic keyword suggestions
- [ ] **Multiple Resumes**: Manage multiple resume profiles
- [ ] **Print Styling**: Optimized `@media print` CSS

---

## 5. Data Model (Zod Schema)

```typescript
// types/resume.ts

export const PersonalInfoSchema = z.object({
  fullName: z.string().min(1),
  title: z.string(),
  email: z.string().email(),
  phone: z.string(),
  location: z.string(),
  website: z.string().url().optional(),
  linkedin: z.string().optional(),
});

export const ExperienceEntrySchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string(), // "YYYY-MM" or "Present"
  endDate: z.string(),
  current: z.boolean().default(false),
  description: z.array(z.string()), // bullet points
});

export const EducationEntrySchema = z.object({
  id: z.string(),
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  gpa: z.string().optional(),
});

export const SkillCategorySchema = z.object({
  id: z.string(),
  category: z.string(),
  skills: z.array(z.string()),
});

export const ResumeSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  title: z.string().default("Untitled Resume"),
  template: z.enum(["modern", "classic", "minimal"]).default("modern"),
  accentColor: z.string().default("#2563eb"),
  font: z.enum(["sans", "serif"]).default("sans"),
  sectionOrder: z.array(z.string()),
  personal: PersonalInfoSchema,
  summary: z.string(),
  experience: z.array(ExperienceEntrySchema),
  education: z.array(EducationEntrySchema),
  skills: z.array(SkillCategorySchema),
  projects: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    link: z.string().optional(),
  })),
});

export type Resume = z.infer<typeof ResumeSchema>;
```

---

## 6. Component Inventory

### shadcn/ui Components to Install
```bash
npx shadcn add button input textarea label card tabs badge separator
npx shadcn add scroll-area collapsible dropdown-menu
```

### Custom Components
| Component | Purpose |
|-----------|---------|
| `AppLayout` | Split-pane layout (editor left, preview right) |
| `SectionNav` | Vertical navigation for form sections |
| `PersonalInfoForm` | Form for personal details |
| `ExperienceForm` | Add/edit job history with bullet list editor |
| `EducationForm` | Add/edit education entries |
| `SkillsForm` | Tag-based skill input per category |
| `ResumePreview` | A4-sized live DOM preview |
| `TemplateModern` | Modern template component |
| `TemplateClassic` | Classic template component |
| `TemplateMinimal` | Minimal template component |
| `ExportButton` | PDF export trigger with loading state |
| `ColorPicker` | Simple accent color selector |

---

## 7. State Management (Zustand)

```typescript
// stores/resumeStore.ts
interface ResumeStore {
  resume: Resume;
  activeSection: string;
  setPersonal: (data: PersonalInfo) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<ExperienceEntry>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<EducationEntry>) => void;
  removeEducation: (id: string) => void;
  setTemplate: (template: Resume["template"]) => void;
  setAccentColor: (color: string) => void;
  reorderSections: (order: string[]) => void;
  loadResume: (json: string) => void;
}
```

---

## 8. PDF Export Strategy

Use `html2canvas` to rasterize the preview DOM node, then `jsPDF` to embed it as a PDF.

```typescript
// utils/exportPdf.ts
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportToPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${filename}.pdf`);
}
```

---

## 9. Project File Structure

```
resume-maker/
├── public/
│   └── fonts/               # Optional custom fonts
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── SectionNav.tsx
│   │   │   └── Header.tsx
│   │   ├── forms/
│   │   │   ├── PersonalInfoForm.tsx
│   │   │   ├── ExperienceForm.tsx
│   │   │   ├── EducationForm.tsx
│   │   │   ├── SkillsForm.tsx
│   │   │   ├── ProjectsForm.tsx
│   │   │   └── SummaryForm.tsx
│   │   ├── preview/
│   │   │   ├── ResumePreview.tsx
│   │   │   ├── TemplateModern.tsx
│   │   │   ├── TemplateClassic.tsx
│   │   │   └── TemplateMinimal.tsx
│   │   └── shared/
│   │       ├── ExportButton.tsx
│   │       ├── ColorPicker.tsx
│   │       └── ReorderableList.tsx
│   ├── stores/
│   │   └── resumeStore.ts
│   ├── types/
│   │   └── resume.ts
│   ├── utils/
│   │   ├── exportPdf.ts
│   │   ├── storage.ts       # localStorage helpers
│   │   └── helpers.ts
│   ├── constants/
│   │   └── defaults.ts      # Default resume data
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── components.json          # shadcn config
└── package.json
```

---

## 10. Implementation Roadmap

| Step | Task | Time Est. |
|------|------|-----------|
| 1 | Initialize Vite + React + TS project | 5 min |
| 2 | Install Tailwind CSS v4 | 5 min |
| 3 | Initialize shadcn/ui | 5 min |
| 4 | Install dependencies (Zustand, RHF, Zod, etc.) | 5 min |
| 5 | Define Zod schemas & types | 15 min |
| 6 | Build Zustand store with localStorage sync | 20 min |
| 7 | Create AppLayout with split panes | 15 min |
| 8 | Build all form sections | 60 min |
| 9 | Build ResumePreview + 1 template | 30 min |
| 10 | Add PDF export functionality | 15 min |
| 11 | Add 2 more templates | 30 min |
| 12 | Polish: themes, fonts, drag-and-drop | 30 min |
| 13 | Test export quality & fix layout issues | 20 min |
| **Total** | | **~4.5 hours** |

---

## 11. Design Tokens

```css
/* A4 Page Dimensions */
--page-width: 210mm;
--page-height: 297mm;
--page-padding: 24mm;

/* Colors (Tailwind defaults) */
--accent: var(--user-selected, #2563eb);
--text-primary: #0f172a;
--text-secondary: #64748b;
--border: #e2e8f0;

/* Typography */
font-sans: "Inter", system-ui, sans-serif;
font-serif: "Georgia", "Times New Roman", serif;
```

---

## 12. Next Step

Ready to start implementation? Run:
```bash
npm create vite@latest . -- --template react-ts
```

Or I can scaffold the entire project for you right now.
