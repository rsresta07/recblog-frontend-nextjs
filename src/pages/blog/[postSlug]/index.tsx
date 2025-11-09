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

import { useEffect, useState, useCallback } from "react";
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
  APIGetRecommendedPosts,
} from "@/api/recommendation";
import Head from "next/head";

const PostSkeleton = () => (
  <section className="col-span-8 flex flex-col gap-4 animate-pulse">
    <div className="h-8 bg-slate-300 rounded w-3/4" />
    <div className="h-4 bg-slate-200 rounded w-1/2" />
    <div className="h-64 bg-slate-300 rounded" />
    <div className="h-4 bg-slate-200 rounded w-full" />
    <div className="h-4 bg-slate-200 rounded w-5/6" />
    <div className="h-4 bg-slate-200 rounded w-3/4" />
    <div className="h-4 bg-slate-200 rounded w-2/4" />
  </section>
);

const SidebarSkeleton = () => (
  <aside className="col-span-4 space-y-4 animate-pulse">
    <div className="h-6 bg-slate-300 w-1/2 rounded" />
    {[...Array(4)].map((_, i) => (
      <div key={i} className="mb-8 flex flex-col">
        <div className="h-[14rem] bg-slate-200 rounded mb-2" />
        <div className="h-4 bg-slate-200 rounded mb-1" />
        <div className="h-10 bg-slate-200 rounded mb-4" />
        <div className="h-6 bg-slate-200 rounded mb-2" />
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

  // UI State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [details, setDetails] = useState<any | null>(null);
  const [postData, setPostData] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [recommendedPosts, setRecommendedPosts] = useState<any[]>([]);
  const [showFullContent, setShowFullContent] = useState(false);

  const [shareOpen, { open: openShare, close: closeShare }] =
    useDisclosure(false);
  // login modal control
  const [loginOpen, { open: openLogin, close: closeLogin }] =
    useDisclosure(false);

  // initial fetch
  const loadDetails = useCallback(async () => {
    if (!postSlug) return;
    const { data } = isLoggedIn
      ? await APIGetPostDetailsAuth(postSlug)
      : await APIGetPostDetails(postSlug);
    setDetails(data);
    setComments(data?.comments || []);

    /* pre‑load like / follow status (optional if BE sends flags) */
    if (data?.user?.id) {
      APIAmIFollowing(data.user.id)
        .then((r: any) => setIsFollowing(r?.data?.following))
        .catch(() => {});
    }
    if (data?.id) {
      APIDoILike(data.id)
        .then((r: any) => setLiked(r?.data?.liked))
        .catch(() => {});
    }

    await refreshComments(data.id);
  }, [postSlug, isLoggedIn]);

  const loadRecent = useCallback(async () => {
    const r = await ApiGetPost();
    setPostData(r?.data || []);
  }, []);

  useEffect(() => {
    if (isReady) loadDetails();
    loadRecent();
  }, [isReady, loadDetails, loadRecent]);

  useEffect(() => {
    if (!user) {
      // not logged in → show recent blogs
      setRecommendedPosts(postData.slice(0, 8));
      return;
    }

    if (!details?.id) {
      // user is logged in but blog details missing → fallback to general
      APIGetRecommendedPosts()
        .then((res: any) => {
          setRecommendedPosts(res.data || []);
        })
        .catch(() => {
          setRecommendedPosts(postData.slice(0, 8));
        });
      return;
    }

    // user logged in & blog detail exists → try post-context recommendations
    APIGetPostContextRecommendations(details.id)
      .then((res: any) => {
        if (res.data?.length) {
          setRecommendedPosts(res.data); // tag-based recommendations
        } else {
          // fallback to general if no matched tags
          APIGetRecommendedPosts()
            .then((res2: any) => {
              setRecommendedPosts(res2.data || []);
            })
            .catch(() => {
              setRecommendedPosts(postData.slice(0, 8)); // fallback to recent
            });
        }
      })
      .catch(() => {
        // even context call failed → fallback to general
        APIGetRecommendedPosts()
          .then((res2: any) => {
            setRecommendedPosts(res2.data || []);
          })
          .catch(() => {
            setRecommendedPosts(postData.slice(0, 8)); // fallback to recent
          });
      });
  }, [user, details, postData]);

  const handleFollowToggle = async () => {
    if (!details?.user?.id) return;

    if (!isLoggedIn) {
      // User not logged in, show login modal
      setShowLoginModal(true);
      return;
    }

    // User is logged in, proceed with follow/unfollow API calls
    try {
      if (isFollowing) {
        await APIUnfollowUser(details.user.id);
      } else {
        await APIFollowUser(details.user.id);
      }
      setIsFollowing((p) => !p);
    } catch (e) {
      console.error("follow/unfollow failed:", e);
    }
  };

  const handleLikeToggle = async () => {
    if (!details?.id) return;
    try {
      if (liked) {
        await APIUnlikePost(details.id);
      } else {
        await APILikePost(details.id);
      }
      setLiked((p) => !p);
    } catch (e) {
      console.error("like/unlike failed:", e);
    }
  };

  const refreshComments = async (postId: string) => {
    if (!postId) return;
    const r = await APIListComments(postId);
    setComments(r.data || []);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !details?.id) return;
    try {
      await APIAddComment(details.id, newComment.trim());
      setNewComment("");
      refreshComments(details.id); // pull fresh list
    } catch (e) {
      console.error("comment failed:", e);
    }
  };

  const scrollToComments = () => {
    const el = document.getElementById("comment-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const likeCommentSection = (post: any, comments: any) => (
    <section className="flex items-center justify-between bg-card p-2 px-4 rounded-lg text-sm font-normal">
      <div className="flex items-center gap-2">
        <ActionIcon
          onClick={handleLikeToggle}
          variant="transparent"
          size="xl"
          color="red"
        >
          {liked ? <IconHeartFilled color="red" /> : <IconHeart />}
          <span className="text-sm font-normal ml-1">
            {post?.likeCount || 0}
          </span>
        </ActionIcon>
        <Button
          onClick={scrollToComments}
          variant="transparent"
          className="flex items-center gap-1 text-primary"
        >
          <IconMessage />
          <span className="text-sm font-normal ml-1">
            {comments?.length || 0}
          </span>
        </Button>
        <div className="flex items-center text-sm font-normal text-primary">
          <IconEye />
          <span className="ml-1">{post?.viewCount || 0}</span>
        </div>
      </div>
      <Button onClick={openShare} variant="transparent" radius="lg">
        <IconShare className="text-primary" />
      </Button>
      <ShareModal opened={shareOpen} onClose={closeShare} />
    </section>
  );

  return (
    <>
      <Head>
        <title>{details?.title} | RecBlog</title>
        <meta name="description" content={`${details?.title} of RecBlog.`} />
        <meta property="og:title" content={`${details?.title}`} />
        <meta property="og:image" content="/favicon.ico" />
      </Head>

      <main className="container mx-auto grid grid-cols-12 gap-16 pt-16">
        {!details ? (
          <PostSkeleton />
        ) : (
          <section className="col-span-8 flex flex-col gap-4">
            {/* Title + tags */}
            <header className="flex items-start justify-between gap-8">
              <h1 className="text-2xl font-bold text-primary">
                {details?.title}
              </h1>
              <div className="flex flex-wrap max-w-[200px]">
                {details?.tags?.slice(0, 3).map((t: any) => (
                  <span
                    key={t.id}
                    className="px-2 text-sm bg-primary text-white rounded-lg m-1 w-fit"
                  >
                    <Link href="#">{t.title}</Link>
                  </span>
                ))}
              </div>
            </header>

            {/* author + follow */}
            <div className="flex gap-8">
              <div className="flex items-end gap-2 text-slate-700">
                <p className="text-primary">
                  {details?.user && (
                    <Link href={`/user/${details.user.username}`}>
                      <span className="text-lg">{details?.user?.fullName}</span>
                      <span className="text-sm">{details?.user?.position}</span>
                    </Link>
                  )}
                </p>
                <p className="text-secondary">{details?.user?.position}</p>
              </div>
              <div>
                {/* Follow button - hide if current user is author */}
                {user?.id !== details?.user?.id && (
                  <CommonButton
                    label={isFollowing ? "Following" : "Follow"}
                    onClick={handleFollowToggle}
                    radius="lg"
                    size="xs"
                    color="#F28F3B"
                  />
                )}
              </div>
            </div>

            <hr />

            {/* {likeCommentSection()} */}

            {/* image + content */}
            <section className="flex flex-col gap-8">
              {details?.image && (
                <Image
                  src={details.image}
                  alt={details.title || "Blog Post Image"}
                  width={1024}
                  height={1024}
                  className="w-full object-contain rounded-lg"
                  priority
                />
              )}

              {!user && !showFullContent ? (
                <div className="relative rounded-lg overflow-hidden bg-light-bg">
                  <div className="max-h-[50rem] overflow-hidden relative">
                    <div
                      className="prose max-w-none prose-invert"
                      dangerouslySetInnerHTML={{ __html: details?.content }}
                    />

                    <div
                      className="absolute bottom-0 left-0 right-0 h-[12rem] backdrop-blur-sm pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(241, 242, 246, 1), rgba(241, 242, 246, 0.6), transparent)",
                      }}
                    />
                  </div>
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={() => setShowLoginModal(true)}
                      variant="transparent"
                    >
                      Show more <IconChevronDown stroke={2} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: details?.content }}
                />
              )}

              <LoginModal
                openRegisterModal={() => {}}
                triggerOpen={showLoginModal}
                setTriggerOpen={setShowLoginModal}
              />
            </section>

            {/* comments */}
            <section className="flex flex-col gap-4 mt-12" id="comment-section">
              {isLoggedIn && likeCommentSection(details, comments)}

              {(isLoggedIn || comments.length > 0) && ( // show nothing if guest & 0 comments
                <>
                  <h3 className="text-xl font-semibold text-secondary">
                    Comments
                  </h3>

                  {isLoggedIn && (
                    <>
                      <textarea
                        className="w-full border rounded p-2"
                        rows={4}
                        placeholder="Write your comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <Button
                        onClick={handleCommentSubmit}
                        disabled={!newComment.trim()}
                      >
                        Submit Comment
                      </Button>
                    </>
                  )}

                  {comments.length > 0 && (
                    <div className="space-y-4 max-h-64 overflow-y-auto border p-4 rounded-lg bg-white shadow-sm">
                      {comments.map((c) => (
                        <div
                          key={c.id}
                          className="border-b pb-2 last:border-b-0"
                        >
                          <p className="font-semibold">
                            {c.user?.fullName || "Anonymous"}
                          </p>
                          <p>{c.content}</p>
                          <small className="text-gray-500">
                            {new Date(c.createdAt).toLocaleString()}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          </section>
        )}

        {/* recommended posts */}
        {recommendedPosts.length === 0 ? (
          <SidebarSkeleton />
        ) : (
          <aside className="col-span-4">
            <h2 className="text-xl font-bold text-primary mb-4">
              {user ? "Recommended for you" : "Recent blog posts"}
            </h2>

            {recommendedPosts.length === 0 && <p>No posts available.</p>}

            {recommendedPosts.map((p) => (
              <article
                key={p.id}
                className="mb-8 transform transition-transform duration-300 hover:scale-[1.05]"
              >
                <Link href={`/blog/${p.slug}`}>
                  <Image
                    src={p.image}
                    alt={p.title || "Blog Post Image"}
                    width={1024}
                    height={1024}
                    className="h-56 object-cover rounded-lg"
                  />
                </Link>
                <div>
                  <span className="text-primary text-sm">
                    {p.user && (
                      <Link href={`/user/${p.user.slug}`}>
                        {p.user.fullName}
                      </Link>
                    )}
                  </span>
                  <Link href={`/blog/${p.slug}`}>
                    <h3 className="text-lg text-primary font-bold line-clamp-1">
                      {p.title}
                    </h3>
                    <p
                      dangerouslySetInnerHTML={{ __html: p.content }}
                      className="mb-4 line-clamp-2 text-sm text-foreground"
                    />
                    {p.tags?.map((t: any) => (
                      <span
                        key={t.id}
                        className="text-sm px-2 bg-primary text-foreground rounded-lg m-1"
                      >
                        {t.title}
                      </span>
                    ))}
                  </Link>
                </div>
              </article>
            ))}
          </aside>
        )}
      </main>
    </>
  );
};

PostDetail.getLayout = (page: any) => <HeroLayout>{page}</HeroLayout>;
export default PostDetail;
