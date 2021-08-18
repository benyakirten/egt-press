<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	export let refresh = '';
</script>

{#key refresh}
	<div in:fade={{ duration: 500, delay: 800 }} out:fly={{ x: 100, duration: 800 }}>
		<slot />
	</div>
{/key}
