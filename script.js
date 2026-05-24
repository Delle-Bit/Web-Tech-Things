const root = document.documentElement;
const storedTheme = localStorage.getItem("sti-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = storedTheme || (prefersDark ? "dark" : "light");

root.dataset.theme = initialTheme;

const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const revealItems = document.querySelectorAll(".reveal");
const loader = document.querySelector(".loader");

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("sti-theme", theme);

  if (themeToggle && themeIcon) {
    const isDark = theme === "dark";
    themeIcon.textContent = isDark ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }
}

setTheme(initialTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
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
  loader?.classList.add("hide");
});
