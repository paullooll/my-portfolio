import { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";
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
  return (
    <ErrorBoundary>
      <ThemeProvider switchable>
        <Switch>
          <Route path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
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
