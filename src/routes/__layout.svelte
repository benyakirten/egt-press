<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ page }) => ({ props: { path: page.path.split('/')[1] } });
</script>

<script lang="ts">
	import '../tailwind.css';

	import PageTransition from '$/components/Transitions/PageTransition.component.svelte';

	export let path: string;
</script>
<div class="mx-8 sm:mx-8 lg:mx-36">
	<nav class="layout h-24 text-2xl">
		<a class="flex items-center" class:active-route={path === ''} href="/">
			<img class="h-11 mr-2" src="/illustrations/girl.png" alt="EGT Press Logo" />
			Home
		</a>
		<a class:active-route={path.includes('books')} href="/books"> Books </a>
		<a class:active-route={path === 'meet-us'} href="/meet-us"> Meet Us </a>
	</nav>
	
	<main class="min-h-screen">
		<PageTransition refresh={path}>
			<slot />
		</PageTransition>
	</main>
	
	<footer class="layout h-14 text-lg">
		<a class:active-route={path === 'privacy-policy'} href="/privacy-policy"> Privacy Policy </a>
		<a class:active-route={path === 'contact'} href="/contact"> Contact </a>
		<div class="text-xs">
			<p>&COPY; 2021 by English Garden Talk Press</p>
		</div>
	</footer>
</div>

<style lang="scss" global>
	@import '../styles/main.scss';

	a {
		@include hover-fadein;
		@include hover-bar;
	}

	.active-route {
		opacity: 1;
		&::after {
			transform: scaleX(1);
		}
	}
</style>
