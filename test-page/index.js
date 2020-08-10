fetch('./lb.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text, d3.autoType))
    .then(data => {
        const ahm = animatedHeatMap(
            data.filter(d => !(d.VISITNUM%1)),
            '#container',
            {
                measure: 'Platelet count',
                subset: [
                    { key: 'LBTEST', value: ['Platelet count'] },
                ],
            }
        );
    });
