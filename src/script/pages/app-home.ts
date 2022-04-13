import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
//@ts-ignore
import fabricPureBrowser from "https://cdn.skypack.dev/fabric-pure-browser";

import "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.63/dist/components/button/button.js";
import "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.63/dist/components/animation/animation.js";
import "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.63/dist/components/drawer/drawer.js";
import "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.63/dist/components/color-picker/color-picker.js";

import "../components/app-canvas";
import "../components/drag-drop";
import "../components/save-modal";
import "../components/common-controls";

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import "@pwabuilder/pwainstall";
import { directoryOpen, fileOpen } from "browser-fs-access";
import { AppCanvas } from "../components/app-canvas";
import { get, set } from "idb-keyval";

import { IdleQueue } from "idlize/IdleQueue.mjs";
import { IdleValue } from "idlize/IdleValue.mjs";

@customElement("app-home")
export class AppHome extends LitElement {
  // For more information on using properties in lit-element
  // check out this link https://lit-element.polymer-project.org/guide/properties#declare-with-decorators

  @state() canvas: AppCanvas | undefined | null;
  @state() org:
    | File
    | Array<File>
    | Array<Blob>
    | Blob
    | undefined
    | null = undefined;

  @state() handleSettings = false;

  @state() pen_mode: boolean | undefined;

  @state() intensity: boolean | undefined;

  @state() saving = false;
  @state() removeShow = false;

  @state() menuOpen = false;

  fabric: any;

  menuAnimation: Animation | undefined;

  currentFilter: string | undefined;

