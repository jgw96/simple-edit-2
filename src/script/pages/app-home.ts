import { LitElement, css, html, customElement, property, internalProperty } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';

import '../components/app-canvas';
import '../components/drag-drop';

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
  @internalProperty() org: File | Blob | undefined | null;

  @internalProperty() handleSettings = false;

  @internalProperty() pen_mode: boolean | undefined;

  settingsAni: Animation | undefined;

  static get styles() {
    return css`
    fast-button::part(content) {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    fast-button ion-icon {
      margin-left: 6px;
    }

      #layout {
        height: 92vh;
        width: auto;

        display: grid;
        grid-template-columns: 18% auto;
      }

      aside {
        display: flex;
        padding-left: 16px;
        padding-right: 16px;
        margin-top: 1em;

        justify-content: space-between;

        flex-direction: column;
        height: 90vh;

        animation-name: slideup;
        animation-duration: 280ms;
        animation-timing-function: "ease-in-out";
      }

      aside fast-button {
        margin-bottom: 6px;
      }

      #controls, #filters {
        display: flex;
        justify-content: space-between;

        flex-direction: column;
      }

      #controls fast-button, #filters fast-button {
        margin-bottom: 10px;
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

      #getting-started-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;

        box-shadow: #0e0e0e 0px 2px 11px 2px;
        border-radius: 10px;
        margin: 4em;
        margin-left: 6em;
        margin-right: 6em;
        padding-bottom: 2em;

        background: var(--accent-foreground-rest);

        animation-name: slideup;
        animation-duration: 280ms;
        animation-timing-function: "ease-in-out";
      }

      #getting-started {
        scroll-snap-type: x mandatory;
        overflow-x: scroll;
        display: flex;
        width: 444px;
      }

      #getting-started::-webkit-scrollbar {
        display: none;
      }

      .getting-started-item {
        scroll-snap-align: center;

        display: flex;
        flex-direction: column;
        align-items: center;
      }

      #getting-started img {
        width: 28em;
        height: 280px;
        margin-top: 4em;
      }

      #getting-started fast-button {
        width: 126px;
      }

      #getting-started h2 {
        font-size: 1.6em;
        text-align: center;
      }

      #mobile-toolbar {
        display: none;

        position: fixed;
        bottom: 0;
        background: rgb(19, 19, 19);
        padding: 10px;
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

      .setting {
        background: #2b2b2b;
        margin-right: 1em;
        padding: 10px;
        border-radius: 6px;
        margin-bottom: 10px;
      }

      .setting .setting-header  {
        margin-top: 8px;
        font-size: 12px;
      }

      .setting .setting-header p {
        margin-top: 8px;
      }

      #color-label {
        font-weight: bold;
        font-size: 16px;
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

      @media(screen-spanning: single-fold-vertical) {
        #getting-started-wrapper {
          width: 44vw;
          margin: 2em;
        }

        #layout {
          gap: 27px;
          grid-template-columns: 49% 50%;
        }

        app-canvas {
          width: 50vw;
          display: block;
          margin-top: 1em;
        }
      }

      @media(max-width: 800px) {
        main {
          width: 100vw;
        }

        #settings-pane {
          width: 60vw;
        }

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

        #getting-started-wrapper {
          margin: 4em 1em;
        }

        #getting-started {
          text-align: center;
          font-size: 10px;
          width: 246px;
        }

        #getting-started img {
          width: 60vw;
        }
      }

      @media(min-width: 1200px) {
        #getting-started-wrapper {
          margin: 4em;
          margin-left: 12em;
          margin-right: 12em;
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

  async firstUpdated() {
    const test = localStorage.getItem("done-with-tut");

    if (test) {
      const thing = this.shadowRoot?.querySelector("#getting-started");
      thing?.scrollBy({ top: 0, left: 800, behavior: 'smooth' });
    }

    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('file event', event);
      console.log('file event data', event.data);
      const imageBlob = event.data.file;

      if (imageBlob) {
        this.handleSharedImage(imageBlob);
      }
    });

    this.fileHandler();
  }

  async fileHandler() {
    if ('launchQueue' in window) {
      (window as any).launchQueue.setConsumer(async (launchParams: any) => {
        if (!launchParams.files.length) {
          return;
        }


        const fileHandle = launchParams.files[0];
        console.log('fileHandle', fileHandle);

        await this.handleSharedImage(fileHandle);
      });
    }
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

    localStorage.setItem("done-with-tut", "true");
  }

  async handleSharedImage(blob: Blob | File) {
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

  scrollRight() {
    const thing = this.shadowRoot?.querySelector("#getting-started");
    // thing?.scrollBy({top: 0, left: 400, behavior: 'smooth'});
    if (window.matchMedia("(max-width: 800px)").matches) {
      thing?.scrollBy({ top: 0, left: 246, behavior: 'smooth' });
    }
    else {
      thing?.scrollBy({ top: 0, left: 400, behavior: 'smooth' });
    }
  }

  penMode(ev: boolean) {
    console.log(ev);

    this.pen_mode = ev;

    this.canvas?.handlePenMode(this.pen_mode);
  }

  render() {
    return html`
      <div>
      ${!this.org ? html`<div id="getting-started-wrapper">
              <div id="getting-started">
                <div class="getting-started-item">
                  <img src="/assets/started.svg">
                  <h2>Welcome to SimpleEdit!</h2>

                  <fast-button @click="${() => this.scrollRight()}">Next</fast-button>
                </div>

                <div class="getting-started-item">
                  <img src="/assets/started_two.svg">
                  <h2>Quickly edit your photos, create collages and more</h2>

                  <fast-button @click="${() => this.scrollRight()}">Next</fast-button>
                </div>

                <div class="getting-started-item">
                  <img src="/assets/started_three.svg">
                  <h2>Tap Choose Photo to get started!</h2>

                  <fast-button id="choosePhoto" @click="${() => this.openPhoto()}">Choose Photo <ion-icon name="add-outline"></ion-icon></fast-button>
                </div>
               </div>
              </div>` : null}

        <div id="layout">
        ${this.org ? html`<aside>
            <div id="controls">
              <fast-button id="choosePhoto" @click="${() => this.openPhoto()}">Add Photo <ion-icon name="add-outline"></ion-icon></fast-button>
              <fast-button appearance="outline" @click="${() => this.save()}">Save Copy <ion-icon name="save-outline"></ion-icon></fast-button>
              <fast-button appearance="outline" @click="${() => this.share()}" id="shareButton">Share <ion-icon name="share-outline"></ion-icon></fast-button>

              <fast-button appearance="outline" @click="${() => this.revert()}">undo <ion-icon name="arrow-undo-outline"></ion-icon></fast-button>
              <fast-button id="remove-image" @click="${() => this.remove()}">Remove Photo <ion-icon name="trash-outline"></ion-icon></fast-button>

              <fast-button appearance="outline" id="advanced" @click="${() => this.doSettings()}">Settings <ion-icon name="settings-outline"></ion-icon></fast-button>
            </div>


              <div id="filters">
                <fast-button appearance="outline" @click="${() => this.filter("grayscale")}">desaturate</fast-button>
                <fast-button appearance="outline" @click="${() => this.filter("pixelate")}">pixelate</fast-button>
                <fast-button appearance="outline" @click="${() => this.filter("invert")}">invert</fast-button>
                <fast-button appearance="outline" @click="${() => this.filter("blur")}">blur</fast-button>
                <fast-button appearance="outline" @click="${() => this.filter("sepia")}">sepia</fast-button>
                <fast-button appearance="outline" @click="${() => this.filter("saturation")}">saturate</fast-button>
              </div>

          </aside>` : null}

          <main>
            ${this.org ? html`<drag-drop @got-file="${(event: any) => this.handleSharedImage(event.detail.file)}"><app-canvas></app-canvas></drag-drop>` : null}
          </main>

          ${this.org ? html` <div id="mobile-toolbar">
          <div id="controls">
              <fast-button id="choosePhoto" @click="${() => this.openPhoto()}">Add Photo <ion-icon name="add-outline"></ion-icon></fast-button>
              <fast-button appearance="outline" @click="${() => this.save()}">Save Copy <ion-icon name="save-outline"></ion-icon></fast-button>
              <fast-button appearance="outline" @click="${() => this.share()}" id="shareButton">Share <ion-icon name="share-outline"></ion-icon></fast-button>

              <fast-button appearance="outline" @click="${() => this.revert()}">undo <ion-icon name="arrow-undo-outline"></ion-icon></fast-button>
              <fast-button id="remove-image" @click="${() => this.remove()}">Remove Photo <ion-icon name="trash-outline"></ion-icon></fast-button>

              <fast-button appearance="outline" id="advanced" @click="${() => this.doSettings()}">Settings <ion-icon name="settings-outline"></ion-icon></fast-button>
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

        <div
        style=${styleMap({
            display: this.handleSettings ? "initial" : "none"
          })}
          id="settings-pane">
          <div id="settings-header">
            <h3>Settings</h3>

            <fast-button @click="${() => this.doSettings()}">
              Close
            </fast-button>
          </div>

          <div class="setting">
            <div class="setting-header">
              <label id="color-label" for="color">Canvas Background Color</label>
              <p>Change the background color of your canvas</p>
            </div>
            <input @change="${(ev) => this.handleColor(ev.target.value)}" id="color" name="color" type="color"></input>
          </div>

          <div class="setting">
            <div class="setting-header">
              <label id="color-label" for="color">Drawing Mode</label>
              <p>Draw on your collage with your pen, mouse or touch!</p>
            </div>

            <fast-switch value="${this.pen_mode || false}" @change="${(ev) => this.penMode(ev.target.checked)}">
              <span slot="checked-message">on</span>
              <span slot="unchecked-message">off</span>
            </fast-switch>
          </div>
        </div>

        <pwa-install>Install PWA Starter</pwa-install>
      </div>
    `;
  }
}
