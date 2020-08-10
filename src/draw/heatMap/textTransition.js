export default function textTransition(visitText, text) {
    const transition = visitText
        .transition()
        //.delay(2000)
        .duration(this.settings.duration)
        .text(text);

    return transition;
}
