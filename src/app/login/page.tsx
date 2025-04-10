import { signIn } from "@/auth";
import { Box, Typography, Paper } from "@mui/material";
import { Google } from "@mui/icons-material";

export default async function SignIn() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#323232"
    >
      <Paper
        elevation={6}
        sx={{
          padding: 5,
          borderRadius: 3,
          maxWidth: 400,
          width: "90%",
          textAlign: "center",
          backgroundColor: "#1e1e1e",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: "#ffffff" }}>
          Welcome To Music & Friends
        </Typography>
        <Typography variant="body2" sx={{ color: "#bbbbbb", marginBottom: 3 }}>
          Sign in with your Google account to continue
        </Typography>

        <form
          action={async () => {
            "use server";
            await signIn("google", {
              redirectTo: "/",
            });
          }}
        >
          <button
            type="submit"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 16px",
              width: "100%",
              backgroundColor: "#2e2e2e",
              border: "1px solid #555",
              borderRadius: "8px",
              fontWeight: "bold",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            <Google />
            Sign in with Google
          </button>
        </form>
      </Paper>
    </Box>
  );
}
