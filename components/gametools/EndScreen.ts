import InfoBox from './InfoBox';
import SetBackground from './SetBackground';

export default class EndScreen extends InfoBox {
    constructor(protected endString: string = "You've finished the game!") {
        super("Great work!", "", null);
    }
    async dialogCreated() {
        await super.dialogCreated();
        await new SetBackground(require('../images/fireworks.jpg')).display();
        this.$content.html(`
            <img class="mw-100" src="${require('../images/happy_face.png')}" alt="happy face"/>
            <p></p>
            ${this.endString}
        `);
    }
}