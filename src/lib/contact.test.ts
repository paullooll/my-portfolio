import { describe, expect, it } from "vitest";
import { missingKeyMessage } from "./contact";

describe("missingKeyMessage", () => {
  it("tells the developer which env var to set", () => {
    expect(missingKeyMessage(true)).toContain("VITE_WEB3FORMS_ACCESS_KEY");
  });
  it("gives visitors a way to reach out instead of setup instructions", () => {
    const msg = missingKeyMessage(false, "me@example.com");
    expect(msg).not.toContain("VITE_");
    expect(msg).toContain("me@example.com");
  });
});