  static get styles() {
    return css`
      #menu-close {
        margin-left: 6px;
        margin-bottom: 1em;
      }

      .menu-label {
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 14px;
      }

      pwa-install {
        position: fixed;
        right: 14.4em;
        z-index: 2;
        top: 3.11em;
        display: none;
      }

      pwa-install::part(openButton) {
        border-radius: 2px;
        background-color: var(--sl-color-primary-600);

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

        position: absolute;
        top: 0;
        height: env(titlebar-area-height, 33px);
        margin-top: 0;
        z-index: 999999;

        app-region: no-drag;

        margin-right: 0;

        left: calc(env(titlebar-area-x, 0px) + 26px);

        animation-name: slideup;
        animation-duration: 280ms;
        animation-timing-function: "ease-in-out";
      }

      #menuToggler {
        position: absolute;
        bottom: 16px;
        right: 16px;
      }

      aside sl-button {
        margin-bottom: 6px;
      }

      #controls,
      #filters {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
      }

      #controls a {
        width: 5em;
        text-align: center;
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

        right: 10.5em;

        height: 38px;
        top: 3.75em;
        border-radius: 4px;
        border: solid 1px #43434a;

        font-size: var(--sl-button-font-size-medium);
        line-height: calc(
          var(--sl-input-height-medium) - var(--sl-input-border-width) * 2
        );
        border-radius: var(--sl-input-border-radius-medium);
        top: 3.5em;

        display: none;
      }

      @media (prefers-color-scheme: light) {
        #controls a {
          color: white;
        }
      }

      #filters {
        flex-direction: row;
        justify-content: flex-end;
        height: 86vh;
        overflow-y: auto;
      }

      #controls sl-button,
      #filters sl-button {
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
        display: block;
        border-radius: 12px 12px 0px 0px;
        position: fixed;
        background: rgb(19, 19, 19);
        padding: 10px;
        overflow-y: auto;
        top: 0px;
        height: initial;
        transform: translateX(-100%);
        left: 0px;
        right: 0px;
        bottom: 0px;
      }

      #controls #advanced {
        position: fixed;
        right: calc(env(titlebar-area-width, 53vw) - 37.7em);
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

      @media (prefers-color-scheme: light) {
        .setting {
          background: #f3f3f3;
        }
      }

      .colorCard {
        display: none;
      }

      .setting .setting-header {
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

      @media (max-width: 800px) {
        pwa-install {
          left: 12px;
          bottom: 12px;
        }

        #controls sl-button,
        #filters sl-button,
        #otherControls sl-button {
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

        #controls,
        #filters {
          display: grid;
          grid-template-columns: auto auto;
          justify-content: unset;
          min-width: unset;
          gap: 0px 10px;
          margin-bottom: 2em;
        }

        #filters {
          height: initial;
        }

        .tabletFilters {
          display: none;
        }
      }

      @media (min-width: 800px) {
        #mobile-toolbar {
          display: none;
        }

        #menuToggler {
          display: none;
        }

        #controls {
          z-index: 9999;
          margin-left: 12px;
        }
      }

      @media (max-width: 1200px) and (min-width: 800px) {
        #remove-image {
          position: fixed;
          bottom: 0px;
          right: 10px;
          width: 10.5em;
          z-index: 8;
        }
      }

      .duoFilters {
        display: none;
      }

      #advanced {
        display: none;
      }

      @media (horizontal-viewport-segments: 2) {
        .duoFilters {
          display: flex;
        }

        #canvasMain {
          display: initial;
        }

        .tabletFilters {
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
          height: initial;
          position: unset;
          padding-top: 12px;
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
    const queue = new IdleQueue({
      ensureTasksRun: true,
      defaultMinTaskTime: 500,
    });

    queue.pushTask(() => {
      console.log("initializing Fabric", window.fabric);
      // import("../fabric.min.js");
      window.fabric = fabricPureBrowser.fabric;
    });

    queue.pushTask(async () => {
      console.log("initializing current_file work");
      const working = await get("current_file");

      if (working) {
        this.org = working;

        await this.updateComplete;

        this.canvas = this.shadowRoot?.querySelector("app-canvas");

        if (working) {
          this.canvas?.openFromJSON(working);
        }
      }
    });

    navigator.serviceWorker.addEventListener("message", (event) => {
      const imageBlob = new IdleValue(() => {
        return event.data.file;
      });

      if (imageBlob.getValue()) {
        this.handleSharedImage(imageBlob.getValue());
      }
    });

    queue.pushTask(() => {
      console.log("initilalizing fileHandling");
      this.fileHandler();
    });

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
        });
      }
    }
  }

  toggleMobileMenu() {
    const el = this.shadowRoot?.querySelector("#mobile-toolbar");

    if (el) {
      if (this.menuOpen === false) {
        this.menuAnimation = el.animate(
          [
            {
              transform: "translateX(0px)",
            },
          ],
          {
            duration: 200,
            easing: "ease-out",
            fill: "forwards",
          }
        );

        this.menuOpen = true;
      } else {
        if (this.menuAnimation) {
          (this.menuAnimation as Animation).reverse();

          this.menuOpen = false;
        }
      }
    }
  }

  async fileHandler() {
    if ("launchQueue" in window) {
      (window as any).launchQueue.setConsumer(async (launchParams: any) => {
        if (!launchParams.files.length) {
          return;
        }

        const fileHandle = launchParams.files[0];
        console.log("fileHandle", fileHandle);

        await this.handleSharedImage(fileHandle);
      });
    }
  }

  async openPhoto() {
    const blobs = await fileOpen({
      mimeTypes: ["image/*"],
      multiple: true,
    });

    if (blobs) {
      this.org = blobs;

      blobs.forEach(async (blob) => {
        await this.updateComplete;

        this.canvas = this.shadowRoot?.querySelector("app-canvas");

        this.canvas?.drawImage(blob);

        await set("current_file", this.canvas?.writeToJSON());
      });
    }

    await this.updateComplete;

    localStorage.setItem("done-with-tut", "true");

    this.toggleMobileMenu();
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
      console.log("blobs", blobs);
      this.org = blobs;

      blobs.forEach(async (blob) => {
        this.canvas = this.shadowRoot?.querySelector("app-canvas");

        this.canvas?.drawImage(blob);
      });

      await set("current_file", this.canvas?.writeToJSON());
    }

    await this.updateComplete;

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
    }
  }

  async revert() {
    this.canvas?.revert();

    await set("current_file", this.canvas?.writeToJSON());
  }

  async save() {
    (this.shadowRoot?.querySelector("save-modal") as any)?.openModal();

    this.toggleMobileMenu();
  }

  saveCanvas() {
    this.canvas?.save();
  }

  async share() {
    this.canvas?.shareImage();

    this.toggleMobileMenu();
  }

  async remove() {
    this.canvas?.removeObject();

    await set("current_file", this.canvas?.writeToJSON());

    this.toggleMobileMenu();
  }

  async doSettings() {
    if (!this.handleSettings) {
      (this.shadowRoot?.querySelector(".drawer") as any)?.show();
      this.handleSettings = true;
    } else {
      (this.shadowRoot?.querySelector(".drawer") as any)?.hide();
      this.handleSettings = false;
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

  handleObjectSelected() {
    console.log("object selected");
    this.removeShow = true;
  }

  handleObjectCleared() {
    this.removeShow = false;
  }

  handleDone() {
    this.toggleMobileMenu();
  }

  render() {
    return html`
      <save-modal @saved="${() => this.saveCanvas()}"></save-modal>

        <div id="layout">
        <aside>
            <div id="controls">
              <sl-button size="small" variant="primary" id="choosePhoto" @click="${() =>
                this.openPhoto()}">Add Photos <ion-icon name="add-outline"></ion-icon></sl-button>
              <sl-button size="small" id="chooseFolder" @click="${() =>
                this.openFolder()}">Add Folder <ion-icon name="folder-outline"></ion-icon></sl-button>
              <sl-button size="small" @click="${() =>
                this.save()}">Export <ion-icon name="save-outline"></ion-icon></sl-button>
              <sl-button size="small" @click="${() =>
                this.share()}" id="shareButton">Share <ion-icon name="share-outline"></ion-icon></sl-button>

              <sl-button size="small" @click="${() =>
                this.revert()}">undo <ion-icon name="arrow-undo-outline"></ion-icon></sl-button>
              ${
                this.removeShow
                  ? html`
                      <sl-animation
                        name="bounce"
                        easing="ease-in-out"
                        duration="400"
                        iterations="1"
                        play
                      >
                        <sl-button
                          variant="danger"
                          size="small"
                          id="remove-image"
                          @click="${() => this.remove()}"
                          >Remove <ion-icon name="trash-outline"></ion-icon
                        ></sl-button>
                      </sl-animation>
                    `
                  : null
              }

              <pwa-install>Install SimpleEdit</pwa-install>

              <a href="/gallery">
                Gallery
              </a>

              <sl-button size="small" id="advanced" @click="${() =>
                this.doSettings()}">Settings <ion-icon name="settings-outline"></ion-icon></sl-button>
            </div>

            <!--extracting -->
            <common-controls class="duoFilters" .canvas="${this.canvas}" @filter-done="${() => this.handleDone()}"></common-controls>


          </aside>

          <main id="canvasMain">

          <!-- extracting -->
          <common-controls class="tabletFilters" .canvas="${this.canvas}" @filter-done="${() => this.handleDone()}"></common-controls>

            <drag-drop @got-file="${(event: any) =>
              this.handleSharedImage(
                event.detail.file
              )}"><app-canvas @object-selected="${() =>
      this.handleObjectSelected()}" @object-cleared="${() =>
      this.handleObjectCleared()}"></app-canvas></drag-drop>
          </main>

          <!-- mobile menu toggler -->
          <sl-button id="menuToggler" variant="primary" @click="${() =>
            this.toggleMobileMenu()}">Menu</sl-button>

          <div id="mobile-toolbar">
           <sl-button variant="primary" id="menu-close" @click="${() =>
             this.toggleMobileMenu()}">Close</sl-button>

          <div id="controls">
              <sl-button variant="primary" id="choosePhoto" @click="${() =>
                this.openPhoto()}">Add Photos <ion-icon name="add-outline"></ion-icon></sl-button>
              <sl-button variant="success" @click="${() =>
                this.save()}">Export <ion-icon name="save-outline"></ion-icon></sl-button>
              <sl-button @click="${() =>
                this.share()}" id="shareButton">Share <ion-icon name="share-outline"></ion-icon></sl-button>

              <sl-button variant="danger" @click="${() =>
                this.revert()}">undo <ion-icon name="arrow-undo-outline"></ion-icon></sl-button>
              ${
                this.removeShow
                  ? html`
                      <sl-animation
                        name="bounce"
                        easing="ease-in-out"
                        duration="400"
                        iterations="1"
                        play
                      >
                        <sl-button
                          variant="danger"
                          id="remove-image"
                          @click="${() => this.remove()}"
                          >Remove <ion-icon name="trash-outline"></ion-icon
                        ></sl-button>
                      </sl-animation>
                    `
                  : null
              }

              <sl-button id="advanced" @click="${() =>
                this.doSettings()}">Settings <ion-icon name="settings-outline"></ion-icon></sl-button>
            </div>

            <common-controls class="mobileControls" .canvas="${this.canvas}" @filter-done="${() => this.handleDone()}"></common-controls>

            </div>
        </div>

        <!--settings-drawer-->
        <sl-drawer label="Settings" class="drawer">

          <div class="setting">
            <div class="setting-header">
              <label id="color-label" for="color">Canvas Background Color</label>
              <p>Change the background color of your canvas</p>
            </div>
            <sl-color-picker @sl-change="${(ev: any) =>
              this.handleColor(ev.target.value)}"></sl-color-picker>
          </div>
        </sl-drawer>
      </div>
    `;
  }
}
