<script lang="ts">
  import { storage } from "../storage";
  import Switch from "./Switch.svelte";

  export let count: number;
  let successMessage: string = null;

  function increment() {
    count += 1;
  }

  function decrement() {
    count -= 1;
  }

  function save() {
    storage.set({ count }).then(() => {
      successMessage = "Options saved!";

      setTimeout(() => {
        successMessage = null;
      }, 1500);
    });
  }
</script>

<div class="container">
  Options:
  <Switch label="Task name linking" design="slider" />
  <br />
  NOTE: options are not functional at the moment
  <!-- <Switch
    label="Experimental features (disabled)"
    fontSize={12}
    disabled={true}
    design="slider"
  />
  <button on:click={save}>Save</button> -->
</div>

<style>
  .container {
    min-width: 250px;
  }

  button {
    border-radius: 2px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    background-color: #2ecc71;
    color: #ecf0f1;
    transition: background-color 0.3s;
    padding: 5px 10px;
    border: none;
  }

  button:hover,
  button:focus {
    background-color: #27ae60;
  }

  .success {
    color: #2ecc71;
    font-weight: bold;
  }
</style>
