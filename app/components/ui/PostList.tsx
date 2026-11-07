import Link from 'next/link'
import type { BlogPost } from '../../../lib/data'

type Props = {
  posts: BlogPost[]
  lang: string
  tone?: 'light' | 'dark'
  showExcerpt?: boolean
  headingLevel?: 'h2' | 'h3'
}

export function PostList({ posts, lang, tone = 'light', showExcerpt = false, headingLevel: Heading = 'h3' }: Props) {
  const muted = tone === 'light' ? 'text-white/60' : 'text-muted'

  return (
    <ul>
      {posts.map((post, i) => (
        <li key={post.slug}>
          {i > 0 ? <span className="my-6 block h-px w-2.5 bg-linear-to-r from-accent-from to-accent-to md:my-8" /> : null}
          <Link href={`/${lang}/blog/${post.slug}`} className="group block">
            <time dateTime={post.date} className={`font-mono text-xs tracking-widest ${muted}`}>
              {post.date.replaceAll('-', '.')}
            </time>
            <Heading className="mt-2 line-clamp-2 text-base leading-relaxed font-bold md:text-lg">
              <span className="bg-linear-to-r from-accent-from to-accent-to bg-size-[0%_1px] bg-bottom-left bg-no-repeat transition-[background-size] duration-400 group-hover:bg-size-[100%_1px]">
                {post.title}
              </span>
            </Heading>
            {showExcerpt && post.excerpt ? (
              <p className={`mt-3 text-sm leading-relaxed ${muted}`}>{post.excerpt}</p>
            ) : null}
            {showExcerpt && post.tags.length > 0 ? (
              <ul className={`mt-3 flex flex-wrap gap-3 text-[10px] tracking-widest uppercase ${muted}`}>
                {post.tags.map((tag) => (
                  <li key={tag}>#{tag}</li>
                ))}
              </ul>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  )
}
