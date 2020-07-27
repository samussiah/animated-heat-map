export default function arcGenerator(dimension) {
    const arcGenerator = d3
        .arc()
        .innerRadius(dimension / 8)
        .outerRadius(dimension / 2 - 1);

    return arcGenerator;
}
