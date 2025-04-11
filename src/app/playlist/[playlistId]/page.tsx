import { auth, signOut } from "@/auth";
import PlaylistPlayer from "@/components/PlaylistPlayer";
import { Logout } from "@mui/icons-material";
import { redirect } from "next/navigation";

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }

  const { playlistId } = await params;

  return (
    <>
      <PlaylistPlayer
        accessToken={session.accessToken as string}
        playlistId={playlistId}
        userImageSrc={session.user?.image as string}
      />
      <form
        action={async () => {
          "use server";
          await signOut({
            redirectTo: "/login",
          });
        }}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
      >
        <button
          type="submit"
          style={{
            backgroundColor: "#1e1e1e",
            color: "white",
            border: "none",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
          }}
          title="Logout"
        >
          <Logout />
        </button>
      </form>
    </>
  );
}
