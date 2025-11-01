export type WithId = {
  id: string;
};

export type WithDimension2D = {
  width: number;
  height: number;
};

export type WithPosition2D = {
  x: number;
  y: number;
};

export type WithDepth = {
  z: number;
};

export type CanvasObject = WithId & WithPosition2D & WithDepth;

export type Model = {
  objects: CanvasObject[];
};
