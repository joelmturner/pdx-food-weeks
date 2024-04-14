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
      <div class="flex gap-5 group align-end">
        <h2 class="text-2xl font-bold">{list.name}</h2>
        <form
          method="POST"
          on:submit|preventDefault={handleDeleteList}
          class="flex align-middle opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
        >
          <input type="hidden" name="listId" value={list.id} />
          <button type="submit" class="text-red-500"> Delete </button>
        </form>
      </div>

      <div class="flex flex-col gap-8">
        {#if list.foodIds.length === 0}
          <p>No items in this list yet</p>
        {:else}
          {#each savedListItems.filter( savedListItem => list.foodIds.includes(savedListItem.id) ) as food (food.id)}
            <div class="flex gap-8">
              <img src={food.imageUrl} alt={food.title} class="w-60 h-60" />

              <div class="prose">
                <h3 class="text-xl">
                  <span class="font-bold">{food.title}</span
                  >{` from ${food.location}`}
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
                class="flex flex-col flex-grow gap-3 justify-center items-end"
              >
                <form
                  method="POST"
                  on:submit|preventDefault={handleDeleteFoodFromList}
                >
                  <input type="hidden" name="listId" value={list.id} />
                  <input type="hidden" name="foodId" value={food.id} />
                  <button type="submit" class="btn btn-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                    Delete
                  </button>
                </form>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {/each}
</div>
