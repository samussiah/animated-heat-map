export default function getDimensions(containers) {
    this.settings.width = containers.main.node().clientWidth;
    this.settings.height = (this.settings.width / 16) * 9;
    this.settings.radius = this.settings.height/2;
    this.settings.innerRadius = this.settings.height/8;
    this.settings.outerRadius = this.settings.height/2;
    this.settings.outerWidth = this.settings.width - this.settings.height;
}
