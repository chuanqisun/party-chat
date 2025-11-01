import { html, render } from "lit-html";
import { repeat } from "lit-html/directives/repeat.js";
import { BehaviorSubject, map } from "rxjs";
import { observe } from "./observe-directive";
import type { Model } from "./types";
import "./view.css";

export function startView(container: HTMLElement, model$: BehaviorSubject<Model>) {
  const view$ = model$.pipe(
    map((model) => {
      const view = html`
        <div class="canvas">
          ${repeat(
            model.objects,
            (object) => object.id,
            (object) => html` <div class="object" style="--x: ${object.x}px; --y: ${object.y}px; --z: ${object.z}"></div> `
          )}
        </div>
      `;
      return view;
    })
  );

  render(observe(view$), container);
}
