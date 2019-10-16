/// <reference types="lodash"/>
/// <reference types="react"/>
/// <reference path="gametools.d.ts"/>

import BrowserDetect from '../browserdetect.js';

namespace GameTools {
    export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<
        T
        >() => T extends Y ? 1 : 2)
        ? true
        : false;
    export const SPEED_HACK: boolean = false;

    export let currentLevel = 0;
    export let lastResult: boolean = false;
    export let lastData: any = null;
    export let helpShown: boolean;
    export let helpRef: React.RefObject<any>;
    export let directLink: string = null;

    export function shuffle<T>(a: T[], shouldShuffle = true): T[] {
        if (!shouldShuffle) return a;
        let j: number, x: T, i: number;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
    export function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    export function getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    export function getRandomArbitrary(min: number, max: number): number {
        let val = Math.random() * (max - min) + min;
        return val;
    }
    export function getRandomArrayMember<T>(a: { [index: number]: T; length: number }): T {
        return a[getRandomInt(0, a.length - 1)];
    }
    export function HSLToHex(h, s, l) {
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
            m = l - c / 2,
            r: string | number = 0,
            g: string | number = 0,
            b: string | number = 0;

        if (0 <= h && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (60 <= h && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (120 <= h && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (180 <= h && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (240 <= h && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else if (300 <= h && h < 360) {
            r = c;
            g = 0;
            b = x;
        }
        // Having obtained RGB, convert channels to hex
        r = Math.round((r + m) * 255).toString(16);
        g = Math.round((g + m) * 255).toString(16);
        b = Math.round((b + m) * 255).toString(16);

        // Prepend 0s, if necessary
        if (r.length == 1) r = "0" + r;
        if (g.length == 1) g = "0" + g;
        if (b.length == 1) b = "0" + b;

        return "#" + r + g + b;
    }
    export function getContrastYIQ(hexcolor) {
        hexcolor = hexcolor.replace("#", "");
        var r = parseInt(hexcolor.substr(0, 2), 16);
        var g = parseInt(hexcolor.substr(2, 2), 16);
        var b = parseInt(hexcolor.substr(4, 2), 16);
        var yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? "black" : "white";
    }
    export function imageAndText(imgSrc: string, text: string): string {
        return "<img src='" + imgSrc + "'></img>" + text;
    }
    export function colorBackground($element) {
        const backColor = HSLToHex(getRandomInt(0, 360), 100, 90);
        $element.css({
            "background-color": backColor,
            color: getContrastYIQ(backColor)
        });
    }
    export function isElement(obj: Node): boolean {
        try {
            //Using W3 DOM2 (works for FF, Opera and Chrome)
            return obj instanceof HTMLElement;
        } catch (e) {
            //Browsers not supporting W3 DOM2 don't have HTMLElement and
            //an exception is thrown and we end up here. Testing some
            //properties that all elements have (works on IE7)
            return (
                typeof obj === "object" &&
                obj.nodeType === 1 &&
                typeof (obj as any).style === "object" &&
                typeof obj.ownerDocument === "object"
            );
        }
    }
    export interface QueryStringsObject {
        [index: string]: string;
    }
    export function getQueryString(query: string): string;
    export function getQueryString(): QueryStringsObject;
    export function getQueryString(query?: string): (string | QueryStringsObject) {
        var key: (string | boolean) = false, res = {}, itm = null;
        // get the query string without the ?
        var qs = location.search.substring(1);
        // check for the key as an argument
        if (query != undefined && query.length > 1)
            key = query;
        // make a regex pattern to grab key/value
        var pattern = /([^&=]+)=([^&]*)/g;
        // loop the items in the query string, either
        // find a match to the argument, or build an object
        // with key/value pairs
        while (itm = pattern.exec(qs)) {
            if (key !== false && decodeURIComponent(itm[1]) === key)
                return decodeURIComponent(itm[2]);
            else if (key === false)
                res[decodeURIComponent(itm[1])] = decodeURIComponent(itm[2]);
        }

        return key === false ? res : null;
    }
    export function notScrollable(element: Element): boolean {
        console.log("scrollHeight: " + element.scrollHeight + " height: " + $(element).height());
        console.log("scrollWidth: " + element.scrollWidth + " width: " + $(element).width());
        if (element.scrollHeight > $(element).height())
            return false;
        if (element.scrollWidth > $(element).width())
            return false;
        return true;
    }
    export function renderBasicTitle(title: string = document.title) {
        var $title = $(".top-title");
        if ($title.get(0) == null) {
            $title = $(`<span class='top-title'>${title}</span>`);
            $("#top-bar").append($title);
        }
        $title.text(title);
    }
    function getElementFontSize(context?: Element): number {
        // Returns a number
        return parseFloat(
            // of the computed font-size, so in px
            getComputedStyle(
                // for the given context
                context ||
                // or the root <html> element
                document.documentElement
            ).fontSize
        );
    }

    export function convertRem(value: number): number {
        return convertEm(value);
    }

    export function convertEm(value: number, context?: Element): number {
        return value * getElementFontSize(context);
    }
    export async function monkeyPatch() {
        ifPropertyPresent(globalThis, "React", (React) => helpRef = React.createRef());
        ifPropertyPresent(window, "jss", (jss) => {
            ifPropertyPresent(window as any, "jssPresetDefault", (jssPresetDefault) => {
                jss.setup(jssPresetDefault());
            });
        });
        directLink = window.location.hash.replace('#', '');
        if (directLink == "") {
            directLink = getQueryString('link');
            if (directLink == null)
                directLink = "";
        }
        console.log("Direct link: " + directLink);
        // Setup our DOM elements
        const $gametools_wrapper = $("<div></div>").attr(
            "id",
            "gametools-wrapper"
        );
        $(document.body).append($gametools_wrapper);
        const topBar = $("<div></div>").attr("id", "top-bar");
        $gametools_wrapper.append(topBar);
        $gametools_wrapper.append(
            $("<div></div>").attr("id", "gametools-container")
        );
        $("#gametools-container").append(
            $("<div></div>")
                .addClass("background-img")
                .attr("id", "bk-im-0")
        );
        $("#gametools-container").append(
            $("<div></div>")
                .addClass("background-img")
                .attr("id", "bk-im-1")
        );
        /*
        moment.updateLocale("en", {
            relativeTime: {
                past: function(input) {
                    return input === "just now" ? input : input + " ago";
                },
                s: "just now",
                future: "in %s",
                ss: "%d seconds",
                m: "1m",
                mm: "%dm",
                h: "1h",
                hh: "%dh",
                d: "1d",
                dd: "%dd",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            }
        });
        */
        if ($.widget != undefined) {
            $.widget("ui.draggable", ($.ui as any).draggable, {
                _mouseStart: function (event) {
                    this._super(event);
                    this.origScroll = this.options.scroll;
                    if (this.cssPosition === "fixed" || this.hasFixedAncestor) {
                        this.options.scroll = false;
                    }
                },

                _mouseStop: function (event) {
                    this._super(event);
                    this.options.scroll = this.origScroll;
                }
            });
        } else {
            console.warn("JQuery UI not present");
        }

        $(document).on("hidden.bs.modal", ".modal", function () {
            $(".modal:visible").length &&
                $(document.body).addClass("modal-open");
        });

        BrowserDetect.init();
        return new Promise((resolve) => {
            $(".preloader").fadeOut(() => {
                $(".preloader").remove();
                resolve();
            });
        });
    }
    export function slugify(string: string): string {
        const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;';
        const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------';
        const p = new RegExp(a.split('').join('|'), 'g');

        return string.toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
            .replace(/&/g, '-and-') // Replace & with 'and'
            .replace(/[^\w\-]+/g, '') // Remove all non-word characters
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    }
    export function classify(ugly: string): string {
        var step1 = ugly.replace(/^[^-_a-zA-Z]+/, '').replace(/^-(?:[-0-9]+)/, '-');
        var step2 = step1 && step1.replace(/[^-_a-zA-Z0-9]+/g, '-');
        return step2;
    }
    export function markdown_img(src: string, alt = "no_alt") {
        return `![${alt}](${src})`;
    }
    export function toDataURI(svg_html: string | SVGElement): string {
        if (svg_html instanceof SVGElement)
            svg_html = svg_html.outerHTML;
        const externalQuotesValue = "double";
        const quotes = getQuotes();
        const symbols = /[\r\n%#()<>?\[\\\]^`{|}]/g;
        function addNameSpace(data) {
            if (data.indexOf('http://www.w3.org/2000/svg') < 0) {
                data = data.replace(/<svg/g, `<svg xmlns=${quotes.level2}http://www.w3.org/2000/svg${quotes.level2}`);
            }

            return data;
        }
        function encodeSVG(data) {
            // Use single quotes instead of double to avoid encoding.
            if (externalQuotesValue === 'double') {
                data = data.replace(/"/g, '\'');
            }
            else {
                data = data.replace(/'/g, '"');
            }

            data = data.replace(/>\s{1,}</g, "><");
            data = data.replace(/\s{2,}/g, " ");

            return data.replace(symbols, encodeURIComponent);
        }


        // Get quotes for levels
        //----------------------------------------

        function getQuotes() {
            const double = `"`;
            const single = `'`;

            return {
                level1: externalQuotesValue === 'double' ? double : single,
                level2: externalQuotesValue === 'double' ? single : double
            };
        }
        return "data:image/svg+xml," + encodeSVG(addNameSpace(svg_html));
    }
    export function patchSVGLayers(svg: SVGElement, visibleLayers?: string[]) {
        if (visibleLayers == undefined || visibleLayers == null || visibleLayers.length == 0)
            return;
        let svgGroups = svg.querySelectorAll('g');
        svgGroups.forEach((group) => {
            let groupMode = group.getAttribute('inkscape:groupmode');
            if (groupMode != "layer")
                return;
            let layerName = group.getAttribute("inkscape:label");
            if (layerName != null && layerName != "") {
                if (visibleLayers.indexOf(layerName) == -1)
                    group.setAttribute("visibility", "hidden");
            }
        });
    }
    export function animateCSS(element: (Element | string), animationName: AnimatableItemAnimation, callback?: () => void): Promise<void> {
        let res, rej;
        const prom: Promise<void> = new Promise((resolve, reject) => {
            res = resolve;
            rej = reject;
        });
        let node: Element;
        function handleAnimationEnd() {
            try {
                node.classList.remove('animated', animationName);
                node.removeEventListener('animationend', handleAnimationEnd);
            } catch (e) {
                rej(e);
            }
            try {
                if (typeof callback === 'function') callback();
            } catch (e) { }
            res();
        }
        try {
            node = (element instanceof Element) ? element : document.querySelector(element);
            node.classList.add('animated', animationName);
            node.addEventListener('animationend', handleAnimationEnd);
        } catch (e) {
            rej(e);
        }

        return prom;
    }
    export function magnify(img: JQuery<HTMLElement>) {
        img.addClass("gt-preview-image mfp-popup-wrapper");
        (img as any).magnificPopup({
            items: {
                src: img.attr("src")
            },
            type: 'image'
        });
    }
    export function caesarShift(str: string, amount: number): string {

        // Wrap the amount
        if (amount < 0)
            return caesarShift(str, amount + 26);

        // Make an output variable
        var output = '';

        // Go through each character
        for (var i = 0; i < str.length; i++) {

            // Get the character we'll be appending
            var c = str[i];

            // If it's a letter...
            if (c.match(/[a-z]/i)) {

                // Get its code
                var code = str.charCodeAt(i);

                // Uppercase letters
                if ((code >= 65) && (code <= 90))
                    c = String.fromCharCode(((code - 65 + amount) % 26) + 65);

                // Lowercase letters
                else if ((code >= 97) && (code <= 122))
                    c = String.fromCharCode(((code - 97 + amount) % 26) + 97);

            }

            // Append
            output += c;

        }

        // All done!
        return output;

    }

    export function stripPunctuation(str: string): string {
        const punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;
        return str.replace(/[.,\/#!$'"%\^&\*;:{}=\-_`~()]/g, "").replace(punctRE, '').replace(/\s{2,}/g, " ").toLowerCase();
    }
    export function codeify(code: string) {
        code = code.toUpperCase();
        return stripPunctuation(code);
    }
    export function appendToArray<T>(array: T[], item: T): T {
        array.push(item);
        return item;
    }

    export function pad(num: number, width: number, z?: string): string {
        z = z || '0';
        if (z.length != 1)
            throw new Error("Third parameter should be exactly one character.");
        let n: string = num + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    type RemoveFirstFromTuple<T extends any[]> =
        T['length'] extends 0 ? undefined :
        (((...b: T) => void) extends (a, ...b: infer I) => void ? I : []);
    export function invokeOn<T, F extends (this: T, ...args: any) => any>(obj: T, fn: F, ...args: Parameters<F>): T {
        fn.call(obj, args);
        return obj;
    }
    export function getRandomBool(): boolean {
        return Math.random() >= 0.5;
    }
    export function replaceAt(str: string, index: number, replacement: string): string {
        return str.substr(0, index) + replacement + str.substr(index + replacement.length);
    }
    export function pl_undef<T, U>(val: T, defaultVal: U, handleNull = false): (T | U) {
        let useDefault = false;
        if (val == undefined)
            useDefault = true;
        else if (handleNull && val == null)
            useDefault = true;
        if (useDefault)
            return defaultVal;
        else
            return val;
    }
    export function isLowerCase(str: string): boolean {
        return str == str.toLowerCase() && str != str.toUpperCase();
    }
    export function showTopBar(show = true): void {
        if (show)
            $("#top-bar").removeClass("hide-top-bar");
        else
            $("#top-bar").addClass("hide-top-bar");
    }
    export function rotateSVGEl(element: SVGGraphicsElement, degrees: number) {
        let box = element.getBBox();
    }
    export function wrapNodes<K extends keyof ElementTagNameMap>(elements: (Node | Node[]), wrapTag: K, ns: "http://www.w3.org/1999/xhtml" | "http://www.w3.org/2000/svg" | string = "http://www.w3.org/1999/xhtml"): ElementTagNameMap[K] {
        const wrapper = document.createElementNS(ns, wrapTag);
        const processElement = (element: Node) => {
            if (element.parentNode != null && element.parentNode != undefined)
                element.parentNode.removeChild(element);
            wrapper.appendChild(element);
        };
        if (Array.isArray(elements))
            elements.forEach(processElement);
        else
            processElement(elements);
        return wrapper as ElementTagNameMap[K];
    }
    export function unCamelCase(str: string): string {
        var test = globalThis._;
        return GameTools.assertProperty(globalThis, "_").capitalize(str.replace(/([A-Z])/g, ' $1').trim());
    }
    export function reCamelCase(str: string): string {
        const _ = GameTools.assertProperty(globalThis, "_");
        return _.upperFirst(_.camelCase(str));
    }
    export function logAndReturn<T>(val: T, logFunc: (val: T) => void = console.log): T {
        logFunc(val);
        return val;
    }
    function returnArgument<T>(val: T): T {
        return val;
    }
    export function assertProperty<T, Z extends keyof T>(obj: T, name: Z): T[Z] {
        const val = ifPropertyPresent(obj, name, undefined, true);
        return val as T[Z];
    }
    export function ifPropertyPresent<T, Z extends keyof T, U = T[Z]>(obj: T, name: Z, fn: (val: T[Z]) => U = returnArgument as any, doThrow = false): (U | false) {
        if ((obj as any)[name] != undefined) {
            return fn((obj as any)[name]);
        } else if (doThrow == undefined || !doThrow)
            return false as any;
        else
            throw new Error(`Property '${name}' does not exist on object '${obj}'`);
    }
    type RectNormalizationType = { top: number; left: number; right: number; bottom: number; width: number; height: number };
    export function normalizeRect<T extends RectNormalizationType>(rect: T): RectNormalizationType {
        var newRect: RectNormalizationType = {
            top: rect.top,
            left: rect.left,
            right: rect.right,
            bottom: rect.bottom,
            width: null,
            height: null
        };
        newRect.width = newRect.right - newRect.left;
        newRect.height = newRect.bottom - newRect.top;
        return newRect;
    }
    export function applyMixins(derivedCtor: any, baseCtors: any[]) {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
            });
        });
    }
    export function isValidReactElement<P>(val: {}): val is React.ReactElement<P> {
        try {
            return GameTools.assertProperty(globalThis, "React").isValidElement(val);
        } catch (e) {
            return false;
        }
    }
    export function animateNumber(start: number, end: number, options: JQuery.EffectsOptions<{ x: number }>): void {
        $({ x: start }).animate({ x: end }, options);
    }
    export const encouragingPhrases: string[] = [
        "YES!",
        "You GOT it!",
        "AWESOME!",
        "GREAT!",
        "GOOD JOB!"
    ];
}

export default GameTools;
