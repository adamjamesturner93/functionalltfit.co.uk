"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Calendar, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
  categories: string[];
}

const blogPosts: BlogPost[] = [
  {
    title: "5 Adaptive Workouts for Limited Mobility",
    excerpt:
      "Discover effective exercises that can be done with limited mobility to improve strength and flexibility.",
    date: "2024-10-20",
    readTime: "5 min read",
    image: "/placeholder.svg",
    slug: "5-adaptive-workouts-for-limited-mobility",
    categories: [
      "adaptive fitness",
      "limited mobility",
      "strength training",
      "flexibility",
    ],
  },
  {
    title: "Balancing Fitness and Parenting: A Guide",
    excerpt:
      "Learn how to incorporate quick, effective workouts into your busy schedule as a parent.",
    date: "2024-10-18",
    readTime: "7 min read",
    image: "/placeholder.svg",
    slug: "balancing-fitness-and-parenting",
    categories: [
      "parenting",
      "time management",
      "quick workouts",
      "family fitness",
    ],
  },
  {
    title: "Nutrition Tips for Managing Diabetes",
    excerpt:
      "Expert advice on maintaining a balanced diet to help manage diabetes while pursuing your fitness goals.",
    date: "2024-10-15",
    readTime: "6 min read",
    image: "/placeholder.svg",
    slug: "nutrition-tips-for-managing-diabetes",
    categories: [
      "nutrition",
      "diabetes management",
      "healthy eating",
      "meal planning",
    ],
  },
];

const getAllCategories = (posts: BlogPost[]): string[] => {
  const categories = posts.flatMap((post) => post.categories);
  return [...new Set(categories)];
};

interface WordCloudProps {
  categories: string[];
  selectedCategory: string;
  onCategoryClick: (category: string) => void;
}

const WordCloud: React.FC<WordCloudProps> = ({
  categories,
  selectedCategory,
  onCategoryClick,
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category, index) => (
        <Button
          key={index}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryClick(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default function BlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || ""
  );
  const allCategories = getAllCategories(blogPosts);

  useEffect(() => {
    if (selectedCategory) {
      router.push(`/blog?category=${encodeURIComponent(selectedCategory)}`);
    } else {
      router.push("/blog");
    }
  }, [selectedCategory, router]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
  };

  const filteredPosts = selectedCategory
    ? blogPosts.filter((post) => post.categories.includes(selectedCategory))
    : blogPosts;

  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none mb-4">
            FunctionallyFit Blog
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl mb-8">
            Discover expert tips, inspiring stories, and the latest in adaptive
            fitness and health management.
          </p>
          <WordCloud
            categories={allCategories}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
          />
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <Card key={index}>
                <CardHeader>
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="rounded-lg object-cover w-full h-48"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2">{post.title}</CardTitle>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span className="mr-4">{post.date}</span>
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((category, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {category}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/blog/${post.slug}`} passHref>
                    <Button variant="outline" className="w-full">
                      Read More
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Stay Updated
          </h2>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto mb-8">
            Subscribe to our newsletter for the latest fitness tips, health
            advice, and app updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </>
  );
}
