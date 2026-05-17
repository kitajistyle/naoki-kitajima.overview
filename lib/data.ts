import type { Locale } from '../app/[lang]/dictionaries'
import worksData from '../data/works.json'
import profileData from '../data/profile.json'
import blogData from '../data/blog.json'

export type Work = {
  slug: string
  tags: string[]
  url?: string
  image?: string
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
    ...work[locale],
  }))

export const getWorkBySlug = (locale: Locale, slug: string): Work | undefined =>
  getWorks(locale).find((w) => w.slug === slug)

export const getProfile = (locale: Locale): Profile => ({
  links: profileData.links,
  skills: profileData.skills,
  ...profileData[locale],
})

export type BlogPost = {
  slug: string
  date: string
  tags: string[]
  title: string
  excerpt: string
  body: string[]
}

export const getBlogPosts = (locale: Locale): BlogPost[] =>
  blogData.map((post) => ({
    slug: post.slug,
    date: post.date,
    tags: post.tags,
    ...post[locale],
  }))

export const getBlogPostBySlug = (locale: Locale, slug: string): BlogPost | undefined =>
  getBlogPosts(locale).find((p) => p.slug === slug)
