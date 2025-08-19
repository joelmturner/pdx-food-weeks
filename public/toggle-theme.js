const primaryColorScheme = ""; // "light" | "dark"

// Get theme data from local storage
const currentTheme = localStorage.getItem("theme");

function getPreferTheme() {
  // return theme value in local storage if it is set
  if (currentTheme) return currentTheme;

  // return primary color scheme if it is set
  if (primaryColorScheme) return primaryColorScheme;

  // return user device's prefer color scheme
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "business"
    : "cupcake";
}

let themeValue = getPreferTheme();

function setPreference() {
  localStorage.setItem("theme", themeValue);
  reflectPreference();
}

function checkLogoBrightness() {
  const logoImage = document.getElementById("logo-image");
  if (logoImage instanceof HTMLImageElement) {
    // check if image has loaded and has valid dimensions
    if (
      !logoImage.complete ||
      logoImage.naturalWidth === 0 ||
      logoImage.naturalHeight === 0
    ) {
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = logoImage.naturalWidth;
    canvas.height = logoImage.naturalHeight;
    ctx.drawImage(logoImage, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let totalBrightness = 0;
    const pixelCount = data.length / 4;

    // Sample pixels (every 4th pixel to improve performance)
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Calculate relative luminance using the formula: 0.299R + 0.587G + 0.114B
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      totalBrightness += brightness;
    }

    const averageBrightness = totalBrightness / (pixelCount / 4);
    const isDark = averageBrightness < 0.5;

    if (logoImage.closest(".logo-container")) {
      if (isDark) {
        logoImage.closest(".logo-container").classList.add("dark-logo");
      } else {
        logoImage.closest(".logo-container").classList.remove("dark-logo");
      }
    }
  }
}

function reflectPreference() {
  document.firstElementChild.setAttribute("data-theme", themeValue);
  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);

  // Get a reference to the body element
  const body = document.body;

  // Check if the body element exists before using getComputedStyle
  if (body) {
    // Handle wa-dark class based on theme
    if (themeValue === "business") {
      document.documentElement.classList.add("wa-dark");
    } else {
      document.documentElement.classList.remove("wa-dark");
    }

    // Get the computed styles for the body element
    const computedStyles = window.getComputedStyle(body);

    // Get the background color property
    const bgColor = computedStyles.backgroundColor;

    // Set the background color in <meta theme-color ... />
    document
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", bgColor);

    // Check logo brightness when theme changes
    checkLogoBrightness();
  }
}

// set early so no page flashes / CSS is made aware
reflectPreference();

window.onload = () => {
  function setThemeFeature() {
    // set on load so screen readers can get the latest value on the button
    reflectPreference();

    // now this script can find and listen for clicks on the control
    document.querySelectorAll("#theme-btn")?.forEach(element =>
      element?.addEventListener("click", () => {
        themeValue = themeValue === "cupcake" ? "business" : "cupcake";
        setPreference();
      })
    );

    // Check logo brightness when image loads
    const logoImage = document.getElementById("logo-image");
    if (logoImage instanceof HTMLImageElement) {
      if (logoImage.complete) {
        checkLogoBrightness();
      } else {
        logoImage.addEventListener("load", checkLogoBrightness);
      }
    }
  }

  setThemeFeature();

  // Runs on view transitions navigation
  document.addEventListener("astro:after-swap", () => {
    setThemeFeature();
    // Add a small delay to ensure the image is loaded after navigation
    setTimeout(checkLogoBrightness, 100);
  });
};

// sync with system changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    themeValue = isDark ? "business" : "cupcake";
    setPreference();
  });

// enhance existing theme functionality to prevent layout shifts
const originalReflectPreference = reflectPreference;
reflectPreference = function () {
  // call original function
  originalReflectPreference();
};
