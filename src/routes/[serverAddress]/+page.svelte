<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';

	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);

	export let data: PageData;

	let refreshInterval = 5;

	onMount(() => {
		setInterval(() => {
			refreshInterval--;
			if (refreshInterval <= 0) {
				refreshInterval = 5;
				invalidateAll();
			}
		}, 1000);
	});
</script>

<nav class="navbar max-w-5xl mx-auto">
	<div class="navbar-start" />
	<div class="navbar-center">
		<a class="btn btn-primary" href="/">Change server</a>
	</div>
	<div class="navbar-end">
		<div class="radial-progress" style="--value:{(refreshInterval / 5) * 100};">
			{refreshInterval}
		</div>
	</div>
</nav>

<div class="max-w-4xl mx-auto my-10 ">
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

			{#each data.flags as flag}
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

	<h2 class="font-bold text-xl text-center mb-2 mt-10">Config</h2>
	<div>
		<pre class="bg-neutral rounded max-h-[400px] overflow-y-auto p-2">{JSON.stringify(data.config, null, 2)}</pre>
	</div>
</div>
