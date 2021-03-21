import React, { useState, useLayoutEffect } from "react"
import { graphql, useStaticQuery } from "gatsby"

import { classNames, tagletsFromPath, emptyTaglets, tagletsPath } from "../infra/functions"

import Link from "./link"

import * as style from "./taglet.module.css"

export const Tag = ({ tag, mode, className, onClick: onClick_External, children }) => {
	const { link, forward, onClick: onClick_Internal } = detectMode(mode, null, tag)

	const text = tag === "all" ? "ALL-TAGS" : tag
	const tagletChildren = children || tagletText(text)

	const classes = [style.taglet]
	if (!children) classes.push(style.taglet)
	if (className) classes.push(className)

	return taglet(
		link,
		forward,
		onClick_Internal,
		onClick_External,
		null,
		tag,
		classes,
		tagletChildren
	)
}

export const Channel = ({
	channel,
	plural,
	mode,
	colorize,
	className,
	onClick: onClick_External,
	children,
}) => {
	let { link, forward, onClick: onClick_Internal } = detectMode(mode, channel, null)
	const { singularName, pluralName, slug } = channelInfo(channel)
	if (link) link = slug

	const text = plural ? pluralName : singularName
	const tagletChildren = children || tagletText(text)

	const classes = []
	if (!children) classes.push(style.taglet)
	if (colorize) classes.push(style.colorize)
	if (className) classes.push(className)

	return taglet(
		link,
		forward,
		onClick_Internal,
		onClick_External,
		channel,
		null,
		classes,
		tagletChildren
	)
}

export const ChannelTag = ({
	channel,
	tag,
	mode,
	className,
	onClick: onClick_External,
	children,
}) => {
	const { link, forward, onClick: onClick_Internal } = detectMode(mode, channel, tag)
	const tagletChildren = children || tagletText(tag)

	const classes = []
	if (!children) classes.push(style.taglet)
	if (className) classes.push(className)

	return taglet(
		link,
		forward,
		onClick_Internal,
		onClick_External,
		channel,
		tag,
		classes,
		tagletChildren
	)
}

// replace hyphen with non-breaking hyphen
export const tagletText = taglet => `#${taglet.replace("-", "‑")}`

const taglet = (
	link,
	forward,
	onClick_Internal,
	onClick_External,
	dataChannel,
	dataTag,
	classes,
	children
) => {
	const onClick = event => {
		if (onClick_External) onClick_External(event)
		if (onClick_Internal) onClick_Internal(event)
	}
	const [jsEnabled, setJsEnabled] = useState(false)
	useLayoutEffect(() => {
		setJsEnabled(true)
	}, [])
	const to = jsEnabled ? forward : link
	return to ? (
		<Link
			to={to}
			dataChannel={dataChannel}
			dataTag={dataTag}
			onClick={onClick}
			{...classNames(classes)}
		>
			{children}
		</Link>
	) : (
		<span data-channel={dataChannel} data-tag={dataTag} {...classNames(classes)}>
			{children}
		</span>
	)
}

/*
 * Modes:
 *  - text: there's just text, no link
 *  - forward: link to index page (with hash) instead of a dedicated page
 *  - uplink: update the hash (i.e. read existing and toggle selection) instead of linking to a different page
 *  - overlink: set the hash (i.e. overwrite existing hash) instead of linking to a different page
 * Returned:
 *  - link: used as href if JS disabled
 *  - forward: used as href if JS enabled
 *  - onClick: event handler
 */
const detectMode = (mode, channel, tag) => {
	// as long as pages are not processed as posts, `#page` can't link anywhere
	if (channel === "pages")
		return {
			link: null,
			forward: null,
			onClick: null,
		}

	mode = mode || "text"
	const taglet = tag || channel
	switch (mode) {
		case "text":
			return {
				link: null,
				forward: null,
				onClick: null,
			}
		case "forward":
			return {
				link: taglet,
				forward: tagletsPath(channel, tag),
				onClick: null,
			}
		case "uplink":
			return {
				link: taglet,
				forward: tagletsPath(channel, tag),
				onClick: event => updatePath(channel, tag, event),
			}
		case "overlink":
			return {
				link: taglet,
				forward: tagletsPath(channel, tag),
				onClick: event => overridePath(channel, tag, event),
			}
	}
}

const updatePath = (channel, tag, event) => {
	event.preventDefault()
	const taglets = tagletsFromPath()
	if (channel) taglets.toggleSelection("channel", channel)
	if (tag) taglets.toggleSelection("tag", tag)
	taglets.writePath()
}

const overridePath = (channel, tag, event) => {
	event.preventDefault()
	const taglets = emptyTaglets()
	if (channel) taglets.toggleSelection("channel", channel)
	if (tag) taglets.toggleSelection("tag", tag)
	taglets.writePath()
}

const channelInfo = channel =>
	channel === "all"
		? {
				singularName: "ALL",
				pluralName: "ALL-CHANNELS",
				slug: "/",
		  }
		: useStaticQuery(graphql`
				query {
					channels: allChannel {
						nodes {
							internalName
							singularName
							pluralName
							slug
						}
					}
				}
		  `).channels.nodes.find(node => node.internalName === channel)
