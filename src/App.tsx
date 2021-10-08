import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from './pages';

const Loading = () => (
	<div className='loader'>
		<h1>Loading...</h1>
	</div>
);

const App = () => (
	<div className='App'>
		<div className='container-fluid'>
			<Suspense fallback={<Loading />}>
				<Switch>
					{routes.map(route => (
						<Route {...route} />
					))}
				</Switch>
			</Suspense>
		</div>
	</div>
);

export default App;
