import {
  createSiteContext,
  generateAssistantResponse,
  speakAssistantText,
  startSpeechToText,
  validateSpeechInput
} from "./voice-assistant-service.js";
import { backgroundMusic } from "./audio-manager-service.js";

const root = document.documentElement;
const storedTheme = localStorage.getItem("sti-theme");
const initialTheme = storedTheme || "light";

root.dataset.theme = initialTheme;
backgroundMusic.init();

const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const revealItems = document.querySelectorAll(".reveal");
const loader = document.querySelector(".loader");
const splashSeen = sessionStorage.getItem("group-8-splash-seen") === "true";
const navigationEntry = performance.getEntriesByType("navigation")[0];
const isRefresh = navigationEntry?.type === "reload";
const shouldAnimateSplash = !splashSeen || isRefresh;

if (loader && !shouldAnimateSplash) {
  loader.classList.add("hide");
}

function setTheme(theme, { persist = false } = {}) {
  root.dataset.theme = theme;
  if (persist) {
    localStorage.setItem("sti-theme", theme);
  }

  if (themeToggle && themeIcon) {
    const isDark = theme === "dark";
    themeIcon.textContent = isDark ? "\u2600" : "\u263E";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }
}

setTheme(initialTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme, { persist: true });
});

navToggle?.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navPanel?.classList.remove("open");
    navToggle?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => observer.observe(item));

window.addEventListener("load", () => {
  if (!loader) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!shouldAnimateSplash) {
    return;
  }

  const delay = prefersReducedMotion ? 900 : 4200;

  window.setTimeout(() => {
    loader.classList.add("hide");
    sessionStorage.setItem("group-8-splash-seen", "true");
  }, delay);
});

let vaIsListening = false;
let vaIsStopping = false;
let vaSpeechSession;
const voiceProcessingDelay = 360;

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function createVoiceAssistant() {
  const wrapper = document.createElement("div");
  wrapper.className = "voice-assistant";
  wrapper.innerHTML = `
    <div class="va-panel" aria-live="polite" aria-hidden="true">
      <div class="va-header">
        <div>
          <span class="va-kicker">STI Assistant</span>
          <h2>Voice Assistant</h2>
        </div>
        <button class="va-close" type="button" aria-label="Close assistant"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="va-status">Ready.</div>
      <div class="va-messages" role="log" aria-label="Assistant messages"></div>
      <form class="va-form">
        <input class="va-input" type="text" placeholder="Ask about the website..." aria-label="Ask the voice assistant">
        <button class="va-send" type="submit" aria-label="Send message"><i class="fa-solid fa-paper-plane"></i></button>
      </form>
    </div>
    <div class="va-helper" aria-hidden="true"><span>Tap to Talk</span><span>Tap Again to Stop</span></div>
    <div class="va-listening-label" aria-hidden="true">Listening...</div>
    <button class="va-button" type="button" aria-label="Start voice assistant listening">
      <span class="va-ring" aria-hidden="true"></span>
      <i class="fa-solid fa-microphone"></i>
    </button>
  `;
  document.body.appendChild(wrapper);

  const button = wrapper.querySelector(".va-button");
  const buttonIcon = button.querySelector("i");
  const panel = wrapper.querySelector(".va-panel");
  const close = wrapper.querySelector(".va-close");
  const status = wrapper.querySelector(".va-status");
  const messages = wrapper.querySelector(".va-messages");
  const form = wrapper.querySelector(".va-form");
  const input = wrapper.querySelector(".va-input");

  function openPanel() {
    wrapper.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
  }

  function closePanel() {
    wrapper.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
  }

  function setStatus(text) {
    status.textContent = text;
  }

  function setButtonMode(mode) {
    const isListeningMode = mode === "listening";
    buttonIcon.className = isListeningMode ? "fa-solid fa-stop" : "fa-solid fa-microphone";
    button.setAttribute(
      "aria-label",
      isListeningMode ? "Stop voice assistant listening" : "Start voice assistant listening"
    );
  }

  function addMessage(text, type = "assistant") {
    const bubble = document.createElement("div");
    bubble.className = `va-message ${type}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  function runNavigation(intent) {
    wrapper.classList.add("navigating");
    setStatus(`Opening ${intent.label}...`);
    window.setTimeout(() => {
      if (intent.external) {
        window.location.href = intent.target;
        return;
      }

      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      if (currentPage === intent.target) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        wrapper.classList.remove("navigating");
        setStatus("Ready.");
        return;
      }

      window.location.href = intent.target;
    }, 650);
  }

  function runAudioIntent(intent) {
    wrapper.classList.add("navigating");
    setStatus(intent.action === "pause" ? "Turning music off..." : "Resuming music...");

    if (intent.action === "pause") {
      backgroundMusic.pause();
    } else {
      backgroundMusic.play();
    }

    window.setTimeout(() => {
      wrapper.classList.remove("navigating");
      setStatus("Ready.");
    }, 700);
  }

  async function respondToPrompt(prompt, options = {}) {
    openPanel();
    wrapper.classList.add("processing");
    setStatus("Processing...");
    const result = await generateAssistantResponse(prompt, createSiteContext(), options);
    wrapper.classList.remove("processing");
    wrapper.classList.add("responding");
    setStatus("Responding...");
    addMessage(result.text);
    speakAssistantText(result.text);
    if (result.intent?.type === "navigate") {
      runNavigation(result.intent);
    }
    if (result.intent?.type === "audio") {
      runAudioIntent(result.intent);
    }
    window.setTimeout(() => {
      wrapper.classList.remove("responding");
      if (!wrapper.classList.contains("navigating")) {
        setStatus("Ready.");
      }
    }, 900);
  }

  function startListening() {
    if (vaIsListening || vaIsStopping) return;
    vaIsListening = true;
    vaIsStopping = false;
    wrapper.classList.add("listening");
    openPanel();
    setButtonMode("listening");
    setStatus("Listening...");
    vaSpeechSession = startSpeechToText({
      onResult: (transcript) => setStatus(transcript ? `Listening: ${transcript}` : "Listening..."),
      onError: (message) => setStatus(message)
    });
  }

  async function stopListening() {
    if (!vaIsListening || vaIsStopping) return;
    vaIsStopping = true;
    vaIsListening = false;
    wrapper.classList.remove("listening");
    setButtonMode("idle");
    setStatus("Finishing...");
    await wait(voiceProcessingDelay);
    setStatus("Processing...");
    const speechResult = await vaSpeechSession?.stop();
    const validation = validateSpeechInput(speechResult);
    const prompt = validation.speech.transcript;

    if (validation.ok) {
      addMessage(prompt, "user");
    }

    try {
      await respondToPrompt(prompt, {
        source: "voice",
        confidence: validation.speech.confidence,
        isFinal: validation.speech.isFinal
      });
    } finally {
      vaIsStopping = false;
    }
  }

  function toggleListening() {
    if (vaIsStopping) return;
    if (vaIsListening) {
      stopListening();
      return;
    }
    startListening();
  }

  button.addEventListener("click", toggleListening);
  close.addEventListener("click", closePanel);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const prompt = input.value.trim();
    if (!prompt) return;
    addMessage(prompt, "user");
    input.value = "";
    respondToPrompt(prompt);
  });
}

createVoiceAssistant();
