import { auth, signOut } from "@/auth";
import Playlist from "@/components/Playlist";
import { Box, Grid } from "@mui/material";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }

  return (
    <Grid container>
      <Grid size={4}>
        <Playlist
          accessToken={session.accessToken as string}
          playlistId="PLf2CUDZ0F9o7-UvQzmXZZTir48K_ySGA8"
        ></Playlist>
      </Grid>
      <Grid size={8}>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
          height="100%"
        >
          <form
            action={async () => {
              "use server";
              await signOut({
                redirectTo: "/login",
              });
            }}
          >
            <button type="submit">Signout</button>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}
