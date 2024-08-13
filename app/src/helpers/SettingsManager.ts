import { Loadable, RecoilState, RecoilValue, SetterOrUpdater, WrappedValue, atom, useRecoilState } from 'recoil';

export enum Setting {
	DarkTheme = 'dark-theme',
	NavWidth = 'nav-width',
	NavCollapsed = 'nav-collapsed',
}

class SettingsManager {
	get(setting: Setting) {
		return localStorage.getItem(setting);
	}
	getBoolean(setting: Setting, defaultValue: boolean) {
		const item = localStorage.getItem(setting);
		if (item === null) return defaultValue === true;
		else return item === 'true';
	}
	getNumber(setting: Setting, defaultValue: number) {
		const item = localStorage.getItem(setting);
		if (item === null) return defaultValue;
		else return parseInt(item);
	}
	set(setting: Setting, val: string | boolean | number) {
		let v = '';
		if (typeof val === 'boolean') v = (val as boolean) ? 'true' : 'false';
		else if (typeof val === 'string') v = val as string;
		else v = `${val}`;
		localStorage.setItem(setting, v);
	}

	getDarkTheme() {
		return this.getBoolean(Setting.DarkTheme, true);
	}
	setDarkTheme(enabled: boolean) {
		if (this.getDarkTheme() === enabled) return;
		this.set(Setting.DarkTheme, enabled);
	}

	getNavWidth() {
		return this.getNumber(Setting.NavWidth, 300);
	}
	setNavWidth(width: number) {
		if (this.getNavWidth() === width) return;
		this.set(Setting.NavWidth, width);
	}

	getNavCollapsed() {
		return this.getBoolean(Setting.NavCollapsed, false);
	}
	setNavCollapsed(collapsed: boolean) {
		if (this.getNavCollapsed() === collapsed) return;
		this.set(Setting.NavCollapsed, collapsed);
	}
}
export const settingsManager = new SettingsManager();

/***
 * Setting hooks
 */

const settingAtoms: { [key in Setting]?: RecoilState<any> } = {};

function useSetting<T>(
	setting: Setting,
	defaultValue: T | RecoilValue<T> | Promise<T> | Loadable<T> | WrappedValue<T>,
	setFunc: { (v: T): void }
): [T, SetterOrUpdater<T>] {
	if (!settingAtoms[setting]) {
		settingAtoms[setting] = atom({
			key: setting,
			default: defaultValue,
			effects: [
				({ onSet }) => {
					onSet(setFunc);
				},
			],
		});
	}

	return useRecoilState(settingAtoms[setting]!);
}

export function useDarkTheme() {
	return useSetting(Setting.DarkTheme, settingsManager.getDarkTheme(), settingsManager.setDarkTheme.bind(settingsManager));
}

export function useNavWidth() {
	return useSetting(Setting.NavWidth, settingsManager.getNavWidth(), settingsManager.setNavWidth.bind(settingsManager));
}

export function useNavCollapsed() {
	return useSetting(Setting.NavCollapsed, settingsManager.getNavCollapsed(), settingsManager.setNavCollapsed.bind(settingsManager));
}
