export const onRequestGet = ({ request }: { request: Request }) => {
  const { origin } = new URL(request.url);

  return new Response(`User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};
