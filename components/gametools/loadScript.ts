function loadScript(src: string): Promise<Event> {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length; i--;) {
        if (scripts[i].src == src) return Promise.resolve(null);
    }
    return new Promise(function (resolve, reject) {
        var s: HTMLScriptElement;
        s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}
export default loadScript;