<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ page }) => ({ props: { path: page.path } });
</script>

<script lang="ts">
	export let path: string;
</script>

<svelte:head>
	<title>404</title>
</svelte:head>

<h1 class="header">404 - Page Does Not Exist</h1>
<p class="text-xl px-2 py-4 shadow-md">
	Unfortunately, no page at {path} exists. You find yourself here because something went wrong.
	I suggest you hit the back button or visit a link from thosse in the menu.
</p>
