import React from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRss } from "@fortawesome/free-solid-svg-icons"
import {
	faDiscord,
	faFacebookF,
	faGithub,
	faHackerNews,
	faLinkedinIn,
	faMediumM,
	faRedditAlien,
	faStackOverflow,
	faTwitch,
	faTwitter,
	faVk,
	faYoutube,
	faXing,
} from "@fortawesome/free-brands-svg-icons"

const FaIcon = ({ icon, className }) => (
	<FontAwesomeIcon icon={iconForName(icon)} className={className} />
)

// don't use a library (e.g. `library.add(fas, fab)`) because,
// if the icons are referenced by string, they require JavaScript to show up;
// importing them explicitly works around that
const iconForName = icon => {
	switch (icon) {
		case "faDiscord":
			return faDiscord
		case "faFacebookF":
			return faFacebookF
		case "faGithub":
			return faGithub
		case "faHackerNews":
			return faHackerNews
		case "faLinkedinIn":
			return faLinkedinIn
		case "faMediumM":
			return faMediumM
		case "faRedditAlien":
			return faRedditAlien
		case "faRss":
			return faRss
		case "faStackOverflow":
			return faStackOverflow
		case "faTwitch":
			return faTwitch
		case "faTwitter":
			return faTwitter
		case "faVk":
			return faVk
		case "faYoutube":
			return faYoutube
		case "faXing":
			return faXing
		default:
			throw new Error(`Unknown FontAwesome icon name: ${icon}.`)
	}
}

export default FaIcon
