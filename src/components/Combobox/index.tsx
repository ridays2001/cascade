// Source code forked from Codebrahma/React-combobox.
import React, { useState, useRef, useEffect, useReducer } from 'react';
import useScroll, { focusReducer, initialState } from './functions';
import { keys } from './util';
import type { ComboBoxProps } from './util';
import '../../styles/combobox.scss';

const ComboBox: React.FC<ComboBoxProps> = ({
	options: comboBoxOptions,
	onChange,
	defaultValue,
	placeholder,
	onSelect,
	onOptionsChange,
	optionsListMaxHeight,
	renderOptions,
	enableAutocomplete,
	name,
	onBlur,
	editable = true,
	renderRightElement,
	renderLeftElement,
	id
}) => {
	const optionMaxHeight = optionsListMaxHeight || 200;
	let suggestionListPositionStyles: React.CSSProperties = {};

	// Function that will check whether the defaultIndex falls inside the length of the options
	// or else it will return -1

	const [options, setOptions] = useState<string[]>(comboBoxOptions);
	const [inputValue, setInputValue] = useState(defaultValue || '');
	const [state, dispatch] = useReducer(focusReducer, initialState);
	const { isFocus, focusIndex } = state;
	const [isMouseInsideOptions, setIsMouseInsideOptions] = useState(false); // This is used to determine whether the mouse cursor is inside or outside options container
	const [IsOptionsPositionedTop, setIsOptionsPositionedTop] = useState(false);
	const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);

	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const optionsListRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		setOptions(comboBoxOptions);
	}, [comboBoxOptions]);

	useEffect(() => {
		if (!isFocus) setInputValue(defaultValue || '');
		dispatch({
			type: 'setFocusIndex',
			focusIndex: defaultValue ? options.indexOf(defaultValue.toString()) : -1
		});
		setSelectedOptionIndex(defaultValue ? options.indexOf(defaultValue.toString()) : -1);
	}, [defaultValue]);

	useScroll(focusIndex, dropdownRef, optionsListRef);

	useEffect(() => {
		// Position the options container top or bottom based on the space available
		const optionsContainerElement: any = dropdownRef.current;

		const offsetBottom = window.innerHeight - optionsContainerElement?.offsetParent?.getBoundingClientRect().top;

		if (
			optionMaxHeight > offsetBottom &&
			optionsContainerElement?.offsetParent?.getBoundingClientRect().top > offsetBottom
		) {
			setIsOptionsPositionedTop(true);
		} else {
			setIsOptionsPositionedTop(false);
		}
	}, [isFocus]);

	if (IsOptionsPositionedTop)
		suggestionListPositionStyles = {
			bottom: '100%',
			marginBottom: '5px'
		};
	else
		suggestionListPositionStyles = {
			top: '100%',
			marginTop: '5px'
		};

	const blurHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!isMouseInsideOptions) dispatch({ type: 'toggleFocus', isFocus: false });
		if (onBlur) onBlur(event);
	};

	const updateValue = (index: number = focusIndex) => {
		if (index !== -1) {
			setInputValue(options[index]);
			if (onOptionsChange) onOptionsChange(options[index]);
		}
	};

	// While searching, the options are filtered and the index also changed.
	// So the focus index is set to original based on all the options.
	const resetFocusIndex = () => {
		comboBoxOptions.forEach((option: string, index: number) => {
			if (option === options[focusIndex])
				dispatch({
					type: 'setFocusIndex',
					focusIndex: index
				});
		});
	};

	const selectSuggestionHandler = () => {
		updateValue();
		dispatch({ type: 'toggleFocus', isFocus: false });
		setSelectedOptionIndex(focusIndex);
		resetFocusIndex();
		setOptions(comboBoxOptions);

		if (onSelect) onSelect(options[focusIndex]);
	};

	const keyHandler = (event: any) => {
		const optionsContainerElement: any = dropdownRef.current;
		let newFocusIndex = focusIndex;

		switch (event.keyCode) {
			case keys.DOWN: {
				event.preventDefault();

				// set the focus to true if the options list was not opened.
				// Also set the scroll top
				if (!isFocus) {
					dispatch({ type: 'toggleFocus', isFocus: true });
				} else {
					// If the focus reaches the end of the options in the list, set the focus to 0

					if (focusIndex >= options.length - 1) {
						newFocusIndex = 0;
						optionsContainerElement.scrollTop = 0;
					}
					// Change the scroll position based on the selected option position
					else {
						newFocusIndex = focusIndex + 1;
					}
				}
				dispatch({
					type: 'setFocusIndex',
					focusIndex: newFocusIndex
				});

				if (onOptionsChange) onOptionsChange(options[newFocusIndex]);
				dropdownRef.current = optionsContainerElement;
				break;
			}
			case keys.UP: {
				event.preventDefault();

				// set the focus to true if the options list was not opened.
				if (!isFocus) {
					dispatch({ type: 'toggleFocus', isFocus: true });
				} else {
					// If the focus falls beyond the start of the options in the list, set the focus to height of the suggestion-list
					if (focusIndex <= 0) {
						newFocusIndex = options.length - 1;

						if (optionsContainerElement)
							optionsContainerElement.scrollTop = optionsContainerElement.scrollHeight;
					} else {
						newFocusIndex = focusIndex - 1;
					}
				}
				dispatch({
					type: 'setFocusIndex',
					focusIndex: newFocusIndex
				});

				if (onOptionsChange) onOptionsChange(options[newFocusIndex]);
				dropdownRef.current = optionsContainerElement;
				break;
			}
			case keys.ENTER: {
				event.preventDefault();
				if (focusIndex > -1 && focusIndex < options.length) selectSuggestionHandler();

				break;
			}
			case keys.ESC: {
				event.target.blur();
				dispatch({ type: 'toggleFocus', isFocus: false });
				break;
			}
		}
	};

	const filterSuggestion = (filterText: string) => {
		if (filterText.length === 0) setOptions(comboBoxOptions);
		else {
			const filteredSuggestion = comboBoxOptions.filter(option => {
				return option.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
			});
			setOptions(filteredSuggestion);
		}
	};

	const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) onChange(event);
		setInputValue(event.target.value);
		if (enableAutocomplete) filterSuggestion(event.target.value);
	};

	const inputClickHandler = () => {
		dispatch({
			type: 'toggleFocus',
			isFocus: true
		});
		dispatch({
			type: 'setFocusIndex',
			focusIndex: options.indexOf(inputValue.toString())
		});
	};

	const focusHandler = () => {
		dispatch({ type: 'toggleFocus', isFocus: true });
	};

	const mouseEnterHandler = (index: number) => {
		dispatch({ type: 'setFocusIndex', focusIndex: index });
		if (onOptionsChange) onOptionsChange(options[index]);
	};

	const getBgClass = (optionIndex: number) => {
		if (optionIndex === focusIndex) return 'highlighted';
		if (optionIndex === selectedOptionIndex) return 'selected';
		return '';
	};

	return (
		<div className='comboBox' id={id}>
			{renderLeftElement && <div className='leftElement'>{renderLeftElement()}</div>}
			<input
				onFocus={focusHandler}
				onChange={inputChangeHandler}
				placeholder={placeholder || ''}
				onKeyDown={keyHandler}
				value={inputValue}
				className='comboBoxInput'
				onBlur={blurHandler}
				name={name}
				style={{
					cursor: editable ? 'text' : 'pointer',
					paddingLeft: renderLeftElement ? 30 : 10
				}}
				readOnly={!editable}
				onClick={inputClickHandler}
			/>
			{renderRightElement && <div className='rightElement'>{renderRightElement()}</div>}
			<div
				className='comboBoxPopover'
				style={{
					opacity: isFocus ? 1 : 0,
					visibility: isFocus ? 'visible' : 'hidden',
					maxHeight: isFocus ? optionMaxHeight : 0,
					...suggestionListPositionStyles
				}}
				ref={dropdownRef}
				onMouseEnter={() => setIsMouseInsideOptions(true)}
				onMouseLeave={() => setIsMouseInsideOptions(false)}
			>
				<ul className='comboBoxList' ref={optionsListRef}>
					{options.map((option, index) => {
						return (
							<li
								className={`comboBoxOption ${getBgClass(index)}`}
								key={option}
								onClick={() => selectSuggestionHandler()}
								onMouseDown={e => e.preventDefault()}
								onMouseEnter={() => mouseEnterHandler(index)}
							>
								{renderOptions ? renderOptions(option) : option}
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

export default ComboBox;
