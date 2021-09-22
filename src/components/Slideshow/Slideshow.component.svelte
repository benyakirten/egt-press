<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';

	import SlideshowImage from './SlideshowImage.component.svelte';
	import { titleToKebab } from '$/lib/strings';

	export let books: IBook[];
	export let index: number = 0;

	const dispatch = createEventDispatcher();

	$: indexMinusOne = getPreviousIndex(index);
	$: indexMinusTwo = getPreviousIndex(indexMinusOne);

	$: indexPlusOne = getNextIndex(index);
	$: indexPlusTwo = getNextIndex(indexPlusOne);

	function getNextIndex(idx: number) {
		return idx === 0 ? books.length - 1 : idx - 1;
	}

	function getPreviousIndex(idx: number) {
		return idx === books.length - 1 ? 0 : idx + 1;
	}

	function setIndexAndNavigate(idx: number) {
		dispatch('select', idx < index ? 'left' : 'right');
		index = idx;
		goto(`/books/${titleToKebab(books[index].title)}`);
	}
</script>

<section class="flex justify-center items-center h-64">
	<div class="hidden-before-md">
		<button class="slideshow-button" on:click={() => setIndexAndNavigate(indexMinusOne)}>
			&larr;
		</button>
	</div>
	<SlideshowImage
		on:select={() => setIndexAndNavigate(indexMinusTwo)}
		image={books[indexMinusTwo].image}
		alt={books[indexMinusTwo].title}
		position="secondary"
	/>
	<SlideshowImage
		on:select={() => setIndexAndNavigate(indexMinusOne)}
		image={books[indexMinusOne].image}
		alt={books[indexMinusOne].title}
		position="secondary"
	/>
	<SlideshowImage
		on:select={(e) => goto(`/books/${e.detail}`)}
		image={books[index].image}
		alt={books[index].title}
	>
		<p class="text-xs text-center">{books[index].title}</p>
	</SlideshowImage>
	<SlideshowImage
		on:select={() => setIndexAndNavigate(indexPlusOne)}
		image={books[indexPlusOne].image}
		alt={books[indexPlusOne].title}
		position="secondary"
	/>
	<SlideshowImage
		on:select={() => setIndexAndNavigate(indexPlusTwo)}
		image={books[indexPlusTwo].image}
		alt={books[indexPlusTwo].title}
		position="secondary"
	/>

	<div class="hidden-before-md">
		<button class="slideshow-button" on:click={() => setIndexAndNavigate(indexPlusOne)}>
			&rarr;
		</button>
	</div>
</section>

<div class="hidden-after-md flex justify-center">
	<button class="slideshow-button" on:click={() => setIndexAndNavigate(indexMinusOne)}>
		&larr;
	</button>
	<button class="slideshow-button" on:click={() => setIndexAndNavigate(indexPlusOne)}>
		&rarr;
	</button>
</div>

<style lang="scss">
	.slideshow-button {
		opacity: 0.8;
		transition: all 0.8s;

		&:hover {
			transform: scale(1.5);
			opacity: 1;
		}
	}
</style>
