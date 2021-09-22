<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	import { sortedBooks } from '$/data/writing';

	export const load: Load = () => ({
		props: {
			books: sortedBooks
		}
	});
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';

	import Slideshow from '$/components/Slideshow/Slideshow.component.svelte';
	import BookTransition from '$comps/Transitions/BookTransition.component.svelte';
	
	export let books: IBook[];
	
	let direction: AnimationDirection = 'right';
	let title: string;
	
	let unSub = page.subscribe(i => title = i.params['title']);

	onDestroy(unSub)

	$: bookIndex = books
		.map(b => b.title)
		.indexOf(title);

	const setTransitionDirection = (e: CustomEvent<AnimationDirection>) =>
		direction = e.detail;
</script>

<header class="flex flex-col items-center my-10">
	<p>Grab a book off the shelf</p>
	<div class="my-10">
		<Slideshow {books} index={bookIndex >= 0 ? bookIndex : 0} on:select={setTransitionDirection} />
	</div>
</header>

<BookTransition refresh={title} {direction}>
	<slot />
</BookTransition>
