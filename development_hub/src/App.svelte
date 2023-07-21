<script lang="ts">
  import { emit, listen } from "@tauri-apps/api/event";
  let text: string = "Hello World!";

  listen("update", (event) => {
    console.log(event);
    console.log(event.payload);
    text = event.payload as string;
  });
</script>

<main class="container">
  <div>{text}</div>
</main>
