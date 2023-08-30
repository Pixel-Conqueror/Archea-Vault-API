import { createInertiaApp } from '@inertiajs/inertia-react';
import ReactDOMServer from 'react-dom/server';
import React from 'react';

export default function render(page) {
	return createInertiaApp({
		page,
		render: ReactDOMServer.renderToString,
		resolve: (name) => require(`./pages/${name}`),
		setup: ({ App, props }) => <App {...props} />,
	});
}
