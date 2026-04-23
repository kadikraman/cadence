export async function POST(request: Request) {
  try {
    const data = (await request.json()) as Record<string, unknown>;
    for (const [key, value] of Object.entries(data)) {
      console.log(key, value);
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.log('feedback parse error', err);
    return Response.json({ ok: false }, { status: 400 });
  }
}
