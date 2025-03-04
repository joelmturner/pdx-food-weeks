function intersection(arr1: string[], arr2: string[]) {
  const intersectionResult = arr1.filter(x => arr2.includes(x));
  return intersectionResult;
}

function runIt() {
  // Find the select elements
  const dietarySelect = document.querySelector(
    'wa-select[data-filter-key="dietary"]'
  );
  const neighborhoodSelect = document.querySelector(
    'wa-select[data-filter-key="neighborhoods"]'
  );

  const handleFilterChange = (e: Event) => {
    const foodCards = document.querySelectorAll(".card");

    // Get selected values from the selects - value is already an array for multiple selects
    const activeDietaryTags = (dietarySelect as any)?.value || [];
    const activeNeighborhoodTags =
      (neighborhoodSelect as any)?.value?.map((item: string) =>
        item.replace("___", " - ").replaceAll("_", " ").toLowerCase()
      ) || [];

    console.log("activeDietaryTags", activeDietaryTags);
    console.log("activeNeighborhoodTags", activeNeighborhoodTags);

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

      const overlapDietary = intersection(activeDietaryTags, dietaryTags);

      const neighborhoodTags =
        card.dataset.neighborhood?.split(",").map(item => item.toLowerCase()) ??
        [];

      const overlapNeighborhood = intersection(
        activeNeighborhoodTags,
        neighborhoodTags
      );

      if (
        (overlapDietary.length || !activeDietaryTags.length) &&
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
}

// run on initial page load
runIt();

// Runs on view transitions navigation
document.addEventListener("astro:after-swap", runIt);
