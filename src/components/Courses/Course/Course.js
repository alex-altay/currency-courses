import React from 'react';

import './Course.css';

import arrow from '../../../assets/arrow.svg';
import close from '../../../assets/close.svg';

// Функция для отображения символов валют, 
// которые иначе Реакт экранирует
const createMarkup = symbols => {
  return { __html: symbols };
}

const course = props => {
    return (
     <form className='currency-course'>

      <div className='from-course'>      
        <label htmlFor='from-input'>{props.fromName}</label>
        <div className='input-group'>
          <input 
            id='from-input'
            className='form-control' 
            type='number' 
            defaultValue={props.quantity} 
            min='0' 
            onChange={(e) => props.calculate(e, props.ind)}/>
          <div className="input-group-append">
            <span className='input-group-text' dangerouslySetInnerHTML={createMarkup(props.fromSymbol)} />
          </div>
        </div>
      </div>
      
      <img className='currency-course__arrow' src={arrow} alt='Поменять местами' onClick={props.swap} />

      <div className='to-course'>
        <label htmlFor='from-input'>{props.toName}</label>
        <div className='input-group'>
          <input 
            className="form-control" 
            type="text" 
            placeholder={Number(props.forAll).toFixed(2)} 
            readOnly />
          <div className="input-group-append">
            <span className='input-group-text' dangerouslySetInnerHTML={createMarkup(props.toSymbol)} />
          </div>
        </div>
      </div>

      <img className='currency-course__close' src={close} alt='Удалить курс' onClick={props.delete} />

    </form>
    );
}

export default course;
