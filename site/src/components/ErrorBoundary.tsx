import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

// Without this, a failed lazy-chunk load (a stale cached index.html right
// after a deploy, a dropped request) or any render-time exception silently
// unmounts the whole app — the visitor sees nothing but the plain #11151a
// body background from index.css, with no error and no way to tell what
// happened. This turns that into a visible, reloadable message instead.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error('Render error:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-6 text-center">
          <p className="font-display text-xl text-[#E6DECD]">Something went wrong loading this page.</p>
          <p className="max-w-md text-sm text-[#767F83]">
            {this.state.error.message || 'An unexpected error occurred.'} Try reloading — if it keeps happening,
            it's worth reporting.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-ink"
            style={{ background: 'linear-gradient(123deg, #E4CFA0 7%, #C6A15B 45%, #8F723D 72%, #B6421D 100%)' }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
