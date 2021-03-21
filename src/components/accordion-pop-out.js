import React, { useEffect } from "react"

import { classNames } from "../infra/functions"

import * as style from "./accordion-pop-out.module.css"

const PopOutAccordion = ({ headerClassName, headers, backToTop, className, children }) => {
	const id = "pop-out-accordion-c92x5f"
	useEffect(() => {
		document.getElementById(id).classList.add(style.animated)
		window.addEventListener("click", closeOpenMenus)
		return () => window.removeEventListener("click", closeOpenMenus)
	})

	children = Array.isArray(children) ? children : [children]
	return (
		<div id={id} {...classNames(style.container, className)}>
			{backToTop && backToTopButton(headerClassName)}
			{children.map((child, index) =>
				child ? item(headers[index], headerClassName, index, child) : null
			)}
		</div>
	)
}

const backToTopButton = titleClassName => {
	return (
		<div key="back-to-top" className={style.item}>
			<span
				{...classNames(style.itemLabel, titleClassName)}
				// the filter on the landing page uses the hash to encode filter state,
				// so back-to-top can't link to an anchor without resetting the filter
				// ~> use JS to scroll
				onClick={() => window.scrollTo(0, 0)}
			>
				{"▼"}
			</span>
		</div>
	)
}

const item = (title, titleClassName, index, item) => {
	const id = "pop-out-accordion-item-" + index
	const checkboxId = id + "-checkbox"
	const contentId = id + "-content"
	return (
		<div key={title} className={style.item}>
			<input id={checkboxId} className={style.itemCheckbox} type="checkbox" />
			<label {...classNames(style.itemLabel, titleClassName)} htmlFor={checkboxId}>
				{title}
			</label>
			<div id={contentId} className={style.itemContent}>
				<div>{item}</div>
			</div>
		</div>
	)
}

const closeOpenMenus = event => {
	document
		.querySelectorAll(`.${style.itemCheckbox}:checked`)
		.forEach(checkbox => closeOpenMenu(event, checkbox))
}

const closeOpenMenu = (event, checkbox) => {
	const target = event.target
	// if the label was clicked, ignore the event;
	// another one will be coming that otherwise toggles back to true
	const clickedLabel =
		target === checkbox ||
		(target.nodeName.toLowerCase() === "label" && target.htmlFor === checkbox.id)
	if (clickedLabel) return

	// we even close if the opened item was clicked
	// const clickedMenuEntry = checkbox.parentNode.contains(event.target)
	// if (clickedMenuEntry) return

	// something unrelated to the currently open menu was clicked ~> close it
	// (by simulating a click, so the animations are triggered)
	checkbox.click()
}

export default PopOutAccordion
