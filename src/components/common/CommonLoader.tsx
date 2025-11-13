import { Loader } from "@mantine/core";
import commonData from "@/utils/mock/commonData.json";

/**
 * CommonLoader component displays a loading indicator or a project title
 * based on the provided type prop.
 *
 * @param {Object} props
 * @param {string} [props.type] - Optional. Determines the display mode.
 *                                If type is "pageLoader", a loading spinner
 *                                is shown. Otherwise, the project title in
 *                                Nepali is displayed.
 *
 * @returns {JSX.Element} A JSX element containing either a loading spinner
 *                        or the project title.
 */
function CommonLoader({ type }: { type?: string }) {
  return (
    <section className="flex items-center justify-center fixed inset-0 bg-black z-50">
      {type === "pageLoader" ? (
        <div className="h-[60vh] flex items-center justify-center w-full">
          <Loader />
        </div>
      ) : (
        <h1 className="text-center text-4xl font-bold text-dark-font">
          {commonData?.projectTitleNep}
        </h1>
      )}
    </section>
  );
}

export default CommonLoader;
