declare interface JQuery {
    randomize(childElem: string): JQuery;
    equals(otherElement: JQuery): boolean;
    sortElements(comp: (a: Element, b: Element) => number, getSortable?: () => Element): JQuery;
}

declare type AnimatableItemAnimation = "bounce"|"flash"|"pulse"|"rubberBand"|"shake"|"headShake"|"swing"|"tada"|"wobble"|"jello"|"bounceIn"|"bounceInDown"|"bounceInLeft"|"bounceInRight"|"bounceInUp"|"bounceOut"|"bounceOutDown"|"bounceOutLeft"|"bounceOutRight"|"bounceOutUp"|"fadeIn"|"fadeInDown"|"fadeInDownBig"|"fadeInLeft"|"fadeInLeftBig"|"fadeInRight"|"fadeInRightBig"|"fadeInUp"|"fadeInUpBig"|"fadeOut"|"fadeOutDown"|"fadeOutDownBig"|"fadeOutLeft"|"fadeOutLeftBig"|"fadeOutRight"|"fadeOutRightBig"|"fadeOutUp"|"fadeOutUpBig"|"flipInX"|"flipInY"|"flipOutX"|"flipOutY"|"lightSpeedIn"|"lightSpeedOut"|"rotateIn"|"rotateInDownLeft"|"rotateInDownRight"|"rotateInUpLeft"|"rotateInUpRight"|"rotateOut"|"rotateOutDownLeft"|"rotateOutDownRight"|"rotateOutUpLeft"|"rotateOutUpRight"|"hinge"|"jackInTheBox"|"rollIn"|"rollOut"|"zoomIn"|"zoomInDown"|"zoomInLeft"|"zoomInRight"|"zoomInUp"|"zoomOut"|"zoomOutDown"|"zoomOutLeft"|"zoomOutRight"|"zoomOutUp"|"slideInDown"|"slideInLeft"|"slideInRight"|"slideInUp"|"slideOutDown"|"slideOutLeft"|"slideOutRight"|"slideOutUp";

declare type ResponsiveVoiceVoice = "UK English Female"|"UK English Male"|"US English Female"|"US English Male"|"Spanish Female"|"Spanish Male"|"French Female"|"French Male"|"German Female"|"German Male"|"Italian Female"|"Italian male"|"Greek Female"|"Greek Male"|"Hungarian Female"|"Hungarian Male"|"Turkish Female"|"Turkish Male"|"Russian Female"|"Russian Male"|"Dutch Female"|"Dutch Male"|"Swedish Female"|"Swedish Male"|"Norwegian Female"|"Norwegian male"|"Japanese Female"|"Japanese Male"|"Korean Female"|"Korean Male"|"Chinese Female"|"Chinese Male"|"Chinese (Hong Kong) Female"|"Chinese (Hong Kong) Male"|"Chinese Taiwan Female"|"Chinese Taiwan Male"|"Hindi Female"|"Hindi Male"|"Serbian Male"|"Serbian Female"|"Croatian Male"|"Croatian Female"|"Bosnian Male"|"Bosnian Female"|"Romanian Male"|"Romanian Female"|"Catalan Male"|"Australian Female"|"Australian Male"|"Finnish Female"|"Finnish Male"|"Afrikaans Male"|"Albanian Male"|"Arabic Male"|"Arabic Female"|"Armenian Male"|"Czech Female"|"Czeck Male"|"Danish Female"|"Danish Male"|"Esperanto Male"|"Hatian Creole Female(no longer supported)"|"Icelandic Male"|"Indonesian Female"|"Indonesian Male"|"Latin Female"|"Latin Male"|"Latvian Male"|"Macedonian Male"|"Moldavian Male"|"Montenegrin Male"|"Polish Female"|"Polish Male"|"Brazilian Portuguese Female"|"Brazilian Portugese Male"|"Portuguese Female"|"Portugese Male"|"Serbo-Croatian Male"|"Slovak Female"|"Slovak Male"|"Spanish Latin American Female"|"Spanish Latin American Male"|"Swahili Male"|"Tamil Male"|"Thai Female"|"Vietnamese Male"|"Vietnamese Female"|"Welsh Male";
declare interface ResponsiveVoiceSpeechOptions {
    pitch?: number;
    rate?: number;
    volume?: number; 
    onstart?: () => void;
    onend?: () => void;
}
declare interface ResponsiveVoiceReplacementObject {
    searchvalue: string|RegExp;
    newvalue: string;
    collectionvoices?: (ResponsiveVoiceVoice|ResponsiveVoiceVoice[]);
    systemvoices?: (string|string[]);
}
declare interface ResponsiveVoice {
    speak(text: string, voice?: ResponsiveVoiceVoice, params?: ResponsiveVoiceSpeechOptions): void;
    cancel(): void;
    voiceSupport(): boolean;
    getVoices(): string[];
    setDefaultVoice(voice: ResponsiveVoiceVoice): void;
    isPlaying(): boolean;
    pause(): void;
    resume(): void;
    setTextReplacements(replacements: Array<ResponsiveVoiceReplacementObject>): void;
    enableWindowClickHook(): void;
    enableEstimationTimeout: boolean;
}

declare class JustGage {
    config: any;
    constructor(options: any);
    refresh(val: any, max?: any, config?: any);
}

declare class Between {
    constructor(from: any, to: any);
    time(duration: number): this; // Set duration
    loop(mode: string, repeatTimes?: number): this; // Set loop mode, if "repeatTimes" is falsy, treats as "endless"
    easing(fn: (x: number) => number): this; // Set easing function
    on(eventName: 'update'|'start'|'pause'|'play'|'complete', cb: (value: number) => void): this; // Add event listener
    pause(): this; // Pauses
    play(): this; // Resumes
    get isPaused(): boolean; // returns true if paused
    static Easing: any;
}



declare interface Window {
    responsiveVoice: ResponsiveVoice;
    jss: import("jss").JSS;
    ReactBootstrap: typeof import("react-bootstrap");
    "rc-tabs": any;
}
/*
declare namespace React {
    interface ReactElement<P = any, T extends string | import('react').JSXElementConstructor<any> = string | import('react').JSXElementConstructor<any>> {
        gametools_val: {};
    }
}
*/
