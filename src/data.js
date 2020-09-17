import mutate from './data/mutate';
import group from './data/group';
import set from './data/set';
import domain from './data/domain';

export default function data() {
    mutate.call(this);
    this.data.groups = group.call(this);
    this.data.sets = set.call(this);

    // TODO: move somewhere more appropriate
    this.visitIndex = 0;
    this.visit = this.data.sets.visit[this.visitIndex];
    this.visit_order = this.data.groups.visit[this.visitIndex].visit_order;
    this.data.visit = this.data.groups.visit[this.visitIndex];
    this.data.id = this.data.groups.id
        .map(d => (
            d.values
                .slice()
                .sort((a,b) => b.visit_order - a.visit_order)
                .find(d => d.visit_order <= this.visit_order)
        ));
    this.domain = domain.call(this);
    this.cutoff = typeof this.settings.cutoff === 'number'
        ? this.settings.cutoff
        : this.settings.cutoff(this.data.clean.map(d => d.result));
    this.colorScale = d3.scaleLinear().domain(this.domain).range(['#f7fbff', '#08306b']);
    this.arcGenerator = d3
        .arc()
        .innerRadius(this.settings.innerRadius)
        .outerRadius(this.settings.outerRadius);
}
