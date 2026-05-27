const AI_API_KEY = import.meta.env?.VITE_AI_API_KEY || "";

export const aiConfig = {
  apiKey: AI_API_KEY,
  endpoint: "",
  model: ""
};

export const siteKnowledge = {
  school: "STI College Calamba",
  location: "National Highway, Barangay Uno, Calamba City, Laguna",
  navigation: {
    home: "index.html",
    facilities: "facilities.html",
    instructors: "instructors.html",
    about: "about.html"
  },
  externalLinks: {
    facebook: "https://www.facebook.com/calamba.sti.edu",
    instagram: "https://youtu.be/9NJIvKdeYrs?si=Gst7TaiNfNZsE3Ej&t=82"
  },
  contact: {
    phone: "(049) 508-0000",
    email: "calamba@sti.edu",
    hours: "Mon-Sat: 8:00 AM - 5:00 PM"
  },
  members: [
    "Wendelle Ortiz",
    "Mac Jazer Fernandez",
    "Ramon Oruga",
    "Jasper Pillos",
    "Khian Roi Llorca Pedis"
  ],
  facilities: [
    "Room 103 computer laboratory",
    "Room 309 computer laboratory",
    "Room 310 computer laboratory",
    "Room 311 computer laboratory",
    "Library",
    "Campus court",
    "Campus canteen",
    "Classroom"
  ],
  instructors: [
    "Jose Carlos Gonzalez - Academic Head",
    "Arvin Sadicon - IT Head",
    "Dexter Belramino - IT Instructor",
    "Joyce Ann Brofar - IT Instructor",
    "Joie Mar Coral - IT Instructor",
    "Jon Philip Daludado - IT Instructor",
    "Danyca Alliah Villanueva - IT Instructor",
    "Euncis Palmones - IT Instructor"
  ]
};

export const assistantSafety = {
  lowConfidenceThreshold: 0.55,
  minimumCommandWords: 2,
  restrictedSchoolResponse: "Sorry, I cannot answer that. You may want to talk to an actual staff of STI.",
  lowConfidenceFallbacks: [
    "Please repeat that.",
    "Sorry, I didn't catch that.",
    "Could you say that again?",
    "I couldn't understand clearly. Please repeat."
  ],
  incompleteCommandFallbacks: [
    "Please complete your command.",
    "Can you say that again?",
    "I need more information to continue."
  ]
};

export function createSiteContext() {
  const pageTitle = document.title;
  const activePage = document.querySelector(".nav-links a.active")?.textContent?.trim() || "Current page";
  const headings = [...document.querySelectorAll("h1, h2, h3")]
    .map((item) => item.textContent.trim())
    .filter(Boolean);
  const paragraphs = [...document.querySelectorAll("main p")]
    .map((item) => item.textContent.trim())
    .filter(Boolean);

  return {
    pageTitle,
    activePage,
    headings,
    paragraphs,
    ...siteKnowledge
  };
}

export function normalizeSpeechInput(input) {
  if (typeof input === "string") {
    return {
      transcript: input.trim(),
      confidence: input.trim() ? 1 : 0,
      isFinal: Boolean(input.trim())
    };
  }

  return {
    transcript: input?.transcript?.trim() || "",
    confidence: Number.isFinite(input?.confidence) ? input.confidence : 0,
    isFinal: Boolean(input?.isFinal)
  };
}

export function getLowConfidenceFallback(prompt = "") {
  const fallbacks = assistantSafety.lowConfidenceFallbacks;
  const index = Math.abs([...prompt].reduce((total, char) => total + char.charCodeAt(0), 0)) % fallbacks.length;
  return fallbacks[index];
}

export function getIncompleteCommandFallback(prompt = "") {
  const fallbacks = assistantSafety.incompleteCommandFallbacks;
  const index = Math.abs([...prompt].reduce((total, char) => total + char.charCodeAt(0), 0)) % fallbacks.length;
  return fallbacks[index];
}

export function validateSpeechInput(input) {
  const speech = normalizeSpeechInput(input);
  const hasUsableTranscript = speech.transcript.length > 1;
  const hasEnoughConfidence = speech.confidence >= assistantSafety.lowConfidenceThreshold;

  if (!hasUsableTranscript || !hasEnoughConfidence) {
    return {
      ok: false,
      text: getLowConfidenceFallback(speech.transcript),
      speech
    };
  }

  return {
    ok: true,
    text: speech.transcript,
    speech
  };
}

