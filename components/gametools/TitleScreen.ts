import InfoBox from './InfoBox';

export class TitleScreen extends InfoBox {
    constructor(protected extraInfo: string = "", protected showHelpHint = true) {
        super(null, "Test", "Start", 0);
    }
    async dialogCreated() {
        await super.dialogCreated();
        this.$content.html(`<h1 class="display-4">Welcome to ${document.title}!</h1>`);
        if(this.showHelpHint) {
            this.$content.append($("<h3 class='d-inline-block'></h3>").append($("<small></small>").addClass("text-muted").html("Need help during the game? Use this button when it appears:")));
            this.$content.append("<button disabled='disabled' class='control-button btn btn-info bs-enabled'><i class='fas fa-question'></i></button>");
        }
        if(this.extraInfo.trim().length > 0) {
            this.$content.append($("<h3 class='d-inline-block'></h3>").append($("<small></small>").addClass("text-muted").html(this.extraInfo)));
        }
        this.$footer.addClass("gt-ts-footer");
    }
}
export default TitleScreen;