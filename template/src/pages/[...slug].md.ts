import { getCollection, getEntry } from 'astro:content';
import type { APIContext } from 'astro';
import { docSlug } from '../markdown/path.ts';

export async function getStaticPaths() {
	const docs = await getCollection('docs');
	return docs
		.filter((entry) => !entry.data.draft)
		.map((entry) => ({ params: { slug: docSlug(entry.id) } }));
}

export async function GET({ params }: APIContext) {
	const id = params.slug ?? 'index';
	const entry = (await getEntry('docs', id)) ?? (await getEntry('docs', `${id}/index`));

	if (!entry) {
		return new Response('Not found', { status: 404 });
	}

	return new Response(entry.body ?? '', {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
		},
	});
}
