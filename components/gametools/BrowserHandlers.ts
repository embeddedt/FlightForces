import BrowserDetect from '../browserdetect.js';
import InfoBox from './InfoBox';

namespace BrowserHandlers {
    export async function warnUser() {
        if(BrowserDetect.browser === 'Explorer') {
            $(document.body).addClass("this-is-ie");
            let box = new InfoBox("Attention!", "<p>This game is not heavily tested on Internet Explorer and may contain bugs/visual issues.</p>" +
                "<p>Please use a browser such as Pale Moon, Mozilla Firefox, or Google Chrome.</p>", "Continue anyways", 0);
            return new Promise((resolve) => {
                box.once("undisplay", () => resolve());
                box.display();
            });
        }
        return Promise.resolve();
    }
}
export default BrowserHandlers;