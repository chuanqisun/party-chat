import { joinRoom } from "trystero";
import { createController } from "./engine/controller";
import "./style.css";

const config = { appId: "crazy-app-792" };
const joinButton = document.querySelector(`[data-action="join"]`) as HTMLButtonElement;
const videoContainer = document.querySelector(`#video-container`) as HTMLDivElement;
const peerAudios = {} as Record<string, HTMLAudioElement>;
const peerVideos = {} as Record<string, HTMLVideoElement>;

export async function start(name: string) {
  const room = joinRoom(config, name);
  room.onPeerJoin((peerId) => console.log(`${peerId} joined`));
  room.onPeerLeave((peerId) => console.log(`${peerId} left`));
  const selfStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: { max: 400 },
    },
  });
  room.addStream(selfStream);
  room.onPeerJoin((peerId) => room.addStream(selfStream, peerId)); // send stream to peers who join later

  room.onPeerStream((stream, peerId) => {
    const audio = new Audio();
    audio.srcObject = stream;
    audio.autoplay = true;
    peerAudios[peerId] = audio;
  });

  room.onPeerStream((stream, peerId) => {
    let video = peerVideos[peerId];

    // if this peer hasn't sent a stream before, create a video element
    if (!video) {
      video = document.createElement("video");
      video.autoplay = true;

      // add video element to the DOM
      videoContainer.appendChild(video);
    }

    video.srcObject = stream;
    peerVideos[peerId] = video;
  });
}

createController(document.getElementById("app")!);

joinButton.addEventListener("click", () => {
  start("idea-room-01");
});
