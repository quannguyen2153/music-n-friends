"use client";

import { Box, List } from "@mui/material";
import { PlaylistItem as PlaylistItemType } from "@/types/PlaylistItem";
import PlaylistItem from "@/components/PlaylistItem";
import React, { useEffect, useRef, useState } from "react";

type PlaylistProps = {
  accessToken: string;
  playlistId: string;
};

export default function Playlist({ accessToken, playlistId }: PlaylistProps) {
  const [playlist, setPlaylist] = useState<PlaylistItemType[]>([]);
  const listRef = useRef<HTMLUListElement>(null);
  const totalResults = useRef(Number.MAX_SAFE_INTEGER);
  const loadingRef = useRef(false);
  const nextPageTokenRef = useRef("");

  const fetchData = async () => {
    if (
      loadingRef.current ||
      !accessToken ||
      totalResults.current <= playlist.length
    )
      return;

    loadingRef.current = true;

    const params = new URLSearchParams();
    if (nextPageTokenRef.current) {
      params.append("pageToken", nextPageTokenRef.current);
    }

    const res = await fetch(
      `http://localhost:3000/api/youtube/playlist/${playlistId}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();

    totalResults.current = data.pageInfo.totalResults;
    setPlaylist((prev) => [...prev, ...(data.items || [])]);
    nextPageTokenRef.current = data.nextPageToken || "";

    loadingRef.current = false;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const list = listRef.current;
      if (!list) return;

      const threshold = 100;
      const isNearBottom =
        list.scrollHeight - list.scrollTop - list.clientHeight < threshold;

      if (isNearBottom && nextPageTokenRef.current) {
        fetchData();
      }
    };

    const list = listRef.current;
    if (list) {
      list.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (list) {
        list.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        bgcolor: "#1e1e1e",
        height: "100vh",
        maxWidth: 600,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <List
        ref={listRef}
        disablePadding
        sx={{
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#1e1e1e",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#555",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#777",
          },
          scrollbarWidth: "thin",
          scrollbarColor: "#555 #1e1e1e",
        }}
      >
        {playlist.map((item, index) => (
          <React.Fragment key={index}>
            <PlaylistItem playlistItem={item} />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
