export function Header() {
  return (
    <header className="w-full py-16 md:py-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-tight text-foreground mb-4">
          recollection
        </h1>
        <p className="font-mono text-sm md:text-base text-muted-foreground">
          moments worth remembering
        </p>
      </div>
    </header>
  );
}
