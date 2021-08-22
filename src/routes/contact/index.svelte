<script lang="ts">
	import { EMAIL_REGEX } from '$lib/constants';

	import Button from '$comps/General/Button.component.svelte';
	import Loading from '$comps/General/Loading.component.svelte';
	import Alert from '$comps/General/Alert.component.svelte';

	import Input from '$comps/Input/Input.component.svelte';
import Error from '../__error.svelte';

	let loading = false;

	let alertMessage: string | undefined | null;
	let messageType: MessageType;

	async function onSubmit(e: any) {
		if (!e.target.email.value || !e.target.message.value) {
			messageType = 'error';
			alertMessage = 'Email and message must be filled out';
			return;
		}
		if (!EMAIL_REGEX.test(e.target.email.value)) {
			messageType = 'error';
			alertMessage = 'Email is not a valid email address';
			return;
		}
		loading = true;
		messageType = null;
		await submitQuestion(e.target.email.value, e.target.message.value);
	}

	async function submitQuestion(email: string, message: string) {
		try {
			const res = await fetch('contact/message', {
				method: 'POST',
				body: JSON.stringify({ email, message })
			});
			const data = await res.json();
			console.log(data);
			alertMessage = data.response;
			messageType = 'success';
		} catch (e) {
			alertMessage = `${e} -- Unable to send your message, sorry. Please try again later`;
			messageType = 'error';
		} finally {
			if (!alertMessage && !messageType) {
				alertMessage = `Something went wrong. This feature does not appear to work yet. You must send an email manually, unfortunately.`;
				messageType = 'error';
			}
			loading = false;
		}
	}

	function dismissMessage() {
		alertMessage = null;
		messageType = null;
	}
</script>

<svelte:head>
	<title>EGT Press - Contact</title>
	<meta
		name="description"
		content="Get the details for how to directly contact English Garden Talk Press and/or Saint Bridged Vineyard Press."
	/>
</svelte:head>

{#if alertMessage && messageType}
	<Alert {messageType} on:dismiss={dismissMessage}>
		{alertMessage}
	</Alert>
{/if}

<h1 class="header">Contact Us</h1>

<div class="my-2">
	<h3 class="block-title">Send us a message directly</h3>
	<form
		on:submit|preventDefault={onSubmit}
		class="flex flex-col p-4 border-2 border-solid border-black shadow-md items-start"
	>
		<label for="email">Email address:</label>
		<Input type="text" id="email" required />
		<label for="message">Message:</label>
		<Input type="textarea" id="message" required />
		<Button type="submit" disabled={loading}>
			{#if loading}
				<div class="w-12">
					<Loading size="1rem" />
				</div>
			{:else}
				Submit
			{/if}
		</Button>
	</form>
</div>

<h2 class="py-4 text-2xl">Contact Details:</h2>

<div>
	<h3 class="block-title">English Garden Talk Press</h3>
	<p><a href="mailto:contact@egtpress.com">By email</a></p>
	<p>By mail: 566 McCaslin Boulevard, POB 270252, Superior, Colorado, 80027-9998</p>
	<p>
		<a
			href="https://www.facebook.com/English-Garden-Talk-Press-2023488454570609/"
			rel="external"
			target="blank"
		>
			On Facebook
		</a>
	</p>
</div>

<div>
	<h3 class="block-title">Benyakir Horowitz</h3>
	<p>
		<a href="mailto:ben@benyakiredits.com"> By email </a>
	</p>
	<p>
		<a href="https://benyakiredits.com/about-me/contact/" rel="external" target="blank">
			On his blog
		</a>
	</p>
	<p>
		<a href="https://www.facebook.com/BenyakirTen" rel="external" target="blank"> On Facebook </a>
	</p>
	<p>
		<a href="https://twitter.com/BenyakirTen" rel="external" target="blank"> On Twitter </a>
	</p>
</div>
