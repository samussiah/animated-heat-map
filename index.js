(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.animatedHeatMap = factory());
}(this, (function () { 'use strict';

    function settings() {
      return {
        variables: {
          id: 'USUBJID',
          arm: 'ARM',
          visit: 'VISIT',
          visit_order: 'VISITNUM',
          measure: 'LBTEST',
          result: 'LBSTRESN'
        },
        subset: null,
        // array of objects
        width: null,
        // integer (pixels) - defined in ./layout
        height: null // integer (pixels) - defined in ./layout

      };
    }

    function data() {
      var _this = this;

      this.data.filtered = this.data; // Apply user-specified subset(s).

      if (Array.isArray(this.settings.subset) && this.settings.subset.length > 0) this.settings.subset.forEach(function (subset) {
        var value = Array.isArray(subset.value) ? subset.value : [subset.value];
        _this.data.filtered = _this.data.filtered.filter(function (d) {
          return value.includes(d[subset.key]);
        });
      }); // Keep and rename required variables.

      this.data.clean = this.data.filtered.map(function (d) {
        var datum = {};

        for (var variable in _this.settings.variables) {
          datum[variable] = d[_this.settings.variables[variable]];
        }

        return datum;
      }).filter(function (d) {
        return [NaN, null, undefined, false].includes(d.result) === false;
      }); // Nest data by ID.

      this.data.nest = d3.nest().key(function (d) {
        return d.id;
      }).rollup(function (d) {
        return d[0].result;
      }).entries(this.data.clean); // Calculate domain.

      this.domain = d3.extent(this.data.clean, function (d) {
        return d.result;
      });
    }

    function arcGenerator() {
      var arcGenerator = d3.arc().innerRadius(this.settings.minDimension / 8).outerRadius(this.settings.minDimension / 2 - 1);
      return arcGenerator;
    }

    function resize() {
      this.settings.width = this.elements.parent.node().clientWidth;
      this.settings.height = this.settings.width / 16 * 9;
      this.settings.minDimension = Math.min(this.settings.width, this.settings.height);
      this.elements.svg.attr('width', this.settings.width).attr('height', this.settings.height);
      this.elements.g.attr('transform', 'translate(' + this.settings.width / 2 + ',' + this.settings.height / 2 + ')');
      this.arcGenerator = arcGenerator.call(this);
      this.arcs.attr('d', this.arcGenerator);
    }

    function layout() {
      // Set dimensions.
      this.settings.width = this.elements.parent.node().clientWidth;
      this.settings.height = this.settings.width / 16 * 9;
      this.settings.minDimension = Math.min(this.settings.width, this.settings.height); // container

      this.elements.main = this.elements.parent.append('div').classed('animated-heat-map', true); // svg

      this.elements.svg = this.elements.main.append('svg').classed('ahm-svg', true).attr('width', this.settings.width).attr('height', this.settings.height); // g

      this.elements.g = this.elements.svg.append('g').attr('transform', 'translate(' + this.settings.width / 2 + ',' + this.settings.height / 2 + ')'); // translate to center of SVG
      // arc

      this.arcGenerator = arcGenerator.call(this);
      window.addEventListener('resize', resize.bind(this));
    }

    function draw() {
      var _this = this;

      this.colorScale = d3.scaleLinear().domain(this.domain).range(['#f7fbff', '#08306b']); // One arc per ID; constant arc length

      var arcAngles = d3.pie().sort(null).value(function (d, i) {
        return 1;
      })(this.data.nest); // calculates angles

      this.arcs = this.elements.g.selectAll('path').data(arcAngles) // pass arc
      .join('path').attr('fill', function (d) {
        return _this.colorScale(d.data.value);
      }) // color arcs by result
      .attr('d', this.arcGenerator) // call arc generator
      .attr('stroke', 'white').style('stroke-width', '2px').style('opacity', 0.7);
    }

    // TODO: animate by visit or timepoint

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
      layout.call(ahm);
      data.call(ahm);
      draw.call(ahm);
      return ahm;
    }

    return animatedHeatMap;

})));
