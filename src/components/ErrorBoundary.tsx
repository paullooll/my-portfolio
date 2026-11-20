import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Last-resort fallback: a retro "system crash" screen with a reload button. */
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="not-found">
        <p className="hud-label" style={{ color: "var(--danger)" }}>
          SYSTEM ERROR
        </p>
        <h1 className="pixel-heading">Something broke</h1>
        <p className="muted">
          An unexpected error occurred. Reloading usually fixes it.
        </p>
        <button
          type="button"
          className="button button-primary"
          onClick={() => window.location.reload()}
        >
          ↻ Reload page
        </button>
      </main>
    );
  }
}

export default ErrorBoundary;
