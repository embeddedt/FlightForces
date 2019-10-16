
import GameTools from './components/gametools/GameTools';
import { initializeArray, startDisplay } from './components/gametools/DisplayedItem';
import TitleScreen from './components/gametools/TitleScreen';
import AirplaneController from './AirplaneController';
import EndScreen from './components/gametools/EndScreen';

let myArray = [
    new TitleScreen("In this game, you'll be able to build and customize a plane, trying to reach a height and speed goal.", false),
    new AirplaneController(),
    new EndScreen()
];

$(async function() {
    await GameTools.monkeyPatch();
    
    GameTools.renderBasicTitle();
    
    initializeArray(myArray);
    startDisplay(myArray);
});
