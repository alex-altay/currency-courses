import React from 'react';
import './AddNewCurrency.css';

const addNewCurrency = props => {
  const currenciesKeys = Object.keys(props.currencies);
  let currenciesList = currenciesKeys.map(k => [k, props.currencies[k]['Name']]);
  currenciesList = currenciesList.sort((a, b) => a[1] > b[1]);
  currenciesList = currenciesList.map(c => <option key={c[0]} value={c[0]}>{c[1]}</option>);

  return (
    <div className='add-currency'>
      <h3>Добавить валюту</h3>
      <form onSubmit={props.addCourse}>
        <label htmlFor='fromKey'>У меня есть</label>
        <select id='fromKey' required readOnly>
          {currenciesList}
        </select>
        
        <label htmlFor='fromKey'>Хочу приобрести</label>
        <select id='toKey' required readOnly>
          {currenciesList}
        </select>

        <button type='submit'>OK</button>  
      </form> 
  </div>
  
  );
}

export default addNewCurrency;
