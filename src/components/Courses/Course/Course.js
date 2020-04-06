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
    <div className='currency-courses'>
      <input className='currency-courses__from-quantity' type='number' defaultValue={props.quantity} min='0' onChange={(e) => props.calculate(e, props.ind)}/>
      <span className='currency-courses valute-key' title={props.fromName}>{props.fromKey}</span>
      <span dangerouslySetInnerHTML={createMarkup(props.fromSymbol)} />
      <img className='currency-courses__arrow' src={arrow} alt='Поменять местами' onClick={props.swap} />
      <span>{Number(props.forAll).toFixed(2)}</span>
      <span className='currency-courses valute-key' title={props.toName}>{props.toKey}</span>
      <span dangerouslySetInnerHTML={createMarkup(props.toSymbol)} />
      <img className='currency-courses__close' src={close} alt='Удалить курс' onClick={props.delete} />
    </div>
    );
}

export default course;
