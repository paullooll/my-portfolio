import { type FormEvent, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Github,
  Linkedin,
  Loader2,
  Mail,
  Send,
} from "lucide-react";
import content from "@/content";
import { SectionFrame } from "@/components/SectionFrame";
import { missingKeyMessage } from "@/lib/contact";

/** Contact form. Sends through Web3Forms (VITE_WEB3FORMS_ACCESS_KEY). */
export function Contact({ onSent }: { onSent: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const github = content.socials.find(s => s.icon === "github")!.href;
  const linkedin = content.socials.find(s => s.icon === "linkedin")!.href;

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      setErrorMessage(missingKeyMessage(import.meta.env.DEV, content.email));
      setSubmitting(false);
      return;
    }

    formData.append("access_key", accessKey);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        form.reset();
        onSent();
      } else {
        setErrorMessage(
          data.message ||
            "Failed to send message. Please check your Web3Forms access key."
        );
      }
    } catch {
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const links = [
    { href: `mailto:${content.email}`, icon: Mail, label: content.email },
    { href: linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: github, icon: Github, label: "GitHub" },
  ];

  return (
    <SectionFrame id="contact" title="Let's work together">
      <div className="contact-grid">
        <div className="contact-copy" data-reveal>
          <p className="lede">{content.contact.lede}</p>
          <p className="muted">{content.contact.body}</p>
          <ul className="contact-links">
            {links.map(({ href, icon: Icon, label }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  <Icon size={17} aria-hidden="true" />
                  <span>{label}</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form
          className="card card-pad contact-form"
          onSubmit={submitForm}
          data-reveal
        >
          <label className="field" htmlFor="name">
            Your name
            <input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Jane Smith"
              required
            />
          </label>
          <label className="field" htmlFor="email">
            Email address
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@company.com"
              required
            />
          </label>
          <label className="field" htmlFor="message">
            Message
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="What would you like to talk about?"
              required
            />
          </label>
          {/* Honeypot for bots (Web3Forms botcheck). Hidden from people and assistive tech. */}
          <input
            type="checkbox"
            name="botcheck"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
          <button
            className="button button-primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                Sending… <Loader2 className="spin" size={16} aria-hidden="true" />
              </>
            ) : submitted ? (
              <>
                Message sent <Check size={17} aria-hidden="true" />
              </>
            ) : (
              <>
                Send message <Send size={16} aria-hidden="true" />
              </>
            )}
          </button>
          <div aria-live="polite">
            {submitted && (
              <p className="form-success">
                Thank you! Your message has been sent directly to my inbox.
              </p>
            )}
          </div>
          {errorMessage && (
            <p className="form-error" role="alert">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </SectionFrame>
  );
}
