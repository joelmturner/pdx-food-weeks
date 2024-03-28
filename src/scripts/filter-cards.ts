function intersection(arr1: string[], arr2: string[]) {
  const intersectionResult = arr1.filter(x => arr2.includes(x));
  return intersectionResult;
}

function runIt() {
  // Find all buttons with the `alert` class on the page.
  const tags = document.querySelectorAll("[data-filter-id]");

  // Handle clicks on each button.
  tags.forEach(tag => {
    if (!(tag instanceof HTMLElement)) {
      return;
    }

    tag.addEventListener("click", () => {
      const foodCards = document.querySelectorAll(".card");
      // clear all tags of this filterKey
      if (["dietary", "neighborhoods"].includes(tag.dataset.filterId ?? "")) {
        tags.forEach(t => {
          if (!(t instanceof HTMLElement)) {
            return;
          }
          if (t.dataset.filterKey === tag.dataset.filterId) {
            t.classList.remove("badge-primary");
            t.classList.add("badge-outline");
          }
        });
      } else {
        // toggle selection
        tag.classList.toggle("badge-primary");
        tag.classList.toggle("badge-outline");
      }

      const activeDietaryTags = Array.from(
        document.querySelectorAll("[data-filter-id][data-filter-key=dietary]")
      )
        .filter(t => t.classList.contains("badge-primary"))
        .map(
          tag =>
            (tag instanceof HTMLElement &&
              tag.dataset.filterId?.toLowerCase()) ||
            ""
        )
        .filter(Boolean);

      const activeNeighborhoodTags = Array.from(
        document.querySelectorAll(
          "[data-filter-id][data-filter-key=neighborhoods]"
        )
      )
        .filter(t => t.classList.contains("badge-primary"))
        .map(
          tag =>
            (tag instanceof HTMLElement &&
              tag.dataset.filterId?.toLowerCase()) ||
            ""
        )
        .filter(Boolean);

      // return early if no tags are active
      if (
        activeDietaryTags.length === 0 &&
        activeNeighborhoodTags.length === 0
      ) {
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
          card.dataset.dietary?.split(",").map(item => item.toLowerCase()) ??
          [];

        const overlapDietary = intersection(activeDietaryTags, dietaryTags);

        const neighborhoodTags =
          card.dataset.neighborhood
            ?.split(",")
            .map(item => item.toLowerCase()) ?? [];

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
    });
  });
}

// run on initial page load
runIt();

// Runs on view transitions navigation
document.addEventListener("astro:after-swap", runIt);
