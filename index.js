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
        view: 'heatMap',
        sort: 'participant',
        duration: 1000,
        measure: null,
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
      }) //.rollup((group) => group[0].result)
      .entries(this.data.clean);
      this.data.byVisit = d3.nest().key(function (d) {
        return d.visit + ':|:' + d.visit_order;
      }).key(function (d) {
        return d.id;
      }).rollup(function (group) {
        return group[0].result;
      }).entries(this.data.clean).map(function (d) {
        var split = d.key.split(':|:');
        d.visit = split[0];
        d.visit_order = +split[1];
        return d;
      }).sort(function (a, b) {
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
        })
      }; // Calculate domain.

      this.domain = d3.extent(this.data.clean, function (d) {
        return d.result;
      });
    }

    function heatMapToggle() {
      var _this = this;

      var container = this.elements.controls.append('div').classed('ahm-control ahm-control--heat-map-toggle', true);
      var inputs = container.selectAll('label').data([{
        prop: 'heatMap',
        "class": 'ahm-heat-map',
        label: 'animated heat map'
      }, {
        prop: 'heatMaps',
        "class": 'ahm-heat-maps',
        label: 'heat maps by visit'
      }]).join('label').append('input').attr('type', 'radio').property('checked', function (d) {
        return d.prop === _this.settings.view;
      }); // Add text _after_ radio button.

      inputs.each(function (d) {
        var text = document.createTextNode("View ".concat(d.label));
        this.parentNode.appendChild(text);
      });
      inputs.on('change', function (d) {
        _this.settings.view = d.prop;
        inputs.property('checked', function (di) {
          return di.prop === _this.settings.view;
        });

        _this.elements.heatMap.classed('ahm-hidden', _this.settings.view !== 'heatMap');

        _this.elements.heatMaps.classed('ahm-hidden', _this.settings.view !== 'heatMaps');
      });
      return inputs;
    }

    function sort() {
      var _this = this;

      var container = this.elements.controls.append('div').classed('ahm-control ahm-control--sort', true);
      var inputs = container.selectAll('label').data([{
        label: 'participant'
      }, {
        label: 'result'
      }]).join('label').append('input').attr('type', 'radio').property('checked', function (d) {
        return d.label === _this.settings.sort;
      }); // Add text _after_ radio button.

      inputs.each(function (d) {
        var text = document.createTextNode("Sort by ".concat(d.label));
        this.parentNode.appendChild(text);
      });
      inputs.on('change', function (d) {
        _this.settings.sort = d.label;
        inputs.property('checked', function (di) {
          return di.label === _this.settings.sort;
        });

        var sortingFunction = function sortingFunction(a, b) {
          var aData = a.data ? a.data : a;
          var bData = b.data ? b.data : b;
          return _this.settings.sort === 'participant' ? d3.ascending(aData.key, bData.key) //(a.data.key < b.data.key ? -1 : 1)
          : d3.ascending(aData.value, bData.value); //(a.data.value - b.data.value)
        };

        _this.heatMap.arcAngles = d3.pie().sort(null).value(function (d, i) {
          return 1;
        })(_this.heatMap.data.values.sort(sortingFunction));

        _this.heatMap.iris.sort(sortingFunction).data(_this.heatMap.arcAngles, function (d) {
          return d.data.key;
        }).transition().duration(750).ease(d3.easeElastic).delay(function (d, i) {
          return i * 20;
        }).attr('d', _this.heatMap.elements.arcGenerator);
      });
      return inputs;
    }

    function controls() {
      var controls = {
        elements: {
          main: this.elements.controls
        }
      };
      controls.heatMapToggle = heatMapToggle.call(this);
      controls.sort = sort.call(this);
      return controls;
    }

    function arcGenerator(dimension) {
      var arcGenerator = d3.arc().innerRadius(dimension / 8).outerRadius(dimension / 2 - 1);
      return arcGenerator;
    }

    function heatMap() {
      var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'All Participants';
      var container = title === 'All Participants' ? this.elements.heatMap : this.elements.heatMaps.append('div').classed('ahm-heat-map', true);
      var dimension = title === 'All Participants' ? this.settings.minDimension : this.settings.smallMultipleSize; // header

      var header = container.append('h3').classed('ahm-header', true).text(title); // svg

      var svg = container.append('svg').classed('ahm-svg', true).attr('width', dimension).attr('height', dimension); // g

      var g = svg.append('g').classed('ahm-g', true).attr('transform', 'translate(' + dimension / 2 + ',' + dimension / 2 + ')'); // translate to center of SVG
      // draw visit text
      //const visitText = g
      //    .append('text')
      //    .classed('ahm-visit-text', true)
      //    .attr('x', -dimension / 2)
      //    .attr('y', 0)
      //    .attr('dominant-baseline', 'hanging')
      //    .text(title);

      var visitText = g.append('g').classed('ahm-visit-text', true).attr('transform', 'translate(' + -dimension / 2 + ',' + 0 + ')'); // translate to center of SVG

      visitText.append('rect').attr('x', 0).attr('width', dimension / 4).attr('y', -12).attr('height', 22).attr('fill', '#aaa'); // draw pupil

      var pupil = g.append('circle').classed('ahm-pupil', true).attr('cx', 0).attr('cy', 0).attr('r', dimension / 16).attr('fill', 'black').attr('stroke', 'black').attr('stroke-width', '5px').attr('stroke-opacity', 0.25);
      return {
        header: header,
        svg: svg,
        g: g,
        visitText: visitText,
        pupil: pupil,
        arcGenerator: arcGenerator.call(this, dimension / 2)
      };
    }

    function resize() {
      // Update dimensions.
      this.settings.width = this.elements.parent.node().clientWidth;
      this.settings.height = this.settings.width / 16 * 9;
      this.settings.minDimension = Math.min(this.settings.width, this.settings.height);
      this.settings.smallMultipleSize = this.settings.minDimension / 4; // Update main heat map.

      this.heatMap.elements.svg.attr('width', this.settings.minDimension).attr('height', this.settings.minDimension);
      this.heatMap.elements.g.attr('transform', 'translate(' + this.settings.minDimension / 2 + ',' + this.settings.minDimension / 2 + ')');
      this.heatMap.elements.visitText.attr('x', -this.settings.minDimension / 2).attr('y', -this.settings.minDimension / 2);
      this.heatMap.elements.pupil.attr('r', this.settings.minDimension / 8);
      this.heatMap.elements.arcGenerator = arcGenerator.call(this, this.settings.minDimension);
      this.heatMap.iris.attr('d', this.heatMap.elements.arcGenerator); // Update small multiples.
      //this.heatMaps.forEach((heatMap) => {
      //    heatMap.elements.svg
      //        .attr('width', this.settings.smallMultipleSize)
      //        .attr('height', this.settings.smallMultipleSize);
      //    heatMap.elements.g.attr(
      //        'transform',
      //        'translate(' +
      //            this.settings.smallMultipleSize / 2 +
      //            ',' +
      //            this.settings.smallMultipleSize / 2 +
      //            ')'
      //    );
      //    heatMap.elements.visitText
      //        .attr('x', -this.settings.minDimension / 2)
      //        .attr('y', -this.settings.minDimension / 2);
      //    heatMap.elements.pupil.attr('r', this.settings.smallMultipleSize / 8);
      //    this.heatMap.elements.arcGenerator = arcGenerator.call(this, this.settings.smallMultipleSize);
      //    heatMap.iris.attr('d', heatMap.elements.arcGenerator);
      //});
    }

    function layout() {
      // Set dimensions.
      this.settings.width = this.elements.parent.node().clientWidth;
      this.settings.height = this.settings.width / 16 * 9;
      this.settings.minDimension = Math.min(this.settings.width, this.settings.height);
      this.settings.smallMultipleSize = this.settings.minDimension / 4; // container

      this.elements.main = this.elements.parent.append('div').classed('animated-heat-map', true); //controls

      this.elements.controls = this.elements.main.append('div').classed('ahm-controls', true);
      this.controls = controls.call(this); // legend

      this.elements.legend = this.elements.main.append('div').classed('ahm-legend', true); // main heat map

      this.elements.heatMap = this.elements.main.append('div').classed('ahm-heat-map', true).classed('ahm-hidden', this.settings.view !== 'heatMap');
      this.heatMap = {
        elements: Object.assign({
          main: this.elements.heatMap
        }, heatMap.call(this))
      }; // small multiples

      this.elements.heatMaps = this.elements.main.append('div').classed('ahm-heat-maps', true).classed('ahm-hidden', this.settings.view !== 'heatMaps');
      this.heatMaps = {
        elements: {
          main: this.elements.heatMaps
        }
      };
      window.addEventListener('resize', resize.bind(this));
    }

    function drawVisits() {
      var ahm = this;
      var visits = this.heatMap.elements.visitText.selectAll('text').data(this.data.byVisit).join('text').attr('x', 0).attr('y', function (d, i) {
        return i * 25;
      }).attr('fill-opacity', function (d, i) {
        return 1 - i / 5;
      }).attr('alignment-baseline', 'middle').text(function (d) {
        return d.visit;
      });
      cycle(); // TODO: use chained transitions with transition.on('start', function repeat() {// transitions, recursive shit; })

      function cycle() {
        var transition = ahm.data.byVisit.reduce(function (prev, next, i) {
          return prev.transition().duration(1000).attr('y', function (d, j) {
            return j * 25 - i * 25;
          }) // the 5 visits before and after the current visit index (i) should be visible
          .attr('fill-opacity', function (d, j) {
            return 1 - Math.abs(i - j) / 5;
          });
        }, visits);
        transition.on('end', cycle);
      }
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

      var svg = d3.create('svg').attr('width', width).attr('height', height).attr('viewBox', [0, 0, width, height]).style('overflow', 'visible').style('display', 'block');

      var tickAdjust = function tickAdjust(g) {
        return g.selectAll('.tick line').attr('y1', marginTop + marginBottom - height);
      };

      var x; // Continuous

      if (color.interpolate) {
        var n = Math.min(color.domain().length, color.range().length);
        x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));
        svg.append('image').attr('x', marginLeft).attr('y', marginTop).attr('width', width - marginLeft - marginRight).attr('height', height - marginTop - marginBottom).attr('preserveAspectRatio', 'none').attr('xlink:href', ramp.call(this, color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
      } // Sequential
      else if (color.interpolator) {
          x = Object.assign(color.copy().interpolator(d3.interpolateRound(marginLeft, width - marginRight)), {
            range: function range() {
              return [marginLeft, width - marginRight];
            }
          });
          svg.append('image').attr('x', marginLeft).attr('y', marginTop).attr('width', width - marginLeft - marginRight).attr('height', height - marginTop - marginBottom).attr('preserveAspectRatio', 'none').attr('xlink:href', ramp.call(this, color.interpolator()).toDataURL()); // scaleSequentialQuantile doesn’t implement ticks or tickFormat.

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
            var thresholds = color.thresholds ? color.thresholds() // scaleQuantize
            : color.quantiles ? color.quantiles() // scaleQuantile
            : color.domain(); // scaleThreshold

            var thresholdFormat = tickFormat === undefined ? function (d) {
              return d;
            } : typeof tickFormat === 'string' ? d3.format(tickFormat) : tickFormat;
            x = d3.scaleLinear().domain([-1, color.range().length - 1]).rangeRound([marginLeft, width - marginRight]);
            svg.append('g').selectAll('rect').data(color.range()).join('rect').attr('x', function (d, i) {
              return x(i - 1);
            }).attr('y', marginTop).attr('width', function (d, i) {
              return x(i) - x(i - 1);
            }).attr('height', height - marginTop - marginBottom).attr('fill', function (d) {
              return d;
            });
            tickValues = d3.range(thresholds.length);

            tickFormat = function tickFormat(i) {
              return thresholdFormat(thresholds[i], i);
            };
          } // Ordinal
          else {
              x = d3.scaleBand().domain(color.domain()).rangeRound([marginLeft, width - marginRight]);
              svg.append('g').selectAll('rect').data(color.domain()).join('rect').attr('x', x).attr('y', marginTop).attr('width', Math.max(0, x.bandwidth() - 1)).attr('height', height - marginTop - marginBottom).attr('fill', color);

              tickAdjust = function tickAdjust() {};
            }

      svg.append('g').attr('transform', "translate(0,".concat(height - marginBottom, ")")).call(d3.axisBottom(x).ticks(ticks, typeof tickFormat === 'string' ? tickFormat : undefined).tickFormat(typeof tickFormat === 'function' ? tickFormat : undefined).tickSize(tickSize).tickValues(tickValues)).call(tickAdjust).call(function (g) {
        return g.select('.domain').remove();
      }).call(function (g) {
        return g.append('text').attr('x', marginLeft).attr('y', marginTop + marginBottom - height - 6).attr('fill', 'currentColor').attr('text-anchor', 'start').attr('font-weight', 'bold').text(title);
      });
      return svg.node();
    }

    function heatMap$1(data, i) {
      var _this = this;

      var elements = i === undefined ? this.heatMap.elements : data.elements;
      var arcAngles = d3.pie().sort(null).value(function (d, i) {
        return 1;
      })(data.values); // draw arcs

      var iris = elements.g.selectAll('path').data(arcAngles, function (d) {
        return d.data.key;
      }) // pass arc
      .join('path').classed('ahm-iris', true).attr('d', elements.arcGenerator) // call arc generator
      .attr('fill', function (d) {
        return _this.colorScale(d.data.value);
      }) // color arcs by result
      .attr('stroke', function (d) {
        return _this.colorScale(d.data.value);
      }); // color arcs by result
      //const textTransition = callTextTransition.call(this, elements.visitText, data.visit);
      //const transition = transitionToNextVisit.call(this, iris, data.visit_order);

      elements.pupil.raise();
      return {
        data: data,
        arcAngles: arcAngles,
        iris: iris //textTransition,
        //transition,

      };
    }

    function draw() {
      this.colorScale = d3.scaleLinear().domain(this.domain).range(['#f7fbff', '#08306b']); // Draw legend.

      this.elements.legend.node().appendChild(legend({
        color: this.colorScale,
        title: this.settings.measure
      }));
      drawVisits.call(this); // Draw animated chart.

      Object.assign(this.heatMap, heatMap$1.call(this, this.data.byVisit[0]));
      var ahm = this;
      console.log(ahm.data.byVisit);
      console.log(ahm.heatMap.iris);
      cycle();

      function cycle() {
        var transition = ahm.data.byVisit.reduce(function (prev, next, i) {
          return prev.transition() //.delay(2000)
          .duration(1000).attr('fill', function (d) {
            var idData = ahm.data.nest.find(function (di) {
              return di.key === d.data.key;
            });
            var visitDatum = idData.values.find(function (di) {
              return di.visit_order === next.visit_order;
            });
            if (visitDatum !== undefined) return ahm.colorScale(visitDatum.result);else return ahm.colorScale(d.data.value);
          });
        }, ahm.heatMap.iris); //transition.on('end', cycle);
      } //this.data.byVisit.slice(1).forEach((visit) => {
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
