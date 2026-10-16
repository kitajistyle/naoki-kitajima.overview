import type { MetadataRoute } from 'next'
import { getBlogPosts, getWorks } from '../lib/data'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kitajistyle.com'
const langs = ['en', 'ja'] as const
const staticPaths = ['', '/about', '/blog', '/contact', '/like', '/works']

const withLangAlternates = (path: string) => ({
  alternates: {
    languages: {
      en: `${siteUrl}/en${path}`,
      ja: `${siteUrl}/ja${path}`,
      'x-default': `${siteUrl}/en${path}`,
    },
  },
})

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticPaths.flatMap((path) =>
    langs.map((lang): MetadataRoute.Sitemap[number] => ({
      url: `${siteUrl}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? 'weekly' : 'monthly',
      priority: path === '' ? 1 : 0.7,
      ...withLangAlternates(path),
    }))
  )

  const blogEntries = getBlogPosts('en').flatMap((post) =>
    langs.map((lang): MetadataRoute.Sitemap[number] => ({
      url: `${siteUrl}/${lang}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly',
      priority: 0.6,
      ...withLangAlternates(`/blog/${post.slug}`),
    }))
  )

  const worksEntries = getWorks('en').flatMap((work) =>
    langs.map((lang): MetadataRoute.Sitemap[number] => ({
      url: `${siteUrl}/${lang}/works/${work.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
      ...withLangAlternates(`/works/${work.slug}`),
    }))
  )

  return [...staticEntries, ...blogEntries, ...worksEntries]
}
