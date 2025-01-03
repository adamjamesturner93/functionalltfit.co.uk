'use client';

import { Suspense, useEffect, useState } from 'react';
import { Calendar, Clock, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
    title: '5 Adaptive Workouts for Limited Mobility',
    excerpt:
      'Discover effective exercises that can be done with limited mobility to improve strength and flexibility.',
    date: '2024-10-20',
    readTime: '5 min read',
    image: '/placeholder.svg',
    slug: '5-adaptive-workouts-for-limited-mobility',
    categories: ['adaptive fitness', 'limited mobility', 'strength training', 'flexibility'],
  },
  {
    title: 'Balancing Fitness and Parenting: A Guide',
    excerpt:
      'Learn how to incorporate quick, effective workouts into your busy schedule as a parent.',
    date: '2024-10-18',
    readTime: '7 min read',
    image: '/placeholder.svg',
    slug: 'balancing-fitness-and-parenting',
    categories: ['parenting', 'time management', 'quick workouts', 'family fitness'],
  },
  {
    title: 'Nutrition Tips for Managing Diabetes',
    excerpt:
      'Expert advice on maintaining a balanced diet to help manage diabetes while pursuing your fitness goals.',
    date: '2024-10-15',
    readTime: '6 min read',
    image: '/placeholder.svg',
    slug: 'nutrition-tips-for-managing-diabetes',
    categories: ['nutrition', 'diabetes management', 'healthy eating', 'meal planning'],
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

const WordCloud: React.FC<WordCloudProps> = ({ categories, selectedCategory, onCategoryClick }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((category, index) => (
        <Button
          key={index}
          variant={selectedCategory === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryClick(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

function BlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || '',
  );
  const allCategories = getAllCategories(blogPosts);

  useEffect(() => {
    if (selectedCategory) {
      router.push(`/blog?category=${encodeURIComponent(selectedCategory)}`);
    } else {
      router.push('/blog');
    }
  }, [selectedCategory, router]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const filteredPosts = selectedCategory
    ? blogPosts.filter((post) => post.categories.includes(selectedCategory))
    : blogPosts;

  return (
    <>
      <section className="w-full bg-gradient-to-b from-secondary/20 to-background py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h1 className="mb-4 text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            Functionally Fit Blog
          </h1>
          <p className="mb-8 max-w-[700px] text-muted md:text-xl">
            Discover expert tips, inspiring stories, and the latest in adaptive fitness and health
            management.
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
                    className="h-48 w-full rounded-lg object-cover"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2">{post.title}</CardTitle>
                  <p className="mb-4 text-muted">{post.excerpt}</p>
                  <div className="mb-4 flex items-center text-sm text-muted">
                    <Calendar className="mr-2 size-4" />
                    <span className="mr-4">{post.date}</span>
                    <Clock className="mr-2 size-4" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((category, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        <Tag className="mr-1 size-3" />
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

      <section className="w-full bg-secondary/5 py-12 md:py-24 lg:py-32">
        <div className="container px-4 text-center md:px-6">
          <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Stay Updated
          </h2>
          <p className="mx-auto mb-8 max-w-[600px] text-muted md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Subscribe to our newsletter for the latest fitness tips, health advice, and app updates.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Input type="email" placeholder="Enter your email" className="max-w-sm" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogContent />
    </Suspense>
  );
}
