import { PlaylistItem as PlaylistItemType } from "@/types/PlaylistItem";
import {
  Avatar,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

type PlaylistItemProps = {
  playlistItem: PlaylistItemType;
};

export default function PlaylistItem({ playlistItem }: PlaylistItemProps) {
  return (
    <ListItem alignItems="center" sx={{ color: "#fff" }}>
      <Typography
        variant="body1"
        sx={{ width: 20, mr: 2, textAlign: "center" }}
      >
        {playlistItem.snippet.position + 1}
      </Typography>

      <ListItemAvatar sx={{ mr: 2 }}>
        <Avatar
          variant="square"
          src={playlistItem.snippet.thumbnails?.medium?.url}
          sx={{
            width: 80,
            height: 45,
            bgcolor: "#000", // fallback bg in case image fails
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
          <Link
            href={`https://www.youtube.com/watch?v=${playlistItem.snippet.resourceId.videoId}`}
            target="_blank"
            rel="noopener"
            underline="hover"
            sx={{ color: "#fff", fontWeight: 500 }}
          >
            {playlistItem.snippet.title}
          </Link>
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
