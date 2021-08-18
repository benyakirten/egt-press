<script lang="ts">
    import { createEventDispatcher } from 'svelte';
	export let person: IPerson;
    export let alignLeft = true;
    export let open = false;

    const dispatch = createEventDispatcher();
</script>

<section class="person my-10 {open ? 'h-full' : 'h-10'}" style="transition: all 500ms">
    <div>
        <button
            class="flex pl-2 w-full rounded-xl border border-solid border-black {open ? 'bg-blue-100' : 'bg-white'}"
            on:click={() => dispatch('toggle', person.name)}
        >
            <span
                class="transition-transform duration-500"
                style={open ? 'transform: rotate(270deg)' : 'transform: rotate(90deg)'}
            >
                &#10148;
            </span>
            <span class="mx-2">{person.name}</span>
        </button>
        <div
            style='transform-origin: top; {open ? 'transform: scaleY(1)' : 'transform: scaleY(0)'}'
            class="flex flex-col md:flex-row transition-transform duration-500 {alignLeft ? '' : 'md:flex-row-reverse'} mt-2"
        >
            <img src={person.image} alt={person.name} class="hidden invisible md:block md:visible" />
            <div class="flex flex-col justify-between {alignLeft ? 'ml-4' : 'mr-4'}">
                <div>
                    <div class="flex flex-col justify-between">
                        <img src={person.image} alt={person.name} class="mb-2 h-24 w-24 block visible md:hidden md:invisible" />
                        <h3 class="text-lg mb-2">
                            About {person.name.split(' ')[0]}:
                        </h3>
                    </div>
                    <p >{@html person.bio}</p>
                </div>
                {#if person.books}
                    <ul role="list" class="my-2">
                        <h3 class="text-lg">Books:</h3>
                        {#each person.books as book (book)}
                            <li>
                                <a href={`/books/${book}`}>{book}</a>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>
        </div>
    </div>
</section>