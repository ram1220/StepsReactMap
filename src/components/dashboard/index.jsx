import React, { Component } from 'react'
import RunWalk from '../runwalk';
export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "today"
        }
        this.change = this.change.bind(this);
    }

    componentDidMount() {

    }
    change(event){
        this.setState({value: event.target.value});
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-3">
                        <div className="form-group">
                            <label htmlFor="sel1">Select Chart Range...:</label>
                            <select onChange={this.change} value={this.state.value} className="form-control" id="sel1">
                                <option value="today">Today</option>
                                <option value="weekly">Weekly</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <RunWalk chartType={this.state.value}/>
                    </div>
                </div>
            </div>
        );
    }
}
