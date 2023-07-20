import { siteMetadata } from '@/data/siteMetaData'

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(siteMetadata.locale, {
    year: '2-digit',
    month: 'long',
    day: 'numeric',
  })
}
