import React from 'react'
import { render } from 'react-dom'
import Timings from './components/Timings'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <body>
          <nav className="cyan lighten-1">
            <div className="nav-wrapper container valign-wrapper">
              <img src="logo-trans.png" className="logo valign"/>
              <div className="brand-logo valign">Transit</div>
            </div>
          </nav>
          <div className="container">
            <Timings />
          </div>
        </body>
      </div>
    )
  }
}
