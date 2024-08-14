import React from 'react';

import './Badge.scss';

interface IProps {
	text: string;
	backgroundColor?: string;
}

export default function Badge(props: IProps) {
	return (
		<span className="badge" style={{ backgroundColor: props.backgroundColor || '#555' }}>
			{props.text}
		</span>
	);
}
