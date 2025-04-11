import { PlaylistItem as PlaylistItemType } from "@/types/PlaylistItem";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { GraphicEq } from "@mui/icons-material";

type PlaylistItemProps = {
  playlistItem: PlaylistItemType;
  onVideoClick: (index: number) => void;
  playingVideoIndex: number;
};

export default function PlaylistItem({
  playlistItem,
  onVideoClick,
  playingVideoIndex,
}: PlaylistItemProps) {
  const isPlaying = playingVideoIndex === playlistItem.snippet.position;

  return (
    <ListItem
      alignItems="center"
      onClick={() => onVideoClick(playlistItem.snippet.position)}
      sx={{
        color: "#fff",
        cursor: "pointer",
        backgroundColor: isPlaying ? "rgba(255, 255, 255, 0.1)" : "transparent",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        },
      }}
    >
      <Typography
        variant="body1"
        sx={{ width: 20, mr: 2, textAlign: "center" }}
      >
        {isPlaying ? (
          <GraphicEq fontSize="small" sx={{ color: "#1db954" }} />
        ) : (
          playlistItem.snippet.position + 1
        )}
      </Typography>

      <ListItemAvatar sx={{ mr: 2 }}>
        <Avatar
          variant="square"
          src={playlistItem.snippet.thumbnails?.medium?.url}
          sx={{
            width: 80,
            height: 45,
            bgcolor: "#000",
            img: {
              objectFit: "cover",
              width: "100%",
              height: "100%",
            },
          }}
        />
      </ListItemAvatar>

      <ListItemText
        primary={
          <Typography variant="body1">{playlistItem.snippet.title}</Typography>
        }
        secondary={
          <Typography variant="caption" sx={{ color: "#aaa" }}>
            {playlistItem.snippet.videoOwnerChannelTitle}
          </Typography>
        }
      />
    </ListItem>
  );
}
