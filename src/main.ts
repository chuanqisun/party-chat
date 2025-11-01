import { BehaviorSubject } from "rxjs";
import { startController } from "./engine/controller";
import type { Model } from "./engine/types";
import { startView } from "./engine/view";
import "./style.css";

const model$ = new BehaviorSubject<Model>({
  objects: [],
});

startController(document.getElementById("app")!, model$);
startView(document.getElementById("app")!, model$);
