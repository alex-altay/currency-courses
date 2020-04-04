import React, { Component, Fragment } from 'react';
import './Layout.css';

import Header from '../Header/Header';
import Courses from '../Courses/Courses';
import AddNewCurrency from '../AddNewCurrency/AddNewCurrency';


const url = 'https://www.cbr-xml-daily.ru/daily_json.js';
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


class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      dateString: null,
      allCurrencies: {},
      defaultCurrenciesKeys: [{ fromKey: 'USD', toKey: 'RUB' }, { fromKey: 'EUR', toKey: 'RUB'}, { fromKey: 'GBP', toKey: 'EUR'}],
      coursesList: [],
    }
  };

  updateLocalStorage = (courses) => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(courses));
  }

  // Если в localStorage браузера нет записей о курсах, устанавливаем курсы по умолчанию
  setDefaultCourses = allCurrencies => {
    const coursesList = [];
    for (const c of this.state.defaultCurrenciesKeys) {
      const fromKey = c.fromKey;
      const fromName = allCurrencies[fromKey].Name;
      const toKey = c.toKey;
      const toName = allCurrencies[toKey].Name;
      const forOne = this.getForOne(fromKey, toKey, allCurrencies);
      const quantity = 1;
      const forAll = forOne * quantity;
      coursesList.push({ fromKey: fromKey, fromName: fromName, toKey: toKey, toName: toName, forOne: forOne, quantity: quantity, forAll: forAll });
    }
    return coursesList;
  }

  addCourse = (event) => {
    event.preventDefault();
    const fromKey = event.target.elements.fromKey.value;
    const toKey = event.target.elements.toKey.value;
    const courses = this.state.coursesList.slice();
    let course = {};
    course.fromKey = fromKey;
    course.fromName = this.state.allCurrencies[fromKey].Name;
    course.toKey  = toKey;
    course.toName = this.state.allCurrencies[toKey].Name;
    course.forOne = this.getForOne(fromKey, toKey, this.state.allCurrencies);
    course.quantity = 1;
    course.forAll = course.quantity * course.forOne;
    courses.push(course);
    this.setState({coursesList: courses});
    this.updateLocalStorage(courses);
    event.target.reset();
  }


  getForOne(fromKey, toKey, allCurrencies) {
    let forOne;
    if (toKey === 'RUB') {
      forOne = Number(allCurrencies[fromKey].Value);
    } else if (fromKey === 'RUB') {
      forOne = 1 / Number(allCurrencies[toKey].Value);
    } else {
      forOne = Number(allCurrencies[fromKey].Value) / Number(allCurrencies[toKey].Value);
    }
    return forOne;
  }

  deleteCourse = index => {
    const courses = this.state.coursesList.slice();
    courses.splice(index, 1);
    this.setState({coursesList: courses});
    this.updateLocalStorage(courses);
  }

  swapCourse = index => {
    const courses = this.state.coursesList.slice();
    let course = courses[index];
    const newToKey = course.fromKey;
    const newFromKey = course.toKey;
    const newForOne = Number(1 / course.forOne);
    const newQantity = course.quantity;
    const newForAll = newForOne * newQantity;
    course = { fromKey: newFromKey, toKey: newToKey, forOne: newForOne, quantity: newQantity, forAll: newForAll };
    courses[index] = course;
    this.setState({coursesList: courses});
  }

  calculate = (event, index) => {
    const courses = this.state.coursesList.slice();
    let course = courses[index];
    course.quantity = event.target.value;
    course.forAll = event.target.value * course.forOne;
    courses[index] = course;
    this.setState({ coursesList: courses });
  }

  componentDidMount() {
    fetch(url)
      .then(res => res.json())
      .then((result) => { 
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
          dateString: result['Date'],
          allCurrencies: allCurrencies,
          coursesList: coursesList, 
        });
      },
        (error) => this.setState({ isLoaded: true, error: error })
      )
  }
  
  render() {
    const date = new Date(this.state.dateString).toLocaleDateString();

    return (
    <Fragment>
      <Header date={date} />
      <Courses coursesList={this.state.coursesList} delete={this.deleteCourse} swap={this.swapCourse} calculate={this.calculate} />
      <AddNewCurrency currencies={this.state.allCurrencies} addCourse={this.addCourse} />
    </Fragment>
    );
  }

}

export default Layout;
