import React from 'react'
import { render } from 'react-dom'
import { cumtdUrl, apiKey } from './../config'
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
    this.clearResults = this.clearResults.bind(this)
  }

  componentDidMount() {
    if (localStorage['allStops']) {
      this.setState({
        allStops: JSON.parse(localStorage['allStops'])
      })
    } else {
      // loads all bus stops and creates a dictionary that maps stop names to their ids
      request
        .get(cumtdUrl + 'GetStops')
        .query({key: apiKey})
        .then(res => {
          const allStops = res.body.stops.reduce((obj, stop) => {
            obj[stop.stop_name] = stop.stop_id
            return obj
          }, {})
          this.setState({allStops: allStops})
          localStorage.setItem('allStops', JSON.stringify(allStops))
        })
    }
  }

  loadBusData(inputStopName, stopId) {
    request
      .get(cumtdUrl + 'GetDeparturesByStop')
      .query({
        key: apiKey,
        stop_id: stopId
      })
      .then(res => {
        this.setState({
          accessedTime: moment(res.body.time).format("MMMM Do YYYY, h:mm:ss a"),
          inputStopName: inputStopName,
          stopId: stopId,
          departures: res.body.departures,
          userDidLoad: true
        })
      })
  }

  clearResults() {
    this.setState({
      departures: undefined,
      userDidLoad: false
    })
  }

  render() {
    const { allStops, inputStopName, stopId, departures, accessedTime, userDidLoad } = this.state
    return (
      <div>
        <SearchBar allStops={allStops} loadBusData={this.loadBusData} clearResults={this.clearResults} />
        <Results userDidLoad={userDidLoad} departures={departures} inputStopName={inputStopName} accessedTime={accessedTime} stopId={stopId}/>
      </div>
    )
  }

}
