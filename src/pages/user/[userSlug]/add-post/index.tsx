import { Controller, useForm } from "react-hook-form";
import "suneditor/dist/css/suneditor.min.css";
import CommonLogo from "@/components/common/CommonLogo";
import showNotify from "@/utils/notify";
import { Input, MultiSelect, Text, TextInput } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { APIAddBlog } from "@/api/blog";
import { ApiGetTag } from "@/api/tag";
import CommonImageUpload from "@/components/common/CommonImageUpload";
import Link from "next/link";
import CustomEditor from "@/components/common/CommonSunEditor";
import Head from "next/head";

type FormValues = {
  title: string;
  content: string;
  tagIds: string[];
  image: File | null;
};

const AddPost = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: "", content: "", tagIds: [], image: null },
  });

  const router = useRouter();
  const slug = router.query.userSlug as string;

  const [loading, setLoading] = useState(false);
  const [tagData, setTagData] = useState<any[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await ApiGetTag();
        setTagData(res.data);
      } catch (e) {
        console.error("Failed to fetch tags", e);
      }
    })();
  }, []);

  const tagOptions = tagData.map((t) => ({ value: t.id, label: t.title }));

  const onSubmit = async (data: FormValues) => {
    if (!uploadedImageUrl)
      return showNotify("error", "Please select and upload an image.");
    setLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.content,
        image: uploadedImageUrl,
        tagIds: data.tagIds,
      };
      const resp = await APIAddBlog(slug, payload);
      showNotify("success", resp?.message || "Post added successfully!");
      reset();
      setUploadedImageUrl(null);
      router.push(`/user/${slug}`);
    } catch (e: any) {
      console.error("Submission error:", e);

      // Safely extract the error message from the backend response
      // (This handles standard Axios formats and fallback JS errors)
      const errorMessage =
        e?.response?.data?.message ||
        e?.message || e ||
        "Failed to add post. Please try again.";

      // If the backend threw a 403 (Forbidden), it's our moderation gatekeeper
      if (e?.response?.status === 403) {
        // Show as a warning so the user knows they just need to fix their content
        showNotify("warning", errorMessage);
      } else {
        // Show as a standard error for 500s or network failures
        showNotify("error", errorMessage);
      }

    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (imageUrl: string | null) => {
    setUploadedImageUrl(imageUrl);
    setValue("image", imageUrl as any);
  };

  return (
    <main className="min-h-screen bg-background">
      <Head>
        <title>RecBlog | Add Post</title>
      </Head>

      <form onSubmit={handleSubmit(onSubmit)} className="container mx-auto px-4 py-6 md:py-12 max-w-5xl">
        {/* Top bar - Better spacing & alignment */}
        <section className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 md:mb-10 border-b border-border/50 pb-6">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="flex items-center gap-3">
              <CommonLogo />
              <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />
              <label className="text-muted-foreground font-medium text-sm md:text-base">Draft</label>
            </div>
            {/* Mobile-only Back link to save space */}
            <Link
              href={`/user/${slug}`}
              className="sm:hidden text-xs font-bold text-primary"
            >
              BACK
            </Link>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Link
              href={`/user/${slug}`}
              className="hidden sm:block text-primary hover:text-accent font-semibold transition-colors"
            >
              Back to Profile
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto px-8 py-3 rounded-full text-white font-bold bg-primary hover:scale-[1.02] active:scale-95 shadow-lg transition-all flex justify-center items-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </section>

        {/* Form body - Adjusted padding for mobile */}
        <section className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl md:rounded-[2.5rem] p-4 sm:p-8 md:p-10 shadow-sm space-y-6 md:space-y-10">

          {/* Title & Tags - Stack on mobile, side-by-side on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label={<span className="text-sm font-bold mb-1.5 block">Post Title <span className={'text-red-500'}>*</span></span>}
              placeholder="Enter a catchy title..."
              size="md"
              {...register("title", {
                required: "Title is required",
                validate: (value) =>
                  /^[a-zA-Z0-9][a-zA-Z0-9\s\-:;'""]*$/.test(value) ||
                  "Title must start with a letter or number",
              })}
              error={errors.title?.message?.toString()}
              classNames={{
                input: "bg-background/80 rounded-xl md:rounded-full border-border/60 focus:border-primary h-[50px] px-5",
                label: "ml-1"
              }}
            />

            <Controller
              name="tagIds"
              control={control}
              rules={{ required: "Select at least one tag" }}
              render={({ field }) => (
                <MultiSelect
                  label={<span className="text-sm font-bold mb-1.5 block">Tags <span className={'text-red-500'}>*</span></span>}
                  placeholder="Choose up to 3"
                  data={tagOptions}
                  maxValues={3}
                  searchable
                  size="md"
                  {...field}
                  error={errors.tagIds?.message?.toString()}
                  classNames={{
                    input: "bg-background/80 rounded-xl md:rounded-2xl border-border/60 focus:border-primary min-h-[50px] px-3",
                    label: "ml-1"
                  }}
                />
              )}
            />
          </div>

          {/* Content - Ensure editor doesn't break container */}
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1 block w-fit">Content Details <span className="text-red-500">*</span></label>
            <div className="rounded-2xl md:rounded-3xl overflow-hidden border border-border/60 bg-background/30 shadow-inner">
              <Controller
                name="content"
                control={control}
                rules={{ required: "Content is required" }}
                render={({ field }) => (
                  <CustomEditor
                    value={field.value}
                    onChange={field.onChange}
                    // Ensure the editor has a min-height for mobile usage
                  />
                )}
              />
            </div>
            {errors.content && (
              <span className="text-red-500 text-xs mt-1 ml-1">{errors.content.message}</span>
            )}
          </div>

          {/* Featured image - Simplified layout */}
          <div className="w-full lg:max-w-md pt-4">
            <CommonImageUpload
              control={control}
              name="image"
              label={<span className="text-sm font-bold mb-2 block">Featured Image <span className="text-red-500">*</span></span>}
              rules={{ required: "A featured image is required" }}
              errors={errors}
              required={false}
              onImageChange={handleImageChange}
            />
          </div>
        </section>
      </form>
    </main>
  );
};

export default AddPost;