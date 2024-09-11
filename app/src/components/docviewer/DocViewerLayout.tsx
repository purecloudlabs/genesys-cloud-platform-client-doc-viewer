import React, { useEffect, useRef, useState } from 'react';
import { DxButton, DxTextbox, DxToggle } from 'genesys-react-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GenesysDevIcon, GenesysDevIcons } from 'genesys-dev-icons';

import { useDarkTheme, useNavCollapsed, useNavWidth } from '../../helpers/SettingsManager';
import MarkdownDisplay from '../markdowndisplay/MarkdownDisplay';
import { getSDKDocConfig } from '../../helpers/SDKConfig';
import logoDark from '../../images/logo-dark.svg';
import logolight from '../../images/logo-light.svg';

import './DocViewerLayout.scss';
import Badge from './Badge';

const NAV_MIN_WIDTH = 300;
const NAV_COLLAPSED_WIDTH = 32;
const NAV_MAX_WIDTH_FACTOR = 0.7;

const pathAndExtensionRegex = /^(.+?)(:?\.(md|html))?$/i;
const hashRegex = /^#(.+)$/i;

const sdkDocConfig = getSDKDocConfig();

export default function DocViewerLayout() {
	const [darkThemeEnabled, setDarkThemeEnabled] = useDarkTheme();
	const [navWidth, setNavWidth] = useNavWidth();
	const [navCollapsed, setNavCollapsed] = useNavCollapsed();
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const loadedPath = useRef<string>('');
	const location = useLocation();
	const navigate = useNavigate();
	const [markdown, setMarkdown] = useState<string>();
	const [navItems, setNavItems] = useState<string[]>([]);
	const [filteredNavItems, setFilteredNavItems] = useState<string[]>([]);
	const [filterTerm, setFilterTerm] = useState<string>('');
	const [showZoomZoom, setShowZoomZoom] = useState(false);

	useEffect(() => {
		const onResize = (e: UIEvent) => {
			const maxWidth = Math.trunc(document.documentElement.clientWidth * NAV_MAX_WIDTH_FACTOR);
			if (sidebarRef.current?.clientWidth! > maxWidth) setNavWidth(maxWidth);
		};

		window.addEventListener('resize', onResize);

		(async () => {
			try {
				const res = await axios.get(`${process.env['PUBLIC_URL']}/docs/index.json`);
				const items = (res.data as string[])
					.sort((a, b) => (a.toLowerCase() === b.toLowerCase() ? 0 : a.toLowerCase() > b.toLowerCase() ? 1 : -1))
					.map((s) => {
						const match = pathAndExtensionRegex.exec(s);
						return match ? match[1] : s;
					})
					.filter((s) => s !== 'index');
				setNavItems(items);
			} catch (err) {
				console.log('failed to load doc index', err);
			}
		})();

		return () => {
			window.removeEventListener('resize', onResize);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const match = pathAndExtensionRegex.exec(location.pathname);
		if (match && match[2]) {
			let newLocation = match[1] + location.hash;
			navigate(newLocation, { replace: true });
			return;
		}
		updateDocument();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	useEffect(() => {
		if (window.location.hash) {
			// Scroll to hash location
			scrollIntoView();
		} else {
			// Scroll to top of content
			document.getElementById('markdown-content')?.scrollTo(0, 0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [markdown]);

	useEffect(() => {
		const term = filterTerm.toLowerCase();
		let items = navItems;
		if (term) items = items.filter((i) => i.toLowerCase().includes(term));
		setFilteredNavItems(items);
	}, [navItems, filterTerm]);

	const rsMouseDownHandler: React.MouseEventHandler = (e) => {
		if (!sidebarRef.current || e.button !== 0) return;
		setIsDragging(true);

		const startingDragPos = e.clientX;
		const sbWidth = window.getComputedStyle(sidebarRef.current).width;
		const initialWidth = parseInt(sbWidth, 10);

		const mouseMoveHandler = (e: MouseEvent) => {
			const delta = e.clientX - startingDragPos;
			const newWidth = initialWidth + delta;

			if (navCollapsed) setNavCollapsed(false);
			if (newWidth >= NAV_MIN_WIDTH && newWidth < document.documentElement.clientWidth * NAV_MAX_WIDTH_FACTOR) {
				setNavWidth(newWidth);
			}
		};

		const mouseUpHandler = () => {
			document.removeEventListener('mouseup', mouseUpHandler);
			document.removeEventListener('mousemove', mouseMoveHandler);
			setIsDragging(false);
		};

		document.addEventListener('mousemove', mouseMoveHandler);
		document.addEventListener('mouseup', mouseUpHandler);
	};

	const onDoubleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
		setNavCollapsed(!navCollapsed);
	};

	const scrollIntoView = function (isRetry?: boolean): void {
		const match = hashRegex.exec(window.location.hash);
		if (!match) return;
		const elementId = match[1];
		const elem = document.getElementById(elementId);
		if (elem) {
			elem.scrollIntoView();
		} else if (!isRetry) {
			setTimeout(() => scrollIntoView(true), 1000);
		}
	};

	const updateDocument = async () => {
		try {
			// Update content
			let pathname = location.pathname === '/' ? '/index' : location.pathname;
			let match = pathAndExtensionRegex.exec(pathname);
			if (match && match[1] !== loadedPath.current) {
				loadedPath.current = match[1];
				const doc = await axios.get(`${process.env['PUBLIC_URL']}/docs${loadedPath.current}.md`);

				// Double check against outdated async result
				if (match[1] === loadedPath.current) {
					setMarkdown(doc.data);

					const elem = document.getElementById(`link-${loadedPath.current.toLowerCase()}`);
					if (elem) {
						if (!isElementVisible(elem)) elem.scrollIntoView();
					}
				}
			}

			// Scroll to hash location
			scrollIntoView();
		} catch (err: any) {
			console.error(err);
			let msg = "An unexpected error occurred loading the content, see the browser's JavaScript console for details.";
			if (err?.response?.status === 404) {
				msg = '404: Page not found';
			}
			setMarkdown(`# Error
:::{"alert":"critical","title":"Page not loaded","collapsible":false,"autoCollapse":false}
${msg}
:::`);
		}
	};

	const navDisplayWidth = navCollapsed ? NAV_COLLAPSED_WIDTH : navWidth;

	return (
		<div className={`doc-viewer doc-viewer-${darkThemeEnabled ? 'dark' : 'light'}`}>
			<div className={`navigation${isDragging ? ' dragging' : ''}`} ref={sidebarRef} style={{ width: `${navDisplayWidth}px` }}>
				<div className="navigation-header">
					<img src={darkThemeEnabled ? logoDark : logolight} alt="Genesys" className="genesys-logo" />
					<h1 className="header-title">
						<Link to="/">{sdkDocConfig.title}</Link>
					</h1>
					<div className="badges">
						{sdkDocConfig.badges.map((badgeConfig, i) => (
							<Link key={i} to={badgeConfig.packageBadgeLink} target="_blank" title={badgeConfig.text}>
								<img src={badgeConfig.packageBadgeURL} alt={badgeConfig.text} />
							</Link>
						))}
						<Link to="releaseNotes">
							<Badge text="release notes" backgroundColor={sdkDocConfig.badgeColor} />
						</Link>
					</div>
					<DxToggle
						label="Dark theme"
						value={darkThemeEnabled}
						onChange={(value) => {
							if (value !== undefined && value !== darkThemeEnabled) setDarkThemeEnabled(value === true);
						}}
					/>
					<DxTextbox
						className="filter-textbox"
						label="SDK Resource Filter"
						onChange={(newText) => setFilterTerm(newText || '')}
						changeDebounceMs={0}
						clearOnEscape={true}
						clearButton={true}
						icon={GenesysDevIcons.AppSearch}
					/>
				</div>
				<div
					id="navigation-content"
					onScroll={(event) =>
						(event.target as Element).id === 'navigation-content' && setShowZoomZoom((event.target as Element).scrollTop > 50)
					}
				>
					<ul className="nav-list">
						{filteredNavItems.map((s) => (
							<li
								key={s}
								id={`link-/${s.toLowerCase()}`}
								className={location.pathname.toLowerCase() === `/${s.toLowerCase()}` ? 'selected' : ''}
							>
								<Link to={s} title={s}>
									{s}
								</Link>
							</li>
						))}
					</ul>
				</div>
				{showZoomZoom && (
					<DxButton className="zoom-zoom" type="link" onClick={() => document.getElementById('navigation-content')?.scrollTo(0, 0)}>
						<GenesysDevIcon icon={GenesysDevIcons.AppZoomZoomUp} />
					</DxButton>
				)}
				<div className="resize-handle" onMouseDown={rsMouseDownHandler} onDoubleClick={onDoubleClick}>
					<div className="grip"></div>
				</div>
			</div>
			<div id="markdown-content" className="content" style={{ marginLeft: `${navDisplayWidth}px` }}>
				{markdown && <MarkdownDisplay markdown={markdown} />}
			</div>
		</div>
	);
}

function isElementVisible(elem: HTMLElement, offset = 0) {
	const bounds = elem.getBoundingClientRect();
	return bounds.top >= 0 && bounds.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset;
}
