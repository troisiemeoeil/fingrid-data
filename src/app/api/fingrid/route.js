
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get('endpoint');
  
    if (!endpoint) {
      return new Response(JSON.stringify({ error: 'Missing endpoint param' }), {
        status: 400
      });
    }
  
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}/data?pageSize=10`;
  
    try {
      const res = await fetch(apiUrl, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY
        }
      });
  
      const data = await res.json();
  
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch' }), {
        status: 500
      });
    }
  }
  