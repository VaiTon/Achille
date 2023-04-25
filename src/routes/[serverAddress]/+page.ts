import type { PageLoad } from './$types';

export const ssr = false;

type Flag = {
	flag: string;
	sploit: string;
	team: string;
	receivedTime: string;
	status: string;
	checkSystemResponse: string | null;
	sentCycle: number | null;
};

export const load = (async ({ fetch, params }) => {
	const serverAddress = atob(params.serverAddress);
	const config = (await fetch(serverAddress + '/api/config')).json();
	const flags = (await (await fetch(serverAddress + '/api/flags')).json()) as Flag[];
	flags.reverse();
	return { flags: flags, config };
}) satisfies PageLoad;
