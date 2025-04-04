import { NextRequest } from "next/server";

// TODO: replace with RSC
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new Response(JSON.stringify({ error: "Missing URL" }), {
      status: 400,
    });
  }

  try {
    const headRes = await fetch(url, { method: "HEAD" });
    const contentType = headRes.headers.get("content-type");

    return Response.json({ mime: contentType });
  } catch (error) {
    console.error("Failed to detect MIME type:", error);
    return new Response(
      JSON.stringify({ mime: null, error: "Failed to fetch file" }),
      {
        status: 500,
      }
    );
  }
}
