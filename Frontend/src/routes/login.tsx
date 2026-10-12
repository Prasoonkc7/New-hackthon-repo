import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, ErrorState, Notice } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — JalRakshak" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { signIn, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (mode === "register" && name.trim().length < 2) { setError("Please enter your name."); return; }
    setBusy(true);
    try {
      if (mode === "login") await signIn(email, password);
      else await register(name, email, password);
      await navigate({ to: "/dashboard" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to authenticate.");
    } finally { setBusy(false); }
  };
  return (
    <>
      <PageHeader title={mode === "login" ? "Sign in" : "Create a citizen account"} description="Accounts let you track your own requests and reports. Emergency services are not automatically contacted." />
      <main className="mx-auto max-w-md space-y-4 px-4 py-8 sm:px-6">
        <Notice tone="warning">JalRakshak is a hackathon prototype, not an official government emergency service.</Notice>
        {error && <ErrorState message={error} />}
        <form className="card-surface grid gap-4 p-5" onSubmit={submit}>
          {mode === "register" && <label className="grid gap-1 text-sm font-medium">Name<Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>}
          <label className="grid gap-1 text-sm font-medium">Email<Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
          <label className="grid gap-1 text-sm font-medium">Password<Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
          <Button type="submit" disabled={busy}>{busy ? "Working…" : mode === "login" ? "Sign in" : "Register"}</Button>
          <Button type="button" variant="ghost" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
            {mode === "login" ? "Create an account" : "I already have an account"}
          </Button>
        </form>
      </main>
    </>
  );
}
