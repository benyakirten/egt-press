import path from 'path';

import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		target: '#svelte',
		vite: {
			resolve: {
				alias: {
					'$': path.resolve('./src'),
					'$lib': path.resolve('./src/lib'),
					'$data': path.resolve('./src/data'),
					'$comps': path.resolve('./src/components')
				}
			}
		},
		adapter: vercel()
	}
};

export default config;
