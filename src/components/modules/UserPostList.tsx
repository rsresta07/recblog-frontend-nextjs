"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import CommonLink from "../common/CommonLink";
import { ApiDeletePost } from "@/api/blog";
import showNotify from "@/utils/notify";

interface UserPostProps {
  userData: any;
  isOwner: boolean;
}

const UserPostList = ({ userData, isOwner }: UserPostProps) => {
  const [posts, setPosts] = useState(userData?.posts ?? []);

  const handleDelete = async (id: string) => {
    try {
      await ApiDeletePost(id);
      showNotify("success", "Deleted successfully!");
      setPosts((prev: any[]) => prev.filter((p) => p.id !== id));
    } catch {
      showNotify("fail", "Failed to delete post");
    }
  };

  return (
    <section className="mb-40 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-primary text-2xl font-bold">
          Posts ({posts.length})
        </h2>
        {isOwner && (
          <CommonLink
            link={`/user/${userData?.username}/add-post`}
            linkLabel="Add Post"
          />
        )}
      </div>

      <section className="grid grid-cols-3 gap-4">
        {posts.length === 0 ? (
          <div className="col-span-3 text-center text-muted-foreground text-lg py-10">
            {isOwner
              ? "You haven’t shared any posts yet. Time to publish your first one!"
              : `${userData?.username || "This user"} hasn't posted anything yet.`}
          </div>
        ) : (
          posts.map((post: any) => (
            <div key={post.id}>
              <div className="flex flex-col gap-4 p-4 rounded-lg transform transition-transform duration-300 hover:scale-105 border border-border bg-card text-card-foreground">
                <Link href={`/blog/${post.slug}`}>
                  <Image
                    src={post.image}
                    alt={post.title || "Blog Post Image"}
                    width={1024}
                    height={1024}
                    className="h-52 w-full object-cover rounded-md"
                  />
                </Link>

                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-semibold line-clamp-1">
                    {post.title}
                  </h3>
                  <p
                    className="mb-4 line-clamp-2 text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: post?.description }}
                  />
                </Link>

                <div>
                  {post?.tags?.map((tag: any) => (
                    <span
                      key={tag?.id}
                      className="text-sm px-2 py-1 bg-accent text-accent-foreground rounded-md m-1"
                    >
                      <Link href="#">{tag?.title}</Link>
                    </span>
                  ))}
                </div>

                {isOwner && (
                  <div className="flex justify-between items-center">
                    <CommonLink
                      link={`/blog/${post.slug}/edit-post`}
                      linkLabel="Edit Post"
                    />
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg shadow hover:opacity-90 transition"
                    >
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </section>
  );
};

export default UserPostList;
