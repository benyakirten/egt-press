<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";

    export let messageType: MessageType = 'success';
    const dispatch = createEventDispatcher();
</script>

<div transition:fade class="fixed top-0 left-0 flex items-center justify-center my-4 text-white h-14 w-full {messageType === 'success' ? 'bg-success' : 'bg-error'}">
    <slot />
    <button type="button" class="text-2xl mx-2" on:click={() => dispatch('dismiss')}>&times;</button>
</div>