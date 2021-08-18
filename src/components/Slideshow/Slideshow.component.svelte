<script lang="ts">
	import { goto } from '$app/navigation';
	import SlideshowImage from './SlideshowImage.component.svelte';

	export let books: IBook[];
	export let index: number = 0;

	let indexMinusOne = index === 0 ? books.length - 1 : index - 1;
	let indexMinusTwo = indexMinusOne === 0 ? books.length -1 : indexMinusOne - 1;

	let indexPlusOne = index === books.length - 1 ? 0 : index + 1;
	let indexPlusTwo = indexPlusOne === books.length -1 ? 0 : indexPlusOne + 1;

	function moveLeft() {
		indexPlusTwo = indexPlusOne;
		indexPlusOne = index;
		index = indexMinusOne;
		indexMinusOne = indexMinusTwo;
		indexMinusTwo = indexMinusTwo === 0 ? books.length - 1 : indexMinusTwo - 1;

		navigateToIndex();
	}

	function moveRight() {
		indexMinusTwo = indexMinusOne;
		indexMinusOne = index;
		index = indexPlusOne;
		indexPlusOne = indexPlusTwo;
		indexPlusTwo = indexPlusTwo === books.length - 1 ? 0 : indexPlusTwo + 1;

		navigateToIndex();
	}

	function setIndexAndNavigate(idx: number) {
		index = idx;

		indexMinusOne = index === 0 ? books.length - 1 : index - 1;
		indexMinusTwo = indexMinusOne === 0 ? books.length -1 : indexMinusOne - 1;

		indexPlusOne = index === books.length - 1 ? 0 : index + 1;
		indexPlusTwo = indexPlusOne === books.length -1 ? 0 : indexPlusOne + 1;

		navigateToIndex();
	}

	function navigateToIndex() {
		goto(`/books/${books[index].title}`);
	}
</script>

<section class="flex justify-center items-center h-64">
	<div class="hidden-before-md">
		<button class="slideshow-button" on:click={moveLeft}>&larr;</button>
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
	<SlideshowImage on:select={e => goto(`/books/${e.detail}`)} image={books[index].image} alt={books[index].title}>
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
		<button class="slideshow-button" on:click={moveRight}>&rarr;</button>
	</div>
</section>
<div class="hidden-after-md flex justify-center">
	<button class="slideshow-button" on:click={moveLeft}>&larr;</button>
	<button class="slideshow-button" on:click={moveRight}>&rarr;</button>
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
