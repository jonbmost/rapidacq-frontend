export async function GET() {
  try {
    const res = await fetch('https://acquisition-assistant-266001336704.us-central1.run.app/', {
      cache: 'no-store', // Disable caching
    });
    const text = await res.text();
    return Response.json({ 
      status: res.status,
      statusText: res.statusText,
      body: text.substring(0, 500) 
    });
  } catch (error: any) {
    return Response.json({ error: error.message });
  }
}
