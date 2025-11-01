import { BehaviorSubject, fromEvent, merge, tap, withLatestFrom } from "rxjs";
import { randomId } from "./id";
import type { CanvasObject, Model } from "./types";

export function startController(container: HTMLElement, model$: BehaviorSubject<Model>) {
  const pointerDown$ = fromEvent(container, "pointerdown");
  // const pointerMove$ = fromEvent(container, "pointermove");
  // const pointerUp$ = fromEvent(container, "pointerup");
  // const resize$ = fromResize(container);

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

  const effects$ = merge(addObjectOnPointerDown$);
  effects$.subscribe();
}
