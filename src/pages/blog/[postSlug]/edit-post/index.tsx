import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import {
  TextInput,
  Loader,
  MultiSelect,
  Stack,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { APIGetPostDetails, ApiUpdatePost } from "@/api/blog";
import { ApiGetTag } from "@/api/tag";
import CustomSunEditor from "@/components/common/CommonSunEditor";
import CommonImageUpload from "@/components/common/CommonImageUpload";
import CommonButton from "@/components/common/CommonButton";
import Head from "next/head";

type TagOption = { value: string; label: string };

type FormValues = {
  title: string;
  description: string;
  image: File | null;
  tagIds: string[];
};

const EditPost = () => {
  const router = useRouter();
  const slug = router?.query?.postSlug as string | undefined;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: "", description: "", image: null, tagIds: [] },
  });

  const [tagOptions, setTagOptions] = useState<TagOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [postId, setPostId] = useState<string | null>(null);
  const [authorSlug, setAuthorSlug] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const { data: post } = await APIGetPostDetails(slug);
        const { data: tags } = await ApiGetTag();

        setTagOptions(
          tags.map((t: any) => ({ value: t?.id, label: t?.title }))
        );

        setPostId(post?.id);
        setAuthorSlug(post?.user?.slug);
        setExistingImageUrl(post?.image);
        setCurrentImageUrl(post?.image);

        reset({
          title: post?.title,
          description: post?.content,
          tagIds: post?.tags?.map((t: any) => t.id),
        });
      } catch (err) {
        console.error(err);
        showNotification({ color: "red", message: "Failed to load post." });
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!postId) return;

    try {
      const payload = {
        title: data.title,
        description: data.description,
        tagIds: data.tagIds,
        image: currentImageUrl || existingImageUrl,
      };

      await ApiUpdatePost(postId, payload);
      showNotification({ color: "green", message: "Post updated successfully!" });

      if (authorSlug) router.push(`/user/${authorSlug}`);
      else router.push(`/blog/${slug}`);
    } catch (err) {
      console.error(err);
      showNotification({ color: "red", message: "Update failed" });
    }
  };

  const handleImageChange = (imageUrl: string | null) => {
    setCurrentImageUrl(imageUrl);
    setValue("image", imageUrl as any);
  };

  if (loading) return <Loader color="var(--primary)" style={{ margin: "4rem auto", display: "block" }} />;

  return (
    <main className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <Head>
        <title>RecBlog | Edit Post</title>
      </Head>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-primary !mb-0">Edit Post</h1>
        <CommonButton
          label="Go Back"
          variant="outline"
          onClick={() => router.back()}
          fullWidth={false}
          size="sm"
        />
      </div>

      <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <TextInput
                  label={<span className="text-sm font-semibold mb-1 block">Post Title</span>}
                  withAsterisk
                  {...field}
                  error={errors.title?.message}
                  classNames={{ input: 'bg-background/50 rounded-full border-border/60 focus:border-primary' }}
                />
              )}
            />

            <div>
              <label className="text-sm font-semibold mb-2 block">Content Description <span className="text-destructive">*</span></label>
              <div className="rounded-2xl overflow-hidden border border-border/60 shadow-sm">
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <CustomSunEditor
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.description?.message}
                    />
                  )}
                />
              </div>
              {errors.description && (
                <Text color="red" size="xs" mt={4}>{errors.description.message}</Text>
              )}
            </div>

            <CommonImageUpload
              control={control}
              name="image"
              label="Featured Image"
              errors={errors}
              existingImageUrl={existingImageUrl}
              onImageChange={handleImageChange}
            />

            <Controller
              name="tagIds"
              control={control}
              rules={{ required: "At least one tag is required" }}
              render={({ field }) => (
                <MultiSelect
                  label={<span className="text-sm font-semibold mb-1 block">Tags</span>}
                  data={tagOptions}
                  searchable
                  withAsterisk
                  {...field}
                  error={errors.tagIds?.message}
                  classNames={{ input: 'bg-background/50 rounded-2xl border-border/60 focus:border-primary min-h-[45px]' }}
                />
              )}
            />

            <div className="flex justify-end pt-6 border-t border-border/50">
              <CommonButton type="submit" label="Save Changes" fullWidth={false} />
            </div>
          </Stack>
        </form>
      </div>
    </main>
  );
};

export default EditPost;