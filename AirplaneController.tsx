/// <reference path="./node_modules/react-bootstrap/index.d.ts"/>
import ReactInfoBox from './components/gametools/ReactInfoBox';
import GameTools from './components/gametools/GameTools';
import InfoBox from './components/gametools/InfoBox';
import DisplayedItem from './components/gametools/DisplayedItem';
import SetBackground from './components/gametools/SetBackground';

type PlaneBackgroundAnimatedObject = { theX: number; theY: number };
function ValueCheckpoint(props: {value: number; minimum: number; title: string; unit?: string; }) {
    const reachedMinimum = props.value >= props.minimum;
    return <li className={reachedMinimum ? "checkpoint-reached" : "checkpoint-failed"}>{props.title}: <b>{props.value}/{props.minimum} {props.unit}</b>.</li>;
}
function StateCheckpoint(props: {stateVal: boolean; stateName: string; }) {
    return <li className={props.stateVal ? "checkpoint-reached" : "checkpoint-failed"}>{props.stateName}? <b>{props.stateVal ? "Yes" : "No" }</b>.</li>;
}
class PlaneBackground extends React.Component<{ planeX: number; planeY: number; ySpeed?: number; xSpeed?: number; airplaneComponent: AirplaneComponent; }, { exploded: boolean; }> {
    static defaultProps = {
        ySpeed: 4000
    };
    divRef: React.RefObject<HTMLDivElement>;
    planeRef: React.RefObject<HTMLImageElement>;
    yGaugeRef: React.RefObject<GaugeComponent>;
    xGaugeRef: React.RefObject<GaugeComponent>;
    fireRef: React.RefObject<HTMLDivElement>;
    xObject: { x: number };
    nextXDuration: number;
    xSpeed: number;
    shouldUpdateX: boolean;
    currentXPercentage: number;
    currentYVal: number;
    expectedDuration: number;
    timeoutToReopen: number;
    loopRunning: boolean;
    gaugeUpdateInterval: number;
    currentXTween: Between;
    nextAnimationID: number;
    forceExploded: boolean;
    setNewTitle: boolean;
    badComponent: { ptr: ControlType, type: string };
    revertComponent: { index: number, type: string };
    highestAttainedAltitude: number;
    highestAttainedSpeed; number;
    constructor(props) {
        super(props);
        this.divRef = React.createRef();
        this.planeRef = React.createRef();
        this.yGaugeRef = React.createRef();
        this.xGaugeRef = React.createRef();
        this.fireRef = React.createRef();
        this.xObject = { x: 0 };
        this.xSpeed = this.props.xSpeed;
        this.shouldUpdateX = false;
        this.lastTime = performance.now();
        this.currentXPercentage = 0;
        this.highestAttainedAltitude = 0;
        this.highestAttainedSpeed = 0;
        this.currentYVal = 0;
        this.expectedDuration = -1;
        this.timeoutToReopen = -1;
        this.startXAnimationLoop = this.startXAnimationLoop.bind(this);
        this.updateGauges = this.updateGauges.bind(this);
        this.loopRunning = false;
        this.nextAnimationID = -1;
        this.forceExploded = false;
        this.setNewTitle = false;
        this.state = { exploded: false };
    }
    getMPHSpeed() {
        return Math.round(this.xSpeed / 50);
    }
    getAltitude() {
        return Math.round(600+this.currentYVal);
    }
    updateGauges() {
        const crashed = this.planeHasCrashed()||this.forceExploded;
        const yValue = (crashed ? 0 : this.getAltitude());
        const xValue = (crashed ? 0 : this.getMPHSpeed());
        if(this.yGaugeRef.current != null)
            this.yGaugeRef.current.forceNewValue(yValue);
        if(this.xGaugeRef.current != null)
            this.xGaugeRef.current.forceNewValue(xValue);
    }
    startLoops() {
        if(this.loopRunning) {
            throw new Error("Invalid invariant: loops should not run twice!!");
        }
        this.loopRunning = true;
        this.gaugeUpdateInterval = window.setInterval(this.updateGauges, 100);
        this.startXAnimationLoop(0);
    }
    updateDiv() {
        this.divRef.current.style.transform = `translate3d(${this.currentXPercentage}%, ${this.currentYVal * 0.003}%, 0)`;
    }
    lastTime: number;
    triggerCheckpointDialog() {
        if(this.timeoutToReopen == -1 && this.expectedDuration != -1) {
            this.expectedDuration = -1;
            /* Update the gauges one last time to be sure that the user sees the final number */
            this.forceGaugeUpdate();
            this.timeoutToReopen = window.setTimeout(async() => {
                this.timeoutToReopen = -1;
                const didCrash = this.planeHasCrashed()||this.forceExploded;
                /* Update the "Highest attained" values */
                if(!didCrash) {
                    this.highestAttainedAltitude = Math.max(this.highestAttainedAltitude, this.getAltitude());
                    this.highestAttainedSpeed = Math.max(this.highestAttainedSpeed, this.getMPHSpeed());
                }
                /* HAX */
                this.highestAttainedSpeed = 500;
                this.highestAttainedAltitude = 30000;
                const _self =this;
                let finishedGame = true;
                if(this.highestAttainedAltitude < 30000)
                    finishedGame = false;
                else if(this.highestAttainedSpeed < 500)
                    finishedGame = false;
                else if(didCrash)
                    finishedGame = false;
                await new class extends InfoBox {
                    buttonCallback(e: JQuery.ClickEvent) {
                        super.buttonCallback(e);
                        if(finishedGame)
                            _self.props.airplaneComponent.props.displayedItem.displayNext();
                    }
                }("Test Summary", <div>
                    Here's a breakdown of how well your plane fared.
                    <br/>
                    You've succeeded once all these checkpoints are green.
                    <p></p>
                    <ul className="gt-ul-left-centered gt-ul-custom-bullet">
                    <StateCheckpoint stateVal={!didCrash} stateName="Remained airborne"/>
                    <ValueCheckpoint value={this.highestAttainedAltitude} minimum={30000} title="Highest altitude safely attained thus far" unit="ft"/>
                    <ValueCheckpoint value={this.highestAttainedSpeed} minimum={500} title="Highest speed safely attained thus far" unit="mph"/>
                </ul>
                <p></p>
                {didCrash ? "The Department of Transportation is considering whether they will fire you or not." : null}
                <p></p>
                Remember, not all of these components work well with one another. Some components may appear to be useless in one
                combination but may work better in another one. You have to experiment and see what works well with what.
                <p></p>
                Also, it's difficult to maintain high speed and high altitude at the same time. Work toward attaining one of them first,
                then try to attain the other one. The game will remember what you previously achieved.
                </div>).display();
                new SetBackground(require('./customizations/factory.svg')).display();
                this.props.airplaneComponent.setState({ open: true, customTitle: null });
                if(didCrash) {
                    console.log("Reset parameters");
                    /* With the values now handed to the checkpoint dialog, reset the plane's state */
                    this.currentYVal = 0; /* put it back in the sky */
                    this.xSpeed = 3000; /* give it a reasonable speed */
                    this.forceExploded = false;
                    this.setNewTitle = false;
                    this.badComponent = null;
                    this.props.airplaneComponent.currentConfigs[this.revertComponent.type] = this.revertComponent.index;
                    this.props.airplaneComponent.forceUpdate();
                    this.revertComponent = null;
                    this.setState({ exploded: false });
                } else
                    console.log("Plane did not crash");
            }, 3000);
        }
    }

