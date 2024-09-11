import { Suspense } from 'react';
import { LoadingPlaceholder } from 'genesys-react-components';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';

import DocViewerLayout from './components/docviewer/DocViewerLayout';

import './App.scss';
import { BrowserRouter } from 'react-router-dom';

function App() {
	return (
		<RecoilRoot>
			<RecoilNexus />
			<Suspense fallback={<LoadingPlaceholder />}>
				<BrowserRouter basename={process.env['PUBLIC_URL'] || '/'}>
					<DocViewerLayout />
				</BrowserRouter>
			</Suspense>
		</RecoilRoot>
	);
}

export default App;
