<script lang="ts">
	export let book: IBook;
</script>

<section>
	<h1 class="header">{book.title} by {book.author}</h1>
	<div class="my-4">
		<img
			class="ml-4 rounded-sm float-right h-60 w-40 transition-all origin-top-right duration-500"
			src={book.image}
			alt={book.title}
		/>
		<p class="text-lg">{book.desc}</p>
	</div>
	<ul role="list" class="my-4">
        <li>
            Genres: {book.keywords.join(', ')}
        </li>
		<li>
			Publisher: {book.publisher}
		</li>
		<li>
			Audience: {book.audience}
		</li>
		<li>
			Print ISBN: {book.printedIsbn}
		</li>
		<li>
			Ebook ISBN: {book.printedIsbn}
		</li>
		<li>
			<a href={book.link}>Available for Purchase Here</a>
		</li>
	</ul>
</section>

<style lang="scss">
	img {
		&:hover {
			height: 24rem;
			width: 16rem;
		}
	}
    li {
        margin-top: 0.5rem;
    }
</style>
