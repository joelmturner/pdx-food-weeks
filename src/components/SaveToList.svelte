<script lang="ts">
  import type { ListItem } from "../types";

  export let foodId: string;
  export let lists: ListItem[] = [];

  let myElement: HTMLDialogElement | null;

  const handleChooseList = async (e: any) => {
    myElement?.showModal();
  };

  const handleSaveToList = async (
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
  ) => {
    const formData = new FormData(event.target);

    // get all the list ids from the form
    const listIds = formData.getAll("list").filter(Boolean);

    // send null user doesn't have any list
    const resolvedListIds =
      listIds?.length === 1 && listIds[0] === "noListHere" ? null : listIds;

    if (!foodId) {
      console.log("No food id");
      return;
    }

    const saved = await fetch(`/api/lists/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ foodId, listIds: resolvedListIds }),
    });

    myElement?.close();
  };
</script>

<form>
  <button
    class="btn btn-xs btn-outline btn-secondary"
    on:click|preventDefault={handleChooseList}>+ Save to List</button
  >
</form>

<dialog id={foodId} class="modal" bind:this={myElement}>
  <div class="modal-box flex flex-col gap-6">
    <h3 class="font-bold text-lg">Save to list</h3>
    <form on:submit|preventDefault={handleSaveToList}>
      <div class="flex flex-col gap-2">
        <div class="form-control">
          {#if lists.length === 0}
            <label class="cursor-pointer label flex gap-3 justify-start">
              <input
                type="checkbox"
                name="list"
                value="noListHere"
                class="checkbox checkbox-accent"
              />
              <span class="label-text">Saved Items</span>
            </label>
          {/if}

          {#each lists as list, index}
            <label class="cursor-pointer label flex gap-3 justify-start">
              <input
                type="checkbox"
                value={list.id}
                name="list"
                class="checkbox checkbox-accent"
              />
              <span class="label-text">{list.name}</span>
            </label>
          {/each}
        </div>
      </div>
      <div class="modal-action flex gap-1">
        <button
          type="button"
          class="btn"
          on:click|preventDefault={() => myElement?.close()}>Cancel</button
        >
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  </div>
</dialog>
