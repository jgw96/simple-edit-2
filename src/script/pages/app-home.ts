import { LitElement, css, html, customElement, property, internalProperty } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';

import '../components/app-canvas';
import '../components/drag-drop';
import '../components/save-modal';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';
import { directoryOpen, fileOpen } from 'browser-fs-access';
import { AppCanvas } from '../components/app-canvas';
import { Swipe } from '../utils/swipe';
import { get } from 'idb-keyval';


@customElement('app-home')
export class AppHome extends LitElement {
  // For more information on using properties in lit-element
  // check out this link https://lit-element.polymer-project.org/guide/properties#declare-with-decorators
  @property() message = 'Welcome!';

  @internalProperty() canvas: AppCanvas | undefined | null;
  @internalProperty() org: File | Array<File> | Array<Blob> | Blob | undefined | null;

  @internalProperty() handleSettings = false;

  @internalProperty() pen_mode: boolean | undefined;

  @internalProperty() intensity: boolean | undefined;

  @internalProperty() saving = false;
  @internalProperty() removeShow = false;

  settingsAni: Animation | undefined;

  currentFilter: string | undefined;

  static get styles() {
    return css`

    .menu-label {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 14px;
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

    #otherControls fluent-button {
      width: 97%;
    }

    fluent-button::part(content) {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    fluent-button ion-icon {
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

      aside fluent-button {
        margin-bottom: 6px;
      }

      #controls, #filters {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
      }

      #filters {
        flex-direction: row;
        justify-content: flex-end;
      }

      #controls fluent-button, #filters fluent-button {
        margin-bottom: 10px;
        margin-right: 6px;
      }

      #choosePhoto {
        margin-bottom: 1em;
        background: var(--accent-fill-hover);
      }

      #chooseFolder {
        background: var(--accent-fill-rest);
      }

      #shareButton {
        margin-bottom: 1em;
      }

      fluent-progress-ring {
        position: fixed;
        bottom: -26px;
        right: 16px;
      }

      #getting-started-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        padding-bottom: 2em;
        background-color: rgb(107 99 255);
        border-radius: 10px;
      }

      #getting-started-backer {
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: rgb(14 14 14) 0px 2px 11px 2px;
        border-radius: 10px;
        margin: 6em;
        margin-top: 7em;
        /* background: rgba(38, 38, 38, 0); */
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

      #getting-started img {
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
        height: 280px;
        margin-top: 4em;
      }

      #getting-started fluent-button {
        width: 132px;
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

        height: 94vh;
        transform: translateY(30em);
      }

      #controls #advanced {
        margin-left: 1em;

        position: fixed;
        top: 10px;
        right: 16px;
      }

      #mobile-toolbar #advanced {
        display: none;
        position: initial;
        margin-left: 0;
      }

      #mobile-toolbar #otherControls fluent-button {
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

        animation-name: slideup;
        animation-duration: 300ms;
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

      #extra-controls fluent-slider {
        width: 12em;
        margin-left: 6px;
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

        #controls fluent-button, #filters fluent-button, #otherControls fluent-button {
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

        #getting-started-backer {
          margin: 4em 1em;
        }

        #getting-started {
          text-align: center;
          font-size: 10px;
          width: 280px;
        }

        #getting-started img {
          width: 280px;
          margin-top: 0em;
        }

        #getting-started h2 {
          font-size: 2em;
          text-align: center;
          margin-top: 0px;
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

      @media(min-width: 1200px) {
        #getting-started-backer {
          margin: 4em;
          margin-left: 12em;
          margin-right: 12em;
        }
      }

      #filters.duoFilters {
        display: none;
      }

      @media(horizontal-viewport-segments: 2) {
        #getting-started-backer {
          width: 44vw;
          margin: 2em;
        }

        #filters.duoFilters {
          display: flex;
        }

        #canvasMain {
          display: initial;
        }

        #canvasMain .tabletFilters {
          display: none;
        }

        #getting-started-wrapper {
          margin-top: 2em;
        }

        #getting-started img {
          width: 444px;
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

        #controls fluent-button, #filters fluent-button {
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

        #getting-started-wrapper {
          margin: 0em 1em;
        }

        #getting-started {
          width: 444px;
        }

        #getting-started img {
          width: 444px;
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

    const search = new URLSearchParams(location.search);
    const file_name = search.get("file");

    if (file_name) {
      const files = await get("files");

      if (files) {
        files.forEach(async (file) => {
          if (file.name === file_name) {
            const blob = await file.handle.getFile();

            await this.updateComplete;

            this.canvas = this.shadowRoot?.querySelector("app-canvas");

            this.canvas?.drawImage(blob);
          }
        })
      }
    }
  }

  swipeHandler() {
    const el = this.shadowRoot?.querySelector("#mobile-toolbar");

    console.log('el', el);

    if (el) {
      const swiper = new Swipe(el);

      swiper.onUp((ev) => {
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

      swiper.onDown((ev) => {
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
      })
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

      this.swipeHandler();
    }
  }

  async filter(type: string, value?: number) {
    await this.canvas?.applyWebglFilter(type, value);

    this.currentFilter = type;

    if (type === "blur" || type === "brightness") {
      this.intensity = true;
    }
  }

  async handleBringForward() {
    await this.canvas?.bringForwardObject();
  }

  async handleBringFront() {
    await this.canvas?.bringToFront();
  }

  async handleSendBackward() {
    await this.canvas?.sendBackward();
  }

  async handleSendToBack() {
    await this.canvas?.sendToBack();
  }

  revert() {
    this.canvas?.revert();
  }

  async save() {
    this.saving = !this.saving;
  }

  saveCanvas() {
    this.canvas?.save();
    this.saving = !this.saving;
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

  addText() {
    this.canvas?.handleText()
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
      <save-modal @saved="${() => this.saveCanvas()}" ?hiddenModal="${this.saving ? false : true}"></save-modal>

      <div>
      ${!this.org ? html`<div id="getting-started-backer"><div id="getting-started-wrapper">
              <div id="getting-started">
                <div class="getting-started-item">
                  <img src="/assets/started.svg">
                  <h2>Welcome to SimpleEdit!</h2>

                  <fluent-button @click="${() => this.scrollRight()}">Next</fluent-button>
                </div>

                <div class="getting-started-item">
                  <img src="/assets/started_two.svg">
                  <h2>Quickly edit your photos, create collages and more</h2>

                  <fluent-button @click="${() => this.scrollRight()}">Next</fluent-button>
                </div>

                <div class="getting-started-item">
                  <img src="/assets/started_three.svg">
                  <h2>Tap Choose Photo to get started!</h2>

                  <fluent-button id="choosePhoto" @click="${() => this.openPhoto()}">Choose Photos <ion-icon name="add-outline"></ion-icon></fluent-button>
                </div>
               </div>
              </div></div>` : null}

        <div id="layout">
        ${this.org ? html`<aside>
            <div id="controls">
              <fluent-button id="choosePhoto" @click="${() => this.openPhoto()}">Add Photos <ion-icon name="add-outline"></ion-icon></fluent-button>
              <fluent-button id="chooseFolder" @click="${() => this.openFolder()}">Add Folder <ion-icon name="folder-outline"></ion-icon></fluent-button>
              <fluent-button @click="${() => this.save()}">Save Copy <ion-icon name="save-outline"></ion-icon></fluent-button>
              <fluent-button @click="${() => this.share()}" id="shareButton">Share <ion-icon name="share-outline"></ion-icon></fluent-button>

              <fluent-button @click="${() => this.revert()}">undo <ion-icon name="arrow-undo-outline"></ion-icon></fluent-button>
              ${this.removeShow ? html`<fluent-button id="remove-image" @click="${() => this.remove()}">Remove <ion-icon name="trash-outline"></ion-icon></fluent-button>` : null}

              <fluent-button id="advanced" @click="${() => this.doSettings()}">Settings <ion-icon name="settings-outline"></ion-icon></fluent-button>
            </div>

            <div id="filters" class="duoFilters">
                <div class="menu-label">
                  <span id="filters-label">Filters</span>
                </div>

                <fluent-button @click="${() => this.filter("grayscale")}">desaturate</fluent-button>
                <fluent-button @click="${() => this.filter("pixelate")}">pixelate</fluent-button>
                <fluent-button @click="${() => this.filter("invert")}">invert</fluent-button>
                <fluent-button @click="${() => this.filter("blur")}">blur</fluent-button>
                <fluent-button @click="${() => this.filter("sepia")}">sepia</fluent-button>
                <fluent-button @click="${() => this.filter("saturation")}">saturate</fluent-button>
                <fluent-button @click="${() => this.filter("brightness")}">brighten</fluent-button>

                <div id="otherControls">
                  <div class="menu-label">
                    <span id="order-label">Order</span>
                  </div>

                  <fluent-button @click="${() => this.handleBringFront()}">Bring to Front</fluent-button>
                  <fluent-button @click="${() => this.handleBringForward()}">Bring Forward</fluent-button>
                  <fluent-button @click="${() => this.handleSendToBack()}">Send to Back</fluent-button>
                  <fluent-button @click="${() => this.handleSendBackward()}">Send Backward</fluent-button>


                    <div class="menu-label">
                      <span>Add</span>
                    </div>

                    <fluent-button @click="${() => this.addText()}">Add Text</fluent-button>
                </div>
              </div>


          </aside>` : null}

          ${
            this.intensity ? html`<div id="extra-controls">
              <div>
                <label for="intensity">Intensity</label>
                <fluent-slider @change="${(ev) => this.handleIntensity(ev.target.value)}" name="intensity" id="intensity" min="0" max="1" step="0.1" value="0.5">
                </fluent-slider>
              </div>
            </div>` : null
          }

          <main id="canvasMain">

          ${ this.org ? html`<div id="filters" class="tabletFilters">
                <div class="menu-label">
                  <span id="filters-label">Filters</span>
                </div>

                <fluent-button @click="${() => this.filter("grayscale")}">desaturate</fluent-button>
                <fluent-button @click="${() => this.filter("pixelate")}">pixelate</fluent-button>
                <fluent-button @click="${() => this.filter("invert")}">invert</fluent-button>
                <fluent-button @click="${() => this.filter("blur")}">blur</fluent-button>
                <fluent-button @click="${() => this.filter("sepia")}">sepia</fluent-button>
                <fluent-button @click="${() => this.filter("saturation")}">saturate</fluent-button>
                <fluent-button @click="${() => this.filter("brightness")}">brighten</fluent-button>

                <div id="otherControls">
                  <div class="menu-label">
                    <span id="order-label">Order</span>
                  </div>

                  <fluent-button @click="${() => this.handleBringFront()}">Bring to Front</fluent-button>
                  <fluent-button @click="${() => this.handleBringForward()}">Bring Forward</fluent-button>
                  <fluent-button @click="${() => this.handleSendToBack()}">Send to Back</fluent-button>
                  <fluent-button @click="${() => this.handleSendBackward()}">Send Backward</fluent-button>


                    <div class="menu-label">
                      <span>Add</span>
                    </div>

                    <fluent-button @click="${() => this.addText()}">Add Text</fluent-button>
                </div>
              </div>` : null }

            ${this.org ? html`<drag-drop @got-file="${(event: any) => this.handleSharedImage(event.detail.file)}"><app-canvas @object-selected="${() => this.handleObjectSelected()}" @object-cleared="${() => this.handleObjectCleared()}"></app-canvas></drag-drop>` : null}
          </main>

          ${this.org ? html` <div id="mobile-toolbar">
          <div id="pill-box">
            <div id="pill"></div>
          </div>

          <div id="controls">
              <fluent-button id="choosePhoto" @click="${() => this.openPhoto()}">Add Photos <ion-icon name="add-outline"></ion-icon></fluent-button>
              <fluent-button @click="${() => this.save()}">Save Copy <ion-icon name="save-outline"></ion-icon></fluent-button>
              <fluent-button @click="${() => this.share()}" id="shareButton">Share <ion-icon name="share-outline"></ion-icon></fluent-button>

              <fluent-button @click="${() => this.revert()}">undo <ion-icon name="arrow-undo-outline"></ion-icon></fluent-button>
              ${this.removeShow ? html`<fluent-button id="remove-image" @click="${() => this.remove()}">Remove <ion-icon name="trash-outline"></ion-icon></fluent-button>` : null}

              <fluent-button id="advanced" @click="${() => this.doSettings()}">Settings <ion-icon name="settings-outline"></ion-icon></fluent-button>
            </div>

            ${this.org ? html`
              <div id="filters">
                <fluent-button @click="${() => this.filter("grayscale")}">desaturate</fluent-button>
                <fluent-button @click="${() => this.filter("pixelate")}">pixelate</fluent-button>
                <fluent-button @click="${() => this.filter("invert")}">invert</fluent-button>
                <fluent-button @click="${() => this.filter("blur")}">blur</fluent-button>
                <fluent-button @click="${() => this.filter("sepia")}">sepia</fluent-button>
                <fluent-button @click="${() => this.filter("saturation")}">saturate</fluent-button>
                <fluent-button @click="${() => this.filter("brightness")}">brighten</fluent-button>
              </div>
              ` : null
        }
                <div id="otherControls">
                  <div class="menu-label">
                    <span id="order-label">Order</span>
                  </div>

                  <fluent-button @click="${() => this.handleBringFront()}">Bring to Front</fluent-button>
                  <fluent-button @click="${() => this.handleBringForward()}">Bring Forward</fluent-button>
                  <fluent-button @click="${() => this.handleSendToBack()}">Send to Back</fluent-button>
                  <fluent-button @click="${() => this.handleSendBackward()}">Send Backward</fluent-button>
                </div>
    </div>` : null}
        </div>

        <div
        style=${styleMap({
            display: this.handleSettings ? "initial" : "none"
          })}
          id="settings-pane">
          <div id="settings-header">
            <h3>Settings</h3>

            <fluent-button @click="${() => this.doSettings()}">
              Close
            </fluent-button>
          </div>

          <div class="setting">
            <div class="setting-header">
              <label id="color-label" for="color">Canvas Background Color</label>
              <p>Change the background color of your canvas</p>
            </div>
            <input @change="${(ev) => this.handleColor(ev.target.value)}" id="color" name="color" type="color"></input>
          </div>

          <div class="setting colorCard">
            <div class="setting-header">
              <label id="color-label" for="color">Drawing Mode</label>
              <p>Draw on your collage with your pen, mouse or touch!</p>
            </div>

            <fluent-switch value="${this.pen_mode || false}" @change="${(ev) => this.penMode(ev.target.checked)}">
              <span slot="checked-message">on</span>
              <span slot="unchecked-message">off</span>
            </fluent-switch>
          </div>
        </div>

        <pwa-install>Install PWA Starter</pwa-install>
      </div>
    `;
  }
}
