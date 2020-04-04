import React from 'react';

import './Course.css';

import arrow from '../../../assets/arrow.svg';
import close from '../../../assets/close.svg';

const course = props => {
    return (
      <div className='currency-courses'>
      <input className='currency-courses__from-quantity' type='number' defaultValue={props.quantity} min='0' onChange={(e) => props.calculate(e, props.ind)}/>
      <span className='currency-courses valute-key' title={props.fromName}>{props.fromKey}</span>
      {/* TODO Остановился здесь, разберись с отображением символов валют */}
      <span>{props.fromSymbol}</span>
      <img className='currency-courses__arrow' src={arrow} alt='Поменять местами' onClick={props.swap} />
      <span>{Number(props.forAll).toFixed(2)}</span>
      <span className='currency-courses valute-key' title={props.toName}>{props.toKey}</span>
      <img className='currency-courses__close' src={close} alt='Удалить курс' onClick={props.delete} />
    </div>
    );
}

export default course;
