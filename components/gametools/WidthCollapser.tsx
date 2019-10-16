

export class WidthCollapser extends React.Component<{ shown: boolean; }> {
    constructor(props) {
        super(props);
    }
    render() {
        const style = {
            transform: this.props.shown ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "top left"
        };
        return <div className="gt-width-collapser" style={style}>{this.props.children}</div>;
    }
}
export default WidthCollapser;