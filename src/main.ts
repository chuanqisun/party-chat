import PartySocket from "partysocket";
import { createController } from "./engine/controller";
import "./style.css";

const partySocket = new PartySocket({
  host: import.meta.env.VITE_PARTY_KIT_HOST,
  room: "my-room",
});

partySocket.send("Hello everyone");

partySocket.addEventListener("message", (e) => {
  console.log(e.data);
});

createController(document.getElementById("app")!);
