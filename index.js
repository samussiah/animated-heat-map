(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.animatedHeatMap = factory());
}(this, (function () { 'use strict';

    function settings() {
      return {
        variables: {
          participant: 'USUBJID',
          arm: 'ARM',
          visit: 'VISIT',
          visit_numeric: 'VISITNUM',
          result: 'LBSTRESN'
        },
        width: null,
        // defined in ./layout
        height: null // define in ./layout

      };
    }

    function data() {
      this.data.clean = this.data.map(function (d) {});
    }

    function layout() {
      // Set dimensions.
      this.settings.width = this.elements.parent.node().clientWidth;
      this.settings.height = this.settings.width / 16 * 9; // Add elements to DOM.

      this.elements.main = this.elements.parent.append('div').classed('animated-heat-map', true);
      this.elements.svg = this.elements.main.append('svg').classed('ahm-svg', true).attr('width', this.settings.width).attr('height', this.settings.height).append('g').attr('transform', 'translate(' + this.settings.width / 2 + ',' + this.settings.height / 2 + ')');
    }

    function animatedHeatMap(data$1) {
      var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
      var settings$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var ahm = {
        data: data$1,
        elements: {
          parent: d3.select(element)
        },
        settings: Object.assign(settings(), settings$1)
      };
      data.call(ahm);
      layout.call(ahm);
      var radius = Math.min(ahm.settings.width, ahm.settings.height) / 2 - 1;
      var domain = d3.extent(data$1, function (d) {
        return +d.LBSTRESN;
      });
      var color = d3.scaleLinear().domain(domain).range(['#f7fbff', //'#deebf7',
      //'#c6dbef',
      //'#9ecae1',
      //'#6baed6',
      //'#4292c6',
      //'#2171b5',
      //'#08519c',
      '#08306b']);
      var arc = d3.arc().innerRadius(0).outerRadius(Math.min(ahm.settings.width, ahm.settings.height) / 2 - 1); //const pie = d3.pie().sort(null).value(d => d.value);
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

    return animatedHeatMap;

})));
