import React from 'react';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
	resolve: (name) => require(`./Pages/${name}`),
	setup({ el, App, props }) {
		createRoot(el).render(<App {...props} />);
	},
});
