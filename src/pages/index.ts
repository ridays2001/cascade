import type { LazyExoticComponent } from 'react';
import { lazy } from 'react';

const Home = lazy(() => import('./home'));

interface RouteType {
	exact?: boolean;
	path?: string;
	component: LazyExoticComponent<() => JSX.Element>;
	key: string;
}

const routes: Array<RouteType> = [
	{
		component: Home,
		key: 'home',
		path: '/'
	}
];

export default routes;
