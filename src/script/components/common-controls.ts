import { set } from "idb-keyval";
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("common-controls")
export class CommonControls extends LitElement {
  @property() canvas: any;

  currentFilter: string | undefined;

  static styles = [
    css`
      :host {
        display: block;
      }

      :host.tabletFilters {
        .tabletFilters {
            flex-direction: column;
            justify-content: flex-start;
            padding-left: 10px;
            padding-right: 6px;
            padding-top: 8px;
          }
      }

      /* width */
      ::-webkit-scrollbar {
        width: 2px;
      }

      /* Track */
      ::-webkit-scrollbar-track {
        background: black;
      }

      /* Handle */
      ::-webkit-scrollbar-thumb {
        background: #43434a;
      }

      /* Handle on hover */
      ::-webkit-scrollbar-thumb:hover {
        background: rgb(30, 30, 30);
      }

      #filters {
        flex-direction: row;
        justify-content: flex-end;
        height: 86vh;
        overflow-y: auto;
        overflow-x: hidden;
      }

      #otherControls {
        margin-top: 1em;
      }

      #otherControls sl-button {
        border-radius: 6px;
        font-size: 1em;
        font-weight: 500;
      }

      #filters sl-button {
        margin-bottom: 10px;
        margin-right: 6px;
      }

      #filters sl-button,
        #otherControls sl-button {
          border-radius: 6px;
          font-size: 1em;
          font-weight: 500;
          width: 97%;
        }

        .menu-label {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 14px;
          }

          .add-header {
            margin-top: 1em;
          }

          @media(max-width: 800px) {

              #otherControls sl-button {
                margin-bottom: 8px;
              }

              #filters sl-button,
        #otherControls sl-button {
          width: 100%;
        }

              #filters {
                overflow-x: hidden;
                height: 63vh;
              }
          }

          @media (horizontal-viewport-segments: 2) {
            :host.duoFilters {
              display: flex;
            }

            #filters sl-button,
            #otherControls sl-button {
            width: 100%;
            }

            #canvasMain {
              display: initial;
            }

            #layout {
              gap: 27px;
              grid-template-columns: 49% 50%;
              display: grid;
            }

            app-canvas {
              width: 50vw;
              display: block;
            }

            #extra-controls {
              left: 51vw;
            }

            aside {
              flex-direction: column;
              overflow-y: scroll;
            }

            #controls,
            #filters {
              flex-direction: column;
              justify-content: initial;
              height: initial;
              overflow-y: initial;
            }

            #controls sl-button,
            #filters sl-button {
              border-radius: 6px;
              font-size: 1em;
              font-weight: 500;
            }

            .menu-label {
              margin-bottom: 20px;
              margin-top: 20px;
              font-size: 20px;
            }

            #advanced {
              display: none;
            }
          }

          @media (vertical-viewport-segments: 2) {
            #mobile-toolbar {
              height: 60vh;
              border-radius: 0;
              margin-top: 0em;
            }

            main {
              height: 46vh;
            }

            app-canvas {
              height: 46vh;
            }

            #pill-box {
              display: none;
            }

            #controls {
              margin-top: 1em;
            }
          }

    `,
  ];

  async filter(type: string, value?: number) {
    await this.canvas?.applyWebglFilter(type, value);

    this.currentFilter = type;

    await set("current_file", this.canvas?.writeToJSON());

    //emit event that filter is done
    this.dispatchEvent(
      new CustomEvent("filter-done", {
        detail: {},
      })
    );
  }

  async addText() {
    this.canvas?.handleText();

    await set("current_file", this.canvas?.writeToJSON());
  }

  async handleBringForward() {
    await this.canvas?.bringForwardObject();

    await set("current_file", this.canvas?.writeToJSON());
  }

  async handleBringFront() {
    await this.canvas?.bringToFront();

    await set("current_file", this.canvas?.writeToJSON());
  }

  async handleSendBackward() {
    await this.canvas?.sendBackward();

    await set("current_file", this.canvas?.writeToJSON());
  }

  async handleSendToBack() {
    await this.canvas?.sendToBack();

    await set("current_file", this.canvas?.writeToJSON());
  }

  render() {
    return html` <div id="filters">
      <div class="menu-label">
        <span id="filters-label">Filters</span>
      </div>

      <sl-button @click="${() => this.filter("grayscale")}"
        >desaturate</sl-button
      >
      <sl-button @click="${() => this.filter("pixelate")}">pixelate</sl-button>
      <sl-button @click="${() => this.filter("invert")}">invert</sl-button>
      <sl-button @click="${() => this.filter("blur")}">blur</sl-button>
      <sl-button @click="${() => this.filter("sepia")}">sepia</sl-button>
      <sl-button @click="${() => this.filter("saturation")}"
        >saturate</sl-button
      >
      <sl-button @click="${() => this.filter("brightness")}"
        >brighten</sl-button
      >
      <sl-button @click="${() => this.filter("contrast")}">contrast</sl-button>
      <sl-button @click="${() => this.filter("vintage")}">vintage</sl-button>
      <sl-button @click="${() => this.filter("polaroid")}">polaroid</sl-button>

      <div id="otherControls">
        <div class="menu-label">
          <span id="order-label">Order</span>
        </div>

        <sl-button @click="${() => this.handleBringFront()}"
          >Bring to Front</sl-button
        >
        <sl-button @click="${() => this.handleBringForward()}"
          >Bring Forward</sl-button
        >
        <sl-button @click="${() => this.handleSendToBack()}"
          >Send to Back</sl-button
        >
        <sl-button @click="${() => this.handleSendBackward()}"
          >Send Backward</sl-button
        >

        <div class="menu-label add-header">
          <span>Add</span>
        </div>

        <sl-button @click="${() => this.addText()}">Add Text</sl-button>
      </div>
    </div>`;
  }
}