    stopTween() {
        if(this.currentXTween != null) {
            this.currentXTween.pause();
            this.currentXTween = null;
            console.log("Steep tween");
        }
    }
    stopLoops() {
        this.loopRunning = false;
        if(this.nextAnimationID != -1) {
            window.cancelAnimationFrame(this.nextAnimationID);
            this.nextAnimationID = -1;
        }
        this.stopTween();
        window.clearInterval(this.gaugeUpdateInterval);
    }
    forceGaugeUpdate() {
        setTimeout(this.updateGauges, 0);
    }
    crashPlane() {
        /* Stop incrementing the speed. Crashed planes don't fly. */
        this.stopLoops();
        this.currentYVal = -600;
        this.setState({ exploded: true });
        /* Show 0 on the gauges */
        this.forceGaugeUpdate();
        /* TODO: trigger checkpoint */
        this.triggerCheckpointDialog();
    }
    planeHasCrashed(): boolean {
        return this.currentYVal <= -600;
    }
    startXAnimationLoop(time: number) {
        if(time > 0) {
            time -= this.lastTime;
            this.lastTime += time;
        }
        if(this.shouldUpdateX) {
            if(time > 0) {
                if(!this.planeHasCrashed()) {
                    /* Decrement the X percentage by the appropriate amount for this timeframe */
                    const deltaTime = ((this.xSpeed)/time);
                    const deltaX = (deltaTime/200);
                    if(this.currentXPercentage > -100) {
                        this.currentXPercentage -= deltaX;
                        if(this.currentXPercentage < -100) {
                            this.currentXPercentage = 0;
                        }
                    } else {
                        this.currentXPercentage = 0;
                    }
                    const signed_diff = this.currentYVal - this.props.planeY;
                    const diff = Math.abs(signed_diff);
                    const tooMuchForce = this.tooMuchForce()||this.forceExploded;
                    const isStalling = (this.getMPHSpeed() <= 30||tooMuchForce);
                    if(isStalling && !this.setNewTitle) {
                        this.setNewTitle = true;
                        setTimeout(() => {
                            if(tooMuchForce)
                                this.props.airplaneComponent.forceSetTitle(`The ${this.badComponent.ptr.title} can't handle the speed!`);
                            else
                                this.props.airplaneComponent.forceSetTitle("The plane is stalling!");
                        }, 0);
                    }
                    let sign;
                    if(isStalling) {
                        sign = (tooMuchForce ? 6 : 1);
                    } else if(diff >= 4)
                        sign = Math.sign(signed_diff);
                    else
                        sign = 0;
                    let deltaY = (sign * (this.expectedDuration/time))/50;
                    if(tooMuchForce && !this.forceExploded) {
                        this.forceExploded = true;
                        this.setState({ exploded: true });
                        /* Tween the Y value upwards to give the impression that the plane exploded */
                        new Between(this.currentYVal, this.currentYVal + 6000).time(1000).easing(Between.Easing.Cubic.Out).on('update', (val) => this.currentYVal = val);
                        /* Abort the X tween */
                        this.stopTween();
                        /* Update the gauges */
                        this.forceGaugeUpdate();
                    }
                    if(isStalling && !tooMuchForce) {
                        deltaY *= (30-this.getMPHSpeed())/4;
                    }
                    this.currentYVal -= deltaY;
                    const yCloseEnough = diff < Math.abs(deltaY) || diff < 4;
                    if(yCloseEnough && !isStalling)
                        this.currentYVal = this.props.planeY;
                    const xCloseEnough = Math.abs(this.xSpeed-this.props.xSpeed) < 4;
                    if(yCloseEnough && !isStalling && xCloseEnough) {
                        this.xSpeed = this.props.xSpeed;
                        this.stopTween();
                        this.triggerCheckpointDialog();
                    }
                    this.updateDiv();
                } else {
                    this.crashPlane();
                    this.props.airplaneComponent.forceSetTitle("The plane crashed!");
                    setTimeout(function() {
                        new SetBackground(require('./customizations/smoke.jpg')).display();
                    }, 0);
                    return; /* don't continue animating */
                }
            }
            this.nextAnimationID = requestAnimationFrame(this.startXAnimationLoop);
        } else {
            this.stopLoops();
        }
    }
    tooMuchForce(): boolean {
        const speedMPH = this.getMPHSpeed();
        for(const componentType of Object.keys(AirplaneComponent.controlsArray)) {
            const component: ControlType = AirplaneComponent.controlsArray[componentType][this.props.airplaneComponent.currentConfigs[componentType]];
            if(speedMPH > component.maxSpeedMPH) {
                this.badComponent = { ptr: component, type: componentType} ;
                return true;
            }
        }
        return false;
    }
    componentDidMount() {
        /* Begin animation loop */
        this.shouldUpdateX = true;
    }
    componentWillUnmount() {
        console.log("Abort");
        this.shouldUpdateX = false;
    }
    componentDidUpdate() {
        this.xObject.x = 0;
        this.shouldUpdateX = true;
        if(this.xSpeed != this.props.xSpeed && this.loopRunning) {
            if(this.currentXTween == null) {
                console.log("Tween from " + this.xSpeed + " to " + this.props.xSpeed);
                this.currentXTween = new Between(this.xSpeed, this.props.xSpeed)
                    .time(this.expectedDuration / 2)
                    .on('update', (value) => this.xSpeed = value);
            }
        }
    }
    render() {
        let fireParticles = [];
        for(var i = 0; i < 20; i++){
            fireParticles.push(<div className="particle"></div>);
        }
        return <><div className="container">
            <div className="row">
                <div className="col d-inline-flex justify-content-center">
                    <GaugeComponent ref={this.xGaugeRef} value={0} min={0} max={500} label="mph" title="Speed" />
                </div>
                <div className="col d-inline-flex justify-content-center">
                    <GaugeComponent ref={this.yGaugeRef} value={0} min={0} max={30000} label="ft" title="Altitude" />
                </div>
            </div>
        </div>
            <div className="has-plane">
                <div className="plane-area" ref={this.divRef}></div>
                <div className="plane"><img src={require('./airliner.png')} alt="plane" ref={this.planeRef}></img><div className="fire plane-fire" ref={this.fireRef} style={{ display: this.state.exploded ? null : 'none'}}>
                    {fireParticles}
                </div></div>
            </div></>;
    }
}
interface ControlType {
    image?: string;
    title: string;
    description?: string;
    heightFactor: number;
    speedFactor: number;
    maxSpeedMPH?: number;
}
class GaugeComponent extends React.Component<any, { value: number; }> {
    static lastGaugeId = 0;
    gaugeRef: React.RefObject<HTMLDivElement>;
    gaugeClass: JustGage;
    constructor(props) {
        super(props);
        this.gaugeRef = React.createRef();
        this.state = { value: 0 };
    }
    createGauge() {
        const id = $(this.gaugeRef.current).attr("id");
        const config = Object.assign({}, this.props, {
            children: null,
            id: id,
            startAnimationTime: 0,
            refreshAnimationTime: 0
        });
        this.gaugeClass = new JustGage(config);
    }
    componentDidMount() {
        this.createGauge();
    }
    componentDidUpdate() {
        if(parseInt(this.gaugeClass.config.value) != this.state.value)
            this.gaugeClass.refresh(this.state.value);
    }
    forceNewValue(newVal: number) {
        if(newVal != parseInt(this.gaugeClass.config.value))
            this.gaugeClass.refresh(newVal);
    }
    render() {
        return <div className="gt-base-gauge" ref={this.gaugeRef} id={`gauge-component-${GaugeComponent.lastGaugeId++}`}></div>
    }
}
class AirplaneComponent extends React.Component<{ displayedItem: DisplayedItem; }, { open: boolean; planeX: number; planeY: number; ySpeed: number; xSpeed: number; customTitle: string; }> {
    public static readonly HARDCODED_DURATION = 20000;
    static readonly controlsArray = {
        "Type of wing (lift)": [
            {
                image: require('./customizations/bleriot.JPG'), title: "Blériot wing", description: `
                This is a smaller type of wing.
                <p>
                It creates less lift than a larger wing, but also has less drag as a result of taking up less space.`, speedFactor: 0, heightFactor: 1000, maxSpeedMPH: 350
            },
            {
                image: require('./customizations/dc-3.jpg'), title: "DC-3 wing", description: `
                Larger than the Blériot wing, the DC-3 has better lift thanks to its increased surface area, but will
                cause more drag on your plane.
            `, speedFactor: -1000, heightFactor: 6000
            },
            {
                image: require('./customizations/f-86.jpg'), title: "F-86 wing", description: `
                A swept wing like this one doesn't generate as much lift, so you won't fly as high.
                <p>
                However, it significantly reduces drag, increasing your speed.
                <p>
                The resulting increase in speed will make your plane fly higher.
            `, speedFactor: 2000, heightFactor: 7000
            },
            {
                image: require('./customizations/x-15.jpg'), title: "X-15 wing", description: `
                This wing has a very low surface area, so it will not lift your plane nearly as much.
                <p>
                However, it should also have a lower drag.
                <p>
                The resulting increase in speed will make your plane fly higher.
            `, speedFactor: 7000, heightFactor: 0
            },
        ],
        "Type of fuselage (drag)": [
            {
                image: require('./customizations/bleriot.JPG'), title: "Blériot fuselage", description: `
                Lightweight but weak.
            `, speedFactor: 0, heightFactor: 0, maxSpeedMPH: 250
            },
            {
                image: require('./customizations/spitfire.jpg'), title: "Spitfire fuselage", description: `
                This fuselage is enclosed and aerodynamic, yielding significant increases in speed.
                <p>
                As a result of the increased speed, a plane with this should also gain altitude.
            `, speedFactor: 0, heightFactor: 3000
            },
            {
                image: require('./customizations/x-15.jpg'), title: "X-15 fuselage", description: `
                The X-15 fuselage is the most aerodynamic of the three. It has similar benefits to
                the Spitfire.
            `, speedFactor: 0, heightFactor: 9000
            }
        ],
        "Type of engine (thrust)": [
            {
                image: require('./customizations/piston.jpg'), title: "Piston", description: `
                The standard, stereotypical propeller. It's not particularly great for speed, but
                it's also not that heavy.
            `, speedFactor: 0, heightFactor: 0
            },
            {
                image: require('./customizations/jet.jpg'), title: "Jet", description: `
                You would typically find this on a commercial airliner. It's somewhat fuel-efficient
                and reasonably fast.
            `, speedFactor: 6000, heightFactor: 10000
            },
            {
                image: require('./customizations/rocket.jpg'), title: "Rocket", description: `
                The most powerful of the three engines. It's very fast but also quite heavy. Not recommended
                for slower or weaker designs.
            `, speedFactor: 12000, heightFactor: 7000
            }
        ],
        "Type of material (weight)": [
            {
                image: require('./customizations/wood.jpg'), title: "Wood", description: `
                Wood is reasonably strong and somewhat lightweight, but you need a good supply of it
                to build a sturdy plane. That means that your plane will weigh more if you use it.
            `, speedFactor: 0, heightFactor: 0, maxSpeedMPH: 300
            },
            {
                image: require('./customizations/aluminum.jpg'), title: "Aluminum", description: `
                This is lighter and stronger than wood, so you don't need as much of it to make an aircraft.
                <p>
                The resulting reduction in material will lower your plane's weight and make it fly
                higher.
            `, speedFactor: 5000, heightFactor: 3000
            },
            {
                image: require('./customizations/carbonfibers.jpg'), title: "Carbon fibers", description: `
                Composite materials (e.g. carbon fibers) are very strong given their weight, so you need
                a significantly lower amount of material to make an aircraft.
                <p>
                This will significantly increase the height that your plane flies.
            `, speedFactor: 70, heightFactor: 6000
            }
        ]
    };
    currentConfigs: {
        [P in keyof typeof AirplaneComponent.controlsArray]: number;
    };
    planeRef: React.RefObject<HTMLImageElement>;
    backgroundRef: React.RefObject<PlaneBackground>;
    titleRef: React.RefObject<any>;
    constructor(props) {
        super(props);
        this.state = { open: false, planeX: 0, planeY: 0, ySpeed: 1000, xSpeed: 3000, customTitle: null };
        this.planeRef = React.createRef();
        this.backgroundRef = React.createRef();
        this.titleRef = React.createRef();
        this.currentConfigs = {} as any;
        for (const keyName of Object.keys(AirplaneComponent.controlsArray)) {
            this.currentConfigs[keyName] = 0;
        }
    }
    public movePlaneIntoView() {
        this.backgroundRef.current.shouldUpdateX = !this.state.open;
        if(this.backgroundRef.current.shouldUpdateX && !this.backgroundRef.current.loopRunning) {
            this.backgroundRef.current.startLoops();
        }
    }
    componentDidMount() {
        this.movePlaneIntoView();
    }
    componentDidUpdate() {
        this.movePlaneIntoView();
    }
    forceSetTitle(newTitle: string) {
        $(this.titleRef.current as HTMLElement).text(newTitle);
    }
    onChangeAirplaneConfig(e: Event) {
        console.log("On Change");
        $(e.currentTarget).blur();
        const $input = $(e.currentTarget).find("input");
        const newIndex = parseInt($input.attr("data-index2"));
        const newConfigType = $input.attr("data-index1");
        const oldIndex = this.currentConfigs[newConfigType];
        this.currentConfigs[newConfigType] = newIndex;
        this.backgroundRef.current.revertComponent = { index: oldIndex, type: newConfigType };
        console.log("New index for " + newConfigType + " is " + newIndex);
        /* Figure out our new ySpeed */
        var yPos = -1000;
        var xSpeed = 3000;
        for (const keyName of Object.keys(AirplaneComponent.controlsArray)) {
            const type: ControlType[] = AirplaneComponent.controlsArray[keyName];
            console.log("Selected index " + this.currentConfigs[keyName] + " for " + keyName);
            const contributor = type[this.currentConfigs[keyName]];
            console.log("contributor " + contributor.title + " contributes x factor of " + contributor.speedFactor + " and y factor of " + contributor.heightFactor);
            yPos += contributor.heightFactor;
            xSpeed += contributor.speedFactor;
        }
        if(xSpeed < 0)
            xSpeed = 0; /* Plane is gonna stall!! */
        console.log(yPos);
        console.log(xSpeed);
        new SetBackground(require('./components/images/wide_sky.jpg')).display();
        this.setState({ open: false });
        setTimeout(() => {
            
            this.backgroundRef.current.expectedDuration = AirplaneComponent.HARDCODED_DURATION;
            this.setState({ open: false, planeY: yPos, ySpeed: 4000, xSpeed: xSpeed });
        }, 3000); 
        /* Will be re-opened by PlaneBackground */
    }
    render() {
        const { Modal, Tabs, Tab } = GameTools.assertProperty(window, "ReactBootstrap");
        return <div className={`modal-content`}>
            <Modal.Header closeButton>
                <Modal.Title as="h5" ref={this.titleRef}>{this.state.customTitle != null ? this.state.customTitle : (!this.state.open ? "Observe the plane in motion." : "Change the plane's configuration!")}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div style={{ display: this.state.open ? null : 'none'}}>
                    <Tabs id="airplane-controls">
                        {Object.keys(AirplaneComponent.controlsArray).map((item) => <Tab data-toggle="buttons" className="btn-group-toggle" title={item} eventKey={item.toLowerCase()}>
                            {typeof AirplaneComponent.controlsArray[item] != 'undefined' ? AirplaneComponent.controlsArray[item].map((control, index2) => <label onClick={this.onChangeAirplaneConfig.bind(this)} className={"gt-airplane-select-option btn btn-secondary my-3 w-100" + ((this.currentConfigs[item] == index2) ? " active" : "")}>
                                <input type="radio" name={GameTools.slugify(item) + "-type"} checked={this.currentConfigs[item] == index2 ? true : null} data-index1={item} data-index2={index2}></input>
                                <div className="row no-gutters">
                                    <div className="col-sm-4 d-flex flex-column justify-content-center">
                                        <img src={control.image} className="card-img" alt="Image"></img>
                                    </div>
                                    <div className="col-sm-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{control.title}</h5>
                                            <span className="card-text" dangerouslySetInnerHTML={{ __html: control.description }}></span>
                                        </div>
                                    </div>
                                </div>
                            </label>) : 'No customization is available for this component.'}
                        </Tab>)}
                    </Tabs>
                </div>
                <div style={{ display: !this.state.open ? null : 'none'}}>
                    <PlaneBackground airplaneComponent={this} ref={this.backgroundRef} planeX={this.state.planeX} planeY={this.state.planeY} ySpeed={this.state.ySpeed} xSpeed={this.state.xSpeed} />
                </div>
            </Modal.Body>
        </div>;
    }
}
export class AirplaneController extends ReactInfoBox {
    airplane: React.RefObject<AirplaneComponent>;
    currentYIdea: number = 0;
    constructor() {

        super(null);

        this.airplane = React.createRef();
        this.jsxElement = <AirplaneComponent displayedItem={this} ref={this.airplane} />;
    }
    testPlane() {
        if (this.currentYIdea == 0)
            this.currentYIdea = -800;
        else
            this.currentYIdea = 0;
        setTimeout(() => {
            this.airplane.current.setState({ open: false, planeY: this.currentYIdea, ySpeed: 4000, xSpeed: 3000 });
            this.testPlane();
        }, 5000);
    }
    async dialogCreated() {
        await super.dialogCreated();
        this.$dialog.find(".modal-dialog").removeClass("modal-xl");
        this.$dialog.find(".close").remove();
        this.$dialog.find(".modal-body").css("text-align", "left");
        new SetBackground(require('./customizations/factory.svg')).display();
        this.airplane.current.setState({ open: true });
        //this.testPlane();
    }
}
export default AirplaneController;