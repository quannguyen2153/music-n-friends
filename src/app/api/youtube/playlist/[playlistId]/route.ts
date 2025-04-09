import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  const { playlistId } = await params;
  const authHeader = req.headers.get("authorization");
  const pageToken = req.nextUrl.searchParams.get("pageToken") || "";

  if (!playlistId || !authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid playlistId or Authorization header" },
      { status: 400 }
    );
  }

  const token = authHeader.split(" ")[1];

  const YOUTUBE_API = `https://youtube.googleapis.com/youtube/v3/playlistItems`;
  const query = new URLSearchParams({
    part: "contentDetails,id,snippet,status",
    playlistId,
    maxResults: "50",
    pageToken,
  });

  try {
    const response = await fetch(`${YOUTUBE_API}?${query.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "YouTube API error", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
