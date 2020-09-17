export default function settings() {
    return {
        id_var: 'USUBJID',
        //arm_var: 'ARM',
        visit_var: 'VISIT',
        visit_order_var: 'VISITNUM',
        measure_var: 'LBTEST',
        result_var: 'LBSTRESN',
        sort: 'participant',
        duration: 2500,
        playPause: 'play',
        measure: null,
        subset: null, // array of objects
        width: null, // integer (pixels) - defined in ./layout
        height: null, // integer (pixels) - defined in ./layout
        cutoff: results => d3.quantile(results.sort((a,b) => a-b), 0.75),
    };
}
