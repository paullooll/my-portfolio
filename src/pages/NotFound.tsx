import { Link } from "wouter";
import { HauntSprite } from "@/components/haunt/HauntSprite";

/** Custom 404: "GAME OVER · Continue?" with Haunt asleep. */
export default function NotFound() {
  return (
    <main className="not-found">
      <div className="scanlines" aria-hidden="true" />
      <HauntSprite state="sleep" size={120} />
      <p className="hud-label accent">ERROR 404 · ROOM NOT FOUND</p>
      <h1 className="pixel-heading">Game over</h1>
      <p className="muted">
        This room doesn&apos;t exist. Even Haunt fell asleep looking for it.
      </p>
      <Link href="/" className="button button-primary">
        ▶ Continue?
      </Link>
    </main>
  );
}
