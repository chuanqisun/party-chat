import { Observable } from "rxjs";
import type { WithDimension2D } from "./types";

export function fromResize(element: Element): Observable<WithDimension2D> {
  return new Observable((subscriber) => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        subscriber.next({ width, height });
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  });
}
