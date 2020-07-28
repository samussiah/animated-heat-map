import drawVisits from './draw/drawVisits';
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

    drawVisits.call(this);

    // Draw animated chart.
    Object.assign(this.heatMap, drawHeatMap.call(this, this.data.byVisit[0]));

    const ahm = this;

    console.log(ahm.data.byVisit);
    console.log(ahm.heatMap.iris);
    //cycle();

    //function cycle() {
    //    const transition = ahm.data.byVisit.reduce((prev,next,i) => {
    //        return ahm.heatMap.iris
    //            .transition()
    //            //.delay(2000)
    //            .duration(1000)
    //            .attr('fill', (d) => {
    //                const idData = ahm.data.nest.find((di) => di.key === d.data.key);
    //                const visitDatum = idData.values.find((di) => di.visit_order === next.visit_order);

    //                if (visitDatum !== undefined) return ahm.colorScale(visitDatum.result);
    //                else return ahm.colorScale(d.data.value);
    //            });
    //    }, ahm.heatMap.iris);

    //    transition.on('end', cycle);
    //}

    //this.data.byVisit.slice(1).forEach((visit) => {
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
