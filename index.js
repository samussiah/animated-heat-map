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
            id_var: 'USUBJID',
            //arm_var: 'ARM',
            visit_var: 'VISIT',
            visit_order_var: 'VISITNUM',
            measure_var: 'LBTEST',
            result_var: 'LBSTRESN',
            sort: 'participant',
            duration: 2500,
            playPause: 'play',
            measure: null,
            subset: null,
            // array of objects
            width: null,
            // integer (pixels) - defined in ./layout
            height: null,
            // integer (pixels) - defined in ./layout
            cutoff: function cutoff(results) {
                return d3.quantile(
                    results.sort(function (a, b) {
                        return a - b;
                    }),
                    0.75
                );
            },
        };
    }

    function addElement(name, parent) {
        var tagName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'div';
        var element = parent
            .append(tagName)
            .classed('ahm-'.concat(name), true)
            .classed('ahm-'.concat(tagName), true)
            .classed('ahm-'.concat(name, '__').concat(tagName), true);
        return element;
    }

    var util = {
        addElement: addElement,
    };

    function getDimensions(containers) {
        this.settings.width = containers.main.node().clientWidth;
        this.settings.height = (this.settings.width / 16) * 9;
        this.settings.radius = this.settings.height / 2;
        this.settings.innerRadius = this.settings.height / 8;
        this.settings.outerRadius = this.settings.height / 2;
        this.settings.outerWidth = this.settings.width - this.settings.height;
    }

    function layout() {
        var containers = {
            main: d3.select(this.element).append('div').classed('animated-heat-map', true),
        };
        getDimensions.call(this, containers); //containers.controls = this.util.addElement('controls', containers.main);

        containers.legend = this.util.addElement('legend', containers.main);
        containers.heatMap = this.util.addElement('heat-map', containers.main);
        containers.svg = this.util
            .addElement('svg', containers.heatMap, 'svg')
            .attr('width', this.settings.width)
            .attr('height', this.settings.height);
        containers.g = this.util
            .addElement('g', containers.svg, 'g')
            .attr(
                'transform',
                'translate('.concat(this.settings.width / 2, ',').concat(this.settings.radius, ')')
            );
        containers.visits = this.util
            .addElement('visits', containers.g, 'g')
            .attr('transform', 'translate(-'.concat(this.settings.width / 2, ',0)'));
        containers.visitBackground = this.util
            .addElement('visit-background', containers.visits, 'rect')
            .attr('x', 0)
            .attr('width', this.settings.width / 2)
            .attr('y', '-12')
            .attr('height', 22)
            .attr('fill', '#aaa');
        containers.iris = this.util.addElement('iris', containers.g, 'g');
        containers.pupil = this.util
            .addElement('pupil', containers.g, 'circle')
            .attr('r', this.settings.innerRadius);
        containers.annotation = this.util
            .addElement('annotation', containers.g, 'text')
            .attr('fill', 'white')
            .attr('stoke', 'white')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle');
        containers.annotation1 = this.util
            .addElement('annotation__1', containers.annotation, 'tspan')
            .attr('x', 0)
            .attr('y', -12);
        containers.annotation2 = this.util
            .addElement('annotation__2', containers.annotation, 'tspan')
            .attr('x', 0)
            .attr('y', 12)
            .text('Baseline'); //window.addEventListener('resize', resize.bind(this));

        return containers;
    }

    function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === 'Object' && o.constructor) n = o.constructor.name;
        if (n === 'Map' || n === 'Set') return Array.from(o);
        if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
            return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;

        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

        return arr2;
    }

    function _createForOfIteratorHelper(o, allowArrayLike) {
        var it;

        if (typeof Symbol === 'undefined' || o[Symbol.iterator] == null) {
            if (
                Array.isArray(o) ||
                (it = _unsupportedIterableToArray(o)) ||
                (allowArrayLike && o && typeof o.length === 'number')
            ) {
                if (it) o = it;
                var i = 0;

                var F = function () {};

                return {
                    s: F,
                    n: function () {
                        if (i >= o.length)
                            return {
                                done: true,
                            };
                        return {
                            done: false,
                            value: o[i++],
                        };
                    },
                    e: function (e) {
                        throw e;
                    },
                    f: F,
                };
            }

            throw new TypeError(
                'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
            );
        }

        var normalCompletion = true,
            didErr = false,
            err;
        return {
            s: function () {
                it = o[Symbol.iterator]();
            },
            n: function () {
                var step = it.next();
                normalCompletion = step.done;
                return step;
            },
            e: function (e) {
                didErr = true;
                err = e;
            },
            f: function () {
                try {
                    if (!normalCompletion && it.return != null) it.return();
                } finally {
                    if (didErr) throw err;
                }
            },
        };
    }

    function mutate() {
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
            .map(function (d, i) {
                var datum = {};

                var _iterator = _createForOfIteratorHelper(
                        Object.keys(_this.settings).filter(function (key) {
                            return /_var$/.test(key);
                        })
                    ),
                    _step;

                try {
                    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                        var setting = _step.value;
                        var variable = setting.replace(/_var$/, '');
                        datum[variable] = d[_this.settings[setting]];
                    }
                } catch (err) {
                    _iterator.e(err);
                } finally {
                    _iterator.f();
                }

                return datum;
            })
            .filter(function (d) {
                return [NaN, null, undefined, false].includes(d.result) === false;
            });
    }

    function id() {
        var group = d3
            .nest()
            .key(function (d) {
                return d.id;
            })
            .entries(this.data.clean);
        return group;
    }

    function visit() {
        var group = d3
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
        return group;
    }

    function group() {
        var groups = {
            id: id.call(this),
            visit: visit.call(this),
        };
        return groups;
    }

    function set() {
        var sets = {
            id: this.data.groups.id.map(function (d) {
                return d.key;
            }),
            visit: this.data.groups.visit.map(function (d) {
                return d.visit;
            }),
            visit_order: this.data.groups.visit.map(function (d) {
                return d.visit_order;
            }),
        };
        return sets;
    }

    function domain() {
        var domain = d3.extent(this.data.clean, function (d) {
            return d.result;
        });
        return domain;
    }

    function data() {
        var _this = this;

        mutate.call(this);
        this.data.groups = group.call(this);
        this.data.sets = set.call(this); // TODO: move somewhere more appropriate

        this.visitIndex = 0;
        this.visit = this.data.sets.visit[this.visitIndex];
        this.visit_order = this.data.groups.visit[this.visitIndex].visit_order;
        this.data.visit = this.data.groups.visit[this.visitIndex];
        this.data.id = this.data.groups.id.map(function (d) {
            return d.values
                .slice()
                .sort(function (a, b) {
                    return b.visit_order - a.visit_order;
                })
                .find(function (d) {
                    return d.visit_order <= _this.visit_order;
                });
        });
        this.domain = domain.call(this);
        this.cutoff =
            typeof this.settings.cutoff === 'number'
                ? this.settings.cutoff
                : this.settings.cutoff(
                      this.data.clean.map(function (d) {
                          return d.result;
                      })
                  );
        this.colorScale = d3.scaleLinear().domain(this.domain).range(['#f7fbff', '#08306b']);
        this.arcGenerator = d3
            .arc()
            .innerRadius(this.settings.innerRadius)
            .outerRadius(this.settings.outerRadius);
    }

    function ramp(color) {
        var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 256;
        //DOM.canvas(n, 1);
        var canvas = document.createElement('canvas');
        canvas.width = n;
        canvas.height = 1;
        var context = canvas.getContext('2d');

        for (var i = 0; i < n; ++i) {
            context.fillStyle = color(i / (n - 1));
            context.fillRect(i, 0, 1, 1);
        }

        return canvas;
    }

    function legend() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            color = _ref.color,
            title = _ref.title,
            _ref$tickSize = _ref.tickSize,
            tickSize = _ref$tickSize === void 0 ? 6 : _ref$tickSize,
            _ref$width = _ref.width,
            width = _ref$width === void 0 ? 320 : _ref$width,
            _ref$height = _ref.height,
            height = _ref$height === void 0 ? 44 + tickSize : _ref$height,
            _ref$marginTop = _ref.marginTop,
            marginTop = _ref$marginTop === void 0 ? 18 : _ref$marginTop,
            _ref$marginRight = _ref.marginRight,
            marginRight = _ref$marginRight === void 0 ? 0 : _ref$marginRight,
            _ref$marginBottom = _ref.marginBottom,
            marginBottom = _ref$marginBottom === void 0 ? 16 + tickSize : _ref$marginBottom,
            _ref$marginLeft = _ref.marginLeft,
            marginLeft = _ref$marginLeft === void 0 ? 0 : _ref$marginLeft,
            _ref$ticks = _ref.ticks,
            ticks = _ref$ticks === void 0 ? width / 64 : _ref$ticks,
            tickFormat = _ref.tickFormat,
            tickValues = _ref.tickValues;

        var svg = d3
            .create('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height])
            .style('overflow', 'visible')
            .style('display', 'block');

        var tickAdjust = function tickAdjust(g) {
            return g.selectAll('.tick line').attr('y1', marginTop + marginBottom - height);
        };

        var x; // Continuous

        if (color.interpolate) {
            var n = Math.min(color.domain().length, color.range().length);
            x = color
                .copy()
                .rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));
            svg.append('image')
                .attr('x', marginLeft)
                .attr('y', marginTop)
                .attr('width', width - marginLeft - marginRight)
                .attr('height', height - marginTop - marginBottom)
                .attr('preserveAspectRatio', 'none')
                .attr(
                    'xlink:href',
                    ramp
                        .call(this, color.copy().domain(d3.quantize(d3.interpolate(0, 1), n)))
                        .toDataURL()
                );
        } // Sequential
        else if (color.interpolator) {
            x = Object.assign(
                color.copy().interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
                {
                    range: function range() {
                        return [marginLeft, width - marginRight];
                    },
                }
            );
            svg.append('image')
                .attr('x', marginLeft)
                .attr('y', marginTop)
                .attr('width', width - marginLeft - marginRight)
                .attr('height', height - marginTop - marginBottom)
                .attr('preserveAspectRatio', 'none')
                .attr('xlink:href', ramp.call(this, color.interpolator()).toDataURL()); // scaleSequentialQuantile doesn’t implement ticks or tickFormat.

            if (!x.ticks) {
                if (tickValues === undefined) {
                    var _n = Math.round(ticks + 1);

                    tickValues = d3.range(_n).map(function (i) {
                        return d3.quantile(color.domain(), i / (_n - 1));
                    });
                }

                if (typeof tickFormat !== 'function') {
                    tickFormat = d3.format(tickFormat === undefined ? ',f' : tickFormat);
                }
            }
        } // Threshold
        else if (color.invertExtent) {
            var thresholds = color.thresholds
                ? color.thresholds() // scaleQuantize
                : color.quantiles
                ? color.quantiles() // scaleQuantile
                : color.domain(); // scaleThreshold

            var thresholdFormat =
                tickFormat === undefined
                    ? function (d) {
                          return d;
                      }
                    : typeof tickFormat === 'string'
                    ? d3.format(tickFormat)
                    : tickFormat;
            x = d3
                .scaleLinear()
                .domain([-1, color.range().length - 1])
                .rangeRound([marginLeft, width - marginRight]);
            svg.append('g')
                .selectAll('rect')
                .data(color.range())
                .join('rect')
                .attr('x', function (d, i) {
                    return x(i - 1);
                })
                .attr('y', marginTop)
                .attr('width', function (d, i) {
                    return x(i) - x(i - 1);
                })
                .attr('height', height - marginTop - marginBottom)
                .attr('fill', function (d) {
                    return d;
                });
            tickValues = d3.range(thresholds.length);

            tickFormat = function tickFormat(i) {
                return thresholdFormat(thresholds[i], i);
            };
        } // Ordinal
        else {
            x = d3
                .scaleBand()
                .domain(color.domain())
                .rangeRound([marginLeft, width - marginRight]);
            svg.append('g')
                .selectAll('rect')
                .data(color.domain())
                .join('rect')
                .attr('x', x)
                .attr('y', marginTop)
                .attr('width', Math.max(0, x.bandwidth() - 1))
                .attr('height', height - marginTop - marginBottom)
                .attr('fill', color);

            tickAdjust = function tickAdjust() {};
        }

        svg.append('g')
            .attr('transform', 'translate(0,'.concat(height - marginBottom, ')'))
            .call(
                d3
                    .axisBottom(x)
                    .ticks(ticks, typeof tickFormat === 'string' ? tickFormat : undefined)
                    .tickFormat(typeof tickFormat === 'function' ? tickFormat : undefined)
                    .tickSize(tickSize)
                    .tickValues(tickValues)
            )
            .call(tickAdjust)
            .call(function (g) {
                return g.select('.domain').remove();
            })
            .call(function (g) {
                return g
                    .append('text')
                    .attr('x', marginLeft)
                    .attr('y', marginTop + marginBottom - height - 6)
                    .attr('fill', 'currentColor')
                    .attr('text-anchor', 'start')
                    .attr('font-weight', 'bold')
                    .attr('font-size', '1.25rem')
                    .text(title);
            });
        return svg.node();
    }

    function visits() {
        var visits = this.containers.visits
            .selectAll('text')
            .data(this.data.groups.visit)
            .join('text')
            .attr('x', 0)
            .attr('y', function (d, i) {
                return i * 25;
            })
            .attr('fill-opacity', function (d, i) {
                return 1 - i / 5;
            })
            .attr('alignment-baseline', 'middle')
            .text(function (d) {
                return d.visit;
            });
        return visits;
    }

    //import callTextTransition from './heatMap/textTransition';
    //import transitionToNextVisit from './heatMap/transitionToNextVisit';
    function heatMap(data, i) {
        var _this = this;

        var pie = d3
            .pie()
            .sort(null)
            .value(function (d, i) {
                return 1;
            });
        var pieData = pie(
            data.values.sort(function (a, b) {
                return a.value - b.value;
            })
        );
        var iris = this.containers.iris
            .selectAll('path')
            .data(pieData, function (d) {
                return d.data.key;
            }) // pass arc
            .join('path')
            .classed('ahm-iris', true)
            .attr('d', this.arcGenerator) // call arc generator
            .attr('fill', function (d) {
                return _this.colorScale(d.data.value);
            }) // color arcs by result
            .attr('stroke', function (d) {
                return _this.colorScale(d.data.value);
            }); // color arcs by result

        this.containers.pupil.raise();
        this.containers.annotation.raise();
        return {
            data: data,
            pie: pie,
            pieData: pieData,
            iris: iris,
        };
    }

    function visits$1() {
        var _this = this;

        this.visits
            .transition()
            .duration(this.settings.duration)
            .attr('y', function (d, i) {
                return i * 25 - _this.visitIndex * 25;
            })
            .attr('fill-opacity', function (d, i) {
                return 1 - Math.abs(_this.visitIndex - i) / 5;
            });
    }

    function iris() {
        var _this = this;

        this.heatMap.iris
            .transition()
            .ease(d3.easeLinear)
            .duration(this.settings.duration)
            .attr('fill', function (d) {
                var idDatum = _this.data.id.find(function (di) {
                    return di.id === d.data.key;
                });

                return _this.colorScale(idDatum.result);
            })
            .attr('stroke', function (d) {
                var idDatum = _this.data.id.find(function (di) {
                    return di.id === d.data.key;
                });

                return _this.colorScale(idDatum.result);
            });
    }

    function annotation() {
        var _this = this;

        this.containers.annotation1
            .transition()
            .duration(this.settings.duration)
            .text(
                this.visitIndex === 0
                    ? 'Baseline'
                    : ''.concat(
                          d3.format('.0%')(
                              this.data.id.filter(function (d) {
                                  return d.result <= _this.cutoff;
                              }).length / this.data.sets.id.length
                          ),
                          ' of participants'
                      )
            );
        this.containers.annotation2
            .transition()
            .duration(this.settings.duration)
            .text(this.visitIndex === 0 ? '' : 'show improvement'); //this.containers.annotation.transition().on('start', function repeat() {
        //    const transition = d3.active(this);
        //    ahm.data.groups.visit.reduce((prev, visit, i) => {
        //        const next = prev
        //            .transition()
        //            .duration(ahm.settings.duration)
        //            .text(
        //                `${d3.format('.0%')(
        //                    visit.values.filter((d) => d.value <= ahm.cutoff).length /
        //                        ahm.data.sets.id.length
        //                )} reduction`
        //            );
        //        if (i === ahm.data.groups.visit.length - 1) next.on('start', repeat);
        //        return next;
        //    }, transition);
        //});
    }

    function update() {
        var _this = this;

        this.visitIndex =
            this.visitIndex >= this.data.sets.visit.length - 1 ? 0 : this.visitIndex + 1;
        this.visit = this.data.sets.visit[this.visitIndex];
        this.visit_order = this.data.groups.visit[this.visitIndex].visit_order;
        this.data.visit = this.data.groups.visit[this.visitIndex];
        this.data.id = this.data.groups.id.map(function (d) {
            return d.values
                .slice()
                .sort(function (a, b) {
                    return b.visit_order - a.visit_order;
                })
                .find(function (d) {
                    return d.visit_order <= _this.visit_order;
                });
        });
        visits$1.call(this);
        iris.call(this);
        annotation.call(this); // Pause at the beginning.

        if (this.visitIndex === 0) {
            this.interval.stop();
            d3.timeout(function () {
                _this.interval = d3.interval(function () {
                    update.call(_this);
                }, _this.settings.duration);
            }, 1000);
        } // Pause at the end.

        if (this.visitIndex === this.data.sets.visit.length - 1) {
            this.interval.stop();
            d3.timeout(function () {
                _this.interval = d3.interval(function () {
                    update.call(_this);
                }, _this.settings.duration);
            }, 5000);
        }
    }

    function draw() {
        var _this = this;

        // Draw legend.
        this.legend = d3.select(
            this.containers.legend.node().appendChild(
                legend({
                    color: this.colorScale,
                    title: this.settings.measure,
                    width: this.settings.width / 4,
                    height: this.settings.height / 16,
                })
            )
        );
        this.visits = visits.call(this);
        this.heatMap = heatMap.call(this, this.data.visit);
        this.interval = d3.interval(function () {
            update.call(_this);
        }, this.settings.duration); //function cycle() {
        //    const transition = ahm.data.groups.visit.reduce((prev, next, i) => {
        //        return (
        //            prev
        //                .transition()
        //                //.delay(2000)
        //                .duration(ahm.settings.duration)
        //                .attr('fill', (d) => {
        //                    const idData = ahm.data.groups.id.find((di) => di.key === d.data.key);
        //                    const visitDatum = idData.values.find(
        //                        (di) => di.visit_order === next.visit_order
        //                    );
        //                    if (visitDatum !== undefined) return ahm.colorScale(visitDatum.result);
        //                    else return ahm.colorScale(d.data.value);
        //                })
        //        );
        //    }, ahm.heatMap.iris);
        //    //transition.on('end', cycle);
        //}
        //this.data.groups.visit.slice(1).forEach((visit) => {
        //    this.heatMap.textTransition = callTextTransition.call(
        //        this,
        //        this.heatMap.textTransition,
        //        visit.visit
        //    );
        //    this.heatMap.transition = transitionToNextVisit.call(
        //        this,
        //        this.heatMap.transition,
        //        visit.visit_order
        //    );
        //});
        //// Draw small multiples.
        //this.heatMaps = smallMultiples.call(this);
    }

    function animatedHeatMap(data$1) {
        var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
        var settings$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var main = {
            data: data$1,
            element: element,
            settings: Object.assign(settings(), settings$1),
            util: util,
        };
        main.containers = layout.call(main); // add elements to DOM

        data.call(main); // mutate and structure data

        draw.call(main); // run the animation

        return main;
    }

    return animatedHeatMap;
});
