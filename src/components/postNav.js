import React from "react"

import Link from "./link"
import LinkList from "./linkList"
import Nav from "./nav"
import Toc from "./toc"

import { classNames } from "../infra/functions"
import MarkdownAsHtml from "../infra/markdownAsHtml"

import canonicalSites from "../../content/meta/canonical-sites.json"
import channelLinks from "../../content/meta/channel-links.json"
import shareLinks from "../../content/meta/share-links.json"

import style from "./postNav.module.css"

const PostNav = ({ title, slug, channel, description, toc, canonical, series, source, open }) => {
	return (
		<Nav
			title={title}
			longHeaders={["origin", "series", "source code", "table of contents", "share & follow"]}
			shortHeaders={["org", "ser", "src", "toc", "s+f"]}
			open={open}
		>
			{canonical && showCanonical(canonical, title)}
			{series && showSeries(series)}
			{source && showSource(source, channel)}
			{toc && showToc(toc)}
			{showShare(title, slug, description)}
		</Nav>
	)
}

const showToc = toc => (
	<div {...classNames(style.entry, style.toc)}>
		<Toc toc={toc} />
	</div>
)

const showCanonical = (canonical, title) => {
	const text = (canonical.text || findTextInCanonicalSites(canonical))
		.replace("$URL", canonical.url)
		.replace("$TITLE", title)
	return (
		<div className={style.entry}>
			<p>
				<MarkdownAsHtml>{text}</MarkdownAsHtml>
			</p>
		</div>
	)
}

const findTextInCanonicalSites = canonical =>
	canonicalSites.sites.find(site => canonical.url.match(site.url)).text

const showSeries = series => {
	return (
		<div className={style.entry}>
			<p>This post is part of a series:</p>
			<ul className={style.seriesList}>
				{series.posts.map(post =>
					post.current ? (
						<li key={post.slug} className={style.currentPost}>
							<MarkdownAsHtml>{post.title}</MarkdownAsHtml> (this one)
						</li>
					) : (
						<li key={post.slug}>
							<Link to={post.slug}>
								<MarkdownAsHtml>{post.title}</MarkdownAsHtml>
							</Link>
						</li>
					)
				)}
				{series.ongoing && <li>to be continued...</li>}
			</ul>
			<p>{series.description}</p>
		</div>
	)
}

const showSource = (source, channel) => (
	<div className={style.entry}>
		{source.repo && <p>{textInSource(source, channel)}</p>}
		{source.text && (
			<p>
				<MarkdownAsHtml>{source.text}</MarkdownAsHtml>
			</p>
		)}
	</div>
)

const textInSource = (source, channel) => {
	switch (source.repo.type) {
		case "demo":
			return (
				<React.Fragment>
					Want to play around with the code yourself? Check out the repository{" "}
					<Link to={source.repo.url}>{source.repo.title}</Link>,{" "}
					<MarkdownAsHtml>{lowercaseFirstLetter(source.repo.description)}</MarkdownAsHtml>{" "}
					- it contains many of the snippets {channelInSource(channel)}.
					{!source.repo.restrictive &&
						" It has a permissive license, so you can reuse the code for your projects."}
				</React.Fragment>
			)
		case "project":
			return (
				<React.Fragment>
					Interested in the project {channelInSource(channel)}? Check out{" "}
					<Link to={source.repo.url}>{source.repo.title}</Link>,{" "}
					<MarkdownAsHtml>{lowercaseFirstLetter(source.repo.description)}</MarkdownAsHtml>
					.
				</React.Fragment>
			)
		default:
			throw new Error("Unknown repo type: " + source.repo.type)
	}
}

const channelInSource = channel => {
	switch (channel) {
		case "articles":
			return "shown in this blog post"
		case "courses":
			return "used in this course"
		case "pages":
			return "shown on this page"
		case "talks":
			return "shown in this talk"
		case "videos":
			return "shown in the video"
		default:
			throw new Error("Unknown channel: " + channel)
	}
}

const lowercaseFirstLetter = string => string.charAt(0).toLowerCase() + string.substring(1)

const showShare = (title, slug, description) => {
	return (
		<div className={style.entry}>
			<p>Share this post with your community:</p>
			<div className={style.icons}>
				<LinkList
					showOnlyIcons
					links={shareLinks.links.map(link =>
						updateShareUrl(link, title, slug, description)
					)}
				/>
			</div>
			<p>
				I'm active on various platforms. Watch this space or follow me there to get notified
				when I publish new content:
			</p>
			<div className={style.icons}>
				<LinkList showOnlyIcons links={channelLinks.links} />
			</div>
		</div>
	)
}

const updateShareUrl = (
	{ title, fontAwesome, url, className },
	articleTitle,
	articleSlug,
	articleDescription
) => {
	articleTitle = articleTitle.replace(/[/`/]/g, "")
	url = url
		.replace(/\n/g, encodeURI("\n"))
		.replace("$DESCRIPTION", articleDescription)
		.replace("$TITLE", articleTitle)
		.replace("$SLUG", articleSlug)
	return { title, fontAwesome, url, className }
}

export default PostNav
