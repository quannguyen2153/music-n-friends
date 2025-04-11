"use client";

import Playlist from "@/components/Playlist";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Home } from "@mui/icons-material";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import React, { useEffect, useRef, useState } from "react";
import { PlaylistItem } from "@/types/PlaylistItem";
import { redirect } from "next/navigation";

type PlaylistPlayerProps = {
  accessToken: string;
  playlistId: string;
  userImageSrc: string;
};

export default function PlaylistPlayer({
  accessToken,
  playlistId,
  userImageSrc,
}: PlaylistPlayerProps) {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [playingVideoIndex, setPlayingVideoIndex] = useState(-1);
  const playerRef = useRef<YouTubePlayer | null>(null);
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
    (async () => {
      await fetchPlaylist();
      setPlayingVideoIndex(0);
    })();
  }, []);

  useEffect(() => {
    if (playlist.length > 0 && playingVideoIndex < 0) {
      setPlayingVideoIndex(0);
    }
  }, [playlist]);

  useEffect(() => {
    if (playerRef.current && playlist[playingVideoIndex]) {
      playerRef.current.loadVideoById(
        playlist[playingVideoIndex].contentDetails.videoId
      );
    }
  }, [playingVideoIndex]);

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "#1e1e1e", height: 64 }}>
        <Toolbar>
          <IconButton
            onClick={() => {
              redirect("/");
            }}
            edge="start"
            color="inherit"
            aria-label="home"
          >
            <Home />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            HỘI NGƯỜI GIÀU (tình cảm)
          </Typography>
          <IconButton edge="end" color="inherit" aria-label="user-avatar">
            <Avatar src={userImageSrc} alt="User Avatar" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Grid container>
        <Grid size={4} sx={{ height: "calc(100vh - 64px)" }}>
          <Playlist
            playlist={playlist}
            fetchPlaylist={fetchPlaylist}
            autoFetch={autoFetch.current}
            onVideoClick={setPlayingVideoIndex}
            playingVideoIndex={playingVideoIndex}
          />
        </Grid>
        <Grid size={8}>
          <Box width="100%" height="50%">
            <YouTube
              opts={{
                height: "100%",
                width: "100%",
                playerVars: { autoplay: 1 },
              }}
              onReady={(event: YouTubeEvent) => {
                playerRef.current = event.target;
                if (playlist.length > 0 && playingVideoIndex >= 0) {
                  playerRef.current.loadVideoById(
                    playlist[playingVideoIndex].contentDetails.videoId
                  );
                }
              }}
              onEnd={() => {
                if (playingVideoIndex < playlist.length - 1) {
                  setPlayingVideoIndex((index) => index + 1);
                }
              }}
              style={{ height: "100%", width: "100%" }}
            />
          </Box>
          <Box width="100%" height="50%" display="flex">
            <Box
              flex={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h6">Description</Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ borderWidth: 3}} />

            <Box
              flex={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h6">Comments</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
