import { useLang, usePages } from '@rspress/core/runtime';
import { Link, renderInlineMarkdown } from '@rspress/core/theme';
import type { BlogAvatarAuthor } from '@rstack-dev/doc-ui/blog-avatar';
import { BlogBackground } from '@rstack-dev/doc-ui/blog-background';
import {
  BlogList as BaseBlogList,
  type BlogListItem,
} from '@rstack-dev/doc-ui/blog-list';

const AUTHORS: Record<string, BlogAvatarAuthor> = {
  mikigo: {
    name: 'mikigo',
    avatar: '/logo.png',
    github: 'https://github.com/mikigo',
  },
};

type BlogFrontmatter = {
  description?: string;
  date?: string;
  authors?: string[];
};

const normalizeAuthors = (
  authors?: string[],
): BlogAvatarAuthor[] => {
  if (!authors?.length) {
    return [];
  }
  return authors
    .map(author => (typeof author === 'string' ? AUTHORS[author] : author))
    .filter((a): a is BlogAvatarAuthor => Boolean(a));
};

const getDateValue = (date?: BlogListItem['date']): number => {
  if (!date) {
    return 0;
  }
  const timestamp = new Date(date).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const useBlogPages = (): BlogListItem[] => {
  const { pages } = usePages();
  const lang = useLang();

  return pages
    .filter(page => page.lang === lang)
    .filter(
      page =>
        page.routePath.includes('/blog/') && !page.routePath.endsWith('/blog/'),
    )
    .map(page => {
      const frontmatter = (page.frontmatter ?? {}) as BlogFrontmatter;
      const filename = page.routePath.split('/').pop();

      return {
        id: filename,
        title: page.title,
        description: frontmatter.description,
        date: frontmatter.date,
        href: page.routePath,
        authors: normalizeAuthors(frontmatter.authors),
      };
    })
    .sort((a, b) => getDateValue(b.date) - getDateValue(a.date));
};

export function BlogList() {
  const blogPages = useBlogPages();
  const lang = useLang();

  return (
    <>
      <BaseBlogList
        posts={blogPages}
        lang={lang}
        LinkComp={Link}
        renderInlineMarkdown={renderInlineMarkdown}
      />
      <BlogBackground />
    </>
  );
}
