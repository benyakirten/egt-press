<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	import { kebabToTitle } from '$/lib/strings';
	import { books } from '$data/writing';

	export const load: Load = ({ page }) => {
		const book = books.find(b => b.title.toLowerCase() === kebabToTitle(page.params.title).toLowerCase());
		return book
			? { props: { book } }
			: null;
	}
</script>

<script lang="ts">
	import Book from "$/components/General/Book.component.svelte";

	export let book: IBook;
</script>

<svelte:head>
	<title>{book.title}</title>
	<meta
		name="description"
		content="Read about {book.title}, whose genres are {book.keywords.join(', ')}"
	/>
</svelte:head>

<Book {book} />