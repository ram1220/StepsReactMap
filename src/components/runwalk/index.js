import React, { Component, Fragment } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import './style.css';
import {
    width,
    height,
    hours,
    margin
} from '../../common';

export default class RunWalk extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.readDailyJSONData();
    }

    readDailyJSONData() {
        let ref = this;
        axios.get('data/data.json')
            .then(function (response) {
                const { data } = response.data;
                ref.renderChart(data);
            })
            .catch(function (error) {
                console.log(error)
            });
    }
    componentWillReceiveProps(newProps) {
        if (newProps.chartType === "today") {
            this.readDailyJSONData();
        }
        else if (newProps.chartType === "weekly") {

        }
    }

    runWalkArrayObject(object) {
        return [
            Object.assign({}, object, {
                type: "walk"
            }),
            Object.assign({}, object, {
                type: "run"
            })
        ]
    }

    toolTipMessage(d) {
        return (d.type === "run") ? "Run: "+ (d.run) : "Walk: "+ (d.walk)
    }

    renderChart(data) {
        const { chartType } = this.props;
        let cWIdth = width - margin.left - margin.right;
        let cHeight = height - margin.top - margin.bottom;
        let ref = this;
        // Append SVG 
        d3.select("svg").remove();
        let svg = d3.select(".runwalk").append("svg")
            .attr("width", cWIdth)
            .attr("height", cHeight)
            .append("g")
            .attr("transform", "translate(" + 0 + "," + margin.top + ")");

        let tooltip = d3.select("body").append("div").attr("class", "toolTip");

        let formatHour = d3.timeFormat("%I %p");

        let totalSteps = d3.extent(data.map((d) => d.total));
        let timeRange = d3.extent(data.map((d) => d.date));

        let walkColorScale = d3.scaleLinear()
            .domain([d3.min(totalSteps), d3.max(totalSteps)])
            .range(["#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        let runColorScale = d3.scaleLinear()
            .domain([d3.min(totalSteps), d3.max(totalSteps)])
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);

        let xscale = d3.scaleLinear()
            .domain([0, 23])
            .range([0, cWIdth - 80])


        let yscale = d3.scaleLinear()
            .domain([d3.min(totalSteps), d3.max(totalSteps)])
            .range([cHeight - 50, 0])
            .nice();

        let xBandScale0 = d3.scaleBand()
            .domain(hours)
            .rangeRound([0, cWIdth - 80])
            .paddingInner(0.05);

        let xBandScale = d3.scaleBand()
            .domain([formatHour(new Date(timeRange[0])), formatHour(new Date(timeRange[1]))])
            .rangeRound([0, xBandScale0.bandwidth()])
            .padding(0.05);

        svg.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function (d, i) { return "translate(" + (xBandScale0(formatHour(new Date(d.date))) + 60) + ",0)"; })
            .selectAll("rect")
            .data(function (d) { return ref.runWalkArrayObject(d) })
            .enter()
            .append("rect")
            .attr("x", function (d, i) { return (xBandScale0.bandwidth() / 2) * i })
            .attr("y", function (d, i) {
                let heightVal = 0;
                if (i == 0) {
                    heightVal = d.walk;
                }
                else {
                    heightVal = d.run;
                }
                return yscale(heightVal) + 10;
            })
            .attr("height", function (d, i) {
                let heightVal = 0;
                if (i == 0) {
                    heightVal = d.walk;
                }
                else {
                    heightVal = d.run;
                }
                return (((cHeight) - yscale(heightVal) - 50))
            })
            .attr("width", xBandScale.bandwidth())
            .style("fill", function (d, i) {
                if (i == 0) {
                    return walkColorScale(d.walk)
                }
                else {
                    return runColorScale(d.run)

                }
            })
            .on("mousemove", function (d) {
                tooltip
                    .style("position", "absolute")
                    .style("background-color", "#fff")
                    .style("border", "1px solid #6F257F")
                    .style("padding", "10px")
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html("<strong> "+
                            ref.toolTipMessage(d)
                        + "</strong>"
                    );
            })
            .on("mouseout", function (d) { tooltip.style("display", "none"); });;

        let xAxisTranslate = cHeight - 40;
        let y_axis = d3.axisLeft()
            .scale(yscale);

        svg.append("g")
            .attr("transform", "translate(50, 10)")
            .call(y_axis);

        let xAxis = d3.axisBottom()
            .scale(xBandScale0)
            .tickValues(xBandScale0.domain().filter(function (d, i) { return !(i % 2) }));

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(60, " + xAxisTranslate + ")")
            .call(xAxis);

    }
    render() {
        return (
            <Fragment>
                <div className="runwalk">
                </div>
            </Fragment>
        );
    }
}
