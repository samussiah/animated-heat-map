export default function id() {
    const group = d3
        .nest()
        .key((d) => d.id)
        .entries(this.data.clean);

    return group;
}
