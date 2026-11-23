import sys

with open(r'x:\Project-Buildings\StudyHub\frontend\types\index.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    if 'export interface TemplateItem {' in line:
        # replace the whole interface
        new_lines.append('''export interface TemplateItem {
  id: string;
  title: string;
  description: string;
  category: string;
  targetRole: string;
  estimatedTime: string;
  tags: string[];
  badge?: string;
  isRecommended?: boolean;
  previewData?: TemplatePreviewData;
  content: string; // The raw template text or ID mapping
}
''')
        while i < len(lines) and lines[i].strip() != '}':
            i += 1
    elif 'export interface TemplateDraft {' in line:
        new_lines.append('''export interface TemplateDraft {
  id: string;
  templateId?: string;
  title: string;
  description: string;
  category?: string;
  targetRole: string;
  progress: number;
  lastEdited: string;
  href: string;
  status?: "Draft" | "Ready" | "Completed";
  estimatedTime?: string;
}
''')
        while i < len(lines) and lines[i].strip() != '}':
            i += 1
    elif 'export interface TemplateWorkspaceData {' in line:
        new_lines.append('''export interface TemplateSectionSchema {
  key: string;
  title: string;
  type: "text" | "textarea" | "list" | "metrics";
  placeholder?: string;
  value?: string | string[];
}

export interface TemplateWorkspaceData {
  id: string;
  title: string;
  category: string;
  fields: { key: string; label: string; placeholder: string; value: string }[];
  structure: { section: string; body: string }[];
  schema?: TemplateSectionSchema[];
}

export interface PlacementJourneyStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  relatedTemplateId?: string;
  isCompleted?: boolean;
}
''')
        while i < len(lines) and lines[i].strip() != '}':
            i += 1
    else:
        new_lines.append(line)
    i += 1

with open(r'x:\Project-Buildings\StudyHub\frontend\types\index.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Done")
