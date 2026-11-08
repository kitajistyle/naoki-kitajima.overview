import { FaGithub, FaLinkedin, FaXTwitter, FaLink } from 'react-icons/fa6'
import { SiQiita, SiZenn } from 'react-icons/si'
import type { IconType } from 'react-icons'

const icons: Record<string, IconType> = {
  GitHub: FaGithub,
  X: FaXTwitter,
  Zenn: SiZenn,
  LinkedIn: FaLinkedin,
  Qiita: SiQiita,
}

type Props = {
  label: string
  className?: string
}

export function SocialIcon({ label, className = '' }: Props) {
  const Icon = icons[label] ?? FaLink
  return <Icon aria-hidden="true" className={className} />
}
