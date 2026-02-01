import  Link  from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar, User } from "lucide-react";
import { Blog } from "@/data/blog";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="tour-card overflow-hidden bg-card border border-transparent transition-all duration-300 hover:scale-[1.02] hover:border-gold hover:shadow-lg hover:shadow-gold/20">
      <AspectRatio ratio={16 / 9}>
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </AspectRatio>
      <CardHeader className="pb-2">
        <h3 className="line-clamp-2 text-lg font-bold text-navy">
          {blog.title}
        </h3>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {blog.excerpt}
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {blog.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-gold hover:bg-gold-hover hover:opacity-100">
          <Link href={`/blog/${blog.slug}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
