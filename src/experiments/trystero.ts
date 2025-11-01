import { BehaviorSubject } from "rxjs";
import { joinRoom } from "trystero";

const config = { appId: "crazy-app-792" };
const joinButton = document.querySelector(`[data-action="join"]`) as HTMLButtonElement;
const videoContainer = document.querySelector(`#video-container`) as HTMLDivElement;
const peerAudios = new BehaviorSubject({} as Record<string, HTMLAudioElement>);
const peerVideos = new BehaviorSubject({} as Record<string, HTMLVideoElement>);

export async function start(name: string) {
  const room = joinRoom(config, name);
  room.onPeerJoin((peerId) => console.log(`${peerId} joined`));
  room.onPeerLeave((peerId) => console.log(`${peerId} left`));
  const selfStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: { max: 120 },
    },
  });
  room.addStream(selfStream);
  room.onPeerJoin((peerId) => room.addStream(selfStream, peerId)); // send stream to peers who join later
  room.onPeerLeave((peerId) => {
    const audio = peerAudios.getValue()[peerId];
    if (audio) {
      audio.pause();
      const mutable = peerAudios.getValue();
      delete mutable[peerId];
      peerAudios.next({ ...mutable });
    }

    const video = peerVideos.getValue()[peerId];
    if (video) {
      video.pause();
      videoContainer.removeChild(video);
      const mutable = peerVideos.getValue();
      delete mutable[peerId];
      peerVideos.next({ ...mutable });
    }
  });

  room.onPeerStream((stream, peerId) => {
    const audio = new Audio();
    audio.srcObject = stream;
    audio.autoplay = true;
    peerAudios.next({ ...peerAudios.getValue(), [peerId]: audio });
  });

  room.onPeerStream((stream, peerId) => {
    let video = peerVideos.getValue()[peerId];

    if (!video) {
      video = document.createElement("video");
      video.autoplay = true;
      videoContainer.appendChild(video);
    }

    video.srcObject = stream;
    peerVideos.next({ ...peerVideos.getValue(), [peerId]: video });
  });
}
joinButton.addEventListener("click", () => {
  start("idea-room-01");
});
