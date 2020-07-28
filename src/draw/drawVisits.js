export default function drawVisits() {
    const ahm = this;

    const visits = this.heatMap.elements.visitText
        .selectAll('text')
        .data(this.data.byVisit)
        .join('text')
        .attr('x', 0)
        .attr('y', (d,i) => i*25)
        .attr('fill-opacity', (d,i) => 1 - i/5)
        .attr('alignment-baseline', 'middle')
        .text(d => d.visit);

    const t0 = performance.now();
    //begin performance test

    cycle();

    function cycle() {
        const transition = ahm.data.byVisit.reduce((prev,next,i) => {
            return prev.transition().duration(1000)
                .attr('y', (d,j) => j*25 - i*25)
                // the 5 visits before and after the current visit index (i) should be visible
                .attr('fill-opacity', (d,j) => 1-Math.abs(i - j)/5);
        }, visits);
        transition.on('end', () => {
            //end performance test
            const t1 = performance.now();
            console.log(`[code] took ${t1 - t0} milliseconds.`);
        });
    }
}