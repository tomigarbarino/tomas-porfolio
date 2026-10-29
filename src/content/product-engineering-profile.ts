type ProofCard = {
  title: string;
  claim: string;
  attribution: string;
  limitation: string;
  href: string;
  linkLabel: string;
};

type ProfileCopy = {
  title: string;
  description: string;
  identity: string;
  proofHeading: string;
  contactHeading: string;
  backLabel: string;
  skipLabel: string;
  lead: string;
  scope: {
    heading: string;
    items: { label: string; text: string }[];
  };
  proofCards: ProofCard[];
  fit: { heading: string; text: string };
  contactPrompt: { text: string; label: string; href: string };
};

export const productEngineeringProfile: Record<"en" | "es", ProfileCopy> = {
  en: {
    title: "Product engineering for web products and AI",
    description: "Tomás Garbarino, Product Engineer in Buenos Aires. Product discovery, end-to-end features, backend logic and AI integrations, with cases from Agora and Trainly at Flock I+D.",
    identity: "Tomás Garbarino · Buenos Aires, Argentina · Flock I+D",
    proofHeading: "Decisions, implementation and evidence",
    contactHeading: "Tell me what you want to build",
    backLabel: "Back to portfolio",
    skipLabel: "Skip to profile",
    lead: "I help turn complex or manual work into product flows people can understand, review and use. My work connects discovery, scope, implementation and validation across interfaces, backend logic and AI integrations.",
    scope: {
      heading: "From the problem to a working feature",
      items: [
        {
          label: "Product",
          text: "Shape a workflow around its real users, decision points, evidence and next actions.",
        },
        {
          label: "Implementation",
          text: "Build features across interfaces, backend logic and integrations, with scope and acceptance criteria agreed for the project.",
        },
        {
          label: "AI and systems",
          text: "Integrate AI into product workflows, connect outputs to source material and review, and contribute to architecture decisions.",
        },
      ],
    },
    proofCards: [
      {
        title: "Agora · make missing requirements reviewable",
        claim: "At Flock I+D, I helped define a bounded guardrail: route searches with no structured skills to human review and extend the education catalog to recognize English degree names. The case records a team-reported post-release check of the affected case and a control search.",
        attribution: "A Flock I+D product contribution; the case separates my role from the team's validation.",
        limitation: "The validation is reported by the team, and the public case is anonymized. It does not establish quantified business impact.",
        href: "/en/agora",
        linkLabel: "Read the Agora case",
      },
      {
        title: "Trainly · keep AI generation tied to its sources",
        claim: "At Flock I+D, my scope includes product flow, frontend and AI integration. One example is a reviewable learning plan that traces chapters to source material and pauses generation when sources conflict, so a person can decide what to do.",
        attribution: "Trainly is a Flock I+D product built by a team; my case names my contribution and the team's initial platform work.",
        limitation: "The published interface captures use fictional data in a local demo. The case reports no quantified learning outcomes.",
        href: "/en/trainly",
        linkLabel: "Read the Trainly case",
      },
      {
        title: "JEV · evaluate model decisions against a stated reference",
        claim: "I authored a retrospective study of JEV in Agora: how to evaluate interview answers, choose CV decision thresholds and make the cost of human review explicit.",
        attribution: "Research authored by Tomás Garbarino, published by Flock Labs on October 4, 2026.",
        limitation: "The study separates retrospective evaluation from the production incident described in the Agora case.",
        href: "/writing/jev",
        linkLabel: "Read the study and its methods",
      },
    ],
    fit: {
      heading: "Where I can be useful",
      text: "A good fit is a team with a real workflow to improve—such as learning from scattered company knowledge, making AI-supported decisions reviewable, or turning a manual process into a usable web product—and a need for someone who can connect product decisions with end-to-end implementation.",
    },
    contactPrompt: {
      text: "Share the workflow, who uses it and where it gets stuck. That context is enough to start a useful conversation about product and AI engineering.",
      label: "Contact Tomás on LinkedIn",
      href: "https://www.linkedin.com/in/tomas-garbarino/",
    },
  },
  es: {
    title: "Ingeniería de producto para aplicaciones web e IA",
    description: "Tomás Garbarino, Product Engineer en Buenos Aires. Relevamiento, features de punta a punta, lógica de backend e integraciones de IA, con casos de Agora y Trainly en Flock I+D.",
    identity: "Tomás Garbarino · Buenos Aires, Argentina · Flock I+D",
    proofHeading: "Decisiones, implementación y evidencia",
    contactHeading: "Contame qué querés construir",
    backLabel: "Volver al portfolio",
    skipLabel: "Ir al perfil",
    lead: "Ayudo a convertir tareas complejas o manuales en flujos de producto que las personas puedan entender, revisar y usar. Mi trabajo conecta relevamiento, alcance, implementación y validación, desde las interfaces hasta la lógica de backend y las integraciones de IA.",
    scope: {
      heading: "Del problema a una funcionalidad en uso",
      items: [
        {
          label: "Producto",
          text: "Dar forma al flujo según sus usuarios, puntos de decisión, evidencia y acciones siguientes.",
        },
        {
          label: "Implementación",
          text: "Construir features de interfaz, lógica de backend e integraciones, con un alcance y criterios de aceptación acordados para el proyecto.",
        },
        {
          label: "IA y sistemas",
          text: "Integrar IA en flujos de producto, vincular resultados con sus fuentes y revisión, y participar en decisiones de arquitectura.",
        },
      ],
    },
    proofCards: [
      {
        title: "Agora · permitir revisar requisitos faltantes",
        claim: "En Flock I+D, ayudé a definir una protección acotada: enviar a revisión humana las búsquedas sin habilidades estructuradas y ampliar el catálogo educativo para reconocer títulos en inglés. El caso registra una comprobación posterior del equipo sobre el caso afectado y una búsqueda de control.",
        attribution: "Una contribución a un producto de Flock I+D; el caso distingue mi participación de la validación del equipo.",
        limitation: "La validación está reportada por el equipo y el caso público es anónimo. No demuestra un impacto comercial cuantificado.",
        href: "/es/agora",
        linkLabel: "Leer el caso Agora",
      },
      {
        title: "Trainly · vincular la generación de IA con sus fuentes",
        claim: "En Flock I+D, mi alcance incluye flujo de producto, frontend e integración de IA. Un ejemplo es un plan de aprendizaje revisable que vincula capítulos con sus fuentes y pausa la generación cuando hay contradicciones para que una persona decida.",
        attribution: "Trainly es un producto de Flock I+D construido por un equipo; el caso detalla mi contribución y el trabajo inicial del equipo.",
        limitation: "Las interfaces publicadas usan datos ficticios en una demo local. El caso no informa resultados de aprendizaje cuantificados.",
        href: "/es/trainly",
        linkLabel: "Leer el caso Trainly",
      },
      {
        title: "JEV · evaluar decisiones del modelo frente a una referencia explícita",
        claim: "Soy autor de un estudio retrospectivo sobre JEV en Agora: cómo evaluar respuestas de entrevistas, elegir umbrales de decisión sobre CVs y hacer explícito el costo de la revisión humana.",
        attribution: "Estudio de Tomás Garbarino, publicado por Flock Labs el 4 de octubre de 2026.",
        limitation: "El estudio distingue la evaluación retrospectiva del incidente de producción que se cuenta en el caso de Agora.",
        href: "/es/writing/jev",
        linkLabel: "Leer el estudio y sus métodos",
      },
    ],
    fit: {
      heading: "Dónde puedo aportar",
      text: "Tiene sentido conversar si tu equipo tiene un flujo real para mejorar —por ejemplo, aprender desde conocimiento disperso, hacer revisables decisiones apoyadas por IA o convertir un proceso manual en un producto web usable— y necesita a alguien que conecte las decisiones de producto con la implementación de punta a punta.",
    },
    contactPrompt: {
      text: "Contame qué flujo querés mejorar, quién lo usa y dónde se traba. Con ese contexto podemos conversar sobre el siguiente paso de producto e ingeniería con IA.",
      label: "Contactar a Tomás por LinkedIn",
      href: "https://www.linkedin.com/in/tomas-garbarino/",
    },
  },
};
