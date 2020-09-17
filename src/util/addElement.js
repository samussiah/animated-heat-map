export default function addElement(name, parent, tagName = 'div') {
    const element = parent
        .append(tagName)
        .classed(`ahm-${name}`, true)
        .classed(`ahm-${tagName}`, true)
        .classed(`ahm-${name}__${tagName}`, true);

    return element;
}
