import React from "react"
import Helmet from "react-helmet"

import { graphql, useStaticQuery } from "gatsby"

import { getImagePath, getImagePaths } from "./image"

const Meta = ({title, slug, publicationDate, canonicalUrl, image, description, searchKeywords, videoUrl, structuredDataType}) => {
	const data = useStaticQuery(
		graphql`
			query {
				site {
					siteMetadata {
						title
						description
						siteUrl
						twitter
					}
				}
			}
		`
	)

	const site = data.site.siteMetadata
	const siteName = `${site.title} - ${site.description}`
	const pageTitle = title ? `${title} - ${site.title}` : siteName
	const pageDescription = description || site.description
	const pageUrl = slug ? `${site.siteUrl}/${slug}` : site.siteUrl
	// because pages are reachable with and without trailing slash
	// (which Google treats as two different pages), the canonical URL
	// has to be used to identify one of them as the... well, canonical URL
	const pageCanonicalUrl = canonicalUrl || pageUrl
	const pageImage = (image && image.slug)
		? site.siteUrl + getImagePath(image.slug, image.type)
		: `${site.siteUrl}/nicolai.jpg`
	const pageImageAlt = null

	if (pageTitle.length > 60) console.warn("Long title: ", slug)
	if (pageDescription.length > 180) console.warn("Long description: ", slug)

	const links = {
		canonical: pageCanonicalUrl,
	}

	const metaNames = {
		// Google
		description,
		// Twitter
		//                             only use "summary_large_image" with non-default page images
		"twitter:card": videoUrl ? "player" : image ? "summary_large_image" : "summary",
		"twitter:site": site.twitter,
		"twitter:creator": site.twitter,
		"twitter:title": pageTitle,
		"twitter:description": pageDescription,
		"twitter:image": pageImage,
		"twitter:image:alt": pageImageAlt,
		"twitter:player": videoUrl,
		"twitter:player:width": videoUrl ? 1280 : null,
		"twitter:player:height": videoUrl ? 720 : null,
	}

	// yes, it's useless for search engines, but it's documentation what I'm aiming for
	// and it helps other tools judge the SEO quality
	if (searchKeywords) metaNames.keywords = searchKeywords

	const metaProperties = {
		// Open Graph
		"og:title": pageTitle,
		"og:type": "article",
		"og:image": pageImage,
		"og:url": pageUrl,
		"og:description": pageDescription,
		"og:site_name": siteName,
		"og:video": videoUrl,
	}

	let structuredData = null
	if (structuredDataType === `article`)
		structuredData = {
			"@context": "https://schema.org",
			"@type": "NewsArticle",
			headline: title,
			image: [pageImage],
			datePublished: publicationDate,
		}
		if (structuredDataType === `course`)
		structuredData = {
			"@context": "https://schema.org",
			"@type": "Course",
			name: title,
			description,
			provider: {
				"@type": "Organization",
				name: "Nicolai Parlog - nipafx",
				sameAs: "https://nipafx.dev/nicolai-parlog",
			},
		}
	if (structuredDataType === `video`)
		structuredData = {
			"@context": "https://schema.org",
			"@type": "VideoObject",
			name: title,
			description,
			uploadDate: publicationDate,
			thumbnailUrl: getImagePaths(image.slug, image.type),
			contentUrl: getVideoContentUrl(videoUrl)
		}

	return (
		<Helmet>
			<title key="title">{pageTitle}</title>
			{/* "charset" and "viewport" are defined in html.js */}
			{propertiesOf(links).map(([key, value]) => (
				<link key={key} rel={key} href={value} />
			))}
			{propertiesOf(metaNames).map(([key, value]) => (
				<meta key={key} name={key} content={value} />
			))}
			{propertiesOf(metaProperties).map(([key, value]) => (
				<meta key={key} property={key} content={value} />
			))}
			{structuredData && (
				<script type="application/ld+json">{JSON.stringify(structuredData)}</script>
			)}
		</Helmet>
	)
}

const getVideoContentUrl = videoUrl => {
	if (!videoUrl || !videoUrl.includes("youtube.com/watch?v="))
		return undefined

	const videoId = videoUrl.match(/.*youtube\.com\/watch\?v=(.*)/)[1]
	return `https://youtube.com/get_video_info?video_id=${videoId}`
}

const propertiesOf = object =>
	Object.getOwnPropertyNames(object)
		.map(prop => [prop, object[prop]])
		// filter out pairs with undefined values
		.filter(([key, value]) => value)

export default Meta
