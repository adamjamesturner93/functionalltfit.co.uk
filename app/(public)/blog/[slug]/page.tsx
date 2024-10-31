import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  title: string;
  content: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
  categories: string[];
}

// This would typically come from a CMS or API
const post: BlogPost = {
  title: "5 Adaptive Workouts for Limited Mobility",
  content: `
    <p>Living with limited mobility doesn't mean you can't enjoy the benefits of regular exercise. In fact, staying active is crucial for maintaining overall health and improving quality of life. Here are five adaptive workouts that can be tailored to various levels of mobility:</p>

    <h2>1. Chair Yoga</h2>
    <p>Chair yoga is an excellent low-impact exercise that can improve flexibility, balance, and strength. It's perfect for those who have difficulty standing for long periods or getting up and down from the floor.</p>

    <h2>2. Resistance Band Exercises</h2>
    <p>Resistance bands are versatile tools that can be used to strengthen various muscle groups. They're especially useful for those with limited mobility as exercises can be performed while seated or lying down.</p>

    <h2>3. Water Aerobics</h2>
    <p>The buoyancy of water reduces stress on joints and muscles, making water aerobics an ideal exercise for those with mobility issues. It provides a full-body workout while being gentle on the body.</p>

    <h2>4. Seated Tai Chi</h2>
    <p>Tai Chi's slow, flowing movements can be adapted to a seated position. This gentle exercise can improve balance, flexibility, and mental well-being.</p>

    <h2>5. Adaptive Weight Training</h2>
    <p>With the right equipment and guidance, weight training can be adapted for various mobility levels. This can help maintain muscle mass, bone density, and overall strength.</p>

    <p>Remember, it's important to consult with a healthcare professional or a certified adaptive fitness instructor before starting any new exercise regimen. They can help you create a safe and effective workout plan tailored to your specific needs and abilities.</p>
  `,
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
};

interface PageParams {
  params: {
    slug: string;
  };
}

export const generateMetadata = ({ params }: PageParams): Metadata => {
  // In a real application, you would fetch the post data based on the slug
  // const post = await getPost(params.slug)

  return {
    title: post.title,
    description: `Learn about ${post.title.toLowerCase()} in this informative article from FunctionallyFit.`,
    keywords: post.categories,
    openGraph: {
      title: post.title,
      description: `Learn about ${post.title.toLowerCase()} in this informative article from FunctionallyFit.`,
      type: "article",
      publishedTime: post.date,
      images: [
        {
          url: `https://functionallyfit.com${post.image}`,
          width: 800,
          height: 600,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: `Learn about ${post.title.toLowerCase()} in this informative article from FunctionallyFit.`,
      images: [`https://functionallyfit.com${post.image}`],
    },
  };
};

export default function BlogPost({ params }: PageParams) {
  // In a real application, you would fetch the post data based on the slug
  // const post = await getPost(params.slug)

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/blog"
        className="inline-flex items-center text-primary hover:underline mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Blog
      </Link>
      <article className="max-w-3xl mx-auto">
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={400}
          className="rounded-lg object-cover w-full h-64 mb-6"
        />
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Calendar className="mr-2 h-4 w-4" />
          <span className="mr-4">{post.date}</span>
          <Clock className="mr-2 h-4 w-4" />
          <span>{post.readTime}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {post.categories.map((category, i) => (
            <Link
              key={i}
              href={`/blog?category=${encodeURIComponent(category)}`}
            >
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">
                <Tag className="mr-1 h-3 w-3" />
                {category}
              </span>
            </Link>
          ))}
        </div>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
      <div className="max-w-3xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-4">Share this article</h2>
        <div className="flex space-x-4">
          <Button variant="outline">Facebook</Button>
          <Button variant="outline">Twitter</Button>
          <Button variant="outline">LinkedIn</Button>
        </div>
      </div>
    </div>
  );
}
