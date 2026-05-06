export async function POST(request: Request) {
  try {
    const data = (await request.json()) as Record<string, unknown>;
    // TODO: send via email instead of relying on server logs
    for (const [key, value] of Object.entries(data)) {
      console.log(key, value);
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error('feedback parse error', err);
    return Response.json({ ok: false }, { status: 400 });
  }
}
