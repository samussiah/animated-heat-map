export default function set() {
    const sets = {
        id: this.data.groups.id.map((d) => d.key),
        visit: this.data.groups.visit.map((d) => d.visit),
        visit_order: this.data.groups.visit.map((d) => d.visit_order),
    };

    return sets;
}
