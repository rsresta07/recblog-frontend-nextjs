import { Loader } from "@mantine/core";
import commonData from "@/utils/mock/commonData.json";

function CommonLoader({ type }: { type?: string }) {
  return (
    <section className="flex items-center justify-center fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      {type === "pageLoader" ? (
        <div className="h-[60vh] flex items-center justify-center w-full">
          <Loader color="var(--primary)" />
        </div>
      ) : (
        <h1 className="text-center text-primary animate-pulse">
          {commonData?.projectTitleNep}
        </h1>
      )}
    </section>
  );
}

export default CommonLoader;