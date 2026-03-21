import Link from "next/link";
import commonData from "@/utils/mock/commonData.json";

const CommonLogo = () => {
  return (
    <Link href="/" className="group inline-block">
      <span className="text-2xl md:text-3xl font-extrabold text-primary group-hover:text-primary/80 transition-colors duration-300 tracking-tight select-none">
        {commonData?.projectTitleSmall}
      </span>
      <span className="block h-1 w-0 bg-primary/80 group-hover:w-full rounded-full mt-0.5 transition-all duration-500 ease-out"></span>
    </Link>
  );
};

export default CommonLogo;