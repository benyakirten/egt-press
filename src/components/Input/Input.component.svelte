<script lang="ts">
    export let required = false;
    export let type: InputType = 'text';
    export let id: string;
    export let value = '';
</script>

{#if type === 'text'}
    <input on:change type="text" {id} class="px-2 border-2 border-solid border-black w-1/3" {required} {value} />
{:else}
    <textarea on:change {id} {required} class="px-2 border-2 border-solid border-black w-4/5 h-16" {value} />
{/if}