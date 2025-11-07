import { useRouter } from "next/router";
import commonData from "@/utils/mock/commonData.json";
import Link from "next/link";

/**
 * CommonLogo component renders the logo of the application.
 * Styled with Tailwind using global CSS variables for colors and fonts.
 */
const CommonLogo = () => {
  return (
    <Link href="/" className="group inline-block">
      <h1
        className="
          text-2xl sm:text-3xl md:text-4xl 
          font-bold 
          text-primary 
          hover:text-accent 
          transition-colors duration-200
          select-none
        "
      >
        {commonData?.projectTitleSmall}
      </h1>
      {/* Optional underline animation on hover */}
      <span className="block h-0.5 bg-primary group-hover:bg-accent mt-1 transition-colors duration-200"></span>
    </Link>
  );
};

export default CommonLogo;
