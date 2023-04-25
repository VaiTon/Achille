<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import type { Flag } from '$lib/flag';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);

	export let data: PageData;

	let flags: Flag[] | undefined = undefined;
	let config: object | undefined = undefined;

	let errored = false;

	const refreshFlags = async () => {
		flags = (await (await fetch(data.serverAddress + '/api/flags')).json()) as Flag[];
		flags.reverse();
	};

	const refreshConfig = async () => {
		config = await (await fetch(data.serverAddress + '/api/config')).json();
	};
	const refresh = async () => {
		try {
			await fetch(data.serverAddress + '/');
			errored = false;
		} catch (e) {
			errored = true;
			return;
		}

		refreshFlags();
		refreshConfig();
	};

	const DEFAULT_INTERVAL = 10;

	let refreshInterval = DEFAULT_INTERVAL;
	let timerId: number;
	onMount(async () => {
		await refresh();
		timerId = setInterval(() => {
			refreshInterval--;
			if (refreshInterval <= 0) {
				refreshInterval = DEFAULT_INTERVAL;
				refresh();
			}
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(timerId);
	});
</script>

<nav class="navbar bg-primary text-primary-content rounded-xl shadow-md mb-8 mt-8 max-w-5xl mx-auto sticky top-2 z-10">
	<div class="navbar-start">
		<a class="btn btn-ghost" href="/">Change server</a>
	</div>
	<div class="navbar-center">
		<span class="font-mono">
			{#if refreshInterval == DEFAULT_INTERVAL}
				Refreshing...
			{:else}
				Connected to {data.serverAddress}
			{/if}
		</span>
	</div>
	<div class="navbar-end">
		<span class="countdown me-4 text-xl font-mono">
			<span style="--value:{refreshInterval};" />
		</span>
	</div>
</nav>

{#if errored}
	<div class="alert alert-error shadow-lg max-w-3xl mx-auto">
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current flex-shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span>Error while fetching data</span>
		</div>
	</div>
{:else}
	<div class="flex gap-10 mx-10">
		<div class="card bg-base-200 w-96 grow">
			<p class="card-body text-xl font-mono text-center">Flags sent this cycle: 0</p>
		</div>
		<div class="card bg-base-200 w-96 grow">
			<p class="card-body text-xl font-mono text-center">Exploits working: 0</p>
		</div>
		<div class="card bg-base-200 w-96 grow">
			<p class="card-body text-xl font-mono text-center">Cycle: 0</p>
		</div>
		<div class="card bg-base-200 w-96 grow">
			<p class="card-body text-xl font-mono text-center">A-Index: 0.00</p>
		</div>
	</div>

	<div class="max-w-4xl mx-auto my-10 ">
		{#if flags != null}
			<h2 class="font-bold text-xl text-center mb-2">Flags</h2>
			<div class="overflow-auto max-h-[400px] bg-neutral rounded">
				<table class="table table-compact w-full">
					<thead class="sticky top-0">
						<td>Team</td>
						<td>Flag</td>
						<td>Status</td>
						<td>Exploit</td>
						<td>Received</td>
						<td>Sent Cycle</td>
					</thead>

					{#each flags as flag}
						<tr class="hover">
							<td>{flag.team}</td>
							<td class="font-mono">{flag.flag}</td>
							<td>{flag.status}</td>
							<td class="font-mono">{flag.sploit}</td>
							<td title={flag.receivedTime}>
								{dayjs(flag.receivedTime).fromNow()}
							</td>
							<td>{flag.sentCycle}</td>
						</tr>
					{/each}
				</table>
			</div>
		{/if}

		{#if config != null}
			<h2 class="font-bold text-xl text-center mb-2 mt-10">Config</h2>
			<div>
				<pre class="bg-neutral rounded max-h-[400px] overflow-y-auto p-2">
{JSON.stringify(config, null, 2)}
				</pre>
			</div>
		{/if}
	</div>
{/if}
