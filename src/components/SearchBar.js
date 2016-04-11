import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { Typeahead } from 'react-typeahead'

export default class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = { invalidInput: false }
    this.handleChange = this.handleChange.bind(this)
    this.onOptionSelected = this.onOptionSelected.bind(this)
    this.loadBusData = this.loadBusData.bind(this)
  }

  handleChange(event) {
    if (this.state.invalidInput) {
      this.setState({invalidInput: false})
    }
    this.setState({inputStopName: event.target.value})
  }

  onOptionSelected(option) {
    this.setState({inputStopName: option}, this.loadBusData)
  }

  loadBusData() {
    let { inputStopName } = this.state
    const { allStops, clearResults } = this.props
    let stopId = allStops[inputStopName]

    // autofills suggestion
    if (stopId === undefined) {
      for (let key in allStops) {
        if (key.toLowerCase() === inputStopName.trim().toLowerCase()) {
          stopId = allStops[key]
          inputStopName = key
          break
        }
      }
    }

    // no matching stops found
    if (stopId === undefined) {
      this.setState({invalidInput: true})
      clearResults()
    } else {
      // make request
      this.props.loadBusData(inputStopName, stopId)
    }
  }

  render() {
    const { allStops } = this.props
    const { invalidInput } = this.state
    const formValidity = invalidInput ? 'invalid' : ''
    const typeaheadClasses = {
      input: formValidity,
      results: 'typeahead-dropdown',
      listItem: 'typeahead-list-item',
      hover: 'typeahead-selected'
    }

    return (
      <div>
        <h3> Search Bus Stops </h3>
        <div className="row">
          <div className="col m9 s12">
            <Typeahead
              options={Object.keys(allStops)}
              maxVisible={5}
              placeholder="Enter Stop Here"
              onChange={this.handleChange}
              onOptionSelected={this.onOptionSelected}
              customClasses={typeaheadClasses}
            />
          </div>
          <div className="col m3 s12">
            <button className="btn cyan lighten-1" onClick={this.loadBusData}>Load</button>
          </div>
        </div>
        { invalidInput && <p className="error">Not a valid stop</p> }
        <Favorites onOptionSelected={this.onOptionSelected} />
      </div>
    )
  }
}

SearchBar.propTypes = {
  allStops: PropTypes.object.isRequired,
  loadBusData: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired
}

const Favorites = ({ onOptionSelected }) => {
  let favorites = localStorage['favorites']
  favorites = (!favorites) ? [] : JSON.parse(favorites)

  if (!favorites.length) {
    return <p>No favorites set yet. Click the star in the results to set as a favorite</p>
  }

  return (
    <div className="valign-wrapper">
      <span className="valign">Favorites:</span>
      <span className="valign">
        {
          favorites.sort((a, b) => {
            if (a.stopName < b.stopName) return -1
            if (a.stopName > b.stopName) return 1
            return 0
          }).map((stop, i) => <FavoriteChip
            stop={stop}
            onOptionSelected={onOptionSelected}
            key={stop.stopId + i}
          />)
        }
      </span>
    </div>
  )
}

const FavoriteChip = ({ stop, onOptionSelected }) => {
  const { stopId, stopName } = stop
  const margin = { margin: '5px' }
  return <span
    className="chip"
    style={margin}
    onClick={onOptionSelected.bind(this, stopName)}>
    {stop.stopName}
  </span>
}
