export default function settings() {
    return {
        variables: {
            id: 'USUBJID',
            arm: 'ARM',
            visit: 'VISIT',
            visit_order: 'VISITNUM',
            measure: 'LBTEST',
            result: 'LBSTRESN',
        },
        view: 'heatMap',
        sort: 'participant',
        duration: 1000,
        playPause: 'play',
        measure: null,
        subset: null, // array of objects
        width: null, // integer (pixels) - defined in ./layout
        height: null, // integer (pixels) - defined in ./layout
    };
}
