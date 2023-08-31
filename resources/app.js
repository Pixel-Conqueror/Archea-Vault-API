import { createInertiaApp } from '@inertiajs/inertia-react';
import { createRoot } from 'react-dom/client';
import React from 'react';

import 'Styles/index.scss';
import 'Styles/form.scss';
import 'Styles/colors.scss';

createInertiaApp({
	resolve: (name) => require(`./pages/${name}`),
	setup({ el, App, props }) {
		createRoot(el).render(<App {...props} />);
	},
});
