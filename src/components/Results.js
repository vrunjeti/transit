import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { approximateColor, getColorFamily } from 'materialcolorize'

export default class Results extends Component {
  constructor(props) {
    super(props)
    this.isFavoriteStop = this.isFavoriteStop.bind(this)
    this.toggleIsFavoriteStop = this.toggleIsFavoriteStop.bind(this)
  }

  // returns true if the stop is favorited
  isFavoriteStop(stopName) {
    let favorites = localStorage['favorites']
    if (!favorites) return false
    favorites = JSON.parse(favorites)

    // TODO: change to Array.prototype.includes
    return !!~favorites.map(stop => stop.stopName).indexOf(stopName)
  }

  toggleIsFavoriteStop() {
    const { inputStopName, stopId, forceLoadFavorites } = this.props
    let favorites = localStorage['favorites']
    favorites = (!favorites) ? [] : JSON.parse(favorites)

    if (this.isFavoriteStop(inputStopName)) {
      const newFavorites = favorites.filter(stop => stop.stopId !== stopId)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    } else {
      favorites.push({ stopId: stopId, stopName: inputStopName })
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }

    // this.forceUpdate()
    forceLoadFavorites()
  }

  render() {
    const { departures, inputStopName, accessedTime, userDidLoad, stopId } = this.props
    const starClass = (this.isFavoriteStop(inputStopName)) ? 'starred' : 'not-starred'

    if (userDidLoad) {
      if (departures.length) {
        return (
          <div className="results">
            <h4>
              Showing Buses For: {inputStopName}
              <i className={starClass + ' fa fa-star star'} onClick={this.toggleIsFavoriteStop}></i>
            </h4>
            <p>Accessed Time: <span className="timestamp">{accessedTime}</span></p>
            <ResultsTable departures={departures} />
          </div>
        )
      } else {
        return <h5 className="results">
          No buses from {inputStopName} anytime soon =(
        </h5>
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
          <th>Color</th>
          <th>Bus</th>
          <th>Minutes</th>
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
  accessedTime: PropTypes.string,
  userDidLoad: PropTypes.bool
}
