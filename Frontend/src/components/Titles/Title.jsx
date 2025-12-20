import React from 'react'
import './Title.css'
const Title = ({SubTitle , title}) => {
  return (
    <div className="title">
        <h2>{title}</h2>
        <p>{SubTitle}</p>
    </div>
  )
}

export default Title