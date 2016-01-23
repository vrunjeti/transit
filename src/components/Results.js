import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { approximateColor, getColorFamily } from 'materialcolorize'

export default class Results extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { departures, inputStopName, accessedTime } = this.props
    const userDidLoad = (departures !== undefined)

    if (userDidLoad) {
      if (departures.length) {
        return (
          <div>
            <div className="row">
              <h4>Showing Buses For: {inputStopName}</h4>
              <p>Accessed Time: <span className="timestamp">{accessedTime}</span></p>
            </div>
            <ResultsTable departures={departures} />
          </div>
        )
      } else {
        return <h5>Sorry, there aren't any buses coming to {inputStopName} anytime soon =(</h5>
      }
    } else {
      return false
    }
  }
}

const ResultsTable = ({ departures }) => {
  return (
    <table className="table striped">
      <thead>
        <tr>
          <td>Color</td>
          <td>Bus</td>
          <td>Minutes</td>
        </tr>
      </thead>
      <tbody>
        {
          departures.map((bus, i) => {
            const style = {
              backgroundColor: '#' + bus.route.route_color
              // backgroundColor: '#' + approximateColor(bus.route.route_color)
              // backgroundColor: '#' + getColorFamily(bus.route.route_color)['500']
            }
            return (
              <tr key={bus.expected + i}>
                <td>
                  <div className="bus-color" style={style}></div>
                </td>
                <td>{bus.headsign}</td>
                <td>{bus.expected_mins}</td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}

Results.propTypes = {
  departures: PropTypes.array,
  inputStopName: PropTypes.string,
  accessedTime: PropTypes.string
}
