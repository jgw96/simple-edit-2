let isDragging = false;
  let selection: any | undefined;
  let lastPosX: number | undefined;
  let lastPosY: number | undefined;

export function setupCanvas(canvas: HTMLCanvasElement) {
    if (canvas) {
        console.log('setting up');

        window.fabric.textureSize = 8000;
        const fabricCanvas = new window.fabric.Canvas(canvas);

        console.log('fabricCanvas', fabricCanvas);

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

        fabricCanvas.on('mouse:wheel', (opt) => {
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
}

export function drag(canvas) {
    if (canvas) {
      canvas.on('mouse:down', (opt) => {
        const evt: any = opt.e;
        if (evt.altKey === true) {
          isDragging = true;
          selection = false;
          lastPosX = evt.clientX;
          lastPosY = evt.clientY;
        }
      });
      canvas.on('mouse:move', (opt) => {
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
        selection = true;
      });

    }
  }

  export function drawImageFunc(blob: Blob | File, canvas, image, imgInstance) {
    if (canvas) {
      console.info("Drawing image");

      const reader = new FileReader();

      reader.onloadend = (e) => {
        image = new Image();

        if (image) {
          image.onload = () => {
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
          }

          if (e.target?.result) {
            image.src = (e.target.result as string);
          }
        }

      }

      reader.readAsDataURL(blob);
    }
  }