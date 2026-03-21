import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { TextInput, Group, Loader } from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ApiGetMe, ApiUpdateMe } from "@/api/user";
import showNotify from "@/utils/notify";
import CommonButton from "@/components/common/CommonButton";
import Head from "next/head";

// Validation schema
const schema = z.object({
  fullName: z.string().min(2, "Name too short"),
  username: z.string().min(2, "Username too short"),
  email: z.string().email("Invalid email"),
  position: z.string().min(2, "Position too short"),
});

export type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  fullName: "",
  username: "",
  email: "",
  position: "",
};

const EditProfile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await ApiGetMe();
        form.reset({
          fullName: data.fullName ?? "",
          username: data.username ?? "",
          email: data.email ?? "",
          position: data.position ?? "",
        });
      } catch (error: any) {
        showNotify("error", error?.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [form]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await ApiUpdateMe(values);
      showNotify("success", "Profile updated");
      const newData = await ApiGetMe();
      router.push(`/user/${newData?.data?.username}`);
    } catch (error: any) {
      showNotify("error", error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader color="var(--primary)" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-16 max-w-2xl">
      <Head>
        <title>RecBlog | Edit Profile</title>
      </Head>

      <h2 className="text-primary text-center md:text-left mb-8">
        Edit Profile
      </h2>

      <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <TextInput
            label={<span className="text-sm font-semibold mb-1 block">Full Name</span>}
            placeholder="John Doe"
            {...form.register("fullName")}
            error={form.formState.errors.fullName?.message}
            classNames={{ input: "bg-background/50 rounded-full border-border/60 focus:border-primary px-4" }}
          />

          <TextInput
            label={<span className="text-sm font-semibold mb-1 block">Username</span>}
            placeholder="Edit your username"
            {...form.register("username")}
            error={form.formState.errors.username?.message}
            classNames={{ input: "bg-background/50 rounded-full border-border/60 focus:border-primary px-4" }}
          />

          <TextInput
            label={<span className="text-sm font-semibold mb-1 block">Expertise / Position</span>}
            placeholder="e.g. Web Developer"
            {...form.register("position")}
            error={form.formState.errors.position?.message}
            classNames={{ input: "bg-background/50 rounded-full border-border/60 focus:border-primary px-4" }}
          />

          <TextInput
            label={<span className="text-sm font-semibold mb-1 block">Email Address</span>}
            placeholder="john@example.com"
            {...form.register("email")}
            error={form.formState.errors.email?.message}
            classNames={{ input: "bg-background/50 rounded-full border-border/60 focus:border-primary px-4" }}
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-border/50 mt-4">
            <CommonButton
              label="Cancel"
              onClick={() => router.back()}
              variant="light"
              fullWidth={false}
              className="w-full sm:w-auto"
            />
            <CommonButton
              label="Save Changes"
              type="submit"
              variant="filled"
              fullWidth={false}
              className="w-full sm:w-auto"
            />
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfile;