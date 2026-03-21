const SidebarSkeleton = () => {
  return (
    <div className="animate-pulse bg-card/40 backdrop-blur-sm border border-border/50 p-4 rounded-3xl w-full h-full shadow-sm">
      <div className="bg-muted h-48 w-full rounded-2xl mb-4"></div>
      <div className="h-4 bg-muted rounded-full w-3/4 mb-3"></div>
      <div className="h-4 bg-muted rounded-full w-5/6 mb-3"></div>
      <div className="h-4 bg-muted rounded-full w-1/3 mt-6"></div>
    </div>
  );
};

export default SidebarSkeleton;