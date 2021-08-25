<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let image: string;
	export let alt: string;
	export let position: ImagePosition = 'primary';

	const dispatch = createEventDispatcher();
</script>

<figure
	on:click={() => dispatch('select', alt)}
	class="flex flex-col justify-end overflow-hidden cursor-pointer mx-1 {position === 'primary' ? 'h-3/4 w-24 md:h-full md:w-36' : 'h-1/2 w-16 md:h-3/4 md:w-24'}"
>
	<img class={position === 'primary' ? '' : 'filter blur-sm'} src={image} {alt} />
	<figcaption class="h-20" aria-hidden={position === 'primary' ? 'false' : 'true'}>
		<slot />
	</figcaption>
</figure>