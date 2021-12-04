<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	import { people } from '$data/writing';

	export const load: Load = () => ({ props: { people }});
</script>

<script lang="ts">
	import Person from "$comps/General/Person.component.svelte";
	export let people: IPerson[];

	let openPerson: string | null = people[0].name;

	function toggleOpenPerson(e: CustomEvent<string>) {
		console.log(e);
		openPerson = openPerson === e.detail
			? null
			: e.detail;
	}
</script>

<svelte:head>
	<title>EGT Press - Meet Us</title>
	<meta
		name="description"
		content="Learn about the people who make up English Garden Talk Press and Saint Bridged Vineyard Press.
		We're real people, we promise, and we have our own life stories that informs what we write."
	/>
</svelte:head>

<div>
	<h1 class="header">The People of EGT Press</h1>
	{#each people as person, index (person.name)}
		<Person
			{person}
			alignLeft={index % 2 === 0 ? false : true}
			open={openPerson === person.name}
			on:toggle={toggleOpenPerson}
		/>
	{/each}
</div>