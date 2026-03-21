import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ApiGetMe, ApiGetPreferences, ApiGetUser } from "@/api/user";
import HeroLayout from "@/layouts/HeroLayout";
import UserInfo from "@/components/modules/UserInfo";
import UserPostList from "@/components/modules/UserPostList";
import Head from "next/head";

const UserPage = () => {
  const router = useRouter();
  const { userSlug } = router.query as { userSlug?: string };

  const [user, setUser] = useState<any>();
  const [me, setMe] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [hasPreferences, setHasPreferences] = useState<boolean | null>(null);

  const userData = user?.data;

  useEffect(() => {
    if (!router.isReady || !userSlug) return;

    (async () => {
      try {
        const [profile, current] = await Promise.all([
          ApiGetUser(userSlug),
          ApiGetMe().catch(() => null),
        ]);

        setUser(profile);
        setMe(current);

        if (current && current.data?.username === profile.data?.username) {
          const { data: prefs } = await ApiGetPreferences().catch(() => ({
            data: [],
          }));
          setHasPreferences(prefs.length > 0);
        } else {
          setHasPreferences(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [router.isReady, userSlug]);

  if (loading || hasPreferences === null)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse flex gap-2 items-center text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-75" />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150" />
          <span className="ml-2 font-medium">Loading profile...</span>
        </div>
      </div>
    );

  if (!userData)
    return <div className="text-center py-20 text-muted-foreground text-lg">User not found.</div>;

  const isOwner = me && me.data?.username === userData?.username;

  return (
    <>
      <Head>
        <title>{userData?.fullName} | RecBlog</title>
        <meta name="description" content={`Profile Page of ${userData?.fullName}.`} />
      </Head>

      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-6xl">
        <UserInfo userData={userData} isOwner={isOwner} />
        <UserPostList userData={userData} isOwner={isOwner} />
      </main>
    </>
  );
};

export default UserPage;

UserPage.getLayout = (p: any) => <HeroLayout>{p}</HeroLayout>;