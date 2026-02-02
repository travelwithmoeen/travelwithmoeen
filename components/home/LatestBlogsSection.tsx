import  Link  from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { blogs } from "@/data/blog";

const latestBlogs = blogs.slice(0, 3);

export function LatestBlogsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <Badge className="mb-3 bg-gold text-black">
            Blog
          </Badge>
          <h2 className="mb-3 text-3xl font-bold text-navy md:text-4xl">
            Latest Blogs
          </h2>
          <p className="mx-auto max-w-2xl text-navy/80">
            Travel stories, tips, and insights from our adventures
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latestBlogs.map((blog, index) => (
            <motion.div
              key={blog.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <CardHeader className="pb-2">
                  <h3 className="line-clamp-2 text-lg font-bold text-navy hover:text-navy/80 transition-colors group-hover:text-primary">
                    {blog.title}
                  </h3>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="mb-3 line-clamp-2 text-sm text-navy/80">
                    {blog.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {blog.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(blog.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild  className="w-full bg-gold text-black hover:bg-gold/90">
                    <Link href={`/blog/${blog.slug}`}>Read More</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Button asChild className="bg-white text-black border border-navy hover:bg-navy/10 hover:bg-navy hover:text-white">
            <Link href="/blog">
              View All Blogs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
