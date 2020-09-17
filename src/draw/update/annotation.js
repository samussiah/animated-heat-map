export default function annotation() {
    this.containers.annotation1
        .transition()
        .duration(this.settings.duration)
        .text(
            this.visitIndex === 0
                ? 'Baseline'
                : `${d3.format('.0%')(
                      this.data.id.filter((d) => d.result <= this.cutoff).length /
                          this.data.sets.id.length
                  )} of participants`
        );
    this.containers.annotation2
        .transition()
        .duration(this.settings.duration)
        .text(this.visitIndex === 0 ? '' : 'show improvement');

    //this.containers.annotation.transition().on('start', function repeat() {
    //    const transition = d3.active(this);

    //    ahm.data.groups.visit.reduce((prev, visit, i) => {
    //        const next = prev
    //            .transition()
    //            .duration(ahm.settings.duration)
    //            .text(
    //                `${d3.format('.0%')(
    //                    visit.values.filter((d) => d.value <= ahm.cutoff).length /
    //                        ahm.data.sets.id.length
    //                )} reduction`
    //            );
    //        if (i === ahm.data.groups.visit.length - 1) next.on('start', repeat);
    //        return next;
    //    }, transition);
    //});
}
