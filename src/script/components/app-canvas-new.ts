import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("app-canvas-new")
export class AppCanvas extends LitElement {

    @state() workingCanvas: HTMLCanvasElement | undefined;
    @state() context: CanvasRenderingContext2D | null;

    static get styles() {
        return css``
    }

    constructor() {
        super();
    }

    firstUpdated() {
      const canvas = this.shadowRoot?.querySelector("canvas");

      if (canvas) {
        this.workingCanvas = canvas;

        this.setupCanvas();
      }
    }

    private setupCanvas() {
        if (this.workingCanvas) {
            this.context = this.workingCanvas.getContext("2d");
        }
    }

    public async drawImage() {

    }

    render() {
        return html`
          <canvas></canvas>
      `;
    }
}