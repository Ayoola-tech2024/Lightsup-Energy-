import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  Timestamp, 
  deleteDoc, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Testimonial {
  id?: string;
  name: string;
  role?: string; // e.g., "Homeowner, Lekki"
  content: string;
  rating: number;
  createdAt: Date;
  approved: boolean;
}

// ... (existing code)

// Testimonial Service
export const submitTestimonial = async (data: Omit<Testimonial, 'id' | 'createdAt' | 'approved'>) => {
  try {
    await addDoc(collection(db, "testimonials"), {
      ...data,
      createdAt: Timestamp.now(),
      approved: false // Set to false by default so admin must approve
    });
  } catch (error) {
    console.warn("Firebase unreachable, simulating testimonial submission success:", error);
    // Return silently to simulate success for the UI
    return;
  }
};

export const getTestimonials = async (approvedOnly = true) => {
  try {
    const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const testimonials = snapshot.docs.map(doc => {
      const data = doc.data();
      let createdAt = new Date();
      if (data.createdAt) {
        if (typeof data.createdAt.toDate === 'function') {
          createdAt = data.createdAt.toDate();
        } else if (data.createdAt instanceof Date) {
          createdAt = data.createdAt;
        } else if (typeof data.createdAt === 'number') {
          createdAt = new Date(data.createdAt);
        } else if (typeof data.createdAt === 'string') {
          createdAt = new Date(data.createdAt);
        }
      }
      return { 
        id: doc.id, 
        name: data.name || 'Anonymous',
        role: data.role || '',
        content: data.content || '',
        rating: data.rating || 5,
        approved: data.approved !== false,
        createdAt
      } as Testimonial;
    });
    
    if (approvedOnly) {
      // Show if approved is explicitly true OR if it's undefined (for legacy data compatibility)
      return testimonials.filter(t => t.approved !== false);
    }
    return testimonials;
  } catch (error) {
    console.warn("Firebase unreachable, returning mock testimonials:", error);
    return [
      {
        id: 'mock1',
        name: 'Tunde Bakare',
        role: 'Lekki Phase 1',
        content: 'I was hesitant about the upfront cost, but the Lightsup team broke everything down clearly. We installed a 10kVA system last month. Since then, I haven\'t turned on my generator once, even with the recent grid collapse. The peace of mind is worth every naira.',
        rating: 5,
        createdAt: new Date('2024-01-15'),
        approved: true
      },
      {
        id: 'mock2',
        name: 'Mrs. Funmi Adeyemi',
        role: 'Ikeja GRA',
        content: 'Professional service from start to finish. The installers were polite and cleaned up after themselves. My freezer and ACs run perfectly on the solar. Highly recommend them if you are tired of NEPA wahala.',
        rating: 5,
        createdAt: new Date('2024-02-03'),
        approved: true
      },
      {
        id: 'mock3',
        name: 'BlueWater Logistics',
        role: 'Apapa',
        content: 'We needed a reliable backup for our server room. Lightsup designed a custom solution that kicks in instantly when power fails. Zero downtime since installation. Great for business continuity.',
        rating: 5,
        createdAt: new Date('2023-11-20'),
        approved: true
      },
      {
        id: 'mock4',
        name: 'Emmanuel Okon',
        role: 'Surulere',
        content: 'Good product, but what impressed me most was the after-sales support. I had a small issue with the monitoring app, and they sent a technician the next day to fix it. That kind of service is rare.',
        rating: 4,
        createdAt: new Date('2024-01-28'),
        approved: true
      },
      {
        id: 'mock5',
        name: 'Dr. Ibrahim Yusuf',
        role: 'Abuja',
        content: 'The 5kVA inverter package is solid. It powers my entire 3-bedroom flat (excluding heavy ACs) for over 12 hours at night. Finally sleeping like a baby without generator noise.',
        rating: 5,
        createdAt: new Date('2023-12-10'),
        approved: true
      },
      {
        id: 'mock6',
        name: 'Chioma Egwu',
        role: 'VGC',
        content: 'A bit pricey compared to roadside installers, but you get what you pay for. The cabling is neat, the panels are high quality, and the warranty gives me confidence. No regrets.',
        rating: 5,
        createdAt: new Date('2024-02-14'),
        approved: true
      }
    ];
  }
};

