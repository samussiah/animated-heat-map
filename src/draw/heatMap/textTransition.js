export default function textTransition(visitText, text) {
    const transition = visitText
        .transition()
        //.delay(2000)
        .duration(2000)
        .text(text);

    return transition;
}
