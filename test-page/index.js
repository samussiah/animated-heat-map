fetch('./lb.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text, d3.autoType))
    .then(data => {
        const ahm = animatedHeatMap(
            data,
            '#container',
            {
                measure: 'Albumin (g/L)',
                subset: [
                    { key: 'LBTEST', value: ['Albumin'] },
                ],
            }
        );
    });
