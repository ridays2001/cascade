import type { ReactElement } from 'react';

export interface ComboBoxProps {
	options: string[];
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	defaultValue?: string;
	placeholder?: string;
	onSelect?: (option: string) => void;
	onOptionsChange?: (option: string) => void;
	optionsListMaxHeight?: number;
	renderOptions?: (option: string) => React.ReactNode;
	enableAutocomplete?: boolean;
	name?: string;
	onBlur?: (event?: React.ChangeEvent<HTMLInputElement>) => void;
	editable?: boolean;
	renderRightElement?: () => ReactElement;
	renderLeftElement?: () => ReactElement;
	id?: string;
}

export const keys = {
	UP: 38,
	DOWN: 40,
	ENTER: 13,
	ESC: 27
};
