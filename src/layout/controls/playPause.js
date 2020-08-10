import toggle, { playPause as playPauseData } from './playPause/toggle';

export default function playPause() {
    const ahm = this;

    const container = this.elements.controls
        .append('div')
        .classed('ahm-control ahm-control--play-pause', true);
    const inputs = container
        .append('div')
        .classed(`togglebutton ahm-input`, true)
        .attr(
            'title',
            `${
                playPauseData.find((value) => value.action !== this.settings.playPause).label
            } animation.`
        )
        .style('border', '2px solid #333')
        .style('border-radius', '4px')
        .style('background', '#bbb')
        .style('padding', '2px 12px')
        .style('cursor', 'pointer')
        .html(playPauseData.find((value) => value.action !== this.settings.playPause).html);

    inputs.on('click', function(d) {
        if (this.settings.playPause === 'pause') {
            this.settings.playPause = 'play';
            this.heatMap.visitText.interrupt();
            this.heatMap.iris.interrupt();
        } else {
            this.settings.playPause = 'pause';
        }
    });

    return {
        container,
        inputs,
    };
}
