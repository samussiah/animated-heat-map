export default function domain() {
    const domain = d3.extent(this.data.clean, (d) => d.result);

    return domain;
}
