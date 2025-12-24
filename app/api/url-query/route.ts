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

    console.log('Querying tomcp with:', { mcpUrl, question });

    // Call the tomcp service with JSON-RPC format
    const tomcpResponse = await fetch('https://tomcp.org/sse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'fetch_url',
          arguments: {
            url: mcpUrl,
            query: question,
          }
        },
        id: Date.now()
      }),
    });

    if (!tomcpResponse.ok) {
      const errorText = await tomcpResponse.text();
      console.error('tomcp error:', errorText);
      return NextResponse.json(
        { error: `tomcp service error: ${errorText}` },
        { status: tomcpResponse.status }
      );
    }

    const data = await tomcpResponse.json();
    console.log('tomcp response:', JSON.stringify(data, null, 2));

    // Extract the answer from JSON-RPC response
    if (data.result?.content) {
      const content = Array.isArray(data.result.content) 
        ? data.result.content[0]?.text 
        : data.result.content;
      
      return NextResponse.json({
        answer: content,
        content: data.result.content
      });
    }

    // Return full response if structure is different
    return NextResponse.json(data);

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
