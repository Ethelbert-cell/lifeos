export default function CharacterLoading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse pb-20">
      <div className="h-9 w-48 bg-muted rounded-xl" />
      <div className="h-52 bg-muted rounded-2xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-muted rounded-2xl" />)}
      </div>
      <div className="h-52 bg-muted rounded-2xl" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {[...Array(12)].map((_, i) => <div key={i} className="h-28 bg-muted rounded-2xl" />)}
      </div>
    </div>
  );
}
