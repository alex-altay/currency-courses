import React from 'react';
import './AddNewCurrency.css';

const addNewCurrency = props => {
  const currenciesKeys = Object.keys(props.currencies);
  let currenciesList = currenciesKeys.map(k => [k, props.currencies[k]['Name']]);
  currenciesList = currenciesList.sort((a, b) => a[1] > b[1]);
  currenciesList = currenciesList.map(c => <option key={c[0]} value={c[0]}>{c[1]}</option>);

  return (
      
      <form className='add-course' onSubmit={props.addCourse}>
       
        <h3>Добавить валюту</h3>

        <div className='add-line'>
         <div className='from'>
            <label htmlFor='fromKey'>У меня есть</label>
            <select id='fromKey' className="form-control" required readOnly>
              {currenciesList}
            </select>
          </div>
          
          <div className='to'>
            <label htmlFor='toKey'>Хочу приобрести</label>
            <select id='toKey' className="form-control" required readOnly>
              {currenciesList}
            </select>
          </div>
        
          <button type='submit' className="btn btn-primary add-button">Добавить</button>  
        </div>
      
      </form> 
  );
}

export default addNewCurrency;
