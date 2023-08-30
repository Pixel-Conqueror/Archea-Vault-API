export function makeRequest({ url, body }: { url: string; body: object }) {
	return fetch(url, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(extractData);
}

async function extractData(res: any) {
	const data = await res.json();
	if (res.ok) {
		return data;
	} else {
		throw data;
	}
}
