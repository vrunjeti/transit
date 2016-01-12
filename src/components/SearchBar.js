import React from 'react'
import { render } from 'react-dom'
import { Typeahead } from 'react-typeahead'

export default class SearchBar extends React.Component {
  constructor(props) {
   super(props)

   this.handleChange = this.handleChange.bind(this)
   this.onOptionSelected = this.onOptionSelected.bind(this)
   this.loadBusData = this.loadBusData.bind(this)
  }

  handleChange(event) {
    this.setState({inputStopName: event.target.value})
  }

  onOptionSelected(option) {
    this.setState({inputStopName: option})
  }

  loadBusData() {
    this.props.loadBusData(this.state.inputStopName)
  }

  render() {
    const { allStops } = this.props

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
            />
          </div>
          <div className="col m3 s12">
            <button className="btn" onClick={this.loadBusData}>Load</button>
          </div>
        </div>
      </div>
    )
  }
}
