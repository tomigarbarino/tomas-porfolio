// Migrated from the author's published case on 2026-10-10. Product status and
// contributions remain portfolio-declared; demo imagery is not outcome data.
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
    { name: "Structure", title: "Give the knowledge a sequence.", body: "Specialized agents turn source material into a learning sequence.", detail: "Identify themes and relationships, then sequence prerequisites, explanations and examples into a coherent path.", output: "Themes / prerequisites / chapters" },
    { name: "Learn", title: "Make room for different ways to learn.", body: "Chapters, visuals, quizzes and flashcards create multiple learning paths.", detail: "Complementary formats reinforce the same structured content, with narration and live evaluations alongside the learning experience.", output: "Chapters / visuals / quizzes / flashcards" },
    { name: "Validate", title: "Follow the learner’s reasoning.", body: "A live AI interview explores how the learner explains and applies the material.", detail: "The evaluator asks technical questions, requests examples and follows the reasoning behind an answer.", output: "Questions / examples / explanations" },
    { name: "Improve", title: "Bring the evidence back to the team.", body: "Managers see progress and gaps, closing the feedback loop.", detail: "The administrative layer connects individual learning, results and knowledge gaps so managers can inspect the training process.", output: "Progress / results / knowledge gaps" },
  ],
  formats: ["Chapters with structured progression", "Generated visual reinforcement", "Quizzes and flashcards", "Narration and live evaluations"],
  learnings: [
    { label: "Learning", title: "Knowledge is the starting material.", body: "Existing institutional knowledge can be the raw material for faster, contextual training." },
    { label: "Learning", title: "Structure gives the formats a purpose.", body: "Visual variety supports complex content, but structure matters more than content volume." },
    { label: "Next", title: "More context for each learner.", body: "Deeper personalization and industry-specific evaluation patterns." },
    { label: "Next", title: "A more traceable feedback loop.", body: "Richer dashboards, traceability and feedback for managers and learners." },
  ],
} as const;
