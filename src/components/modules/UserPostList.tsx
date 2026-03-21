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
    <section className="mb-40 flex flex-col gap-6">
      <div className="flex justify-between items-center pb-4 border-b border-border/50">
        <h3 className="!mb-0 text-primary">
          Posts <span className="text-muted-foreground text-base font-normal">({posts.length})</span>
        </h3>
        {isOwner && (
          <CommonLink
            link={`/user/${userData?.username}/add-post`}
            linkLabel="Add Post"
          />
        )}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-16 p-8 rounded-2xl bg-card/30 border border-dashed border-border/80">
            {isOwner
              ? "You haven’t shared any posts yet. Time to publish your first one!"
              : `@${userData?.username || "This user"} hasn't posted anything yet.`}
          </div>
        ) : (
          posts.map((post: any) => (
            <div key={post.id} className="h-full">
              <div className="flex flex-col h-full gap-4 p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <Link href={`/blog/${post.slug}`}>
                  <Image
                    src={post.image}
                    alt={post.title || "Blog Post Image"}
                    width={1024}
                    height={1024}
                    className="h-48 w-full object-cover rounded-xl hover:opacity-90 transition-opacity"
                  />
                </Link>

                <div className="flex-grow">
                  <Link href={`/blog/${post.slug}`} className="group">
                    <h4 className="line-clamp-1 group-hover:text-primary transition-colors !mb-2">
                      {post.title}
                    </h4>
                    <p
                      className="line-clamp-2 text-sm text-muted-foreground !mt-0"
                      dangerouslySetInnerHTML={{ __html: post?.description }}
                    />
                  </Link>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {post?.tags?.map((tag: any) => (
                      <span
                        key={tag?.id}
                        className="text-xs px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full"
                      >
                        {tag?.title}
                      </span>
                    ))}
                  </div>
                </div>

                {isOwner && (
                  <div className="flex justify-between items-center pt-4 border-t border-border/50 mt-auto">
                    <CommonLink
                      link={`/blog/${post.slug}/edit-post`}
                      linkLabel="Edit"
                    />
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-5 py-2 text-sm font-medium bg-destructive/10 text-destructive border border-destructive/20 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors duration-300"
                    >
                      Delete
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