<script lang="ts">
  $: data = null as { eventDetails: any; food: any[] } | null;

  $: status = "idle";

  async function handleSubmitUrl(
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
  ) {
    const formData = new FormData(event.target);
    // Handle form submission logic here
    const response = await fetch("/api/fetchDataFromSource", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: formData.get("url") }),
    });

    if (response.ok) {
      data = await response.json();
    } else {
      console.error("Failed to fetch data");
    }
  }

  async function handleSubmitData(
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
  ) {
    const formData = new FormData(event.target);

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
    const formData = new FormData(event.target);
    const eventData = formData.get("data");
    const { title, description, dateStart, dateEnd, url, year, type } =
      JSON.parse(eventData);

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
  </div>
  <button type="submit" class="btn btn-primary max-w-xs">Fetch Data</button>
</form>

{#if status === "loading"}
  <span class="loading loading-ring loading-md"></span>
{:else}
  <p>{status}</p>
{/if}

{#if data}
  <h3>Food</h3>
  <form on:submit|preventDefault={handleSubmitData} class="flex flex-col gap-3">
    <div class="flex flex-col gap-1">
      <label for="year">Year</label>
      <input
        name="year"
        id="year"
        type="number"
        class="input input-bordered w-full max-w-xs"
      />
    </div>
    <div class="flex flex-col gap-1">
      <label for="type">Type</label>
      <select
        id="type"
        name="type"
        class="select select-bordered w-full max-w-xs"
      >
        <option value="pizza">Pizza</option>
        <option value="burger">Burger</option>
        <option value="nacho">Nachos</option>
        <option value="sandwich">Sandwich</option>
      </select>
    </div>

    <button type="submit" class="btn btn-primary max-w-xs">Add to db</button>
    <input value={JSON.stringify(data.food)} hidden name="data" id="data" />
  </form>

  <h3>Event Details</h3>
  <form
    on:submit|preventDefault={handleSubmitEventDetails}
    class="flex flex-col gap-3"
  >
    <input
      type="hidden"
      value={JSON.stringify(data.eventDetails)}
      name="data"
      id="name"
    />
    <button type="submit" class="btn btn-primary max-w-xs">Add to db</button>
  </form>

  <div class="h-full max-h-96 w-full p-4 overflow-auto">
    <pre><code>
        {JSON.stringify(data.eventDetails, null, 2)}
    </code></pre>
  </div>

  <div class="py-24" />
  <div class="h-full max-h-96 w-full p-4 overflow-auto">
    <pre><code>
        {JSON.stringify(data.food, null, 2)}
    </code></pre>
  </div>
{/if}
