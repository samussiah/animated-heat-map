(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory())
        : typeof define === 'function' && define.amd
        ? define(factory)
        : ((global = global || self), (global.animatedHeatMap = factory()));
})(this, function () {
    'use strict';

    function settings() {
        return {
            variables: {
                id: 'USUBJID',
                arm: 'ARM',
                visit: 'VISIT',
                visit_order: 'VISITNUM',
                measure: 'LBTEST',
                result: 'LBSTRESN',
            },
            subset: null,
            // array of objects
            width: null,
            // integer (pixels) - defined in ./layout
            height: null, // integer (pixels) - defined in ./layout
        };
    }

    function data() {
        var _this = this;

        this.data.filtered = this.data; // Apply user-specified subset(s).

        if (Array.isArray(this.settings.subset) && this.settings.subset.length > 0)
            this.settings.subset.forEach(function (subset) {
                var value = Array.isArray(subset.value) ? subset.value : [subset.value];
                _this.data.filtered = _this.data.filtered.filter(function (d) {
                    return value.includes(d[subset.key]);
                });
            }); // Keep and rename required variables.

        this.data.clean = this.data.filtered
            .map(function (d) {
                var datum = {};

                for (var variable in _this.settings.variables) {
                    datum[variable] = d[_this.settings.variables[variable]];
                }

                return datum;
            })
            .filter(function (d) {
                return [NaN, null, undefined, false].includes(d.result) === false;
            }); // Nest data by ID.

        this.data.nest = d3
            .nest()
            .key(function (d) {
                return d.id;
            })
            .rollup(function (group) {
                return group[0].result;
            })
            .entries(this.data.clean);
        this.data.byVisit = d3
            .nest()
            .key(function (d) {
                return d.visit_order;
            })
            .key(function (d) {
                return d.id;
            })
            .rollup(function (group) {
                return group[0].result;
            })
            .entries(this.data.clean)
            .sort(function (a, b) {
                return a.key - b.key;
            }); // Calculate domain.

        this.domain = d3.extent(this.data.clean, function (d) {
            return d.result;
        });
    }

    function arcGenerator() {
        var arcGenerator = d3
            .arc()
            .innerRadius(this.settings.minDimension / 8)
            .outerRadius(this.settings.minDimension / 2 - 1);
        return arcGenerator;
    }

    function resize() {
        var _this = this;

        this.settings.width = this.elements.parent.node().clientWidth;
        this.settings.height = (this.settings.width / 16) * 9;
        this.settings.minDimension = Math.min(this.settings.width, this.settings.height);
        this.arcGenerator = arcGenerator.call(this);
        this.heatMaps.forEach(function (heatMap) {
            heatMap.svg.attr('width', _this.settings.width).attr('height', _this.settings.height);
            heatMap.g.attr(
                'transform',
                'translate(' + _this.settings.width / 2 + ',' + _this.settings.height / 2 + ')'
            );
            heatMap.iris.attr('d', _this.arcGenerator);
            heatMap.pupil.attr('r', _this.settings.minDimension / 8);
        });
    }

    function layout() {
        // Set dimensions.
        this.settings.width = this.elements.parent.node().clientWidth;
        this.settings.height = (this.settings.width / 16) * 9;
        this.settings.minDimension = Math.min(this.settings.width, this.settings.height);
        this.settings.smallMultipleSize = this.settings.minDimension / 4; // container

        this.elements.main = this.elements.parent.append('div').classed('animated-heat-map', true); // arc generator

        this.arcGenerator = arcGenerator.call(this);
        window.addEventListener('resize', resize.bind(this));
    }

    function arcGenerator$1() {
        var arcGenerator = d3
            .arc()
            .innerRadius(this.settings.smallMultipleSize / 8)
            .outerRadius(this.settings.smallMultipleSize / 2 - 1);
        return arcGenerator;
    }

    function heatMap(data) {
        var _this = this;

        // div
        var div = this.elements.main
            .append('div')
            .classed('ahm-heat-map', true)
            .style('display', 'inline-block'); // header

        var header = div.append('h3').classed('ahm-header', true).text('Visit '.concat(data.key)); // svg

        var svg = div
            .append('svg')
            .classed('ahm-svg', true)
            .attr('width', this.settings.smallMultipleSize)
            .attr('height', this.settings.smallMultipleSize); // g

        var g = svg
            .append('g')
            .classed('ahm-g', true)
            .attr(
                'transform',
                'translate(' +
                    this.settings.smallMultipleSize / 2 +
                    ',' +
                    this.settings.smallMultipleSize / 2 +
                    ')'
            ); // translate to center of SVG
        // One arc per ID; constant arc length

        var shell = this.data.nest.map(function (d) {
            var datum = data.values.find(function (di) {
                return di.key === d.key;
            });
            return datum
                ? datum
                : {
                      key: d.key,
                      value: null,
                  };
        });
        var arcAngles = d3
            .pie()
            .sort(null)
            .value(function (d, i) {
                return 1;
            })(shell); // draw arcs

        var iris = g
            .selectAll('path')
            .data(arcAngles) // pass arc
            .join('path')
            .classed('ahm-iris', true)
            .attr('d', arcGenerator$1.call(this)) // call arc generator
            .attr('fill', function (d) {
                return _this.colorScale(d.data.value);
            }); // color arcs by result
        //.attr('stroke', 'white')
        //.attr('stroke-width', '.5px');
        // draw pupil

        var pupil = g
            .append('circle')
            .classed('ahm-pupil', true)
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', this.settings.smallMultipleSize / 8)
            .attr('fill', 'black')
            .attr('stroke', 'black')
            .attr('stroke-width', '5px')
            .attr('stroke-opacity', 0.25);
        return {
            data: data,
            svg: svg,
            g: g,
            arcAngles: arcAngles,
            iris: iris,
            pupil: pupil,
        };
    }

    function draw() {
        var _this = this;

        this.colorScale = d3.scaleLinear().domain(this.domain).range(['#f7fbff', '#08306b']);
        this.heatMaps = this.data.byVisit.map(function (visit) {
            return heatMap.call(_this, visit);
        });
    }

    // TODO: animate by visit or timepoint

    function animatedHeatMap(data$1) {
        var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
        var settings$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var ahm = {
            data: data$1,
            elements: {
                parent: d3.select(element),
            },
            settings: Object.assign(settings(), settings$1),
        };
        layout.call(ahm);
        data.call(ahm);
        draw.call(ahm);
        return ahm;
    }

    return animatedHeatMap;
});
