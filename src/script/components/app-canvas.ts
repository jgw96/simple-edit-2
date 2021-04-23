import { fileSave } from 'browser-fs-access';
import { LitElement, css, html, customElement, internalProperty } from 'lit-element';

@customElement('app-canvas')
export class AppCanvas extends LitElement {

  @internalProperty() canvas: fabric.Canvas | undefined;
  @internalProperty() image: HTMLImageElement | undefined | null;
  @internalProperty() imgInstance: any;
  @internalProperty() pen: boolean;

  isDragging = false;
  selection: any | undefined;
  lastPosX: number | undefined;
  lastPosY: number | undefined;

  typeMap: any | undefined;

  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: center;
        align-items: center;

        background: #1e1e1e;

        width: 100%;
      }

      #colors {
        position: absolute;
        bottom: 16px;
        right: 16px;
        background: #181818;
        backdrop-filter: blur(10px);
        border-radius: 4px;
        padding: 8px;
        z-index: 3;
        animation-name: quickup;
        animation-duration: 300ms;
      }
      .color {
        border: none;
        height: 1.6em;
        width: 1.6em;
        border-radius: 50%;
        margin: 6px;
      }
      #red {
        background: red;
      }

      #green {
        background: green;
      }

      #black {
        background: black;
      }

      #blue {
        background: blue;
      }

      #yellow {
        background: yellow;
      }

      @keyframes quickup {
        from {
          transform: translateY(30px);
          opacity: 0;
        }
        75% {
          transform: translateY(-10px);
          opacity: 1;
        }
        to {
          transform: translateY(0);
        }
      }

    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    const canvas = this.shadowRoot?.querySelector("canvas");

    this.typeMap = [
      { name: "grayscale", filter: new window.fabric.Image.filters.Grayscale() },
      { name: "sepia", filter: new window.fabric.Image.filters.Sepia() },
      { name: "brightness", filter: new window.fabric.Image.filters.Brightness({ brightness: 10 }) },
      { name: "saturation", filter: new window.fabric.Image.filters.Saturation({ saturation: 50 }) },
      { name: "blur", filter: new (window.fabric.Image.filters as any).Blur({ blur: 0.5 }) },
      { name: "invert", filter: new window.fabric.Image.filters.Invert() },
      { name: "pixelate", filter: new window.fabric.Image.filters.Pixelate({ blocksize: 50 }) }
    ];

    if (canvas) {
      console.log('setting up');

      window.fabric.textureSize = 8000;
      this.canvas = new window.fabric.Canvas(canvas);

      // this.canvas.isDrawingMode = true;

      this.canvas?.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 40
      });

      window.onresize = () => {
        this.canvas?.setDimensions({
          width: window.innerWidth,
          height: window.innerHeight - 40
        });
      }

      this.canvas.on('mouse:wheel', (opt) => {
        const delta = (opt.e as any).deltaY;
        let zoom = this.canvas?.getZoom();

        if (zoom) {
          zoom *= 0.999 ** delta;
          if (zoom > 20) zoom = 20;
          if (zoom < 0.01) zoom = 0.01;

          this.canvas?.zoomToPoint(({ x: (opt.e as any).offsetX, y: (opt.e as any).offsetY } as any), zoom);
        }

        opt.e.preventDefault();
        opt.e.stopPropagation();
      });

      this.drag();
    }
  }

  handlePenMode(mode: boolean) {
    if (this.canvas) {
      if (mode === true) {
        this.pen = true;
        this.canvas.isDrawingMode = true;
      }
      else {
        this.pen = false;
        this.canvas.isDrawingMode = false;
      }
    }
  }

  drag() {
    if (this.canvas) {
      this.canvas.on('mouse:down', (opt) => {
        const evt: any = opt.e;
        if (evt.altKey === true) {
          this.isDragging = true;
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;
        }
      });
      this.canvas.on('mouse:move', (opt) => {
        if (this.isDragging) {
          const e: any = opt.e;
          const vpt = this.canvas?.viewportTransform;

          if (vpt) {
            if (this.lastPosX && this.lastPosY) {
              vpt[4] += e.clientX - this.lastPosX;
              vpt[5] += e.clientY - this.lastPosY;
            }

            this.canvas?.requestRenderAll();
            this.lastPosX = e.clientX;
            this.lastPosY = e.clientY;
          }
        }
      });
      this.canvas.on('mouse:up', () => {
        // on mouse up we want to recalculate new interaction
        // for all objects, so we call setViewportTransform
        const transform = this.canvas?.viewportTransform;

        if (transform) {
          this.canvas?.setViewportTransform(transform);
        }

        this.isDragging = false;
        this.selection = true;
      });

    }
  }

  public drawImage(blob: Blob | File) {
    if (this.canvas) {
      console.info("Drawing image");

      const reader = new FileReader();

      reader.onloadend = (e) => {
        this.image = new Image();

        if (this.image) {
          this.image.onload = () => {
            this.imgInstance = new window.fabric.Image((this.image as HTMLImageElement), {
              left: 0 + window.innerWidth / 8,
              top: 0 + window.innerHeight / 8,
              angle: 0
            });

            if (window.matchMedia("(max-width: 800px)").matches) {
              this.imgInstance.scaleToWidth(400);
            }
            else {
              this.imgInstance.scaleToWidth(800);
            }

            this.canvas?.add(this.imgInstance);

            this.imgInstance.bringToFront();
          }

          if (e.target?.result) {
            this.image.src = (e.target.result as string);
          }
        }

      }

      reader.readAsDataURL(blob);
    }
  }

  public async applyWebglFilter(type: string, value?: number) {

    try {
      const active = this.canvas?.getActiveObject();

      if (active) {
        const filter = this.typeMap.find((filter) => {
          if (filter.name === type) {
            return filter;
          }
        });

        console.log('type', type);

        if (value && type === "blur") {
          filter.filter.setOptions({
            blur: value
          })
        }
        else if (value && type === "brightness") {
          filter.filter.setOptions({
            brightness: value
          })
        }

        console.log('filter', filter);

        (active as any).filters.push(filter?.filter);

        // apply filters and re-render canvas when done
        (active as any).applyFilters();

        this.canvas?.add(active);
      }
      else {
        // add filter
        const filter = this.typeMap.find((filter) => {
          if (filter.name === type) {
            return filter;
          }
          else {
            return null;
          }
        });

        this.imgInstance.filters.push(filter?.filter);

        // apply filters and re-render canvas when done
        this.imgInstance.applyFilters();

        this.canvas?.add(this.imgInstance);
      }

      // this.applying = false;
    }
    catch (err) {
      console.error(err);
    }
  }

  public async save() {
    let dataurl: string | undefined = undefined;

    const active = this.canvas?.getActiveObject();

    if (active) {
      dataurl = active.toDataURL({});
    }
    else {
      dataurl = this.canvas?.toDataURL();
    }

    if (dataurl) {
      const blob = this.dataURLtoBlob(dataurl);
      console.log(blob);

      if (blob) {
        await fileSave(blob, {
          fileName: "untitle.png",
          extensions: [".png"]
        })
      }
    }
  }

  dataURLtoBlob(dataurl: string) {
    const arr = dataurl.split(',');

    //@ts-expect-error weird typescript issues
    const mime = arr[0].match(/:(.*?);/)[1];

    const bstr = atob(arr[1])
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  public removeObject() {
    const active = this.canvas?.getActiveObject();

    if (active) {
      this.canvas?.remove(active);
    }
    else {
      this.canvas?.remove(this.imgInstance);
    }
  }

  public async shareImage() {
    let dataurl: string | null = null;

    const active = this.canvas?.getActiveObject();

    if (active) {
      dataurl = active.toDataURL({});
    }
    else {
      dataurl = this.imgInstance?.toDataURL();
    }

    if (dataurl) {
      const blob = this.dataURLtoBlob(dataurl);
      console.log(blob);

      if (blob) {
        const file = new File([blob], "untitled.png", {
          type: "image/png"
        });

        if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
          await (navigator as any).share({
            files: [file],
            title: 'Edited image',
            text: 'edited image',
          })
        } else {
          console.log(`Your system doesn't support sharing files.`);
        }
      }
    }
  }

  revert() {
    const active: any = this.canvas?.getActiveObject();
    active.filters.pop();

    active.applyFilters();

    this.canvas?.renderAll();
  }

  public async changeBackgroundColor(color: string) {
    this.canvas?.setBackgroundColor(color, () => {
      console.log('color changed');

      this.canvas?.renderAll();
      return;
    })
  }

  changePenColor(color: string) {
    if (this.canvas) {
      this.canvas.freeDrawingBrush.color = color;
    }
  }

  render() {
    return html`
      <canvas></canvas>

      ${this.pen ? html`<div id="colors">
        <button @click="${() => this.changePenColor("red")}" class="color" id="red"></button>
        <button @click="${() => this.changePenColor("green")}" class="color" id="green"></button>
        <button @click="${() => this.changePenColor("blue")}" class="color" id="blue"></button>
        <button @click="${() => this.changePenColor("yellow")}" class="color" id="yellow"></button>
        <button @click="${() => this.changePenColor("black")}" class="color" id="black"></button>
      </div>` : null}
    `;
  }
}
