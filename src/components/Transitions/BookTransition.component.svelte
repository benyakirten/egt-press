<script lang="ts">
	import { fly } from 'svelte/transition';

	export let refresh = '';
	export let direction: AnimationDirection = 'right';
</script>

{#key refresh}
	<div
		in:fly={{ x: (direction === 'right' ? -1 : 1) * 100, duration: 800, delay: 800 }}
		out:fly={{ x: (direction === 'right' ? 1 : -1) * 100, duration: 800 }}
	>
		<slot />
	</div>
{/key}
