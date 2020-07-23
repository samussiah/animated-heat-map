export default function settings() {
    return {
        variables: {
            participant: 'USUBJID',
            arm: 'ARM',
            visit: 'VISIT',
            visit_numeric: 'VISITNUM',
            result: 'LBSTRESN',
        },
        width: null, // defined in ./layout
        height: null, // define in ./layout
    };
}
