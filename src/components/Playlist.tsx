"use client";

import { Box, LinearProgress, List, ListItem } from "@mui/material";
import { PlaylistItem as PlaylistItemType } from "@/types/PlaylistItem";
import PlaylistItem from "@/components/PlaylistItem";
import React, { useEffect, useRef } from "react";

type PlaylistProps = {
  playlist: PlaylistItemType[];
  fetchPlaylist: () => Promise<void>;
  autoFetch: boolean;
  onVideoClick: (index: number) => void;
  playingVideoIndex: number;
};

export default function Playlist({
  playlist,
  fetchPlaylist,
  autoFetch,
  onVideoClick,
  playingVideoIndex,
}: PlaylistProps) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!autoFetch) return;

      const list = listRef.current;
      if (!list) return;

      const threshold = 100;
      const isNearBottom =
        list.scrollHeight - list.scrollTop - list.clientHeight < threshold;

      if (isNearBottom) {
        fetchPlaylist();
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
        height: "100%",
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
            <PlaylistItem playlistItem={item} onVideoClick={onVideoClick} playingVideoIndex={playingVideoIndex} />
          </React.Fragment>
        ))}
        {autoFetch && (
          <ListItem sx={{ px: 2 }}>
            <LinearProgress
              color="inherit"
              sx={{ width: "100%", bgcolor: "#333" }}
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
}
