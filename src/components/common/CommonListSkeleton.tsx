const SidebarSkeleton = () => {
  return (
    <div className="animate-pulse bg-card p-4 rounded-lg w-full h-full">
      <div className="bg-muted h-48 w-full rounded-lg mb-4"></div>
      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-muted rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-muted rounded w-2/3"></div>
    </div>
  );
};

export default SidebarSkeleton;
