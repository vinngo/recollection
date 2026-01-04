/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	RECOLLECTION_BUCKET: R2Bucket;
}

export default {
	async fetch(request: Request, env: Env, ctx): Promise<Response> {
		const imageUrl = new URL(request.url).pathname.slice(1);

		const object = await env.RECOLLECTION_BUCKET.get(imageUrl);

		if (!object) {
			return new Response('Image not found', { status: 404 });
		}

		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set('Cache-Control', 'public, max-age=31536000, immutable');
		headers.set('Access-Control-Allow-Origin', '*');

		return new Response(object.body, { headers });
	},
} satisfies ExportedHandler<Env>;
