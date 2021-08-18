<script lang="ts">
	import { fly } from 'svelte/transition';
	export let refresh = '';
</script>

{#key refresh}
	<div in:fly={{ x: -100, duration: 800, delay: 800 }} out:fly={{ x: 100, duration: 800 }}>
		<slot />
	</div>
{/key}
