export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-[var(--chatgpt-bg-primary)]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[var(--chatgpt-border-light)] border-t-[var(--chatgpt-accent)] rounded-full animate-spin"></div>
        <div className="absolute inset-0 m-auto w-8 h-8 bg-[var(--chatgpt-accent)]/20 rounded-full animate-pulse flex items-center justify-center">
          <div className="w-2 h-2 bg-[var(--chatgpt-accent)] rounded-full"></div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <h2 className="text-xl font-bold tracking-tight text-[var(--chatgpt-text-primary)] animate-pulse">
          PREMIUM<span className="text-[var(--chatgpt-accent)]">STORE</span>
        </h2>
        <p className="text-[var(--chatgpt-text-muted)] text-sm mt-2 font-medium tracking-wide uppercase">
          Initializing experience...
        </p>
      </div>
    </div>
  );
}
