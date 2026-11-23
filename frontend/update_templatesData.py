import sys

with open(r'x:\Project-Buildings\StudyHub\frontend\lib\data\templatesData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add PlacementJourneyStep to imports
if 'PlacementJourneyStep' not in content:
    content = content.replace('TemplateWorkspaceData,\n} from "@/types";', 'TemplateWorkspaceData,\n  PlacementJourneyStep,\n} from "@/types";')

# Define new placement journey steps array to add to the end of the file
placement_journey_steps_code = """
export const placementJourneySteps: PlacementJourneyStep[] = [
  {
    id: "step-1",
    stepNumber: "01",
    title: "Master the 1-Page Resume",
    description: "Your resume is your ticket to the interview. Use the SDE ATS template to ensure you pass screening.",
    relatedTemplateId: "sde-resume",
    isCompleted: true,
  },
  {
    id: "step-2",
    stepNumber: "02",
    title: "Prepare Your Project Walkthrough",
    description: "Every technical interview starts with 'tell me about a project'. Script a 2-minute overview.",
    relatedTemplateId: "project-walkthrough",
    isCompleted: false,
  },
  {
    id: "step-3",
    stepNumber: "03",
    title: "Map the STAR Matrix",
    description: "Prepare 5 core stories that map to 15 different behavioral questions to avoid getting caught off-guard.",
    relatedTemplateId: "star-matrix",
    isCompleted: false,
  }
];
"""

if 'placementJourneySteps' not in content:
    content = content + "\n" + placement_journey_steps_code

# We also need to add `previewData` and `isRecommended` for some templates in `templateLibrary`.
# Since python string replacement is tricky, let's just write to file directly.
content = content.replace(
'''    badge: "Most Used",
    content: "sde-resume",''',
'''    badge: "Most Used",
    isRecommended: true,
    previewData: {
      whatYouWillCreate: ["A 1-page ATS-compliant resume", "Action-verb bullet points", "Clear technical skills section"],
      bestFor: ["Software Engineering Roles", "Product Companies", "Campus Placements"],
      previewType: "resume",
      previewSections: [
        { title: "Education", content: "Degree, University, CGPA, Expected Graduation" },
        { title: "Skills", content: "Languages, Frameworks, Tools, Databases" },
        { title: "Projects", content: "Project Name, Tech Stack, 2-3 impact bullet points" }
      ]
    },
    content: "sde-resume",''')

content = content.replace(
'''    tags: ["Verbal", "System Design"],
    content: "project-walkthrough",''',
'''    tags: ["Verbal", "System Design"],
    isRecommended: true,
    previewData: {
      whatYouWillCreate: ["A 2-minute verbal script", "Clear problem statement", "Architectural decisions"],
      bestFor: ["Technical Interviews", "System Design Rounds"],
      previewType: "generic",
      previewSections: [
        { title: "The Context", content: "What was the problem?" },
        { title: "The Architecture", content: "What tech did you use and why?" },
        { title: "The Challenge", content: "What was the hardest bug to fix?" },
        { title: "The Result", content: "What was the final outcome/metric?" }
      ]
    },
    content: "project-walkthrough",''')


with open(r'x:\Project-Buildings\StudyHub\frontend\lib\data\templatesData.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done templatesData")
