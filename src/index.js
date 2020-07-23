import defaultSettings from './settings';
import dataManipulation from './data';
import layout from './layout';

export default function animatedHeatMap(data, element = 'body', settings = {}) {
    const ahm = {
        data,
        elements: {
            parent: d3.select(element),
        },
        settings: Object.assign(defaultSettings(), settings),
    };

    dataManipulation.call(ahm);
    layout.call(ahm);

    const radius = Math.min(ahm.settings.width, ahm.settings.height) / 2 - 1;
    const domain = d3.extent(data, d => +d.LBSTRESN);
    const color = d3.scaleLinear()
        .domain(domain)
        .range([
            '#f7fbff',
            //'#deebf7',
            //'#c6dbef',
            //'#9ecae1',
            //'#6baed6',
            //'#4292c6',
            //'#2171b5',
            //'#08519c',
            '#08306b',
        ]);
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(ahm.settings.width, ahm.settings.height) / 2 - 1);
    //const pie = d3.pie().sort(null).value(d => d.value);
    //const nest = d3.nest().key(d => d.USUBJID).rollup(d => +d[0].LBSTRESN).entries(data);
    //const arcs = pie(nest);
    //console.table(arcs);
    //const paths = ahm.elements.svg
    //    .selectAll('path')
    //    .data(arcs)
    //    .join('path')
    //    .attr('fill', d => color(d.value))
    //    .attr('d', arc)
    //    .attr("stroke", "white")
    //    .style("stroke-width", "2px")
    //    .style("opacity", 0.7)

    return ahm;
}