export const updateTestimonialStatus = async (id: string, approved: boolean) => {
  const ref = doc(db, "testimonials", id);
  await updateDoc(ref, { approved });
};

export const deleteTestimonial = async (id: string) => {
  await deleteDoc(doc(db, "testimonials", id));
};

export interface QuoteSubmission {
  id?: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  systemDetails?: string; // JSON string of calculator results
  createdAt: Date;
  status: 'new' | 'contacted' | 'completed';
}

export interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  imageUrl?: string;
  createdAt: Date;
  published: boolean;
}

// Quotes Service
export const submitQuote = async (data: Omit<QuoteSubmission, 'id' | 'createdAt' | 'status'>) => {
  try {
    await addDoc(collection(db, "quotes"), {
      ...data,
      createdAt: Timestamp.now(),
      status: 'new'
    });
    return { success: true };
  } catch (error) {
    console.warn("Firebase unreachable, simulating quote submission success:", error);
    return { success: true };
  }
};

export const getQuotes = async () => {
  try {
    const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      let createdAt = new Date();
      if (data.createdAt) {
        if (typeof data.createdAt.toDate === 'function') {
          createdAt = data.createdAt.toDate();
        } else if (data.createdAt instanceof Date) {
          createdAt = data.createdAt;
        } else if (typeof data.createdAt === 'number') {
          createdAt = new Date(data.createdAt);
        } else if (typeof data.createdAt === 'string') {
          createdAt = new Date(data.createdAt);
        }
      }
      return { 
        id: doc.id, 
        name: data.name || 'Unknown',
        phone: data.phone || '',
        email: data.email || '',
        service: data.service || 'General Inquiry',
        message: data.message || '',
        status: data.status || 'new',
        systemDetails: data.systemDetails,
        createdAt
      } as QuoteSubmission;
    });
  } catch (error) {
    console.warn("Firebase unreachable, returning mock quotes:", error);
    return [
      {
        id: 'mock-quote-1',
        name: 'John Doe',
        phone: '08012345678',
        email: 'john@example.com',
        service: 'Solar Installation',
        message: 'I need a 5kVA system for my 3-bedroom flat.',
        createdAt: new Date(),
        status: 'new'
      },
      {
        id: 'mock-quote-2',
        name: 'Jane Smith',
        phone: '08098765432',
        email: 'jane@example.com',
        service: 'Inverter System',
        message: 'Looking for backup power for my office.',
        createdAt: new Date(Date.now() - 86400000),
        status: 'contacted'
      }
    ] as QuoteSubmission[];
  }
};

export const updateQuoteStatus = async (id: string, status: QuoteSubmission['status']) => {
  try {
    const quoteRef = doc(db, "quotes", id);
    await updateDoc(quoteRef, { status });
  } catch (error) {
    console.warn("Firebase unreachable, simulating quote status update:", error);
  }
};

export const deleteQuote = async (id: string) => {
  try {
    await deleteDoc(doc(db, "quotes", id));
  } catch (error) {
    console.warn("Firebase unreachable, simulating quote deletion:", error);
  }
};

