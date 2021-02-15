import { LitElement, css, html, customElement, property, internalProperty } from 'lit-element';

import '../components/app-canvas';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';
import { fileOpen } from 'browser-fs-access';
import { AppCanvas } from '../components/app-canvas';

@customElement('app-home')
export class AppHome extends LitElement {
  // For more information on using properties in lit-element
  // check out this link https://lit-element.polymer-project.org/guide/properties#declare-with-decorators
  @property() message = 'Welcome!';

  @internalProperty() canvas: AppCanvas | undefined | null;
  @internalProperty() org: File | undefined | null;

  static get styles() {
    return css`
      #layout {
        height: 92vh;
        width: auto;
      }

      aside {
        display: flex;
        padding-left: 10px;
        padding-right: 10px;

        justify-content: space-between;
      }

      aside fast-button {
        margin-bottom: 6px;
      }

      #controls, #filters {
        display: flex;
        justify-content: space-between;
        min-width: 27em;
      }

      #filters {
        animation-name: slideup;
        animation-duration: 280ms;
        animation-timing-function: "ease-in-out";

        min-width: 25em;
      }

      #choosePhoto {
        margin-bottom: 1em;
        background: var(--accent-fill-rest);
      }

      #shareButton {
        margin-bottom: 1em;
      }

      fast-progress-ring {
        position: fixed;
        bottom: -26px;
        right: 16px;
      }

      #getting-started {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 86vh;
      }

      #getting-started img {
        width: 28em;
        margin-top: 4em;
      }

      #getting-started h2 {
        font-size: 2em;
      }

      #mobile-toolbar {
        display: none;

        position: fixed;
        bottom: 0;
        background: rgb(19, 19, 19);
        padding: 10px;
        /* overflow-y: scroll; */
        /* width: 100%; */
        right: 0;
        left: 0;

        height: 30vh;
        overflow-y: scroll;
      }

      @media(max-width: 800px) {
        aside {
          display: none;
        }

        #mobile-toolbar {
          display: block;
        }

        #controls, #filters {
          display: grid;
          grid-template-columns: auto auto;
          justify-content: unset;
          min-width: unset;
          gap: 0px 10px;
          margin-bottom: 2em;
        }

        #filters {
          gap: 10px;
        }

        #getting-started {
          text-align: center;
          font-size: 10px;
        }

        #getting-started img {
          width: 60vw;
        }
      }

      @keyframes slideup {
        from {
          transform: translateY(30px);
          opacity: 0;
        }

        to {
          transform: translateY(0px);
          opacity: 1;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async openPhoto() {
    const blob = await fileOpen({
      mimeTypes: ['image/*'],
    });

    if (blob) {
      this.org = blob;

      await this.updateComplete;

      this.canvas = this.shadowRoot?.querySelector("app-canvas");

      this.canvas.drawImage(blob);
    }
  }

  async filter(type: string) {
    await this.canvas.applyWebglFilter(type);
  }

  revert() {
    this.canvas.revert();
  }

  async save() {
    this.canvas.save();
  }

  async share() {
    this.canvas.shareImage();
  }

  async remove() {
    this.canvas.removeObject();
  }

  render() {
    return html`
      <div>
        <div id="layout">
          <aside>
            <div id="controls">
              <fast-button id="choosePhoto" @click="${() => this.openPhoto()}">Add Photo</fast-button>
              <fast-button @click="${() => this.save()}">Save Copy</fast-button>
              <fast-button @click="${() => this.share()}" id="shareButton">Share</fast-button>

              <fast-button @click="${() => this.revert()}">undo</fast-button>
              <fast-button @click="${() => this.remove()}">Remove Image</fast-button>
            </div>

            ${this.org ? html`
              <div id="filters">
                <fast-button @click="${() => this.filter("grayscale")}">desaturate</fast-button>
                <fast-button @click="${() => this.filter("pixelate")}">pixelate</fast-button>
                <fast-button @click="${() => this.filter("invert")}">invert</fast-button>
                <fast-button @click="${() => this.filter("blur")}">blur</fast-button>
                <fast-button @click="${() => this.filter("sepia")}">sepia</fast-button>
                <fast-button @click="${() => this.filter("saturation")}">saturate</fast-button>
              </div>
              ` : null
      }

          </aside>

          <main>
            ${this.org ? html`<app-canvas></app-canvas>` : html`<div id="getting-started"><img src="/assets/started.svg"> <h2>Choose an image to get started!</h2></div>`}
          </main>

          <div id="mobile-toolbar">
          <div id="controls">
              <fast-button id="choosePhoto" @click="${() => this.openPhoto()}">Choose Photo</fast-button>
              <fast-button @click="${() => this.save()}">Save Copy</fast-button>
              <fast-button @click="${() => this.share()}" id="shareButton">Share</fast-button>

              <fast-button @click="${() => this.revert()}">undo</fast-button>
              <fast-button @click="${() => this.remove()}">Remove Image</fast-button>
            </div>

            ${this.org ? html`
              <div id="filters">
                <fast-button @click="${() => this.filter("grayscale")}">desaturate</fast-button>
                <fast-button @click="${() => this.filter("pixelate")}">pixelate</fast-button>
                <fast-button @click="${() => this.filter("invert")}">invert</fast-button>
                <fast-button @click="${() => this.filter("blur")}">blur</fast-button>
                <fast-button @click="${() => this.filter("sepia")}">sepia</fast-button>
                <fast-button @click="${() => this.filter("saturation")}">saturate</fast-button>
              </div>
              ` : null
      }
    </div>
        </div>

        <pwa-install>Install PWA Starter</pwa-install>
      </div>
    `;
  }
}
