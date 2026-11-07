// App names include Japanese, so they are URI-encoded into the path
export const appHref = (name: string): string => `/admin/apps/${encodeURIComponent(name)}`
