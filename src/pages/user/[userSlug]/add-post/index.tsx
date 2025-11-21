import { Controller, useForm } from "react-hook-form";
import "suneditor/dist/css/suneditor.min.css";
import CommonLogo from "@/components/common/CommonLogo";
import showNotify from "@/utils/notify";
import { Button, Input, MultiSelect, Text, TextInput } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { APIAddBlog } from "@/api/blog";
import { ApiGetTag } from "@/api/tag";
import CustomSunEditor from "@/components/common/CommonSunEditor";
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
      console.error(e);
      showNotify("error", "Failed to add post.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (imageUrl: string | null) => {
    setUploadedImageUrl(imageUrl);
    setValue("image", imageUrl as any);
  };

  return (
    <main className="pt-5 p-[5rem] bg-background">
      <Head>
        <title>RecBlog | Add Post</title>
      </Head>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Top bar */}
        <section className="flex justify-between items-center mb-8">
          <div className="flex gap-6 items-end">
            <CommonLogo />
            <Text className="text-foreground">Draft</Text>
          </div>
          <div className="flex gap-6 items-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-primary-foreground bg-primary hover:bg-accent transition flex items-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading && (
                <svg
                  className="animate-spin h-4 w-4 text-primary-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              {loading ? "Publishing..." : "Publish"}
            </button>
            <Link
              href={`/user/${slug}`}
              className="text-primary hover:text-accent transition-colors"
            >
              Profile
            </Link>
          </div>
        </section>

        {/* Form body */}
        <section className="space-y-6 mb-12">
          {/* Title & Tags */}
          <div className="flex w-full gap-6">
            <TextInput
              label="Title"
              placeholder="Your post title"
              withAsterisk
              className="w-2/4"
              {...register("title", {
                required: "Title is required",
                validate: (value) =>
                  /^[a-zA-Z0-9][a-zA-Z0-9\s\-:;'""]*$/.test(value) ||
                  "Title must start with a letter or number and can only contain letters, numbers, spaces, -, :, ;, ', \"",
              })}
              error={errors.title?.message?.toString()}
              classNames={{
                input:
                  "bg-card text-foreground border border-border placeholder:text-muted-foreground",
                label: "text-primary",
              }}
            />

            <Controller
              name="tagIds"
              control={control}
              rules={{ required: "Select at least one tag" }}
              render={({ field }) => (
                <MultiSelect
                  label="Tags"
                  className="w-2/4"
                  placeholder="Choose up to 3"
                  data={tagOptions}
                  maxValues={3}
                  searchable
                  withAsterisk
                  {...field}
                  error={errors.tagIds?.message?.toString()}
                  classNames={{
                    input:
                      "bg-card text-foreground border border-border placeholder:text-muted-foreground",
                    label: "text-primary",
                  }}
                />
              )}
            />
          </div>

          {/* Content */}
          <Input.Wrapper
            id="content-editor"
            label="Content"
            withAsterisk
            error={errors.content?.message?.toString()}
            className="text-primary"
          >
            <Controller
              name="content"
              control={control}
              rules={{ required: "Content is required" }}
              render={({ field }) => (
                <CustomEditor
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.content?.message}
                />
              )}
            />
          </Input.Wrapper>

          {/* Featured image */}
          <div className="w-[25rem]">
            <CommonImageUpload
              control={control}
              name="image"
              label="Featured Image"
              rules={{ required: "A featured image is required" }}
              errors={errors}
              required={true}
              onImageChange={handleImageChange}
            />
          </div>
        </section>
      </form>
    </main>
  );
};

export default AddPost;
