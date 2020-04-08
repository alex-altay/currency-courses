import React from 'react';
import './Header.css';

const header = props => {
  return (
    <header className='header'>
      <h1 className='header__title'>Курсы валют ЦБ РФ</h1>
      <h2 className='header__subtitle'>на {props.date}</h2>
    </header>
  );
}

export default header;
