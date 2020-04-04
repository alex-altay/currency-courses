import React from 'react';

import Course from './Course/Course';
import './Courses.css';

const courses = props => {
  const coursesTags = props.coursesList.map((c, ind) => 
    <Course 
      key={ind}
      ind = {ind} 
      fromKey={c.fromKey} 
      fromName={c.fromName} 
      toKey={c.toKey}
      toName={c.toName}
      forOne={c.forOne}
      quantity={c.quantity}
      forAll={c.forAll} 
      delete={() => props.delete(ind)} 
      swap={() => props.swap(ind)}
      calculate={props.calculate} />
  );
  return <div>{coursesTags}</div>;
}

export default courses;
