import { set } from "idb-keyval";

let isDragging = false;
let lastPosX: number | undefined;
let lastPosY: number | undefined;

export function setupCanvas(canvas: HTMLCanvasElement) {
  if (canvas) {
    console.log('setting up');

    window.fabric.textureSize = 8000;
    const fabricCanvas = new window.fabric.Canvas(canvas, {
      preserveObjectStacking: true,
      backgroundColor: window.matchMedia("(prefers-color-scheme: light)").matches ? "white" : "#1e1e1e"
    });

    // fabricCanvas.isDrawingMode = true;

    fabricCanvas?.setDimensions({
      width: window.innerWidth,
      height: window.innerHeight - 40
    });

    window.onresize = () => {
      fabricCanvas?.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 40
      });
    }

    fabricCanvas.on('mouse:wheel', (opt: any) => {
      const delta = (opt.e as any).deltaY;
      let zoom = fabricCanvas?.getZoom();

      if (zoom) {
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;

        fabricCanvas?.zoomToPoint(({ x: (opt.e as any).offsetX, y: (opt.e as any).offsetY } as any), zoom);
      }

      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    return fabricCanvas;

    // drag();
  }
  else return undefined;
}

export function drag(canvas: any) {
  if (canvas) {
    canvas.on('mouse:down', (opt: any) => {
      const evt: any = opt.e;
      if (evt.altKey === true) {
        isDragging = true;
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
      }
    });
    canvas.on('mouse:move', (opt: any) => {
      if (isDragging) {
        const e: any = opt.e;
        const vpt = canvas?.viewportTransform;

        if (vpt) {
          if (lastPosX && lastPosY) {
            vpt[4] += e.clientX - lastPosX;
            vpt[5] += e.clientY - lastPosY;
          }

          canvas?.requestRenderAll();
          lastPosX = e.clientX;
          lastPosY = e.clientY;
        }
      }
    });
    canvas.on('mouse:up', () => {
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      const transform = canvas?.viewportTransform;

      if (transform) {
        canvas?.setViewportTransform(transform);
      }

      isDragging = false;
    });

  }
}

export function drawImageFunc(blob: Blob | File, canvas: any, image: any, imgInstance: any) {
  if (canvas) {
    console.info("Drawing image");

    const reader = new FileReader();

    reader.onloadend = (e) => {
      image = new Image();

      if (image) {
        image.onload = async () => {
          imgInstance = new window.fabric.Image((image as HTMLImageElement), {
            left: 0 + window.innerWidth / 8,
            top: 0 + window.innerHeight / 8,
            angle: 0
          });

          if (window.matchMedia("(max-width: 800px)").matches) {
            imgInstance.scaleToWidth(400);
          }
          else {
            imgInstance.scaleToWidth(800);
          }

          canvas?.add(imgInstance);

          imgInstance.bringToFront();

          await set("current_file", canvas?.writeToJSON());
        }

        if (e.target?.result) {
          image.src = (e.target.result as string);
        }
      }

    }

    reader.readAsDataURL(blob);
  }
}