import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Link,
} from "@mui/material";

type Playlist = {
  id: string;
  thumbnail: string;
  title: string;
  channel: string;
};

const mockPlaylists: Playlist[] = [
  {
    id: "PLf2CUDZ0F9o5OIPIFWEOz20Ps7Z_XCvee",
    thumbnail: "https://i.ytimg.com/vi/PCJXyv2VtH0/maxresdefault.jpg",
    title: "Chill Chinese Songs",
    channel: "Nguyễn Minh Quân",
  },
];

export default async function PlaylistPage() {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }

  const playlists = mockPlaylists;

  return (
    <Box sx={{ padding: 4 }}>
      <Grid
        container
        spacing={4}
        justifyContent="space-evenly"
        alignItems="stretch"
        sx={{ height: "100%" }}
      >
        {playlists.map((playlist) => (
          <Grid
            container
            size={4}
            key={playlist.id}
            justifyContent="space-evenly"
            alignItems="stretch"
          >
            <Link
              href={`/playlist/${playlist.id}`}
              style={{ textDecoration: "none", width: "100%" }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  height: "100%",
                  width: "100%",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={playlist.thumbnail}
                  alt={playlist.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {playlist.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {playlist.channel}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
