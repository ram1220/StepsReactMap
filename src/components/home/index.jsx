import React, { Component } from 'react'
import { readJSONData } from '../../data/dataGenerator';
import Chart from '../chart'
export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: []
        }
    }

    componentDidMount() {
        let ref = this;
        readJSONData()
        .then((data) => {
            ref.setState({
                data: data
            })
        })
        .catch((error) => {
            console.log("Error loading Data ", error);
        })
    }
    
    render() {
        const { data } = this.state;
        return (
            <div className="container">
                {data.length > 0 ? (
                    <Chart title="Sleeping Tracker" chartData={data} />
                ) : null
            }
            </div>
        );
    }
}
