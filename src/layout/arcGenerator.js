export default function arcGenerator() {
    const arcGenerator = d3.arc()
        .innerRadius(this.settings.minDimension/8)
        .outerRadius(this.settings.minDimension/2 - 1);

    return arcGenerator;
}
