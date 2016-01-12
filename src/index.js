import React from 'react'
import {render} from 'react-dom'
import App from './App'
import './styles/styles.scss' //Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.

render(
  <App />,
  document.getElementById('app')
)
