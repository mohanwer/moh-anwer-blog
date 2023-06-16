import { CommonSEO } from '@/components/seo/CommonSEO'
import { siteMetadata } from '@/data/siteMetaData'

interface PageSEOProps {
  title: string
  description: string
}

export const PageSEO = (props: PageSEOProps) => {
  const socialUrl = siteMetadata.siteUrl + siteMetadata.socialBanner
  const ogImage = [{ url: socialUrl }]
  return <CommonSEO ogType="website" ogImage={ogImage} twImage={socialUrl} {...props} />
}
