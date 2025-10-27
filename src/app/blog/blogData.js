export const blogCategories = [
    "All",
    "Web Development",
    "Mobile Apps",
    "Cloud Computing",
    "AI/ML",
    "DevOps",
    "UI/UX Design"
];

export const featuredPost = {
    id: "featured-1",
    title: "The Future of Web Development: Trends to Watch in 2023",
    excerpt: "As we navigate through 2023, the web development landscape continues to evolve at a rapid pace. From AI-powered development tools to the rise of WebAssembly, we explore the technologies that are shaping the future of web development.",
    image: "https://picsum.photos/seed/featured-article/800/600.jpg",
    date: "June 15, 2023",
    readTime: "8 min read",
    author: {
        name: "Sarah Johnson",
        role: "Lead Developer",
        avatar: "https://picsum.photos/seed/author1/100/100.jpg"
    },
    featured: true,
    slug: "future-of-web-development"
};

export const blogPosts = [
    {
        id: "post-1",
        title: "Building Scalable APIs with Node.js and Express",
        excerpt: "Learn how to design and implement RESTful APIs that can handle millions of requests with proper architecture patterns and best practices.",
        image: "https://picsum.photos/seed/blog-post-1/600/400.jpg",
        date: "June 10, 2023",
        readTime: "5 min read",
        author: {
            name: "Michael Chen",
            avatar: "https://picsum.photos/seed/author2/100/100.jpg"
        },
        comments: 12,
        tags: ["Node.js", "API", "Backend"],
        slug: "building-scalable-apis"
    },
    {
        id: "post-2",
        title: "Modern CSS Techniques for Responsive Design",
        excerpt: "Explore the latest CSS features including Grid, Flexbox, and Container Queries that make creating responsive layouts easier than ever before.",
        image: "https://picsum.photos/seed/blog-post-2/600/400.jpg",
        date: "June 8, 2023",
        readTime: "7 min read",
        author: {
            name: "Emily Rodriguez",
            avatar: "https://picsum.photos/seed/author3/100/100.jpg"
        },
        comments: 8,
        tags: ["CSS", "Frontend", "Responsive"],
        slug: "modern-css-techniques"
    },
    {
        id: "post-3",
        title: "Implementing CI/CD Pipelines for Modern Web Apps",
        excerpt: "A comprehensive guide to setting up continuous integration and deployment pipelines using GitHub Actions, Docker, and cloud services.",
        image: "https://picsum.photos/seed/blog-post-3/600/400.jpg",
        date: "June 5, 2023",
        readTime: "10 min read",
        author: {
            name: "Alex Thompson",
            avatar: "https://picsum.photos/seed/author4/100/100.jpg"
        },
        comments: 15,
        tags: ["DevOps", "CI/CD", "GitHub"],
        slug: "implementing-cicd-pipelines"
    },
    {
        id: "post-4",
        title: "Optimizing React Performance: Advanced Techniques",
        excerpt: "Dive deep into React performance optimization with code splitting, memoization, and virtualization techniques for large-scale applications.",
        image: "https://picsum.photos/seed/blog-post-4/600/400.jpg",
        date: "June 2, 2023",
        readTime: "6 min read",
        author: {
            name: "David Park",
            avatar: "https://picsum.photos/seed/author5/100/100.jpg"
        },
        comments: 23,
        tags: ["React", "Performance", "JavaScript"],
        slug: "optimizing-react-performance"
    },
    {
        id: "post-5",
        title: "Introduction to Serverless Architecture with AWS",
        excerpt: "Learn how to build scalable applications without managing servers using AWS Lambda, API Gateway, and other serverless services.",
        image: "https://picsum.photos/seed/blog-post-5/600/400.jpg",
        date: "May 28, 2023",
        readTime: "9 min read",
        author: {
            name: "Jessica Liu",
            avatar: "https://picsum.photos/seed/author6/100/100.jpg"
        },
        comments: 18,
        tags: ["Cloud", "AWS", "Serverless"],
        slug: "introduction-to-serverless"
    },
    {
        id: "post-6",
        title: "Building Progressive Web Apps with Next.js",
        excerpt: "Discover how to create fast, reliable, and engaging Progressive Web Apps using Next.js and modern web technologies.",
        image: "https://picsum.photos/seed/blog-post-6/600/400.jpg",
        date: "May 25, 2023",
        readTime: "12 min read",
        author: {
            name: "Ryan Miller",
            avatar: "https://picsum.photos/seed/author7/100/100.jpg"
        },
        comments: 31,
        tags: ["Next.js", "PWA", "Web App"],
        slug: "building-pwa-nextjs"
    }
];

export const relatedPosts = [
    {
        id: "related-1",
        title: "Building Scalable APIs with Node.js and Express",
        image: "https://picsum.photos/seed/related-post-1/400/250.jpg",
        slug: "building-scalable-apis"
    },
    {
        id: "related-2",
        title: "Modern CSS Techniques for Responsive Design",
        image: "https://picsum.photos/seed/related-post-2/400/250.jpg",
        slug: "modern-css-techniques"
    },
    {
        id: "related-3",
        title: "Optimizing React Performance: Advanced Techniques",
        image: "https://picsum.photos/seed/related-post-3/400/250.jpg",
        slug: "optimizing-react-performance"
    }
];

export const blogComments = [
    {
        id: "comment-1",
        author: "John Doe",
        avatar: "https://picsum.photos/seed/commenter1/100/100.jpg",
        date: "June 16, 2023",
        content: "Great article! I've been experimenting with WebAssembly lately and it's amazing how much performance we can gain from it."
    },
    {
        id: "comment-2",
        author: "Jane Smith",
        avatar: "https://picsum.photos/seed/commenter2/100/100.jpg",
        date: "June 17, 2023",
        content: "I completely agree about AI-powered development tools. GitHub Copilot has been a game-changer for my productivity."
    }
];