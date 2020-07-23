fetch('./lb.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        const ahm = animatedHeatMap(
            data,
            '#container',
            {
                variables: {
                    participant: 'USUBJID',
                    arm: 'ARM',
                    visit: 'VISIT',
                    visitn: 'VISITNUM',
                    result: 'LBSTRESN',
                },
                subset: [
                    { key: 'LBTEST', values: ['Albumin'] },
                ],
            }
        );
    });
