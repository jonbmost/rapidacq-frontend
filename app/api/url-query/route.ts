import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mcpUrl, question } = body;

    if (!mcpUrl || !question) {
      return NextResponse.json(
        { error: 'Missing required fields: mcpUrl and question' },
        { status: 400 }
      );
    }

    // Call the tomcp service
    const tomcpResponse = await fetch('https://tomcp.org/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: mcpUrl,
        query: question,
      }),
    });

    if (!tomcpResponse.ok) {
      const errorText = await tomcpResponse.text();
      return NextResponse.json(
        { error: `tomcp service error: ${errorText}` },
        { status: tomcpResponse.status }
      );
    }

    const data = await tomcpResponse.json();

    return NextResponse.json({
      answer: data.answer || data.response || data.content,
      content: data.content,
      ...data
    });

  } catch (error) {
    console.error('URL Query API Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
