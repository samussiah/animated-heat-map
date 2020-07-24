export default function arcGenerator() {
    const arcGenerator = d3
        .arc()
        .innerRadius(this.settings.smallMultipleSize / 8)
        .outerRadius(this.settings.smallMultipleSize / 2 - 1);

    return arcGenerator;
}
