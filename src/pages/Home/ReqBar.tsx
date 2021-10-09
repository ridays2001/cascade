import React, { useState } from 'react';
import { methods } from '../../util/data';
import '../styles/request.scss';
import ComboBox from '../../components/Combobox';

const ReqBar = () => (
	<div className='row' style={{ justifyContent: 'center' }}>
		<div className='col-4 col-sm-3 col-md-2 col-xl-1'>
			<ComboBox
				id='method'
				options={methods}
				enableAutocomplete
				placeholder='Method'
				defaultValue='GET'
				onChange={e => (e.target.value = e.target.value.toUpperCase())}
				onBlur={e => console.log(e?.target.value)}
			/>
		</div>

		<input className='c-input col-md-8 col-lg-4' />
		<div className='col-md-4'>
			<button>Submit</button>
		</div>
	</div>
);

export default ReqBar;
