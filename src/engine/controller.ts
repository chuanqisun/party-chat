import { html, render } from "lit-html";
import { repeat } from "lit-html/directives/repeat.js";
import { BehaviorSubject, fromEvent, map, merge, tap, withLatestFrom } from "rxjs";
import { fromResize } from "./from-resize";
import { randomId } from "./id";
import { observe } from "./observe-directive";
import type { CanvasObject, Model } from "./types";

export function createController(container: HTMLElement) {
  const pointerDown$ = fromEvent(container, "pointerdown");
  const pointerMove$ = fromEvent(container, "pointermove");
  const pointerUp$ = fromEvent(container, "pointerup");
  const resize$ = fromResize(container);

  const model$ = new BehaviorSubject<Model>({
    objects: [],
  });

  function addObject(model$: BehaviorSubject<Model>, { x, y, z }: { x: number; y: number; z: number }) {
    const currentModel = model$.getValue();
    const newObject: CanvasObject = { id: randomId(8), x, y, z };
    const updatedModel = {
      ...currentModel,
      objects: [...currentModel.objects, newObject],
    };
    model$.next(updatedModel);
  }

  const addObjectOnPointerDown$ = pointerDown$.pipe(
    withLatestFrom(model$),
    tap(([event, _model]) => {
      console.log("pointerdown", event);
      const { offsetX, offsetY } = event as PointerEvent;
      const z = 0;
      addObject(model$, { x: offsetX, y: offsetY, z });
    })
  );

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

  const effects$ = merge(addObjectOnPointerDown$);
  effects$.subscribe();
}
