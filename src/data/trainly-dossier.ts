// Published case enriched with the approved 2026-10-13 real-interface package.
// Demo fixtures show product behavior, not measured client outcomes.
export const trainlyDossier = {
  source: "https://tomas-garbarino.vercel.app/en/trainly",
  sections: [
    { id: "challenge", label: "Challenge" },
    { id: "loop", label: "Product loop" },
    { id: "experience", label: "Experience" },
    { id: "validation", label: "Validation" },
    { id: "system", label: "System" },
    { id: "learnings", label: "Learnings" },
  ],
  challenges: [
    "Operational knowledge is scattered across PDFs, manuals and processes.",
    "Building and updating courses manually makes training slow to scale.",
    "Attendance and multiple-choice scores reveal little about real reasoning.",
    "Managers lack a clear view of understanding and knowledge gaps.",
  ],
  stages: [
    { name: "Source", title: "Start with what the company knows.", body: "Upload manuals, procedures and existing operational knowledge.", detail: "The source material gives the training its context: the processes and knowledge a team actually needs.", output: "Manuals / procedures / documents" },
    { name: "Structure", title: "Review the plan before generating.", body: "The AI proposes chapters with references back to the source material.", detail: "Conflicting sources create a blocking decision. The training owner resolves it before approving the plan and generating the course.", output: "Source references / plan / human approval" },
    { name: "Learn", title: "Make room for different ways to learn.", body: "Chapters, visuals, quizzes and flashcards support the learning path.", detail: "Narrated lessons pair the current slide with a contextual tutor. Learners can ask for an explanation, an example or a practice question.", output: "Chapters / narration / contextual tutor" },
    { name: "Validate", title: "Follow the learner’s reasoning.", body: "A live AI interview explores how the learner explains and applies the material.", detail: "The evaluator asks technical questions, requests examples and follows the reasoning behind an answer.", output: "Questions / examples / explanations" },
    { name: "Improve", title: "Give the manager a next action.", body: "Progress and overdue assignments become cases to act on.", detail: "The manager can inspect a priority case, follow up or send a reminder, with active study time alongside the learning progress.", output: "Priority cases / follow-up / reminders" },
  ],
  formats: ["Chapters with structured progression", "Presentations and visual reinforcement", "Quizzes and flashcards", "Narration and contextual tutor"],
  learnings: [
    { label: "Learning", title: "The source can disagree with itself.", body: "A traceable plan makes a contradiction visible before it becomes a course. Human review belongs in the generation flow." },
    { label: "Learning", title: "Visibility needs a next action.", body: "A priority case with follow-up or reminder actions gives the manager a concrete way to help a learner." },
    { label: "Next", title: "Help the learner recover.", body: "Quiz feedback currently marks an incorrect answer without explaining it. Clear recovery guidance is the next opportunity." },
    { label: "Next", title: "Measure what the tutor retrieves.", body: "Use real questions and a source-grounded evaluation set to check retrieval before deciding that a different model is the answer." },
  ],
} as const;
