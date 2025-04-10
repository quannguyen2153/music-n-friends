"use client";

import Playlist from "@/components/Playlist";
import { Box, Grid } from "@mui/material";
import YouTube, { YouTubeEvent } from "react-youtube";
import React, { useEffect, useRef, useState } from "react";
import { PlaylistItem } from "@/types/PlaylistItem";

type PlaylistPlayerProps = {
  accessToken: string;
  playlistId: string;
};

export default function PlaylistPlayer({
  accessToken,
  playlistId,
}: PlaylistPlayerProps) {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [playingVideoIndex, setPlayingVideoIndex] = useState(0);
  const totalResults = useRef(Number.MAX_SAFE_INTEGER);
  const autoFetch = useRef(true);
  const loadingRef = useRef(false);
  const nextPageTokenRef = useRef("");

  const fetchPlaylist = async () => {
    if (loadingRef.current || !accessToken || !autoFetch.current) return;

    loadingRef.current = true;

    const params = new URLSearchParams();
    if (nextPageTokenRef.current) {
      params.append("pageToken", nextPageTokenRef.current);
    }

    const res = await fetch(
      `/api/youtube/playlist/${playlistId}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();

    totalResults.current = data.pageInfo.totalResults;
    setPlaylist((prev) => {
      const updated = [...prev, ...(data.items || [])];
      if (updated.length >= totalResults.current) {
        autoFetch.current = false;
      }
      return updated;
    });
    nextPageTokenRef.current = data.nextPageToken || "";

    loadingRef.current = false;
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

  const onVideoEnd = () => {
    if (playingVideoIndex < playlist.length - 1) {
      setPlayingVideoIndex((currentVideoIndex) => currentVideoIndex + 1);
    }
  };

  return (
    <Grid container>
      <Grid size={4}>
        <Playlist
          playlist={playlist}
          fetchPlaylist={fetchPlaylist}
          autoFetch={autoFetch.current}
          onVideoClick={setPlayingVideoIndex}
        />
      </Grid>
      <Grid size={8}>
        <Box width="100%" height="50%">
          <YouTube
            videoId={playlist[playingVideoIndex]?.contentDetails.videoId}
            opts={{
              height: "100%",
              width: "100%",
              playerVars: { autoplay: 1 },
            }}
            onReady={(event: YouTubeEvent) => event.target.playVideo()}
            onEnd={onVideoEnd}
            style={{ height: "100%", width: "100%" }}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
