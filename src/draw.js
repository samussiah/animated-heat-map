import makeLegend from './draw/legend';
import drawVisits from './draw/visits';
import drawHeatMap from './draw/heatMap';
import update from './draw/update';

export default function draw() {
    // Draw legend.
    this.legend = d3.select(
        this.containers.legend.node().appendChild(
            makeLegend({
                color: this.colorScale,
                title: this.settings.measure,
                width: this.settings.width / 4,
                height: this.settings.height / 16,
            })
        )
    );

    this.visits = drawVisits.call(this);
    this.heatMap = drawHeatMap.call(this, this.data.visit);
    this.interval = d3.interval(() => {
        update.call(this);
    }, this.settings.duration);
    //function cycle() {
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
