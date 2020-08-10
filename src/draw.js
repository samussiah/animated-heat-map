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

    this.heatMap.visitText = drawVisits.call(this);

    // Draw animated chart.
    Object.assign(this.heatMap, drawHeatMap.call(this, this.data.byVisit[0]));

    const ahm = this;
    this.heatMap.iris
        .transition()
        .ease(d3.easeLinear)
        .on('start', function repeat() {
            const transition = d3.active(this);

            ahm.data.byVisit.reduce((prev, visit, i) => {
                const next = prev
                    .transition()
                    .duration(ahm.settings.duration)
                    .attr('fill', (d) => {
                        // Find the full data array of the current participant.
                        const idData = ahm.data.nest.find((di) => di.key === d.data.key);

                        // Find the single datum matching the current visit.
                        const visitDatum = idData.values.find(
                            (di) => di.visit_order === visit.visit_order
                        );

                        // If the participant has a result at the current visit, update the color
                        // per the result.
                        if (visitDatum !== undefined) return ahm.colorScale(visitDatum.result);
                        // Otherwise maintain the exisiting color.
                        else return ahm.colorScale(d.data.value);
                    });
                if (i === ahm.data.byVisit.length - 1) next.on('start', repeat);
                return next;
            }, transition);
        });

    function cycle() {
        const transition = ahm.data.byVisit.reduce((prev, next, i) => {
            return (
                prev
                    .transition()
                    //.delay(2000)
                    .duration(ahm.settings.duration)
                    .attr('fill', (d) => {
                        const idData = ahm.data.nest.find((di) => di.key === d.data.key);
                        const visitDatum = idData.values.find(
                            (di) => di.visit_order === next.visit_order
                        );

                        if (visitDatum !== undefined) return ahm.colorScale(visitDatum.result);
                        else return ahm.colorScale(d.data.value);
                    })
            );
        }, ahm.heatMap.iris);

        //transition.on('end', cycle);
    }

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
