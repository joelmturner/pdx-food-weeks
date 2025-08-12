<script lang="ts">
  export let savedLists = [];
  export let savedListItems = [];

  const handleDeleteList = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const listId = formData.get("listId");

    const deleted = await fetch(`/api/lists/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ listId }),
    });

    // reload the page
    if (deleted.ok) {
      location.reload();
    }
  };

  const handleDeleteFoodFromList = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const listId = formData.get("listId");
    const foodId = formData.get("foodId");

    const deleted = await fetch(`/api/lists/removeFood`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ listId, foodId }),
    });

    // reload the page
    if (deleted.ok) {
      location.reload();
    }
  };
</script>

<div class="flex flex-col gap-12">
  {#each savedLists as list (list.id)}
    <div class="flex flex-col gap-4">
      <div class="flex gap-5 group items-center">
        <h2 class="text-2xl font-bold">{list.name}</h2>
        <form
          method="POST"
          on:submit|preventDefault={handleDeleteList}
          class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
        >
          <input type="hidden" name="listId" value={list.id} />
          <wa-button variant="error" appearance="outline" type="submit"
            >Delete</wa-button
          >
        </form>
      </div>

      <div class="flex flex-col gap-12 md:gap-8">
        {#if list.foodIds.length === 0}
          <p>No items in this list yet</p>
        {:else}
          {#each savedListItems.filter( savedListItem => list.foodIds.includes(savedListItem.id) ) as food (food.id)}
            <div class="flex gap-4 bg-neutral overflow-hidden p-4 rounded-lg">
              <img src={food.imageUrl} alt={food.title} class="w-60 h-60" />

              <div class="prose">
                <h3 class="text-xl">
                  <span class="font-bold"
                    ><a href={food.url}>{food.title}</a></span
                  >{` from `}<a href={food.mapUrl || food.locationUrl}
                    >{food.location}</a
                  >
                </h3>
                <p>{food.description}</p>
                {#if !!food.neighborhood}
                  <p>Neighborhood: {food.neighborhood}</p>
                {/if}
                {#if food.diet}
                  <p>Dietary options: {food.diet?.join(", ")}</p>
                {/if}
              </div>

              <div
                class="flex flex-col flex-grow gap-3 justify-center items-start md:items-end"
              >
                <form
                  method="POST"
                  on:submit|preventDefault={handleDeleteFoodFromList}
                >
                  <input type="hidden" name="listId" value={list.id} />
                  <input type="hidden" name="foodId" value={food.id} />
                  <wa-button
                    size="small"
                    variant="error"
                    appearance="outline"
                    type="submit"
                    class="cursor-pointer"
                  >
                    <wa-icon slot="end" name="undo"></wa-icon>
                    Remove from list
                  </wa-button>
                </form>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {/each}
</div>
