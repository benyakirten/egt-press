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
	import { goto } from '$app/navigation';
	import BookTransition from '$/components/Transitions/BookTransition.component.svelte';

	export let books: IBook[];
	export let path: string;

	let bookIndex = books
		.map(b => b.title)
		.indexOf(path.split('/')[2]);

	const navigateToBook = (e: CustomEvent<IBook>) => goto(`/books/${e.detail.title}`);
</script>

<header class="flex flex-col items-center my-10">
	<p>Grab a book off the shelf</p>
	<div class="my-10">
		<Slideshow {books} index={bookIndex >= 0 ? bookIndex : 0} on:select={navigateToBook} />
	</div>
</header>

<BookTransition refresh={path}>
	<slot />
</BookTransition>
