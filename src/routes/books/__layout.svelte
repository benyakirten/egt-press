<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	import { books } from '$/data/writing';
	import Slideshow from '$/components/Slideshow/Slideshow.component.svelte';

	export const load: Load = ({ page }) => ({
		props: {
			path: page.path,
			books: books.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
		}
	});
</script>

<script lang="ts">
	import BookTransition from '$comps/Transitions/BookTransition.component.svelte';

	export let books: IBook[];
	export let path: string;

	let direction: AnimationDirection = 'right';

	let bookIndex = books
		.map(b => b.title)
		.indexOf(path.split('/')[2]);

	function setTransitionDirection(e: CustomEvent<AnimationDirection>) {
		direction = e.detail;
	}
</script>

<header class="flex flex-col items-center my-10">
	<p>Grab a book off the shelf</p>
	<div class="my-10">
		<Slideshow {books} index={bookIndex >= 0 ? bookIndex : 0} on:select={setTransitionDirection} />
	</div>
</header>

<BookTransition refresh={path} {direction}>
	<slot />
</BookTransition>
