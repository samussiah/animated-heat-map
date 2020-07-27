import layout from './layout/heatMap';
import drawHeatMap from './draw/heatMap';
import callTextTransition from './draw/heatMap/textTransition';
import transitionToNextVisit from './draw/heatMap/transitionToNextVisit';

export default function draw() {
    this.colorScale = d3.scaleLinear().domain(this.domain).range(['#f7fbff', '#08306b']);

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

    this.heatMaps = this.data.byVisit.map((visit, i) => {
        visit.elements = layout.call(this, visit.visit);

        // One arc per ID; constant arc length
        this.data.nest.forEach((d) => {
            // Find ID nest within visit nest.
            const datum = visit.values.find((di) => di.key === d.key);

            if (datum === undefined)
                visit.values.push({
                    key: d.key,
                    value: null,
                });
        });

        visit.values.sort(
            (a, b) =>
                this.data.nest.findIndex((d) => d.key === a.key) -
                this.data.nest.findIndex((d) => d.key === b.key)
        );

        const heatMap = drawHeatMap.call(this, visit, i);

        return Object.assign(visit, heatMap);
    });
}
