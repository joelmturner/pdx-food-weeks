function intersection(arr1: string[], arr2: string[]) {
  const intersectionResult = arr1.filter(x => arr2.includes(x));
  return intersectionResult;
}

function updateUrlQueryParams(dietaryTags: string[]) {
  const url = new URL(window.location.href);

  if (dietaryTags.length > 0) {
    url.searchParams.set("dietary", dietaryTags.join(","));
  } else {
    url.searchParams.delete("dietary");
  }

  // Update URL without triggering a page reload
  window.history.pushState({}, "", url.toString());

  // Dispatch a custom event to notify about URL changes
  window.dispatchEvent(
    new CustomEvent("url-changed", {
      detail: { url: url.toString() },
    })
  );
}

function setSelectValueFromUrl() {
  const dietarySelect = document.querySelector(
    'wa-select[data-filter-key="dietary"]'
  ) as any;

  const urlParams = new URLSearchParams(window.location.search);
  const dietaryParam = urlParams.get("dietary");

  if (dietaryParam && dietarySelect) {
    const dietaryValues = dietaryParam.split(",");
    dietarySelect.value = dietaryValues;
    dietarySelect.dispatchEvent(new Event("change"));
  }
}

function runIt() {
  // Find the select elements
  const dietarySelect = document.querySelector(
    'wa-select[data-filter-key="dietary"]'
  ) as any;
  const neighborhoodSelect = document.querySelector(
    'wa-select[data-filter-key="neighborhoods"]'
  );

  const handleFilterChange = (e: Event) => {
    const foodCards = document.querySelectorAll(".card");

    // Get selected values from the selects - value is already an array for multiple selects
    const activeDietaryTags = dietarySelect?.value || [];
    const activeNeighborhoodTags =
      (neighborhoodSelect as any)?.value?.map((item: string) =>
        item.replace("___", " - ").replaceAll("_", " ").toLowerCase()
      ) || [];

    // Update URL with dietary query params
    updateUrlQueryParams(activeDietaryTags);

    // return early if no tags are active
    if (activeDietaryTags.length === 0 && activeNeighborhoodTags.length === 0) {
      foodCards.forEach(card => {
        card.classList.remove("hidden");
      });
      return;
    }

    // loop over the posts and hide/show them based on selected filters
    foodCards.forEach(card => {
      if (!(card instanceof HTMLElement)) {
        return;
      }

      const dietaryTags =
        card.dataset.dietary?.split(",").map(item => item.toLowerCase()) ?? [];

      // Check if ALL active dietary tags are present in the card's tags
      const hasAllDietaryTags = activeDietaryTags.every((tag: string) =>
        dietaryTags.includes(tag.toLowerCase())
      );

      const neighborhoodTags =
        card.dataset.neighborhood?.split(",").map(item => item.toLowerCase()) ??
        [];

      const overlapNeighborhood = intersection(
        activeNeighborhoodTags,
        neighborhoodTags
      );

      if (
        (hasAllDietaryTags || !activeDietaryTags.length) &&
        (overlapNeighborhood.length || !activeNeighborhoodTags.length)
      ) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  };

  // Add change event listeners to the selects
  dietarySelect?.addEventListener("change", handleFilterChange);
  neighborhoodSelect?.addEventListener("change", handleFilterChange);

  // Set initial values from URL
  setSelectValueFromUrl();
}

// run on initial page load
runIt();

// Listen for both page load and view transitions
document.addEventListener("astro:page-load", runIt);
document.addEventListener("astro:after-swap", runIt);
