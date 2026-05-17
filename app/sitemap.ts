import type { MetadataRoute } from 'next'
import { getBlogPosts, getWorks } from '../lib/data'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kitajistyle.com'
const langs = ['en', 'ja'] as const
const staticPaths = ['', '/about', '/blog', '/contact', '/like', '/works']

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticPaths.flatMap((path) =>
    langs.map((lang) => ({
      url: `${siteUrl}/${lang}${path}`,
      lastModified: new Date(),
    }))
  )

  const blogEntries = getBlogPosts('en').flatMap((post) =>
    langs.map((lang) => ({
      url: `${siteUrl}/${lang}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    }))
  )

  const worksEntries = getWorks('en').flatMap((work) =>
    langs.map((lang) => ({
      url: `${siteUrl}/${lang}/works/${work.slug}`,
      lastModified: new Date(),
    }))
  )

  return [...staticEntries, ...blogEntries, ...worksEntries]
}