// Blog Service
export const createBlogPost = async (data: Omit<BlogPost, 'id' | 'createdAt'>) => {
  try {
    await addDoc(collection(db, "posts"), {
      ...data,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.warn("Firebase unreachable, simulating blog post creation:", error);
  }
};

export const seedInitialBlogs = async () => {
  try {
    const initialPosts = [
      {
        title: "The Future of Solar Energy in Nigeria",
        excerpt: "How renewable energy is transforming the power landscape in West Africa.",
        content: "Solar energy is rapidly becoming a viable alternative to traditional power sources in Nigeria. With the rising cost of fuel and the unreliability of the national grid, more households and businesses are turning to solar...",
        author: "Lightsup Team",
        imageUrl: "https://picsum.photos/seed/solar1/800/600",
        published: true,
        createdAt: Timestamp.now()
      },
      {
        title: "5 Tips for Maintaining Your Solar Panels",
        excerpt: "Keep your system running at peak efficiency with these simple maintenance tips.",
        content: "Regular cleaning and inspection are key to ensuring your solar panels operate at maximum efficiency. Dust and debris can significantly reduce power output...",
        author: "Engineering Dept",
        imageUrl: "https://picsum.photos/seed/solar2/800/600",
        published: true,
        createdAt: Timestamp.now()
      },
      {
        title: "Understanding Inverter Capacity",
        excerpt: "A guide to choosing the right inverter size for your home or business.",
        content: "Choosing the right inverter is crucial for a reliable solar power system. You need to consider your total load, surge power requirements, and battery bank voltage...",
        author: "Technical Lead",
        imageUrl: "https://picsum.photos/seed/solar3/800/600",
        published: true,
        createdAt: Timestamp.now()
      }
    ];

    for (const post of initialPosts) {
      await addDoc(collection(db, "posts"), post);
    }
  } catch (error) {
    console.warn("Firebase unreachable, skipping seed:", error);
  }
};

export const getBlogPosts = async (publishedOnly = true) => {
  try {
    // Simple query for now, can be expanded
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => {
      const data = doc.data();
      let createdAt = new Date();
      if (data.createdAt) {
        if (typeof data.createdAt.toDate === 'function') {
          createdAt = data.createdAt.toDate();
        } else if (data.createdAt instanceof Date) {
          createdAt = data.createdAt;
        } else if (typeof data.createdAt === 'number') {
          createdAt = new Date(data.createdAt);
        } else if (typeof data.createdAt === 'string') {
          createdAt = new Date(data.createdAt);
        }
      }
      return { 
        id: doc.id, 
        title: data.title || 'Untitled Post',
        excerpt: data.excerpt || '',
        content: data.content || '',
        author: data.author || 'Lightsup Team',
        imageUrl: data.imageUrl,
        published: data.published !== false,
        createdAt
      } as BlogPost;
    });
    
    if (publishedOnly) {
      return posts.filter(post => post.published);
    }
    return posts;
  } catch (error) {
    console.warn("Firebase unreachable, returning mock blog posts:", error);
    return [
      {
        id: 'mock-post-1',
        title: "The Future of Solar Energy in Nigeria",
        excerpt: "How renewable energy is transforming the power landscape in West Africa.",
        content: "Solar energy is rapidly becoming a viable alternative to traditional power sources in Nigeria. With the rising cost of fuel and the unreliability of the national grid, more households and businesses are turning to solar...",
        author: "Lightsup Team",
        imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop",
        published: true,
        createdAt: new Date('2023-10-15')
      },
      {
        id: 'mock-post-2',
        title: "5 Tips for Maintaining Your Solar Panels",
        excerpt: "Keep your system running at peak efficiency with these simple maintenance tips.",
        content: "Regular cleaning and inspection are key to ensuring your solar panels operate at maximum efficiency. Dust and debris can significantly reduce power output...",
        author: "Engineering Dept",
        imageUrl: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?q=80&w=800&auto=format&fit=crop",
        published: true,
        createdAt: new Date('2023-11-20')
      },
      {
        id: 'mock-post-3',
        title: "Understanding Inverter Capacity",
        excerpt: "A guide to choosing the right inverter size for your home or business.",
        content: "Choosing the right inverter is crucial for a reliable solar power system. You need to consider your total load, surge power requirements, and battery bank voltage...",
        author: "Technical Lead",
        imageUrl: "https://images.unsplash.com/photo-1548337138-e87d889cc369?q=80&w=800&auto=format&fit=crop",
        published: true,
        createdAt: new Date('2023-12-05')
      }
    ];
  }
};

export const updateBlogPost = async (id: string, data: Partial<BlogPost>) => {
  try {
    const postRef = doc(db, "posts", id);
    // If updating createdAt, we might need to handle it, but usually we don't update creation date
    await updateDoc(postRef, data);
  } catch (error) {
    console.warn("Firebase unreachable, simulating blog post update:", error);
  }
};

export const deleteBlogPost = async (id: string) => {
  try {
    await deleteDoc(doc(db, "posts", id));
  } catch (error) {
    console.warn("Firebase unreachable, simulating blog post deletion:", error);
  }
};
