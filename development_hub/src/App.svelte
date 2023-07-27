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
    // console.log(event);
    // console.log(event.payload);
    // console.log(event.payload.Task);
    // text = event.payload as string;
    task = event.payload.Task;
    fields = event.payload.Task.fields;
    console.log(fields);
    console.log(fields[0]);
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
