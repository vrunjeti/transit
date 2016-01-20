import React from 'react'
import { render } from 'react-dom'
import { apiConfig } from './../config'
import request from 'superagent'
import moment from 'moment'
import { Results, SearchBar } from './'

export default class Timings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allStops: {}
    }
    this.loadBusData = this.loadBusData.bind(this)
  }

  componentDidMount() {
    // loads all bus stops and creates a dictionary that maps stop names to their ids
    request
      .get(apiConfig.cumtdUrl + 'GetStops')
      .query({key: apiConfig.apiKey})
      .then(res => {
        const allStops = res.body.stops.reduce((obj, stop) => {
          obj[stop.stop_name] = stop.stop_id
          return obj
        }, {})
        this.setState({allStops: allStops})
      })
  }

  loadBusData(inputStopName, stopId) {
    request
      .get(apiConfig.cumtdUrl + 'GetDeparturesByStop')
      .query({
        key: apiConfig.apiKey,
        stop_id: stopId
      })
      .then(res => {
        this.setState({
          accessedTime: moment(res.body.time).format("MMMM Do YYYY, h:mm:ss a"),
          inputStopName: inputStopName,
          departures: res.body.departures
        })
      })
  }

  render() {
    const { allStops, inputStopName, departures, accessedTime } = this.state
    return (
      <div>
        <SearchBar allStops={allStops} loadBusData={this.loadBusData} />
        <Results departures={departures} inputStopName={inputStopName} accessedTime={accessedTime} />
      </div>
    )
  }

}
