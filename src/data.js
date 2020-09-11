export default function data() {
    this.data.filtered = this.data;

    // Apply user-specified subset(s).
    if (Array.isArray(this.settings.subset) && this.settings.subset.length > 0)
        this.settings.subset.forEach((subset) => {
            const value = Array.isArray(subset.value) ? subset.value : [subset.value];
            this.data.filtered = this.data.filtered.filter((d) => value.includes(d[subset.key]));
        });

    // Keep and rename required variables.
    this.data.clean = this.data.filtered
        .map((d) => {
            const datum = {};
            for (const variable in this.settings.variables)
                datum[variable] = d[this.settings.variables[variable]];
            return datum;
        })
        .filter((d) => [NaN, null, undefined, false].includes(d.result) === false);

    // Nest data by ID.
    this.data.nest = d3
        .nest()
        .key((d) => d.id)
        //.rollup((group) => group[0].result)
        .entries(this.data.clean);

    this.data.byVisit = d3
        .nest()
        .key((d) => d.visit + ':|:' + d.visit_order)
        .key((d) => d.id)
        .rollup((group) => group[0].result)
        .entries(this.data.clean)
        .map((d) => {
            const split = d.key.split(':|:');
            d.visit = split[0];
            d.visit_order = +split[1];

            return d;
        })
        .sort((a, b) => a.visit_order - b.visit_order);

    this.data.sets = {
        id: this.data.nest.map((d) => d.key),
        visit: this.data.byVisit.map((d) => d.visit),
        visit_order: this.data.byVisit.map((d) => d.visit_order),
    };

    // Calculate domain.
    this.domain = d3.extent(this.data.clean, (d) => d.result);
    this.cutoff = d3.quantile(this.data.clean.map(d => d.result).sort((a,b) => a-b), .5);
}
