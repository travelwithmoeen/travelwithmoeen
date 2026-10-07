"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BlogContent } from "@/components/blog/BlogContent";
import { BlogDetailSkeleton } from "@/components/blog/BlogDetailSkeleton";
import { Button } from "@/components/ui/button";
import type { Blog } from "@/data/blog";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function BlogDetail({ blog }: { blog: Blog | null }) {
  const blogKey = blog?.slug ?? "";
  const [seenBlog, setSeenBlog] = useState(blogKey);
  const [isLoading, setIsLoading] = useState(true);
  if (blogKey !== seenBlog) {
    setSeenBlog(blogKey);
    setIsLoading(true);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [blogKey]);

  const formattedDate = blog
    ? new Date(blog.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-background">


      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        {/* <Button asChild  className="mb-6 border border-navy hover:bg-navy-hover/10">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button> */}

        {isLoading ? (
          <BlogDetailSkeleton />
        ) : blog ? (
          <article className="mx-auto max-w-4xl">
            {/* Cover Image */}
            <div className="mb-8 overflow-hidden rounded-lg">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="h-64 w-full object-cover md:h-96"
              />
            </div>

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="mb-8 flex flex-wrap items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {blog.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </span>
            </div>

            {/* Separator */}
            <div className="mb-8 h-1 w-16 rounded-full bg-primary" />

            {/* Content */}
            <BlogContent sections={blog.content} />

            {/* Bottom CTA */}
            <div className="mt-12 rounded-lg bg-secondary p-8 text-center">
              <h3 className="mb-2 text-xl font-bold text-secondary-foreground">
                Ready for Your Adventure?
              </h3>
              <p className="mb-4 text-secondary-foreground/80">
                Explore our curated tours and start planning your journey today.
              </p>
              <Button asChild >
                <Link href="/tours">Explore Tours</Link>
              </Button>
            </div>
          </article>
        ) : (
          <div className="py-16 text-center">
            <h2 className="mb-4 text-2xl font-bold text-secondary">
              Blog Not Found
            </h2>
            <p className="mb-6 text-muted-foreground">
              The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button asChild >
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
