<script context="module" lang="ts">
	export const hydrate = false;
</script>

<svelte:head>
	<title>EGT Press - Home</title>
	<meta
		name="description"
		content="The home of English Garden Talk Press and Saint Bridged Vineyard Press.
		Learn about our authors and the books, whether already published or upcoming and discover us on social media."
	/>
</svelte:head>

<div class="lead">
	<h1 class="header my-4">Welcome to the home of our craft publishing company</h1>
	<img class="mx-auto" src="illustrations/watercolor.jpg" alt="A mesmerizing watercolor">
</div>

<div class="flex">
	<article class="article">
		<h3>English Garden Talk Press</h3>
		<p>
			Specializing in children's literature, English Garden Talk Press' main feature is the Olive
			and Violet Bright series by Gloria T. August. Envisioned as a book that parents and caretakers
			can read to their children for warm, heartwarming stories, the series follows the story of four young English
			hailing from Edwardian England who go around the world and solve mysteries. So far they've had adventures
			in England, Hong Kong, Tahiti, Bavaria and Hungary, and they're sure to explore more of the world
			as the 20th century starts to dawn across the world.
		</p>
	</article>

	<article class="article">
		<h3>Saint Bridged Vineyard Press</h3>
		<p>
			Specializing in literature for adults, Saint Bridged Vineyard Press' feature author is Benyakir Horowitz.
			His books all occupy the same universe, a science-fiction cyberpunk quasi-satirical world
			where humanity keeps on keeping on, seemingly for the sake of keeping up appearances. Inspired by
			Isaac Asimov and Philip K. Dick, the pushing question in his stories is where does modern existence begin and end?
			How human can a robot be, and, moreover, how human is anyone? The definitions and boundaries of knowledge
			and existence are always mutable in Benyakir Horowitz's work.
		</p>
	</article>
</div>

<style lang="scss">
	.article {
		&:first-child {
			margin-right: 1.5rem;
		}
	}
</style>
