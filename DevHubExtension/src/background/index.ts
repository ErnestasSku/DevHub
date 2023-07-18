import { storage } from "../storage";
import { handleContentRequest } from "./contentActionHandler";

// console.log("Hello from background script");

// chrome.runtime.onInstalled.addListener(() => {
//     storage.get().then(console.log);
// });




chrome.runtime.onMessage.addListener(handleContentRequest);