"use client";

// React state for form, NextAuth for innlogging, og router for å navigere etter suksess
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  // Lokal form-state: dette holder inputfeltene i skjemaet
  const [form, setForm] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
  });
  // `error` viser menneskevennlige feilmeldinger til brukeren
  const [error, setError] = useState("");
  // `loading` hindrer dobbelt-innsending og kan brukes for spinner/disable knapp
  const [loading, setLoading] = useState(false);
  // Router til å navigere programmatisk etter vellykket registrering/innlogging
  const router = useRouter();

  // Kalles når skjemaet sendes inn
  // Mål: (1) opprette bruker via API, (2) logge inn med NextAuth, (3) navigere til /profile
  const onSubmit = async (e) => {
    // Hindrer at brukeren trykker flere ganger raskt og starter flere requests
    if (loading) return;
    // Hindrer at nettleseren gjør full page reload på form-submit
    e.preventDefault();
    // Nullstill forrige feilmelding
    setError("");

    // AbortController lar oss avbryte request hvis den tar for lang tid (f.eks. dårlig nett)
    const controller = new AbortController();
    // Etter 10 sekunder aborter vi kallet for å ikke la UI "henge"
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      setLoading(true);

      // Kall vårt server-API som oppretter bruker i databasen
      // Viktig: Content-Type må være "application/json" når vi sender JSON
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Vi sender form-data som JSON-kropp
        body: JSON.stringify(form),
        // Knytter abort-signal slik at vi kan avbryte ved timeout
        signal: controller.signal,
      });

      // Serveren svarer med statuskode:
      // - 201 Created: alt OK → vi går videre til innlogging
      // - 409 Conflict: e-post/brukernavn er allerede tatt
      // - 400 Bad Request: mangler felter / ugyldig input
      // - 500 Server Error: noe gikk galt på server
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (res.status === 409) setError("Bruker finnes allerede");
        else if (res.status === 400) setError(data?.error || "Mangler felter");
        else setError("Serverfeil – prøv igjen");
        return; // Stopp videre flyt hvis registrering feilet
      }

      // Når bruker er opprettet forsøker vi å logge inn med samme credentials (NextAuth Credentials)
      // Vi bruker redirect:false for å kontrollere flyten selv og kunne vise feil uten å forlate siden
      const r = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      // Dersom NextAuth ikke aksepterer innlogging (uvanlig rett etter registrering, men mulig)
      if (r?.error) {
        setError("Feil e‑post/passord");
        return;
      }

      // Alt OK → send bruker til beskyttet side
      router.push("/profile");
    } catch (e) {
      // Skiller på avbrudd (timeout) og andre nettverksfeil
      if (e?.name === "AbortError") setError("Tidsavbrudd – prøv igjen");
      else setError("Nettverksfeil – sjekk tilkoblingen");
      // I utvikling kan du se mer detaljer i konsollen
      if (process.env.NODE_ENV === "development") console.error(e);
    } finally {
      // Rydd opp: stopp timeout-timeren og nullstill loading uansett utfall
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  // TODO: Her skal du rendre JSX for skjemaet (inputs + knapp) og knytte onSubmit={onSubmit}
  return (
    <main className="container" style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Registrer</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          placeholder="E-post"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Brukernavn"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          placeholder="Visningsnavn (valgfritt)"
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
        />
        <input
          placeholder="Passord"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Oppretter..." : "Opprett konto"}
        </button>
      </form>
    </main>
  );
}
