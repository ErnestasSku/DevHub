<script lang="ts">
  import { emit, listen } from "@tauri-apps/api/event";
  // let text: string = "Hello World!";
  let task = {};

  let fields = [{ name: "a", content: "b" }];
  $: {
    console.log("updating fields");
    // fields = task.fields;
  }

  listen("update", (event) => {
    text = event.payload as string;
    fields = event.payload.Task.fields;
  });
</script>

<main class="container">
  <!-- <div>{text}</div> -->

  <!-- {task} -->
  <!-- {fields} -->
  {#each fields as { name, content }}
    <div>{@html content}</div>
  {/each}
</main>
