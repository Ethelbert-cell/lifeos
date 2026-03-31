export default function GymLoading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse pb-20">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-muted rounded-xl" />
          <div className="h-4 w-64 bg-muted rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-muted rounded-xl" />
      </div>
      <div className="h-24 bg-muted rounded-2xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-muted rounded-2xl" />)}
      </div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-2xl" />)}
      </div>
    </div>
  );
}
