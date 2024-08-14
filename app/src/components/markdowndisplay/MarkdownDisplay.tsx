import React from 'react';
import { LoadingPlaceholder } from 'genesys-react-components';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { DocumentNode, HeadingNode, LinkNode, scrapeText, YeastBlockNodeTypes, YeastChild, YeastInlineNodeTypes } from 'yeast-core';
import { MarkdownParser } from 'yeast-markdown-parser';
import { ReactRenderer } from 'yeast-react-renderer';
import { Link } from 'react-router-dom';

interface IProps {
	markdown: string;
}

const pathAndExtensionRegex = /^(.+?)(:?\.(md|html))?$/i;

const customRenderers = {
	[YeastInlineNodeTypes.Link]: (node: YeastChild, renderer: ReactRenderer): ReactNode | undefined => {
		if (!Object.hasOwn(node, 'type') || (node as any).type.toLowerCase() !== YeastInlineNodeTypes.Link) return undefined;
		const typedNode = node as LinkNode;
		let href = typedNode.href;

		// Strip content file extensions
		let match = pathAndExtensionRegex.exec(href);
		if (match) href = match[1];

		return (
			<Link to={href} title={typedNode.title}>
				{renderer.renderComponents(typedNode.children)}
			</Link>
		);
	},
	[YeastBlockNodeTypes.Heading]: (node: YeastChild, renderer: ReactRenderer): ReactNode | undefined => {
		// NOTE: this is the base heading renderer from yeast, but with a custom-made ID for the anchor link
		if (!Object.hasOwn(node, 'type') || (node as any).type.toLowerCase() !== YeastBlockNodeTypes.Heading) return undefined;
		const typedNode = node as HeadingNode;
		// Override default ID to retain case -- the SDK doc generator uses the enum name with case here
		typedNode.id = scrapeText(typedNode).replaceAll(/[^a-z0-9]/gi, '-');

		const level = typedNode.level >= 1 && typedNode.level <= 7 && typedNode.level % 1 === 0 ? typedNode.level : 1;
		if (level === 7) {
			return (
				<span className={`h7`} id={typedNode.id}>
					{renderer.renderComponents(typedNode.children)}
				</span>
			);
		} else {
			return React.createElement<any>(`h${level}`, { id: typedNode.id }, renderer.renderComponents(typedNode.children));
		}
	},
};

const yeastRenderer = new ReactRenderer(customRenderers);
const yeastParser = new MarkdownParser();

export default function MarkdownDisplay(props: IProps) {
	/***
	 * DESIGN NOTE
	 * The parsed and rendered content is stored in a ref element to prevent re-running the rendering logic on each state update.
	 * When using the OOTB YeastNodeRenderer component, it re-runs renderComponents on every re-render. This causes all of the plugins
	 * to be re-run as well, resulting in entirely new objects being returned. The observed behavior is that any components that
	 * lazy-load additional information (e.g. images and OpenAPI Explorer) reset and reinitialize repeatedly.
	 */
	const renderedNodes = useRef<ReactNode>();
	const [renderTrigger, setRenderTrigger] = useState<number>(0);

	useEffect(() => {
		// Parse markdown into AST
		const document = yeastParser.parse(props.markdown) as DocumentNode;

		// Store AST in ref
		renderedNodes.current = yeastRenderer.renderComponents(document.children);

		// Update render trigger to reload markdown
		setRenderTrigger(Date.now());
	}, [props.markdown]);

	if (renderedNodes.current) {
		return <React.Fragment key={renderTrigger}>{renderedNodes.current}</React.Fragment>;
	} else {
		return <LoadingPlaceholder />;
	}
}
