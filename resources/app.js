import { createInertiaApp } from '@inertiajs/inertia-react';
import { createRoot } from 'react-dom/client';
import React from 'react';

import 'Styles/colors.scss';
import 'Styles/form.scss';
import 'Styles/index.scss';

createInertiaApp({
	progress: {
		delay: 250,
		color: '#576490',
		includeCSS: true,
		showSpinner: true,
	},
	resolve: (name) => require(`./pages/${name}`),
	setup({ el, App, props }) {
		createRoot(el).render(<App {...props} />);
	},
});
