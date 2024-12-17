export interface ReleaseResponse {
  version: string;
  url: string;
  notes?: string;
  date?: string;
}

export interface FeedResponse {
  title: string[];
  link: {
    $: {
      href: string;
    };
  }[];
  summary?: string[];
  content?: { _: string }[];
  updated?: string[];
}
