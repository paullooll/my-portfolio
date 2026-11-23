import { Suspense, lazy, useRef } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { useAfterLoad } from "./hooks/useAfterLoad";

const Toaster = lazy(() =>
  import("sonner").then(m => ({ default: m.Toaster }))
);

function App() {
  const ready = useAfterLoad();
  // Fade between pages, but never on first load (keeps the prerendered page instant).
  const [location] = useLocation();
  const first = useRef(location);
  const animate = first.current !== location;
  if (animate) first.current = "";
  return (
    <ErrorBoundary>
      <ThemeProvider switchable>
        <div key={location} className={animate ? "route-fade" : undefined}>
          <Switch>
            <Route path="/" component={Home} />
            <Route component={NotFound} />
          </Switch>
        </div>
        {ready && (
          <Suspense fallback={null}>
            <Toaster
              position="bottom-center"
              toastOptions={{
                unstyled: true,
                classNames: { toast: "toast" },
              }}
            />
          </Suspense>
        )}
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
