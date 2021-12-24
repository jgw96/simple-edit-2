import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map';
//@ts-ignore
import fabricPureBrowser from 'https://cdn.skypack.dev/fabric-pure-browser';

import '../components/app-canvas';
import '../components/drag-drop';
import '../components/save-modal';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';
import { directoryOpen, fileOpen } from 'browser-fs-access';
import { AppCanvas } from '../components/app-canvas';
import { Swipe } from '../utils/swipe';
import { get, set } from 'idb-keyval';


@customElement('app-home')
export class AppHome extends LitElement {
  // For more information on using properties in lit-element
  // check out this link https://lit-element.polymer-project.org/guide/properties#declare-with-decorators

  @state() canvas: AppCanvas | undefined | null;
  @state() org: File | Array<File> | Array<Blob> | Blob | undefined | null = undefined;

  @state() handleSettings = false;

  @state() pen_mode: boolean | undefined;

  @state() intensity: boolean | undefined;

  @state() saving = false;
  @state() removeShow = false;

  fabric: any;

  settingsAni: Animation | undefined;

  currentFilter: string | undefined;

  static get styles() {
    return css`

    .menu-label {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 14px;
    }

    pwa-install {
      position: fixed;
      right: 13.2em;
      z-index: 2;
      top: 3.11em;
    }

    pwa-install::part(openButton) {
      border-radius: 2px;
      background: var(--accent-fill-hover);

      height: 2.9em;
    }

    #canvasMain {
      display: grid;
      grid-template-columns: 16% 84%;
    }

    #canvasMain .tabletFilters {
      flex-direction: column;
      justify-content: flex-start;
      padding-left: 10px;
      padding-right: 6px;
      padding-top: 8px;
    }

    #otherControls {
      margin-top: 1em;
    }

    #otherControls sl-button {
      width: 97%;
    }

    .add-header {
      margin-top: 1em;
    }

    sl-button::part(content) {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    sl-button ion-icon {
      margin-left: 6px;
    }

      #layout {
        height: 96vh;
        width: auto;

        display: flex;
        flex-direction: column;
      }

      aside {
        display: flex;
        padding-left: 16px;
        padding-right: 16px;
        margin-top: 1em;

        justify-content: space-between;

        height: initial;
        flex-direction: row;

        animation-name: slideup;
        animation-duration: 280ms;
        animation-timing-function: "ease-in-out";
      }

      aside sl-button {
        margin-bottom: 6px;
      }

      #controls, #filters {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
      }

      #controls a {
        width: 5em;
        text-decoration: none;
        color: black;
        display: flex;
        align-items: center;
        justify-content: center;

        background: var(--sl-color-primary-600);
        font-weight: var(--sl-font-weight-semibold);
        margin-bottom: 0px;
        margin-top: 0px;
        position: fixed;

        right: 10.8em;

        height: 2.5rem;
        top: 3.75em;
        border-radius: 4px;
        border: solid 1px #43434a;

        font-size: var(--sl-button-font-size-medium);
        height: var(--sl-input-height-medium);
        line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
        border-radius: var(--sl-input-border-radius-medium);
        top: 3.5em;
      }

      #filters {
        flex-direction: row;
        justify-content: flex-end;
        height: 86vh;
        overflow-y: auto;
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
        background: #rgb(30, 30, 30);
      }

      #controls sl-button, #filters sl-button {
        margin-bottom: 10px;
        margin-right: 6px;
      }

      #choosePhoto {
        margin-bottom: 1em;
      }

      #shareButton {
        margin-bottom: 1em;
      }

      #mobile-toolbar {
        display: none;

        position: fixed;
        bottom: 0;
        background: rgb(19, 19, 19);
        padding: 10px;
        right: 0;
        left: 0;

        height: 94vh;
        transform: translateY(30em);
      }

      #controls #advanced {
        position: fixed;
        right: 20px;
      }

      #mobile-toolbar #advanced {
        display: none;
        position: initial;
        margin-left: 0;
      }

      #mobile-toolbar #otherControls sl-button {
        margin-bottom: 8px;
      }

      #mobile-toolbar #otherControls .menu-label {
        display: none;
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
        z-index: 999;

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

      .colorCard {
        display: none;
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

      #extra-controls {
        position: fixed;
        bottom: 0;
        right: 0;
        left: 18vw;
        background: #181818;
        justify-content: flex-end;
        padding: 8px;
        z-index: 99;

        animation-name: slideup;
        animation-duration: 280ms;
        animation-timing-function: "ease-in-out";

        display: none;
      }

      #extra-controls div {
        font-weight: bold;
        display: flex;
        align-items: center;
      }

      #pill-box {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 14px;
          }

      #pill {
        background: var(--neutral-outline-rest);
        height: 12px;
        width: 2.2em;
        border-radius: 12px;
      }

      @media(max-width: 800px) {

        pwa-install {
          left: 12px;
          bottom: 12px;
        }

        #controls sl-button, #filters sl-button, #otherControls sl-button {
          border-radius: 6px;
          padding: 6px;
          font-size: 1em;
          font-weight: 500;
        }

        #canvasMain {
          display: initial;
        }

        main {
          width: 100vw;
        }

        #extra-controls {
          display: none;
        }

        #settings-pane {
          width: 60vw;
        }

        aside {
          display: none;
        }

        #mobile-toolbar {
          display: block;
          border-radius: 12px 12px 0px 0px;
        }

        #controls, #filters {
          display: grid;
          grid-template-columns: auto auto;
          justify-content: unset;
          min-width: unset;
          gap: 0px 10px;
          margin-bottom: 2em;
        }

        #canvasMain .tabletFilters {
          display: none;
        }
      }

      @media(max-width: 1200px) and (min-width: 800px) {
        #remove-image {
          position: fixed;
          bottom: 0px;
          right: 10px;
          width: 10.5em;
          z-index: 8;
        }
      }

      #filters.duoFilters {
        display: none;
      }

      @media(horizontal-viewport-segments: 2) {
        #filters.duoFilters {
          display: flex;
        }

        #canvasMain {
          display: initial;
        }

        #canvasMain .tabletFilters {
          display: none;
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

        #controls, #filters {
          flex-direction: column;
        }

        #controls sl-button, #filters sl-button {
          border-radius: 6px;
          padding: 6px;
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

      @media(vertical-viewport-segments: 2) {
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
    window.fabric = fabricPureBrowser.fabric;

    const working = await get("current_file");

    if (working) {
      this.org = working;

      await this.updateComplete;

      this.canvas = this.shadowRoot?.querySelector("app-canvas");

      if (working) {
        this.canvas?.openFromJSON(working);
      }
    }

    navigator.serviceWorker.addEventListener('message', (event) => {
      const imageBlob = event.data.file;

      if (imageBlob) {
        this.handleSharedImage(imageBlob);
      }
    });

    this.fileHandler();

    const search = new URLSearchParams(location.search);
    const file_name = search.get("file");
    console.log(file_name);

    if (file_name) {
      const files = await get("saved_files");

      if (files) {
        files.forEach(async (file: any) => {
          if (file.name === file_name) {
            const blob = file.preview;
            this.org = blob;

            await this.updateComplete;

            this.canvas = this.shadowRoot?.querySelector("app-canvas");
            this.canvas?.openFromJSON(file.canvas);

            await set("current_file", file.canvas);
          }
        })
      }
    }

    this.swipeHandler();
  }

  swipeHandler() {
    const el = this.shadowRoot?.querySelector("#mobile-toolbar");

    console.log('el', el);

    if (el) {
      // @ts-ignore
      const swiper = new Swipe(el);

      swiper.onUp((ev: any) => {
        //Your code goes here

        console.log('here', ev);

        el.animate([
          {
            transform: "translateY(0em)"
          }
        ], {
          duration: 200,
          easing: "ease-out",
          fill: "forwards"
        })
      });

      swiper.onDown((ev: any) => {
        el.animate([
          {
            transform: "translateY(30em)"
          }
        ], {
          duration: 200,
          easing: "ease-out",
          fill: "forwards"
        })
      })

      swiper.run()
    }
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
    const blobs = await fileOpen({
      mimeTypes: ['image/*'],
      multiple: true
    });

    if (blobs) {
      this.org = blobs;

      blobs.forEach(async (blob) => {
        await this.updateComplete;

        this.canvas = this.shadowRoot?.querySelector("app-canvas");

        this.canvas?.drawImage(blob);

        await set("current_file", this.canvas?.writeToJSON());
      })
    }

    await this.updateComplete;

    this.swipeHandler();

    localStorage.setItem("done-with-tut", "true");
  }

  async openFolder() {
    const options = {
      // Set to `true` to recursively open files in all subdirectories,
      // defaults to `false`.
      recursive: true,
    };

    const blobs = await directoryOpen(options);

    // await this.updateComplete;

    if (blobs) {
      console.log('blobs', blobs);
      this.org = blobs;

      blobs.forEach(async (blob) => {
        this.canvas = this.shadowRoot?.querySelector("app-canvas");

        this.canvas?.drawImage(blob);
      });

      await set("current_file", this.canvas?.writeToJSON());
    }

    await this.updateComplete;

    this.swipeHandler();

    localStorage.setItem("done-with-tut", "true");

  }

  async handleSharedImage(blob: Blob | File) {
    if (blob) {
      this.org = blob;

      await this.updateComplete;

      this.canvas = this.shadowRoot?.querySelector("app-canvas");

      this.canvas?.drawImage(blob);

      await this.updateComplete;

      await set("current_file", this.canvas?.writeToJSON());

      this.swipeHandler();
    }
  }

  async filter(type: string, value?: number) {
    await this.canvas?.applyWebglFilter(type, value);

    this.currentFilter = type;

    if (type === "blur" || type === "brightness") {
      this.intensity = true;
    }

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

  async revert() {
    this.canvas?.revert();

    await set("current_file", this.canvas?.writeToJSON());
  }

  async save() {
    (this.shadowRoot?.querySelector("save-modal") as any)?.openModal();
  }

  saveCanvas() {
    this.canvas?.save();
  }

  async share() {
    this.canvas?.shareImage();
  }

  async remove() {
    this.canvas?.removeObject();

    await set("current_file", this.canvas?.writeToJSON());
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

  async handleColor(color: string) {
    console.log(color);
    await this.canvas?.changeBackgroundColor(color);

    await set("current_file", this.canvas?.writeToJSON());
  }

  penMode(ev: boolean) {
    console.log(ev);

    this.pen_mode = ev;

    this.canvas?.handlePenMode(this.pen_mode);
  }

  async handleIntensity(value: number) {
    console.log(value);
    if (this.currentFilter) {
      if (this.currentFilter === "brightness") {
        await this.filter(this.currentFilter, value * 10);
      }
      else {
        await this.filter(this.currentFilter, value);
      }
    }
  }

  async addText() {
    this.canvas?.handleText();

    await set("current_file", this.canvas?.writeToJSON());
  }

  handleObjectSelected() {
    console.log('object selected');
    this.removeShow = true;
  }

  handleObjectCleared() {
    this.removeShow = false;
  }

  render() {
    return html`
      <save-modal @saved="${() => this.saveCanvas()}"></save-modal>

        <div id="layout">
        <aside>
            <div id="controls">
              <sl-button type="primary" id="choosePhoto" @click="${() => this.openPhoto()}">Add Photos <ion-icon name="add-outline"></ion-icon></sl-button>
              <sl-button id="chooseFolder" @click="${() => this.openFolder()}">Add Folder <ion-icon name="folder-outline"></ion-icon></sl-button>
              <sl-button type="success" @click="${() => this.save()}">Save Copy <ion-icon name="save-outline"></ion-icon></sl-button>
              <sl-button @click="${() => this.share()}" id="shareButton">Share <ion-icon name="share-outline"></ion-icon></sl-button>

              <sl-button type="danger" @click="${() => this.revert()}">undo <ion-icon name="arrow-undo-outline"></ion-icon></sl-button>
              ${this.removeShow ? html`
              <sl-animation name="bounce" easing="ease-in-out" duration="400" iterations="1" play>
                <sl-button type="danger" id="remove-image" @click="${() => this.remove()}">Remove <ion-icon name="trash-outline"></ion-icon></sl-button>
              </sl-animation>
              ` : null}

              <pwa-install>Install SimpleEdit</pwa-install>

              <a href="/gallery">
                Gallery
              </a>

              <sl-button id="advanced" @click="${() => this.doSettings()}">Settings <ion-icon name="settings-outline"></ion-icon></sl-button>
            </div>

            <div id="filters" class="duoFilters">
                <div class="menu-label">
                  <span id="filters-label">Filters</span>
                </div>

                <sl-button @click="${() => this.filter("grayscale")}">desaturate</sl-button>
                <sl-button @click="${() => this.filter("pixelate")}">pixelate</sl-button>
                <sl-button @click="${() => this.filter("invert")}">invert</sl-button>
                <sl-button @click="${() => this.filter("blur")}">blur</sl-button>
                <sl-button @click="${() => this.filter("sepia")}">sepia</sl-button>
                <sl-button @click="${() => this.filter("saturation")}">saturate</sl-button>
                <sl-button @click="${() => this.filter("brightness")}">brighten</sl-button>
                <sl-button @click="${() => this.filter("contrast")}">contrast</sl-button>

                <div id="otherControls">
                  <div class="menu-label">
                    <span id="order-label">Order</span>
                  </div>

                  <sl-button @click="${() => this.handleBringFront()}">Bring to Front</sl-button>
                  <sl-button @click="${() => this.handleBringForward()}">Bring Forward</sl-button>
                  <sl-button @click="${() => this.handleSendToBack()}">Send to Back</sl-button>
                  <sl-button @click="${() => this.handleSendBackward()}">Send Backward</sl-button>


                    <div class="menu-label add-header">
                      <span>Add</span>
                    </div>

                    <sl-button @click="${() => this.addText()}">Add Text</sl-button>
                </div>
              </div>


          </aside>

          <main id="canvasMain">

          <div id="filters" class="tabletFilters">
                <div class="menu-label">
                  <span id="filters-label">Filters</span>
                </div>

                <sl-button @click="${() => this.filter("grayscale")}">desaturate</sl-button>
                <sl-button @click="${() => this.filter("pixelate")}">pixelate</sl-button>
                <sl-button @click="${() => this.filter("invert")}">invert</sl-button>
                <sl-button @click="${() => this.filter("blur")}">blur</sl-button>
                <sl-button @click="${() => this.filter("sepia")}">sepia</sl-button>
                <sl-button @click="${() => this.filter("saturation")}">saturate</sl-button>
                <sl-button @click="${() => this.filter("brightness")}">brighten</sl-button>
                <sl-button @click="${() => this.filter("contrast")}">contrast</sl-button>

                <div id="otherControls">
                  <div class="menu-label">
                    <span id="order-label">Order</span>
                  </div>

                  <sl-button @click="${() => this.handleBringFront()}">Bring to Front</sl-button>
                  <sl-button @click="${() => this.handleBringForward()}">Bring Forward</sl-button>
                  <sl-button @click="${() => this.handleSendToBack()}">Send to Back</sl-button>
                  <sl-button @click="${() => this.handleSendBackward()}">Send Backward</sl-button>


                    <div class="menu-label add-header">
                      <span>Add</span>
                    </div>

                    <sl-button @click="${() => this.addText()}">Add Text</sl-button>
                </div>
              </div>

            <drag-drop @got-file="${(event: any) => this.handleSharedImage(event.detail.file)}"><app-canvas @object-selected="${() => this.handleObjectSelected()}" @object-cleared="${() => this.handleObjectCleared()}"></app-canvas></drag-drop>
          </main>

          <div id="mobile-toolbar">
          <div id="pill-box">
            <div id="pill"></div>
          </div>

          <div id="controls">
              <sl-button id="choosePhoto" @click="${() => this.openPhoto()}">Add Photos <ion-icon name="add-outline"></ion-icon></sl-button>
              <sl-button @click="${() => this.save()}">Save Copy <ion-icon name="save-outline"></ion-icon></sl-button>
              <sl-button @click="${() => this.share()}" id="shareButton">Share <ion-icon name="share-outline"></ion-icon></sl-button>

              <sl-button @click="${() => this.revert()}">undo <ion-icon name="arrow-undo-outline"></ion-icon></sl-button>
              ${this.removeShow ? html`
              <sl-animation name="bounce" easing="ease-in-out" duration="400" iterations="1" play>
                <sl-button id="remove-image" @click="${() => this.remove()}">Remove <ion-icon name="trash-outline"></ion-icon></sl-button>
              </sl-animation>
              ` : null}

              <sl-button id="advanced" @click="${() => this.doSettings()}">Settings <ion-icon name="settings-outline"></ion-icon></sl-button>
            </div>


              <div id="filters">
                <sl-button @click="${() => this.filter("grayscale")}">desaturate</sl-button>
                <sl-button @click="${() => this.filter("pixelate")}">pixelate</sl-button>
                <sl-button @click="${() => this.filter("invert")}">invert</sl-button>
                <sl-button @click="${() => this.filter("blur")}">blur</sl-button>
                <sl-button @click="${() => this.filter("sepia")}">sepia</sl-button>
                <sl-button @click="${() => this.filter("saturation")}">saturate</sl-button>
                <sl-button @click="${() => this.filter("brightness")}">brighten</sl-button>
                <sl-button @click="${() => this.filter("contrast")}">contrast</sl-button>
              </div>

                <div id="otherControls">
                  <div class="menu-label">
                    <span id="order-label">Order</span>
                  </div>

                  <sl-button @click="${() => this.handleBringFront()}">Bring to Front</sl-button>
                  <sl-button @click="${() => this.handleBringForward()}">Bring Forward</sl-button>
                  <sl-button @click="${() => this.handleSendToBack()}">Send to Back</sl-button>
                  <sl-button @click="${() => this.handleSendBackward()}">Send Backward</sl-button>
                </div>
    </div>
        </div>

        <div
        style=${styleMap({
            display: this.handleSettings ? "initial" : "none"
          })}
          id="settings-pane">
          <div id="settings-header">
            <h3>Settings</h3>

            <sl-button @click="${() => this.doSettings()}">
              Close
            </sl-button>
          </div>

          <div class="setting">
            <div class="setting-header">
              <label id="color-label" for="color">Canvas Background Color</label>
              <p>Change the background color of your canvas</p>
            </div>
            <input @change="${(ev: any) => this.handleColor(ev.target.value)}" id="color" name="color" type="color"></input>
          </div>

          <div class="setting colorCard">
            <div class="setting-header">
              <label id="color-label" for="color">Drawing Mode</label>
              <p>Draw on your collage with your pen, mouse or touch!</p>
            </div>

            <sl-switch value="${this.pen_mode || false}" @change="${(ev: any) => this.penMode(ev.target.checked)}">
            </sl-switch>
          </div>
        </div>
      </div>
    `;
  }
}
