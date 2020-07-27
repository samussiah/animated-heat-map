import layout from '../layout/heatMap';
import drawHeatMap from './heatMap';

export default function smallMultiples() {
    const heatMaps = this.data.byVisit.map((visit, i) => {
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

    return heatMaps;
}
