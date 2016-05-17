import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { Typeahead } from 'react-typeahead'

export default class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = { invalidInput: false, hideDropdown: false }
    this.handleChange = this.handleChange.bind(this)
    this.onOptionSelected = this.onOptionSelected.bind(this)
    this.loadBusData = this.loadBusData.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.closeDropdown = this.closeDropdown.bind(this)
    this.showDropdown = this.showDropdown.bind(this)
    this.loadFavorite = this.loadFavorite.bind(this)
  }

  handleChange(event) {
    if (this.state.invalidInput) {
      this.setState({invalidInput: false})
    }
    this.setState({inputStopName: event.target.value})
  }

  onKeyDown(event) {
    if (event.key === 'Enter') {
      this.loadBusData()
    }
  }

  onKeyUp(event) {
    if (event.key === 'Enter') {
      event.target.blur()
    }
  }

  closeDropdown() {
    if (!this.state.hideDropdown) {
      this.setState({ hideDropdown: true })
    }
  }

  showDropdown() {
    if (this.state.hideDropdown) {
      this.setState({ hideDropdown: false })
    }
  }

  onOptionSelected(option) {
    console.log('option', option)
    this.setState({ inputStopName: option }, this.loadBusData)
  }

  loadFavorite(option) {
    this.refs._typeahead.setEntryText(option)
    // this.onOptionSelected(option)

    this.setState({
      inputStopName: option,
      invalidInput: false
    }, this.loadBusData)
    // this.setState({ hideDropdown: true })


    // this.refs._typeahead.setState({ entryValue: option })
    // this.setState({ invalidInput: false })
    // this.refs._typeahead.setState({ visible: [] })

    // this.closeDropdown()
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
      this.setState({invalidInput: true })
      clearResults()
    } else {
      // make request
      this.props.loadBusData(inputStopName, stopId)
    }

    // this.setState({ hideDropdown: false })
  }

  render() {
    const { allStops } = this.props
    const { invalidInput, hideDropdown, inputStopName } = this.state
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
              ref="_typeahead"
              options={hideDropdown ? [] : Object.keys(allStops)}
              maxVisible={5}
              placeholder="Enter Stop Here"
              onChange={this.handleChange}
              onKeyDown={this.onKeyDown}
              onKeyUp={this.onKeyUp}
              onBlur={this.closeDropdown}
              onFocus={this.showDropdown}
              onOptionSelected={this.onOptionSelected}
              customClasses={typeaheadClasses}
            />
          </div>
          <div className="col m3 s12">
            <button className="btn cyan lighten-1" onClick={this.loadBusData}>Load</button>
          </div>
        </div>
        { invalidInput && <p className="error">Not a valid stop</p> }
        <Favorites onOptionSelected={this.onOptionSelected} loadFavorite={this.loadFavorite} />
      </div>
    )
  }
}

SearchBar.propTypes = {
  allStops: PropTypes.object.isRequired,
  loadBusData: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired
}

const Favorites = ({ onOptionSelected, loadFavorite }) => {
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
            loadFavorite={loadFavorite}
            key={stop.stopId + i}
          />)
        }
      </span>
    </div>
  )
}

const FavoriteChip = ({ stop, onOptionSelected, loadFavorite }) => {
  const { stopId, stopName } = stop
  const margin = { margin: '5px' }
  return <span
    className="chip"
    style={margin}
    onClick={loadFavorite.bind(this, stopName)}>
    {stop.stopName}
  </span>
}
