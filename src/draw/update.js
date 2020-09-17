import updateVisits from './update/visits';
import updateIris from './update/iris';
import updateAnnotation from './update/annotation';

export default function update() {
    this.visitIndex = this.visitIndex >= this.data.sets.visit.length - 1
        ? 0
        : this.visitIndex + 1;;
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
    updateVisits.call(this);
    updateIris.call(this);
    updateAnnotation.call(this);

    // Pause at the beginning.
    if (this.visitIndex === 0) {
        this.interval.stop();
        d3.timeout(() => {
            this.interval = d3.interval(() => {
                update.call(this);
            }, this.settings.duration);
        }, 1000);
    }

    // Pause at the end.
    if (this.visitIndex === this.data.sets.visit.length - 1) {
        this.interval.stop();
        d3.timeout(() => {
            this.interval = d3.interval(() => {
                update.call(this);
            }, this.settings.duration);
        }, 5000);
    }
}
