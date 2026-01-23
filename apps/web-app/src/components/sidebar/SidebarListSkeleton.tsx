export default function SidebarListSkeleton({ count }: { count: number }) {
  return (
    <div className="animate-pulse mx-1.5 space-y-2.5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className=" h-5.5 font-sans text-base antialiased font-light leading-relaxed bg-muted-foreground/25 rounded-md text-inherit"
        ></div>
      ))}
    </div>
  );
}
