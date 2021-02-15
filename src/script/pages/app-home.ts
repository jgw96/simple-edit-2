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
        min-width: 20em;
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

      this.canvas = this.shadowRoot?.querySelector("app-canvas");

      this.canvas.drawImage(blob);
    }
  }

  async filter(type: string) {
    await this.canvas.applyWebglFilter(type);
  }

  revert() {
    this.canvas.drawImage(this.org);
  }

  async save() {
    this.canvas.save();
  }

  async share() {
    this.canvas.shareImage();
  }

  render() {
    return html`
      <div>
        <div id="layout">
          <aside>
            <div id="controls">
              <fast-button id="choosePhoto" @click="${() => this.openPhoto()}">Choose Photo</fast-button>
              <fast-button @click="${() => this.save()}">Save Copy</fast-button>
              <fast-button @click="${() => this.share()}" id="shareButton">Share</fast-button>

              <fast-button @click="${() => this.revert()}">undo</fast-button>
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
            <app-canvas></app-canvas>
          </main>
        </div>

        <pwa-install>Install PWA Starter</pwa-install>
      </div>
    `;
  }
}
