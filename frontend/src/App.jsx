import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './router';
import { ToastContainer } from './components/ui/Toast';
import Particles from '@/components/ui/Particles';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      retry: 1
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: 'var(--bg-app)' }}>
        <Particles
          particleColors={["#00e476", "#b1ccc3", "#e5c364", "#00ff85"]}
          particleCount={180}
          particleSpread={12}
          speed={0.08}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>
      <AppRouter />
      <ToastContainer />
    </QueryClientProvider>);

}

export default App;