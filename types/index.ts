export interface BlogPost {
  id: string;
  title: string;
  image: string;
  description: string;
  content: string;
  redirectUrl: string;
  slug: string;
  tags?: string[];
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | Date;
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface Ad {
  id: string;
  title: string;
  image: string;
  redirectUrl: string;
  position: 'header' | 'sidebar' | 'footer' | 'content-top' | 'content-bottom';
  isActive: boolean;
}

