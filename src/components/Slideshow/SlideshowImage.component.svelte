<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let image: string;
	export let alt: string;
	export let position: ImagePosition = 'primary';

	const dispatch = createEventDispatcher();
</script>

<figure
	on:click={() => dispatch('select', alt)}
	class="flex flex-col justify-end cursor-pointer mx-1 {position === 'primary' ? 'h-full w-36' : 'h-3/4 w-24'}"
>
	<img class={position === 'primary' ? '' : 'filter blur-sm'} src={image} {alt} />
	<figcaption class="h-20" aria-hidden={position === 'primary' ? 'false' : 'true'}>
		<slot />
	</figcaption>
</figure>
