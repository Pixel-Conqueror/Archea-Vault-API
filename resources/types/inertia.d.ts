import type { Page, PageProps, Errors, ErrorBag } from '@inertiajs/inertia';
import User from 'App/Models/User';

export interface InertiaPage extends Page<PageProps> {
	props: {
		errors: Errors & ErrorBag;
		auth: {
			user?: User;
			isAuthenticated: boolean;
		};
	};
}
