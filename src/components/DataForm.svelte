<script lang="ts">
  $: data = null as { eventDetails: any; food: any[] } | null;

  $: status = "idle";
  $: type =
    (typeof window !== "undefined" && window?.location.search.split("=")[1]) ||
    "";

  async function handleSubmitUrl(
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
  ) {
    const formData = new FormData(event.target as HTMLFormElement);
    // Handle form submission logic here
    const response = await fetch("/api/fetchDataFromSource", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: formData.get("url"),
        type: formData.get("type"),
      }),
    });

    if (response?.ok) {
      data = await response.json();
    } else {
      console.error("Failed to fetch data");
    }
  }

  async function handleSubmitData(
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
  ) {
    const formData = new FormData(event.target as HTMLFormElement);

    status = "loading";
    // Handle form submission logic here
    const response = await fetch("/api/addFoodItems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: formData.get("data"),
        year: formData.get("year"),
        type: formData.get("type"),
      }),
    });

    if (response.ok) {
      status = "Data added to db";
    } else {
      status = "Failed to add data to db";
      console.error("Failed to add data to db");
    }
  }

  async function handleSubmitEventDetails(
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
  ) {
    const formData = new FormData(event.target as HTMLFormElement);
    const eventData = formData.get("data");
    const { title, description, dateStart, dateEnd, url, year, type } =
      JSON.parse(eventData as string);

    status = "loading";
    // Handle form submission logic here
    const response = await fetch("/api/events/addDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        dateStart,
        dateEnd,
        url,
        year,
        type,
      }),
    });

    if (response.ok) {
      status = "Data added to db";
    } else {
      status = "Failed to add data to db";
      console.error("Failed to add data to db");
    }
  }
</script>

<form on:submit|preventDefault={handleSubmitUrl} class="flex flex-col gap-3">
  <div class="flex flex-col gap-1">
    <label for="url">URL</label>
    <input name="url" id="url" class="input input-bordered w-full max-w-xs" />
    <input
      name="type"
      id="type"
      class="input input-bordered w-full max-w-xs"
      hidden
      value={type}
    />
  </div>
  <button type="submit" class="btn btn-primary max-w-xs">Fetch Data</button>
</form>

{#if status === "loading"}
  <span class="loading loading-ring loading-md"></span>
{:else}
  <p>{status}</p>
{/if}
