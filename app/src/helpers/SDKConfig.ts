export enum SDKLanguage {
	Java = 'java',
	JavaScript = 'javascript',
	Python = 'python',
	DotNet ='dotnet'
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
};

export function getSDKDocConfig(language?: SDKLanguage) {
	if (!language) {
		language = process.env['REACT_APP_SDK_LANGUAGE'] as SDKLanguage;
	}
	return sdkConfigs[language];
}
