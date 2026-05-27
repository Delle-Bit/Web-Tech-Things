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
  let recognition;
  let resolveStop;
  const stopped = new Promise((resolve) => {
    resolveStop = resolve;
  });

  if (!SpeechRecognition) {
    resolveStop("");
    onError?.("Speech recognition is not supported in this browser.");
    return {
      stop: () => Promise.resolve("")
    };
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    transcript = [...event.results]
      .map((result) => result[0]?.transcript || "")
      .join(" ")
      .trim();
    onResult?.(transcript);
  };

  recognition.onerror = () => {
    onError?.("I could not hear that clearly.");
  };

  recognition.onend = () => {
    resolveStop(transcript);
  };

  try {
    recognition.start();
  } catch {
    resolveStop(transcript);
  }

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch {
        resolveStop(transcript);
      }
      return stopped;
    }
  };
}

export async function generateAssistantResponse(prompt, context = createSiteContext()) {
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