export function validateCommandCompleteness(prompt) {
  const query = prompt
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = query ? query.split(" ") : [];

  if (!query) {
    return {
      ok: false,
      text: getIncompleteCommandFallback(query),
      reason: "empty-command"
    };
  }

  const endsWithConnector = /\b(the|to|for|with|in|on|at|from|of|a|an|this|that|my|your)$/;
  const bareCommand = /^(open|go|show|visit|navigate|take|bring|stop|pause|mute|play|resume|start|turn|tell|search|find|give|what|where|who|when|how|why)$/;
  const incompleteNavigation = /^(open|go|show|visit|navigate|take|bring)( me)?( to)?( the)?$/;
  const incompleteAudio = /^(stop|pause|mute|play|resume|start|turn)( the| on| off| up| down)?$/;
  const incompleteQuestion = /^(tell me about|what is|what are|where is|where are|who is|who are|how do|how can|can you|could you|please)$/;

  const isCommandLike = /^(open|go|show|visit|navigate|take|bring|stop|pause|mute|play|resume|start|turn|tell|search|find|give|what|where|who|when|how|why|can|could|please)\b/.test(query);
  const hasKnownSingleWordTopic = /^(home|facilities|facility|instructors|instructor|teachers|about|members|contact|location|address)$/;

  if (
    bareCommand.test(query)
    || incompleteNavigation.test(query)
    || incompleteAudio.test(query)
    || incompleteQuestion.test(query)
    || (isCommandLike && endsWithConnector.test(query))
    || (words.length < assistantSafety.minimumCommandWords && isCommandLike && !hasKnownSingleWordTopic.test(query))
  ) {
    return {
      ok: false,
      text: getIncompleteCommandFallback(query),
      reason: "incomplete-command"
    };
  }

  return {
    ok: true,
    text: prompt.trim(),
    reason: "complete"
  };
}

export function isRestrictedSchoolQuestion(prompt) {
  const query = prompt.toLowerCase().trim();
  if (!query) return false;

  const mentionsSchool = /\b(sti|school|college|campus|calamba|registrar|admin|staff|office)\b/.test(query);
  if (!mentionsSchool) return false;

  const asksOfficialInfo = [
    /\btuition\b/,
    /\bfee(s)?\b/,
    /\bpayment(s)?\b/,
    /\bregistrar\b/,
    /\b(policy|policies)\b/,
    /\badmission(s)?\b/,
    /\benroll(?!ment-to-employment)\w*\b/,
    /\brequirement(s)?\b/,
    /\bscholarship(s)?\b/,
    /\bgrade(s)?\b/,
    /\bcredential(s)?\b/,
    /\brecord(s)?\b/,
    /\bdocument(s)?\b/,
    /\bid card\b/,
    /\buniform\b/,
    /\bofficial\b/,
    /\badministrative\b/,
    /\bconcern(s)?\b/,
    /\bcomplaint(s)?\b/
  ].some((pattern) => pattern.test(query));

  const asksUnavailableContact = /\b(contact|phone|email|number|address)\b/.test(query)
    && /\b(registrar|admission(s)?|admin|administrator|staff|teacher|instructor|office|department|official)\b/.test(query);

  return asksOfficialInfo || asksUnavailableContact;
}

export function getAssistantSafetyOverride(prompt, options = {}) {
  if (options.source === "voice") {
    const validation = validateSpeechInput({
      transcript: prompt,
      confidence: options.confidence,
      isFinal: options.isFinal
    });

    if (!validation.ok) {
      return {
        intent: { type: "fallback", reason: "low-confidence-speech" },
        text: validation.text
      };
    }
  }

  const completeness = validateCommandCompleteness(prompt);
  if (!completeness.ok) {
    return {
      intent: { type: "fallback", reason: completeness.reason },
      text: completeness.text
    };
  }

  if (isRestrictedSchoolQuestion(prompt)) {
    return {
      intent: { type: "restricted", reason: "official-school-topic" },
      text: assistantSafety.restrictedSchoolResponse
    };
  }

  return null;
}

export function recognizeIntent(prompt) {
  const query = prompt.toLowerCase().trim();
  const mentionsMusic = query.includes("music") || query.includes("song") || query.includes("audio") || query.includes("background");

  if (mentionsMusic && /\b(turn off|stop|mute|pause|silence)\b/.test(query)) {
    return {
      type: "audio",
      action: "pause",
      label: "background music"
    };
  }

  if (mentionsMusic && /\b(play|resume|turn on|start|unmute)\b/.test(query)) {
    return {
      type: "audio",
      action: "play",
      label: "background music"
    };
  }

  const hasNavigationVerb = /\b(go|open|take|bring|navigate|show|visit)\b/.test(query);

  if (!hasNavigationVerb) {
    return { type: "question" };
  }

  const internalTargets = [
    ["home", "Home"],
    ["facilities", "Facilities"],
    ["facility", "Facilities"],
    ["instructors", "Instructors"],
    ["instructor", "Instructors"],
    ["teachers", "Instructors"],
    ["about", "About"]
  ];

  const internalMatch = internalTargets.find(([keyword]) => query.includes(keyword));
  if (internalMatch) {
    const pageName = internalMatch[1];
    const key = pageName.toLowerCase();
    return {
      type: "navigate",
      label: pageName,
      target: siteKnowledge.navigation[key],
      external: false
    };
  }

  if (query.includes("facebook")) {
    return {
      type: "navigate",
      label: "Facebook",
      target: siteKnowledge.externalLinks.facebook,
      external: true
    };
  }

  if (query.includes("instagram")) {
    return {
      type: "navigate",
      label: "Instagram",
      target: siteKnowledge.externalLinks.instagram,
      external: true
    };
  }

  return { type: "question" };
}

export function startSpeechToText({ onResult, onError } = {}) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let transcript = "";
  let confidence = 0;
  let isFinal = false;
  let recognition;
  let resolveStop;
  let didResolve = false;
  const stopped = new Promise((resolve) => {
    resolveStop = resolve;
  });
  const resolveSpeech = () => {
    if (didResolve) return;
    didResolve = true;
    resolveStop({ transcript, confidence, isFinal });
  };

  if (!SpeechRecognition) {
    resolveSpeech();
    onError?.("Speech recognition is not supported in this browser.");
    return {
      stop: () => Promise.resolve({ transcript: "", confidence: 0, isFinal: false })
    };
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    const results = [...event.results];
    transcript = results
      .map((result) => result[0]?.transcript || "")
      .join(" ")
      .trim();
    isFinal = results.some((result) => result.isFinal);

    const confidenceValues = results
      .map((result) => result[0]?.confidence)
      .filter((value) => Number.isFinite(value) && value > 0);

    if (confidenceValues.length) {
      confidence = confidenceValues.reduce((total, value) => total + value, 0) / confidenceValues.length;
    } else if (transcript) {
      confidence = isFinal ? 0.75 : 0.45;
    }

    onResult?.(transcript, { confidence, isFinal });
  };

  recognition.onerror = () => {
    onError?.("I could not hear that clearly.");
  };

  recognition.onend = () => {
    resolveSpeech();
  };

  try {
    recognition.start();
  } catch {
    resolveSpeech();
  }

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch {
        resolveSpeech();
      }
      return stopped;
    }
  };
}

export async function generateAssistantResponse(prompt, context = createSiteContext(), options = {}) {
  const safetyOverride = getAssistantSafetyOverride(prompt, options);
  if (safetyOverride) {
    return safetyOverride;
  }

  const intent = recognizeIntent(prompt);
  if (intent.type === "audio") {
    return {
      intent,
      text: intent.action === "pause"
        ? "Sure, I turned off the background music."
        : "Sure, I resumed the background music."
    };
  }

  if (intent.type === "navigate") {
    return {
      intent,
      text: intent.external
        ? `Opening ${intent.label} for you.`
        : `Taking you to the ${intent.label} page.`
    };
  }

  if (aiConfig.apiKey) {
    return {
      intent,
      text: await generateAIResponse(prompt, context)
    };
  }

  return {
    intent,
    text: generateLocalResponse(prompt, context)
  };
}

async function generateAIResponse(prompt, context) {
  // Future integration point: connect this to your preferred AI endpoint.
  // Use aiConfig.apiKey, aiConfig.endpoint, and aiConfig.model when ready.
  return generateLocalResponse(prompt, context);
}

function generateLocalResponse(prompt, context) {
  const query = prompt.toLowerCase();

  if (!prompt.trim()) {
    return "I am ready. Ask me about the school, facilities, instructors, members, contact details, or the current page.";
  }

  if (/\b(who|created|developed|made|developer|creator)\b/.test(query) && query.includes("website")) {
    return "The person on the top of the list with the help of tools.";
  }

  if (query.includes("made this project") || query.includes("created this project")) {
    return "The Group 8 members created this project, led by the person on the top of the list with the help of tools.";
  }

  if (query.includes("member") || query.includes("group") || query.includes("creator") || query.includes("developer")) {
    return `The Group 8 members are ${context.members.join(", ")}.`;
  }

  if (query.includes("facility") || query.includes("facilities") || query.includes("room") || query.includes("library") || query.includes("court") || query.includes("canteen")) {
    return `The website features these facilities: ${context.facilities.join(", ")}.`;
  }

  if (query.includes("instructor") || query.includes("teacher") || query.includes("head")) {
    return `The instructors section lists ${context.instructors.join(", ")}.`;
  }

  if (query.includes("contact") || query.includes("phone") || query.includes("email") || query.includes("hour")) {
    return `You can contact ${context.school} at ${context.contact.phone} or ${context.contact.email}. Office hours are ${context.contact.hours}.`;
  }

  if (query.includes("where") || query.includes("location") || query.includes("address")) {
    return `${context.school} is located at ${context.location}.`;
  }

  if (query.includes("about")) {
    return "The About section introduces the Group 8 project team and shows each member profile.";
  }

  if (query.includes("page") || query.includes("section") || query.includes("what is this")) {
    return `You are on the ${context.activePage} page. This page includes: ${context.headings.slice(0, 6).join(", ")}.`;
  }

  return `${context.school} is a future-ready, technology-driven education website. I can help with its members, instructors, facilities, contact details, and page sections.`;
}

export function speakAssistantText(text) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}
