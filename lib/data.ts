import { cache } from 'react'
import type { Locale } from '../app/[lang]/dictionaries'
import worksData from '../data/works.json'
import profileData from '../data/profile.json'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export type Work = {
  slug: string
  tags: string[]
  url?: string
  image?: string
  embed?: boolean
  comingSoon?: boolean
  links: { label: string; url: string }[]
  title: string
  description: string
}

export type CareerItem = {
  org: string
  desc: string
}

export type Profile = {
  name: string
  role: string
  location: string
  bio: string
  career: CareerItem[]
  interests: string[]
  skills: string[]
  links: { label: string; url: string }[]
}

export const getWorks = (locale: Locale): Work[] =>
  worksData.map((work) => ({
    slug: work.slug,
    tags: work.tags,
    url: work.url,
    image: work.image,
    embed: work.embed ?? false,
    comingSoon: work.comingSoon ?? false,
    links: work.links ?? [],
    ...work[locale],
  }))

export const getWorkBySlug = (locale: Locale, slug: string): Work | undefined =>
  getWorks(locale).find((w) => w.slug === slug)

export const getProfile = (locale: Locale): Profile => ({
  links: profileData.links,
  skills: profileData.skills,
  ...profileData[locale],
})

export type BodyBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'code'; text: string }
  | { type: 'ul'; items: string[] }

export type BlogPost = {
  slug: string
  date: string
  tags: string[]
  title: string
  excerpt: string
  contentHtml: string
}

// cache() dedupes per render pass — generateMetadata and the page component
// both call these, so markdown parsing runs once instead of twice per request
export const getBlogPosts = cache((locale: Locale): BlogPost[] => {
  const postsDirectory = path.join(process.cwd(), 'data/posts', locale)
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)
      const contentHtml = marked.parse(matterResult.content) as string

      return {
        slug,
        date: matterResult.data.date,
        tags: matterResult.data.tags || [],
        title: matterResult.data.title,
        excerpt: matterResult.data.excerpt || '',
        contentHtml,
      }
    })

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
})

export const getBlogPostBySlug = cache((locale: Locale, slug: string): BlogPost | undefined => {
  try {
    const fullPath = path.join(process.cwd(), 'data/posts', locale, `${slug}.md`)
    if (!fs.existsSync(fullPath)) {
      return undefined
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    const contentHtml = marked.parse(matterResult.content) as string

    return {
      slug,
      date: matterResult.data.date,
      tags: matterResult.data.tags || [],
      title: matterResult.data.title,
      excerpt: matterResult.data.excerpt || '',
      contentHtml,
    }
  } catch {
    return undefined
  }
})
