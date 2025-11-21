import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { TextInput, Group, Loader, Title } from "@mantine/core";
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
        showNotify(
          "error",
          error?.response?.data?.message || "Failed to fetch profile"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      <Group mt="xl">
        <Loader color="var(--foreground)" />
      </Group>
    );
  }

  return (
    <section
      className="pt-12 p-[12rem] pb-[15rem]"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <Head>
        <title>RecBlog | Edit Profile</title>
      </Head>
      <Title order={3} mb="md" style={{ color: "var(--foreground)" }}>
        Edit Profile
      </Title>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <TextInput
          label="Full Name"
          placeholder="John Doe"
          {...form.register("fullName")}
          error={form.formState.errors.fullName?.message}
          styles={{
            input: {
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              borderColor: "var(--border)",
            },
            label: { color: "var(--foreground)" },
          }}
        />

        <TextInput
          label="Username"
          placeholder="Edit your username"
          {...form.register("username")}
          error={form.formState.errors.username?.message}
          styles={{
            input: {
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              borderColor: "var(--border)",
            },
            label: { color: "var(--foreground)" },
          }}
        />

        <TextInput
          label="Expertise"
          placeholder="Web Developer"
          {...form.register("position")}
          error={form.formState.errors.position?.message}
          styles={{
            input: {
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              borderColor: "var(--border)",
            },
            label: { color: "var(--foreground)" },
          }}
        />

        <TextInput
          label="Email"
          placeholder="Email"
          {...form.register("email")}
          error={form.formState.errors.email?.message}
          styles={{
            input: {
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              borderColor: "var(--border)",
            },
            label: { color: "var(--foreground)" },
          }}
        />

        <div className="flex gap-4">
          <CommonButton
            label="Cancel"
            onClick={() => router.back()}
            variant="light"
            // style={{
            //   backgroundColor: "var(--card)",
            //   color: "var(--card-foreground)",
            // }}
          />
          <CommonButton
            label="Save Changes"
            type="submit"
            variant="light"
            // style={{
            //   backgroundColor: "var(--primary)",
            //   color: "var(--primary-foreground)",
            // }}
          />
        </div>
      </form>
    </section>
  );
};

export default EditProfile;
