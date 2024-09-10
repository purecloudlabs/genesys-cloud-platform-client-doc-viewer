export enum SDKLanguage {
	Java = 'java',
	JavaScript = 'javascript',
	Python = 'python',
	DotNet = 'dotnet',
	CLI = 'cli',
	iOS = 'ios',
	WebMessagingJava = 'webmessagingjava',
	JavaGuest = 'javaguest',
	JavaScriptGuest = 'javascriptguest',
}

export interface SDKDocConfig {
	title: string;
	badges: SDKBadge[];
	badgeColor: string;
}

export interface SDKBadge {
	text: string;
	packageBadgeURL: string;
	packageBadgeLink: string;
}

const sdkConfigs: { [language in SDKLanguage]: SDKDocConfig } = {
	[SDKLanguage.Java]: {
		title: 'Platform API Java Client',
		badgeColor: '#4c1',
		badges: [
			{
				text: 'Maven Central',
				packageBadgeURL: 'https://maven-badges.herokuapp.com/maven-central/com.mypurecloud/platform-client-v2/badge.svg',
				packageBadgeLink: 'https://maven-badges.herokuapp.com/maven-central/com.mypurecloud/platform-client-v2',
			},
		],
	},
	[SDKLanguage.JavaScript]: {
		title: 'Platform API JavaScript Client',
		badgeColor: '#007ec6',
		badges: [
			{
				text: 'npm',
				packageBadgeURL: 'https://img.shields.io/npm/v/purecloud-platform-client-v2.svg',
				packageBadgeLink: 'https://www.npmjs.com/package/purecloud-platform-client-v2',
			},
			{
				text: 'GitHub release',
				packageBadgeURL: 'https://img.shields.io/github/release/mypurecloud/platform-client-sdk-javascript.svg',
				packageBadgeLink: 'https://github.com/MyPureCloud/platform-client-sdk-javascript/releases',
			},
		],
	},
	[SDKLanguage.Python]: {
		title: 'Platform API Python Client',
		badgeColor: '#4c1',
		badges: [
			{
				text: 'PyPi',
				packageBadgeURL: 'https://badge.fury.io/py/PureCloudPlatformClientV2.svg',
				packageBadgeLink: 'https://pypi.org/project/PureCloudPlatformClientV2/',
			},
		],
	},
	[SDKLanguage.DotNet]: {
		title: 'Platform API .NET Client',
		badgeColor: '#007ec6',
		badges: [
			{
				text: 'Nuget',
				packageBadgeURL: 'https://img.shields.io/nuget/v/PureCloudPlatform.Client.V2',
				packageBadgeLink: 'https://www.nuget.org/packages/PureCloudPlatform.Client.V2/',
			},
		],
	},
	[SDKLanguage.CLI]: {
		title: 'Platform API CLI SDK',
		badgeColor: '#007ec6',
		badges: [],
	},
	[SDKLanguage.iOS]: {
		title: 'Platform API iOS Client',
		badgeColor: '#007ec6',
		badges: [],
	},
	[SDKLanguage.WebMessagingJava]: {
		title: 'Web Messaging SDK - Java',
		badgeColor: '#007ec6',
		badges: [
			{
				text: 'Maven Central',
				packageBadgeURL: 'https://maven-badges.herokuapp.com/maven-central/cloud.genesys/web-messaging-sdk/badge.svg',
				packageBadgeLink: 'https://maven-badges.herokuapp.com/maven-central/cloud.genesys/web-messaging-sdk',
			},
		],
	},
	[SDKLanguage.JavaGuest]: {
		title: 'Guest Chat Client - Java',
		badgeColor: '#4c1',
		badges: [
			{
				text: 'Maven Central',
				packageBadgeURL: 'https://maven-badges.herokuapp.com/maven-central/com.mypurecloud/purecloud-guest-chat-client/badge.svg',
				packageBadgeLink: 'https://maven-badges.herokuapp.com/maven-central/com.mypurecloud/purecloud-guest-chat-client',
			},
		],
	},
	[SDKLanguage.JavaScriptGuest]: {
		title: 'Guest Chat Client - JavaScript',
		badgeColor: '#007ec6',
		badges: [
			{
				text: 'npm',
				packageBadgeURL: 'https://img.shields.io/npm/v/purecloud-guest-chat-client.svg',
				packageBadgeLink: 'https://www.npmjs.com/package/purecloud-guest-chat-client',
			},
			{
				text: 'GitHub release',
				packageBadgeURL: 'https://img.shields.io/github/release/mypurecloud/purecloud-guest-chat-client.svg',
				packageBadgeLink: 'https://github.com/MyPureCloud/purecloud-guest-chat-client/releases',
			},
		],
	},
};

export function getSDKDocConfig(language?: SDKLanguage) {
	if (!language) {
		language = process.env['REACT_APP_SDK_LANGUAGE'] as SDKLanguage;
	}
	return sdkConfigs[language];
}
