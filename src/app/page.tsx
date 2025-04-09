import { auth, signOut } from "@/auth";
import Playlist from "@/components/Playlist";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }

  return (
    <Playlist
      accessToken={session.accessToken as string}
      playlistId="PLf2CUDZ0F9o7-UvQzmXZZTir48K_ySGA8"
    ></Playlist>
  );
}
