import { careerStrategy1 } from "./articles/career-strategy-1";
import { tech1 } from "./articles/deep-technical-1";
import { market1 } from "./articles/market-analysis-1";
import { career2 } from "./articles/career-negotiation";
import { tech2 } from "./articles/ai-tools-1";
import { arch1 } from "./articles/architecture-1";
import { culture1 } from "./articles/culture-1";
import { oss1 } from "./articles/oss-contribution";
import { leadership1 } from "./articles/leadership-1";
import { distSystems1 } from "./articles/distributed-systems-1";
import { securityDeepDive1 } from "./articles/security-deep-dive-1";
import { productivityScience1 } from "./articles/productivity-science-1";

export type ContentBlock = {
  type: 'text' | 'h2' | 'h3' | 'list' | 'tip' | 'warning' | 'quote' | 'link';
  content: string | string[];
  targetId?: string;
};

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  blocks: ContentBlock[];
};

export const ARTICLES: Article[] = [
  careerStrategy1,
  tech1,
  market1,
  career2,
  tech2,
  arch1,
  culture1,
  oss1,
  leadership1,
  distSystems1,
  securityDeepDive1,
  productivityScience1
];
