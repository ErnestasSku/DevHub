<script lang="ts">
  import { emit, listen } from "@tauri-apps/api/event";
  let text: string = "Hello World!";

  listen("update", (event) => {
    text = event.payload as string;
  });
</script>

<main class="container">
  <div>{text}</div>
</main>
