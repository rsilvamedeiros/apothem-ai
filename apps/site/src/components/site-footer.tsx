export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} APOTHEM AI</span>
        <span>apothemai.com.br</span>
      </div>
    </footer>
  );
}
