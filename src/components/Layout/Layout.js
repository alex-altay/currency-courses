import React, { Component, Fragment } from 'react';
import './Layout.css';

import Header from '../Header/Header';
import Courses from '../Courses/Courses';
import AddNewCurrency from '../AddNewCurrency/AddNewCurrency';


const URL = 'https://www.cbr-xml-daily.ru/daily_json.js';

// Создаем рубль, потому что он отсутствует среди валют в API
const RUB = {
  "ID": "R66666",
  "NumCode": "643",
  "CharCode": "RUB",
  "Nominal": 1,
  "Name": "Российский рубль",
  "Value": 1,
  "Previous": 1
};

// Ключ, по которому храним данные о сохраненных валютах в localStorage браузера пользователя
const LOCAL_STORAGE_KEY = 'defaultCurrenciesKeys';

const SYMBOLS = {
  AMD: '&#1423;',
  AUD: '&#36;',
  AZN: '&#8380;',
  BGN: '',
  BRL: '&#36;',
  BYN: 'Br',
  CAD: '&#36;',
  CHF: '&#8355;',
  CNY: '&#165;',
  CZK: 'Kč',
  DKK: 'kr',
  EUR: '&#8364;',
  GBP: '&#163;',
  HKD: '&#36;',
  HUF: 'Ft',
  INR: '&#8377;',
  JPY: '&#165;',
  KGS: 'с',
  KRW: '&#8361;',
  KZT: '&#8376;',
  MDL: 'L',
  NOK: 'kr',
  PLN: 'zł',
  RON: 'L',
  RUB: '&#8381;',
  SEK: 'kr',
  SGD: '&#36;',
  TJS: 'с',
  TMT: 'm',
  TRY: '&#8378;',
  UAH: '&#8372;',
  USD: '&#36;',
  UZS: 'so’m',
  XDR: 'SDR',
  ZAR: 'R'
}

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      dateFull: null,
      dateShort: null,
      allCurrencies: {},
      defaultCurrenciesKeys: [
        { fromKey: 'USD', toKey: 'RUB' }, 
        { fromKey: 'EUR', toKey: 'RUB'}, 
        { fromKey: 'GBP', toKey: 'EUR'}],
      coursesList: [],
    }
  };

  updateLocalStorage = (courses) => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(courses));
  }

  // Если в localStorage браузера нет записей о курсах, устанавливаем курсы по умолчанию
  setDefaultCourses = allCurrencies => {
    let coursesList = [];
    for (const c of this.state.defaultCurrenciesKeys) {
      const course = this.assembleCourse(c.fromKey, c.toKey, allCurrencies);
      coursesList.push(course);
    }
    return coursesList;
  }

  // Создает и возвращает объект курса в одном месте, чтобы не дублировать код
  assembleCourse = (fromKey, toKey, allCurrencies, quantity=1) => {    
    const forOne = this.calcCourseForOneCoin(fromKey, toKey, allCurrencies);    
    const course = {
      fromKey: fromKey,
      fromName: allCurrencies[fromKey].Name,
      fromSymbol: SYMBOLS[fromKey],
      toKey: toKey,
      toName: allCurrencies[toKey].Name,
      toSymbol: SYMBOLS[toKey],
      forOne: forOne,
      quantity: 1,
      forAll: quantity * forOne}
    return course;
  }

  addCourseButtonHandler = (event) => {
    event.preventDefault();
    const fromKey = event.target.elements.fromKey.value;
    const toKey = event.target.elements.toKey.value;
    const coursesList = this.state.coursesList.slice();
    const course = this.assembleCourse(fromKey, toKey, this.state.allCurrencies);  
    coursesList.push(course);
    this.setState({ coursesList: coursesList });
    this.updateLocalStorage(coursesList);
    event.target.reset();
  }

  calcCourseForOneCoin(fromKey, toKey, allCurrencies) {
    let courseForOneCoin;
    const toValue = Number(allCurrencies[toKey].Value);
    const toNominal = Number(allCurrencies[toKey].Nominal);
    const fromValue = Number(allCurrencies[fromKey].Value);
    const fromNominal = Number(allCurrencies[fromKey].Nominal);
    if (toKey === 'RUB') {
      courseForOneCoin = fromValue/fromNominal;
    } else if (fromKey === 'RUB') {
      courseForOneCoin = 1 / (toValue/toNominal);
    } else {
      courseForOneCoin = (fromValue / fromNominal) / (toValue / toNominal);
    }
    return courseForOneCoin;
  }

  deleteCourseButtonHandler = index => {
    const coursesList = this.state.coursesList.slice();
    coursesList.splice(index, 1);
    this.setState({coursesList: coursesList});
    this.updateLocalStorage(coursesList);
  }

  swapCourseButtonHandler = index => {
    const coursesList = this.state.coursesList.slice();
    let oldCourse = coursesList[index];
    const newCourse = this.assembleCourse(oldCourse.toKey, 
      oldCourse.fromKey, this.state.allCurrencies, oldCourse.quantity);
    coursesList[index] = newCourse;
    this.setState({coursesList: coursesList});
  }

  calculate = (event, index) => {
    const coursesList = this.state.coursesList.slice();
    let course = coursesList[index];
    course.quantity = event.target.value;
    course.forAll = event.target.value * course.forOne;
    coursesList[index] = course;
    this.setState({ coursesList: coursesList });
  }

  componentDidMount() {
    fetch(URL)
      .then(res => res.json())
      .then((result) => { 
        const dateFull = result['Date'];
        const dateShort = new Date(dateFull).toLocaleDateString();

        const allCurrencies = result['Valute'];
        allCurrencies.RUB = RUB; // Добавляем рубль, которого нет в исходном списке
        
        // Подгружаем сохраненные или используем дефолтные курсы
        let coursesList = [];        
        // Если пользователь уже заходил и в localStorage сохранены его курсы
        let storage = window.localStorage.getItem(LOCAL_STORAGE_KEY); 
        if (storage) {          
          coursesList = JSON.parse(storage);
        } else {
          coursesList = this.setDefaultCourses(allCurrencies);
        }

        this.setState({ 
          isLoaded: true, 
          dateString: dateFull,
          dateShort: dateShort,
          allCurrencies: allCurrencies,
          coursesList: coursesList, 
        });
      },
        (error) => this.setState({ isLoaded: true, error: error })
      )
  }
  
  render() {
    return (
    <Fragment>
      <Header date={this.state.dateShort} />
      <Courses 
        coursesList={this.state.coursesList} 
        delete={this.deleteCourseButtonHandler} 
        swap={this.swapCourseButtonHandler} 
        calculate={this.calculate} />
      <AddNewCurrency 
        currencies={this.state.allCurrencies} 
        addCourse={this.addCourseButtonHandler} />
    </Fragment>
    );
  }

}

export default Layout;
