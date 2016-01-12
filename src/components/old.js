import React from 'react'
import { render } from 'react-dom'
import { apiConfig, allStopsRequest, allStops } from './../config'
import request from 'superagent'
import moment from 'moment'
import { Results, SearchBar } from './'

export default class Timings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      allStops: {}
    }

    // set 'this' bindings
    this.loadBusData = this.loadBusData.bind(this)
    // this.handleChange = this.handleChange.bind(this)
    // this.onOptionSelected = this.onOptionSelected.bind(this)

    // this.state = {
    //   busData: [],
    //   inputStopName: ''
    // }

    // this.state = {
    //   busData: undefined,
    //   inputStopName: '',
    //   accessedTime: undefined
    // }
  }

  componentWillMount() {
    allStopsRequest.then(res => {
      const allStops = res.body.stops.reduce((obj, stop) => {
        obj[stop.stop_name] = stop.stop_id
        return obj
      }, {})
      this.setState({
        // Figure out if there's a way to use allStops without setting state
        // Using 'this'? Refering to constructor. But will that trigger render?
        // https://facebook.github.io/react/docs/interactivity-and-dynamic-uis.html
        // ^ A common pattern is to create several...
        allStops: allStops
      })
    })
  }

  // componentDidMount() {
  //   this.setState({
  //     allStopsRequest: allStopsRequest
  //   })
  // }

  loadBusData(inputStopName) {
    // const { allStops } = this.state
    let stopId = allStops[inputStopName]

    // autofill suggestion
    if (stopId === undefined) {
      for (let key in allStops) {
        if (key.toLowerCase() === inputStopName.trim().toLowerCase()) {
          stopId = allStops[key]
          // this.setState({inputStopName: key})
          break
        }
      }
    }

    request
      .get(apiConfig.cumtdUrl + 'GetDeparturesByStop')
      .query({
        key: apiConfig.apiKey,
        stop_id: stopId
      })
      .then(res => {
        this.setState({
          accessedTime: moment(res.body.time).format("MMMM Do YYYY, h:mm:ss a"),
          departures: res.body.departures,
          inputStopName: inputStopName
        })
      })
  }

  // handleChange(event) {
  //   this.setState({inputStopName: event.target.value})
  // }

  // onOptionSelected(option) {
  //   this.setState({inputStopName: option})
  //   // this.loadBusData()
  // }

  render() {
    const { allStops, departures, inputStopName, accessedTime } = this.state
    return (
      <div>
        <SearchBar allStops={allStops} loadBusData={this.loadBusData} />
        {/* TODO: Figure out how to send these props without setting them in this component's state */}
        <Results departures={departures} inputStopName={inputStopName} accessedTime={accessedTime} />
      </div>
    )
  }

  // render() {
  //   return (
  //     <div>
  //       <h3> Search Bus Stops </h3>
  //       <div className="row">
  //         <div className="col m9 s12">
  //           <Typeahead
  //             options={Object.keys(allStops)}
  //             maxVisible={5}
  //             placeholder="Enter Stop Here"
  //             onChange={this.handleChange}
  //             onOptionSelected={this.onOptionSelected}
  //           />
  //         </div>
  //         <div className="col m3 s12">
  //           <button type="submit" className="btn" onClick={this.loadBusData}>
  //             Load Stop
  //             {/* find icons */}
  //             <i className="material-icons right"></i>
  //           </button>
  //         </div>
  //       </div>
  //       { (() => {
  //         if (this.state.busData.length) {
  //           return (
  //             <div>
  //               <div className="row">
  //                 <h4>Showing Buses For: {this.state.inputStopName}</h4>
  //                 <p>Accessed Time: <span className="timestamp">{this.state.accessedTime}</span></p>
  //               </div>
  //               <table className="table striped">
  //                 <thead>
  //                   <tr>
  //                     <td>Color</td>
  //                     <td>Bus</td>
  //                     <td>Minutes</td>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {
  //                     this.state.busData.map(bus => {
  //                       const style = {
  //                         // backgroundColor: '#' + bus.route.route_color
  //                         // backgroundColor: '#' + approximateColor(bus.route.route_color)
  //                         backgroundColor: '#' + getColorFamily(bus.route.route_color)['500']
  //                       }
  //                       return (
  //                         <tr>
  //                           <td>
  //                             <div className="bus-color" style={style}></div>
  //                           </td>
  //                           <td>{bus.headsign}</td>
  //                           <td>{bus.expected_mins}</td>
  //                         </tr>
  //                       )
  //                     })
  //                   }
  //                 </tbody>
  //               </table>
  //             </div>
  //           )
  //         } else if (!this.state.inputStopName.length) {
  //           return (
  //             <div>Please enter a stop</div>
  //           )
  //         } else {
  //           return (
  //             <div>Sorry, there are no buses available</div>
  //           )
  //         }
  //       })()
  //       }
  //     </div>
  //   )
  // }

  // getSearchBar() {
  //   return (
  //     <div>
  //       <h3> Search Bus Stops </h3>
  //       <div className="row">
  //         <div className="col m9 s12">
  //           <Typeahead
  //             options={Object.keys(allStops)}
  //             maxVisible={5}
  //             placeholder="Enter Stop Here"
  //             onChange={this.handleChange}
  //             onOptionSelected={this.onOptionSelected}
  //           />
  //         </div>
  //         <div className="col m3 s12">
  //           <button type="submit" className="btn" onClick={this.loadBusData}>
  //             Load Stop
  //             {/* find icons */}
  //             <i className="material-icons right"></i>
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // getResults(busData, inputStopName, accessedTime) {
  //   const userDidLoad = (busData !== undefined)
  //   const ResultsTable = this.getResultsTable(busData)
  //   const ErrorMessage = this.getErrorMessage(busData)

  //   if (userDidLoad) {
  //     if (busData.length) {
  //       return (
  //         <div>
  //           <div className="row">
  //             <h4>Showing Buses For: { inputStopName }</h4>
  //             <p>Accessed Time: <span className="timestamp">{ accessedTime }</span></p>
  //           </div>
  //           <ResultsTable busData={busData} />
  //         </div>
  //       )
  //     } else {
  //       return <ErrorMessage busData={busData} />
  //     }
  //   }
  // }

  // getErrorMessage(busData) {
  //   if (!busData.length) {
  //     return <div className="error">Sorry, there are no buses available now</div>
  //   }
  // }

  // getResultsTable(busData) {
  //   return (
  //     <table className="table striped">
  //       <thead>
  //         <tr>
  //           <td>Color</td>
  //           <td>Bus</td>
  //           <td>Minutes</td>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {
  //           busData.map(bus => {
  //             const style = {
  //               // backgroundColor: '#' + bus.route.route_color
  //               // backgroundColor: '#' + approximateColor(bus.route.route_color)
  //               backgroundColor: '#' + getColorFamily(bus.route.route_color)['500']
  //             }
  //             return (
  //               <tr>
  //                 <td>
  //                   <div className="bus-color" style={style}></div>
  //                 </td>
  //                 <td>{bus.headsign}</td>
  //                 <td>{bus.expected_mins}</td>
  //               </tr>
  //             )
  //           })
  //         }
  //       </tbody>
  //     </table>
  //   )
  // }

  // render() {
  //   const { busData, inputStopName, accessedTime } = this.state
  //   const SearchBar = this.getSearchBar()
  //   const Results = this.getResults(busData, inputStopName, accessedTime)

  //   return (
  //     <div>
  //       <SearchBar />
  //       <Results busData={busData} inputStopName={inputStopName} accessedTime={accessedTime} />
  //     </div>
  //   )
  // }

}


