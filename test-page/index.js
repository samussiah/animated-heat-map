fetch('./lb-trend.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text, d3.autoType))
    .then(data => {
        data.forEach(d => {
            if (d.LBTEST === 'Platelet count') d.LBTEST = 'Subretinal Fluid';
        });
        const ahm = animatedHeatMap(
            data.filter(d => !(d.VISITNUM%1)),
            '#container',
            {
                measure: 'Subretinal Fluid',
                subset: [
                    { key: 'LBTEST', value: ['Subretinal Fluid'] },
                ],
            }
        );
    });
