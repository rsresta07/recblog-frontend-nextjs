import HeroLayout from "@/layouts/HeroLayout";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/utils/hooks/useAuth";

import {
  ApiGetPost,
  APIGetPostDetails,
  APIGetPostDetailsAuth,
} from "@/api/blog";
import {
  APIFollowUser,
  APIUnfollowUser,
  APIAmIFollowing,
  APILikePost,
  APIUnlikePost,
  APIDoILike,
  APIAddComment,
  APIListComments,
} from "@/api/social";

import { useEffect, useState, useRef } from "react";
import CommonButton from "@/components/common/CommonButton";
import {
  IconChevronDown,
  IconEye,
  IconHeart,
  IconHeartFilled,
  IconMessage,
  IconShare,
} from "@tabler/icons-react";
import ShareModal from "@/components/modals/ShareModal";
import { ActionIcon, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import LoginModal from "@/components/modals/LoginModal";
import {
  APIGetPostContextRecommendations,
  APIFinalRecommendedPosts,
} from "@/api/recommendation";
import Head from "next/head";
import Custom404 from "@/pages/404";

const PostSkeleton = () => (
  <section className="col-span-1 lg:col-span-8 flex flex-col gap-6 animate-pulse">
    <div className="h-10 bg-muted rounded-full w-3/4" />
    <div className="h-6 bg-muted rounded-full w-1/2" />
    <div className="h-48 md:h-80 bg-muted rounded-3xl" />
    <div className="space-y-3">
      <div className="h-4 bg-muted rounded-full w-full" />
      <div className="h-4 bg-muted rounded-full w-5/6" />
      <div className="h-4 bg-muted rounded-full w-3/4" />
      <div className="h-4 bg-muted rounded-full w-2/4" />
    </div>
  </section>
);

const SidebarSkeleton = () => (
  <aside className="col-span-1 lg:col-span-4 space-y-6 animate-pulse">
    <div className="h-8 bg-muted w-1/2 rounded-full" />
    {[...Array(4)].map((_, i) => (
      <div key={i} className="mb-6 flex flex-col p-4 border border-border/50 rounded-2xl bg-card/30">
        <div className="h-[12rem] bg-muted rounded-xl mb-4" />
        <div className="h-4 bg-muted rounded-full mb-3" />
        <div className="h-8 bg-muted rounded-2xl mb-4" />
        <div className="h-6 bg-muted rounded-full mb-2 w-1/3" />
      </div>
    ))}
  </aside>
);

const PostDetail = () => {
  const router = useRouter();
  const { isReady, query } = router;
  const postSlug = typeof query.postSlug === "string" ? query.postSlug : "";
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const hasFetchedDetails = useRef(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [details, setDetails] = useState<any | null>(null);
  const [postData, setPostData] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [recommendedPosts, setRecommendedPosts] = useState<any[]>([]);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  const [shareOpen, { open: openShare, close: closeShare }] = useDisclosure(false);

  useEffect(() => {
    let isMounted = true;
    const loadRecent = async () => {
      try {
        const r = await ApiGetPost();
        if (isMounted) setPostData(r?.data?.data || []);
      } catch (error) {
        console.error("Failed to load recent posts:", error);
      }
    };
    loadRecent();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!isReady || !postSlug || hasFetchedDetails.current) return;
    let isMounted = true;
    hasFetchedDetails.current = true;

    const loadDetails = async () => {
      try {
        const { data } = isLoggedIn
          ? await APIGetPostDetailsAuth(postSlug)
          : await APIGetPostDetails(postSlug);

        if (!isMounted) return;

        if (!data) {
          setIsNotFound(true);
          return;
        }

        setDetails(data);
        setComments(data?.comments || []);

        if (isLoggedIn && data?.user?.id) {
          APIAmIFollowing(data.user.id).then((r: any) => {
            if (isMounted) setIsFollowing(r?.data?.following);
          }).catch(() => {});
        }

        if (isLoggedIn && data?.id) {
          APIDoILike(data.id).then((r: any) => {
            if (isMounted) setLiked(r?.data?.liked);
          }).catch(() => {});
        }
      } catch (error) {
        console.error("Failed to load post details:", error);

        // ✅ FIX: Trigger the 404 page if the API throws an error
        if (isMounted) {
          setIsNotFound(true);
        }
      }
    };

    loadDetails();
    return () => { isMounted = false; };
  }, [isReady, postSlug, isLoggedIn]);

  useEffect(() => {
    if (!details && postData.length === 0) return;
    let isMounted = true;
    setIsLoadingRecommendations(true);

    const loadRecommendations = async () => {
      try {
        if (!user) {
          if (isMounted) setRecommendedPosts(postData.slice(0, 8));
          return;
        }

        if (!details?.id) {
          try {
            const res = await APIFinalRecommendedPosts(1,4);
            if (isMounted) setRecommendedPosts(res?.data?.data || []);
          } catch (err) {
            if (isMounted) setRecommendedPosts(postData.slice(0, 4));
          }
          return;
        }

        try {
          const res = await APIGetPostContextRecommendations(details.id);
          if (isMounted) setRecommendedPosts(res.data || []);
        } catch (err) {
          try {
            const res2 = await APIFinalRecommendedPosts(1, 4);
            if (isMounted) setRecommendedPosts(res2?.data?.data || []);
          } catch (err2) {
            if (isMounted) setRecommendedPosts(postData.slice(0, 4));
          }
        }
      } finally {
        if (isMounted) setIsLoadingRecommendations(false);
      }
    };

    loadRecommendations();
    return () => { isMounted = false; };
  }, [user, details, postData]);

  useEffect(() => {
    hasFetchedDetails.current = false;
    setDetails(null);
    setRecommendedPosts([]);
  }, [postSlug]);

  const handleFollowToggle = async () => {
    if (!details?.user?.id) return;
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    try {
      if (isFollowing) await APIUnfollowUser(details.user.id);
      else await APIFollowUser(details.user.id);
      setIsFollowing((p) => !p);
    } catch (e) { console.error(e); }
  };

  const handleLikeToggle = async () => {
    if (!details?.id) return;
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    try {
      if (liked) await APIUnlikePost(details.id);
      else await APILikePost(details.id);
      setLiked((p) => !p);
    } catch (e) { console.error(e); }
  };

  const refreshComments = async (postId: string) => {
    if (!postId) return;
    try {
      const r = await APIListComments(postId);
      setComments(r.data || []);
    } catch (error) { console.error(error); }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !details?.id) return;
    try {
      await APIAddComment(details.id, newComment.trim());
      setNewComment("");
      refreshComments(details.id);
    } catch (e) { console.error(e); }
  };

  const scrollToComments = () => {
    const el = document.getElementById("comment-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const likeCommentSection = (post: any, comments: any) => (
    <section className="flex flex-wrap items-center justify-between bg-card/60 backdrop-blur-md border border-border/50 p-3 px-6 rounded-full shadow-sm mt-8">
      <div className="flex items-center gap-4 sm:gap-6">
        <ActionIcon onClick={handleLikeToggle} variant="transparent" size="lg" color="red" className="hover:scale-110 transition-transform">
          {liked ? <IconHeartFilled color="var(--destructive)" /> : <IconHeart />}
          <span className="text-sm font-medium ml-1.5 text-foreground">{post?.likeCount || 0}</span>
        </ActionIcon>
        <Button onClick={scrollToComments} variant="transparent" className="flex items-center gap-1.5 text-primary hover:bg-primary/10 rounded-full px-3">
          <IconMessage size={20} />
          <span className="text-sm font-medium">{comments?.length || 0}</span>
        </Button>
        <div className="flex items-center text-sm font-medium text-muted-foreground ml-2">
          <IconEye size={20} />
          <span className="ml-1.5">{post?.viewCount || 0}</span>
        </div>
      </div>
      <ActionIcon onClick={openShare} variant="light" color="primary" radius="xl" size="lg" className="hover:scale-110 transition-transform">
        <IconShare size={18} />
      </ActionIcon>
      <ShareModal opened={shareOpen} onClose={closeShare} />
    </section>
  );

  if (isNotFound) {
    return <Custom404 />;
  }

  return (
    <>
      <Head>
        <title>{details?.title || "Loading..."} | RecBlog</title>
        <meta name="description" content={`${details?.title || "Blog post"} of RecBlog.`} />
      </Head>

      {/* Responsive Grid: Stacks on mobile, 12-cols on large screens */}
      <main className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 px-4 md:px-8 pt-8 lg:pt-16 pb-32">
        {!details ? (
          <PostSkeleton />
        ) : (
          <section className="col-span-1 lg:col-span-8 flex flex-col gap-6">
            <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <h1 className="text-primary break-words flex-1">
                {details?.title}
              </h1>
              <div className="flex flex-wrap gap-2 md:max-w-[250px] justify-start md:justify-end">
                {details?.tags?.slice(0, 3).map((t: any) => (
                  <span key={t.id} className="text-xs font-semibold px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full">
                    <Link href="#">{t.title}</Link>
                  </span>
                ))}
              </div>
            </header>

            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {details?.user?.fullName?.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <Link href={`/user/${details?.user?.username}`} className="text-foreground font-semibold hover:text-primary transition-colors">
                    {details?.user?.fullName}
                  </Link>
                  <span className="text-sm text-muted-foreground">{details?.user?.position || "Member"}</span>
                </div>
              </div>
              {user?.id !== details?.user?.id && (
                <CommonButton
                  label={isFollowing ? "Following" : "Follow"}
                  onClick={handleFollowToggle}
                  variant={isFollowing ? "outline" : "filled"}
                  size="sm"
                  fullWidth={false}
                />
              )}
            </div>

            <article className="flex flex-col gap-8 bg-card/30 backdrop-blur-sm border border-border/40 rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm">
              {details?.image && (
                <Image
                  src={details.image}
                  alt={details.title || "Blog Post Image"}
                  width={1024}
                  height={1024}
                  className="w-full object-cover max-h-[600px] rounded-2xl shadow-sm"
                  priority
                />
              )}

              {!user && !showFullContent ? (
                <div className="relative rounded-2xl overflow-hidden">
                  <div className="max-h-[30rem] overflow-hidden relative">
                    <div className="prose max-w-none dark:prose-invert prose-p:text-foreground/90 prose-headings:text-foreground" dangerouslySetInnerHTML={{ __html: details?.content }} />
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
                  </div>
                  <div className="flex justify-center pt-6 pb-2">
                    <Button onClick={() => setShowLoginModal(true)} variant="light" color="primary" radius="xl" className="shadow-sm">
                      Login to read more <IconChevronDown size={18} className="ml-2" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none dark:prose-invert prose-p:text-foreground/90 prose-headings:text-foreground" dangerouslySetInnerHTML={{ __html: details?.content }} />
              )}

              <LoginModal openRegisterModal={() => {}} triggerOpen={showLoginModal} setTriggerOpen={setShowLoginModal} />
            </article>

            {isLoggedIn && likeCommentSection(details, comments)}

            <section className="flex flex-col gap-6 mt-8" id="comment-section">
              {(isLoggedIn || comments.length > 0) && (
                <>
                  <h3 className="text-primary">Comments ({comments.length})</h3>

                  {isLoggedIn && (
                    <div className="flex flex-col gap-3 bg-card/40 border border-border/50 rounded-3xl p-4 shadow-sm">
                      <textarea
                        className="w-full resize-none bg-background/50"
                        rows={3}
                        placeholder="Share your thoughts..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <CommonButton
                          label="Post Comment"
                          onClick={handleCommentSubmit}
                          disabled={!newComment.trim()}
                          size="sm"
                          fullWidth={false}
                        />
                      </div>
                    </div>
                  )}

                  {comments.length > 0 && (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {comments.map((c) => (
                        <div key={c.id} className="bg-card/40 backdrop-blur-sm border border-border/50 p-4 rounded-2xl shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-semibold text-primary text-sm">{c.user?.fullName || "Anonymous"}</p>
                            <small className="text-muted-foreground text-xs">{new Date(c.createdAt).toLocaleDateString()}</small>
                          </div>
                          <p className="text-sm text-foreground/90">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          </section>
        )}

        {/* Sidebar */}
        {isLoadingRecommendations ? (
          <SidebarSkeleton />
        ) : (
          <aside className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            <h3 className="text-primary border-b border-border/50 pb-4">
              {user ? "Recommended for you" : "Recent Posts"}
            </h3>

            {recommendedPosts.length === 0 && <p className="text-muted-foreground">No posts available.</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {recommendedPosts.map((p) => (
                <article key={p.id} className="group flex flex-col bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-3xl shadow-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <Link href={`/blog/${p.slug}`} className="block overflow-hidden rounded-2xl mb-4">
                    <Image
                      src={p.image}
                      alt={p.title || "Blog Post Image"}
                      width={1024}
                      height={1024}
                      className="h-48 object-cover w-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <div className="flex flex-col flex-grow">
                    <span className="text-primary font-medium text-xs mb-2">
                      {p.user && <Link href={`/user/${p.user.slug}`} className="hover:underline">{p.user.fullName}</Link>}
                    </span>
                    <Link href={`/blog/${p.slug}`}>
                      <h4 className="text-foreground group-hover:text-primary transition-colors line-clamp-2 !mb-2">
                        {p.title}
                      </h4>
                      <p dangerouslySetInnerHTML={{ __html: p.content }} className="mb-4 line-clamp-2 text-sm text-muted-foreground !mt-0" />
                    </Link>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {p.tags?.slice(0, 2).map((t: any) => (
                        <span key={t.id} className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-background/50 border border-border text-muted-foreground rounded-full">
                          {t.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        )}
      </main>
    </>
  );
};

PostDetail.getLayout = (page: any) => <HeroLayout>{page}</HeroLayout>;
export default PostDetail;