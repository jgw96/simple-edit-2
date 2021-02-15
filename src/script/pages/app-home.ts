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

  @internalProperty() handleSettings = false;

  settingsAni: Animation | undefined;

  static get styles() {
    return css`
      #layout {
        height: 92vh;
        width: auto;
      }

      aside {
        display: flex;
        padding-left: 16px;
        padding-right: 16px;
        margin-top: 1em;

        animation-name: slideup;
        animation-duration: 280ms;
        animation-timing-function: "ease-in-out";

        justify-content: space-between;
      }

      aside fast-button {
        margin-bottom: 6px;
      }

      #controls, #filters {
        display: flex;
        justify-content: space-between;
        min-width: 31em;
      }

      #filters {
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

      #advanced {
        margin-left: 1em;

        position: fixed;
        top: 10px;
        right: 16px;
      }

      #settings-pane {
        position: fixed;
        right: 0;
        top: 0;
        background: rgb(24 24 24 / 90%);
        backdrop-filter: blur(10px);
        bottom: 0;
        height: 100%;
        width: 20vw;
        padding-left: 1em;

        display: flex;
        flex-direction: column;
      }

      #settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 10px;
        margin-bottom: 1em;
      }

      #color-label {
        font-weight: bold;
        margin-bottom: 8px;
      }

      #color {
        width: 88%;
        border: none;
        background: #2b2b2b;
        padding: 6px;
        border-radius: 4px;
        height: 2em;
      }

      #remove-image {
        background: #d02929;
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

      this.canvas?.drawImage(blob);
    }
  }

  async filter(type: string) {
    await this.canvas?.applyWebglFilter(type);
  }

  revert() {
    this.canvas?.revert();
  }

  async save() {
    this.canvas?.save();
  }

  async share() {
    this.canvas?.shareImage();
  }

  async remove() {
    this.canvas?.removeObject();
  }

  async doSettings() {
    if (this.settingsAni) {
      this.settingsAni.reverse();

      await this.settingsAni.finished;

      this.settingsAni = undefined;

      this.handleSettings = !this.handleSettings;
    }
    else {
      this.handleSettings = !this.handleSettings;

      await this.updateComplete;

      this.settingsAni = this.shadowRoot?.querySelector("#settings-pane")?.animate([
        {
          transform: "translateX(260px)"
        },
        {
          transform: "translateY(0)"
        }
      ], {
        fill: "both",
        easing: "ease-in-out",
        duration: 280
      })
    }
  }

  handleColor(color: string) {
    console.log(color);
    this.canvas?.changeBackgroundColor(color);
  }

  render() {
    return html`
      <div>
        <div id="layout">
        ${this.org ? html`<aside>
            <div id="controls">
              <fast-button id="choosePhoto" @click="${() => this.openPhoto()}">Add Photo <ion-icon name="add-outline"></ion-icon></fast-button>
              <fast-button @click="${() => this.save()}">Save Copy <ion-icon name="save-outline"></ion-icon></fast-button>
              <fast-button @click="${() => this.share()}" id="shareButton">Share <ion-icon name="share-outline"></ion-icon></fast-button>

              <fast-button @click="${() => this.revert()}">undo <ion-icon name="arrow-undo-outline"></ion-icon></fast-button>
              <fast-button id="remove-image" @click="${() => this.remove()}">Remove Image <ion-icon name="trash-outline"></ion-icon></fast-button>

              <Fast-button id="advanced" @click="${() => this.doSettings()}">Settings <ion-icon name="settings-outline"></ion-icon></fast-button>
            </div>


              <div id="filters">
                <fast-button @click="${() => this.filter("grayscale")}">desaturate</fast-button>
                <fast-button @click="${() => this.filter("pixelate")}">pixelate</fast-button>
                <fast-button @click="${() => this.filter("invert")}">invert</fast-button>
                <fast-button @click="${() => this.filter("blur")}">blur</fast-button>
                <fast-button @click="${() => this.filter("sepia")}">sepia</fast-button>
                <fast-button @click="${() => this.filter("saturation")}">saturate</fast-button>
              </div>

          </aside>` : null }

          <main>
            ${this.org ? html`<app-canvas></app-canvas>` : html`
             <div id="getting-started">
               <div id="getting-started-header">
               <img src="/assets/started.svg">
               <h2>Choose an image to get started!</h2>
              </div>

              <fast-button id="choosePhoto" @click="${() => this.openPhoto()}">Choose Photo <ion-icon name="add-outline"></ion-icon></fast-button>
              </div>`}
          </main>

          ${this.org ? html` <div id="mobile-toolbar">
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
    </div>` : null}
        </div>

        ${this.handleSettings ? html`<div id="settings-pane">
          <div id="settings-header">
            <h3>Settings</h3>

            <fast-button @click="${() => this.doSettings()}">
              Close
            </fast-button>
          </div>

          <label id="color-label" for="color">Canvas Background Color</label>
          <input @change="${(ev) => this.handleColor(ev.target.value)}" id="color" name="color" type="color"></input>
        </div>` : null}

        <pwa-install>Install PWA Starter</pwa-install>
      </div>
    `;
  }
}
