import makeLegend from './draw/legend';
import drawHeatMap from './draw/heatMap';
import callTextTransition from './draw/heatMap/textTransition';
import transitionToNextVisit from './draw/heatMap/transitionToNextVisit';
import smallMultiples from './draw/smallMultiples';

export default function draw() {
    this.colorScale = d3.scaleLinear().domain(this.domain).range(['#f7fbff', '#08306b']);

    // Draw legend.
    this.elements.legend.node().appendChild(
        makeLegend({
            color: this.colorScale,
            title: this.settings.measure,
        })
    );

    // Draw animated chart.
    Object.assign(this.heatMap, drawHeatMap.call(this, this.data.byVisit[0]));

    this.data.byVisit.slice(1).forEach((visit) => {
        this.heatMap.textTransition = callTextTransition.call(
            this,
            this.heatMap.textTransition,
            visit.visit
        );
        this.heatMap.transition = transitionToNextVisit.call(
            this,
            this.heatMap.transition,
            visit.visit_order
        );
    });

    // Draw small multiples.
    this.heatMaps = smallMultiples.call(this);
}
