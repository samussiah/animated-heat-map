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
            }) //.rollup((group) => group[0].result)
            .entries(this.data.clean);
        this.data.byVisit = d3
            .nest()
            .key(function (d) {
                return d.visit + ':|:' + d.visit_order;
            })
            .key(function (d) {
                return d.id;
            })
            .rollup(function (group) {
                return group[0].result;
            })
            .entries(this.data.clean)
            .map(function (d) {
                var split = d.key.split(':|:');
                d.visit = split[0];
                d.visit_order = +split[1];
                return d;
            })
            .sort(function (a, b) {
                return a.visit_order - b.visit_order;
            });
        this.data.sets = {
            id: this.data.nest.map(function (d) {
                return d.key;
            }),
            visit: this.data.byVisit.map(function (d) {
                return d.visit;
            }),
            visit_order: this.data.byVisit.map(function (d) {
                return d.visit_order;
            }),
        }; // Calculate domain.

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

    function arcGenerator$1(dimension) {
        var arcGenerator = d3
            .arc()
            .innerRadius(dimension / 8)
            .outerRadius(dimension / 2 - 1);
        return arcGenerator;
    }

    function heatMap() {
        var title =
            arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'All Participants';
        var dimension =
            title === 'All Participants'
                ? this.settings.minDimension
                : this.settings.smallMultipleSize; // div

        var div = this.elements.main
            .append('div')
            .classed('ahm-heat-map', true)
            .style('display', 'inline-block'); // header

        var header = div.append('h3').classed('ahm-header', true).text(title); // svg

        var svg = div
            .append('svg')
            .classed('ahm-svg', true)
            .attr('width', dimension)
            .attr('height', dimension); // g

        var g = svg
            .append('g')
            .classed('ahm-g', true)
            .attr('transform', 'translate(' + dimension / 2 + ',' + dimension / 2 + ')'); // translate to center of SVG
        // draw visit text

        var visitText = g
            .append('text')
            .classed('ahm-visit-text', true)
            .attr('x', -dimension / 2)
            .attr('y', -dimension / 2)
            .attr('dominant-baseline', 'hanging')
            .text(title); // draw pupil

        var pupil = g
            .append('circle')
            .classed('ahm-pupil', true)
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', dimension / 8)
            .attr('fill', 'black')
            .attr('stroke', 'black')
            .attr('stroke-width', '5px')
            .attr('stroke-opacity', 0.25);
        return {
            div: div,
            header: header,
            svg: svg,
            g: g,
            visitText: visitText,
            pupil: pupil,
            arcGenerator: arcGenerator$1.call(this, dimension),
        };
    }

    function resize() {
        var _this = this;

        this.settings.width = this.elements.parent.node().clientWidth;
        this.settings.height = (this.settings.width / 16) * 9;
        this.settings.minDimension = Math.min(this.settings.width, this.settings.height);
        this.settings.smallMultipleSize = this.settings.minDimension / 4;
        this.arcGenerator = arcGenerator.call(this);
        this.heatMaps.forEach(function (heatMap) {
            heatMap.svg
                .attr('width', _this.settings.smallMultipleSize)
                .attr('height', _this.settings.smallMultipleSize);
            heatMap.g.attr(
                'transform',
                'translate(' +
                    _this.settings.smallMultipleSize / 2 +
                    ',' +
                    _this.settings.smallMultipleSize / 2 +
                    ')'
            );
            heatMap.iris.attr('d', heatMap.arcGenerator.call(_this));
            heatMap.pupil.attr('r', _this.settings.smallMultipleSize / 8);
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
        this.heatMap = {
            elements: heatMap.call(this),
        };
        window.addEventListener('resize', resize.bind(this));
    }

    function textTransition(visitText, text) {
        var transition = visitText
            .transition() //.delay(2000)
            .duration(2000)
            .text(text);
        return transition;
    }

    function transitionToNextVisit(iris, visit_order) {
        var _this = this;

        var transition = iris
            .transition() //.delay(2000)
            .duration(2000)
            .attr('fill', function (d) {
                var idData = _this.data.nest.find(function (di) {
                    return di.key === d.data.key;
                });

                var visitDatum = idData.values.find(function (di) {
                    return di.visit_order === visit_order;
                });
                if (visitDatum !== undefined) return _this.colorScale(visitDatum.result);
                else return _this.colorScale(d.data.value);
            });
        return transition;
    }

    function heatMap$1(data, i) {
        var _this = this;

        var elements = i === undefined ? this.heatMap.elements : data.elements;
        var arcAngles = d3
            .pie()
            .sort(null)
            .value(function (d, i) {
                return 1;
            })(data.values); // draw arcs

        var iris = elements.g
            .selectAll('path')
            .data(arcAngles) // pass arc
            .join('path')
            .classed('ahm-iris', true)
            .attr('d', elements.arcGenerator) // call arc generator
            .attr('fill', function (d) {
                return _this.colorScale(d.data.value);
            }); // color arcs by result
        //.attr('stroke', 'white')
        //.attr('stroke-width', '.5px');

        var textTransition$1 = textTransition.call(this, elements.visitText, data.visit);
        var transition = transitionToNextVisit.call(this, iris, data.visit_order);
        elements.pupil.raise();
        return {
            data: data,
            arcAngles: arcAngles,
            iris: iris,
            textTransition: textTransition$1,
            transition: transition,
        };
    }

    function draw() {
        var _this = this;

        this.colorScale = d3.scaleLinear().domain(this.domain).range(['#f7fbff', '#08306b']);
        Object.assign(this.heatMap, heatMap$1.call(this, this.data.byVisit[0]));
        this.data.byVisit.slice(1).forEach(function (visit) {
            _this.heatMap.textTransition = textTransition.call(
                _this,
                _this.heatMap.textTransition,
                visit.visit
            );
            _this.heatMap.transition = transitionToNextVisit.call(
                _this,
                _this.heatMap.transition,
                visit.visit_order
            );
        });
        this.heatMaps = this.data.byVisit.map(function (visit, i) {
            visit.elements = heatMap.call(_this, visit.visit); // One arc per ID; constant arc length

            _this.data.nest.forEach(function (d) {
                // Find ID nest within visit nest.
                var datum = visit.values.find(function (di) {
                    return di.key === d.key;
                });
                if (datum === undefined)
                    visit.values.push({
                        key: d.key,
                        value: null,
                    });
            });

            visit.values.sort(function (a, b) {
                return (
                    _this.data.nest.findIndex(function (d) {
                        return d.key === a.key;
                    }) -
                    _this.data.nest.findIndex(function (d) {
                        return d.key === b.key;
                    })
                );
            });
            var heatMap$2 = heatMap$1.call(_this, visit, i);
            return Object.assign(visit, heatMap$2);
        });
    }

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
