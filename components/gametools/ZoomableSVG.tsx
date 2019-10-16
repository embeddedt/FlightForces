import React from 'react';
import GameTools from './GameTools';

import 'magnific-popup';

import 'magnific-popup/dist/magnific-popup.css';

type BaseZoomableProps = { visibleLayers?: string[]; extraClasses?: string; style?: React.CSSProperties; onSvgRendered?: (svg: SVGSVGElement) => void; };
type SrcZoomableProps = { src: string; svg_html?: never; };
type XMLZoomableProps = { svg_html: string; src?: never; };
export type ZoomableProps = BaseZoomableProps&(SrcZoomableProps|XMLZoomableProps);
export class ZoomableSVG extends React.Component<ZoomableProps, {svg_html: string; }> {
    imgRef: React.RefObject<HTMLDivElement>;
    constructor(props: ZoomableProps) {
        super(props);
        this.state = { svg_html: GameTools.pl_undef(props.svg_html, null) };
        this.imgRef = React.createRef();
    }
    makeMagnific(img, add = true) {
        if(img == null)
            return;
        if(add) {
            let svg = $(img).find("svg").get(0) as SVGSVGElement;
            
            if(this.props.onSvgRendered != undefined && this.props.onSvgRendered != null) {
                try {
                    this.props.onSvgRendered(svg);
                } catch(e) {
                    console.error(e);
                }
            }
            GameTools.patchSVGLayers(svg, this.props.visibleLayers);
            try {
                let str = new XMLSerializer().serializeToString(svg);
                console.log("Successfully serialized");
                let deserialized = new DOMParser().parseFromString(str, "text/xml");
                console.log("Successfully deserialized");
            } catch(e) {
                /* Probably IE having a fit */
                console.log("Detected SVG load failure, bailing");
                $(img).removeClass("gt-preview-image gt-svg-preview-image mfp-popup-wrapper");
                return;
            }
            const uri = GameTools.toDataURI($(img).html());
            ($(img) as any).magnificPopup({
                items: {
                    src: uri
                },
                type: 'image'
            });
        } else {
            $(img).off('click');
            $(img).removeData('magnificPopup');
        }
        
    }
    componentDidMount() {
        this.makeMagnific(this.imgRef.current);
    }
    componentWillUnmount() {
        this.makeMagnific(this.imgRef.current, false);
    }
    componentDidUpdate() {
        this.makeMagnific(this.imgRef.current);
    }
    render() {
        if(this.state.svg_html != undefined && this.state.svg_html != null)
            return <div style={this.props.style} ref={this.imgRef}
                className={"gt-preview-image gt-svg-preview-image mfp-popup-wrapper " + (this.props.extraClasses == undefined ? "" : this.props.extraClasses)}
                dangerouslySetInnerHTML={{ __html: this.state.svg_html}}></div>;
        else {
            $.get(this.props.src, (data) => {
                this.setState({ svg_html: data });
            }, "text");
            return null;
        }
    }
}
export default ZoomableSVG;