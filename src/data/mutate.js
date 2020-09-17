export default function mutate() {
    this.data.filtered = this.data;

    // Apply user-specified subset(s).
    if (Array.isArray(this.settings.subset) && this.settings.subset.length > 0)
        this.settings.subset.forEach((subset) => {
            const value = Array.isArray(subset.value) ? subset.value : [subset.value];
            this.data.filtered = this.data.filtered.filter((d) => value.includes(d[subset.key]));
        });

    // Keep and rename required variables.
    this.data.clean = this.data.filtered
        .map((d, i) => {
            const datum = {};

            for (const setting of Object.keys(this.settings).filter((key) => /_var$/.test(key))) {
                const variable = setting.replace(/_var$/, '');
                datum[variable] = d[this.settings[setting]];
            }

            return datum;
        })
        .filter((d) => [NaN, null, undefined, false].includes(d.result) === false);
}
