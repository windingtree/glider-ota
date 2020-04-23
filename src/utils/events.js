import {config} from "../config/default";

export async function uiEvent(eventName, data) {
    console.log(`UI Event ${eventName}`,data);
}

