import { Router } from "@vaadin/router";
import { FileSystemHandle } from "browser-fs-access";
import { get, set } from "idb-keyval";
import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.63/dist/components/button/button.js";
import "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.63/dist/components/card/card.js";

@customElement("app-about")
export class AppAbout extends LitElement {
  @state() saved: Array<any> = [];

  static get styles() {
    return css`
      ul {
        padding: 0px;
        margin: 1em;
        display: grid;
        grid-template-columns: auto auto auto auto;
        gap: 8px;
        gap: 18px;
      }

      h2 {
        margin-left: 16px;
      }

      sl-button {
        color: white;
      }

      #gallery-header {
        display: flex;
        align-items: center;
        padding-left: 20px;
      }

      #gallery-header a {
        background: var(--sl-color-primary-600);
        color: black;
        border-radius: 4px;
        text-decoration: none;
        padding: 8px;
        width: 3em;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: var(--sl-font-weight-semibold);
      }

      @media (prefers-color-scheme: light) {
        #gallery-header a {
          color: white;
        }
      }

      #no-saved-block a {
        text-decoration: none;
        color: black;
        font-weight: var(--sl-font-weight-semibold);
        background: var(--sl-color-primary-600);
        padding: 6px;
        padding-left: 10px;
        padding-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        border-radius: 4px;

        width: 8em;
        height: 2em;
        font-size: 18px;
      }

      #content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        padding-left: 10px;
        padding-bottom: 10px;
        padding-right: 10px;
      }

      #content h3 {
        margin-top: 6px;
      }

      #actions {
        display: flex;
        justify-content: flex-end;
      }

      #edit-button {
        background: var(--accent-fill-rest);
        margin-right: 10px;
      }

      #started {
        background: var(--accent-fill-rest);
      }

      #no-saved-block {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      #gallery-wrapper {
        margin-top: 3em;
        overflow-y: scroll;
        height: 93vh;
      }

      #removeButton {
        margin-left: 8px;
      }

      sl-card img {
        height: 280px;
        object-fit: cover;
      }

      sl-card [slot="footer"] {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }

      @media (max-width: 800px) {
        ul {
          grid-template-columns: 50% 50%;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    const saved = await this.getSavedFiles();
    this.saved = saved;

    sessionStorage.setItem("visited-gallery", "true");
  }

  async getSavedFiles() {
    const files = await get("saved_files");

    return files;
  }

  async continue(saved: any) {
    const perm_test = await this.verifyPermission(saved.handle, true);

    if (perm_test === true) {
      Router.go(`/home?file=${saved.name}`);
    }
  }

  async verifyPermission(fileHandle: FileSystemHandle, readWrite: boolean) {
    console.log("trying perm");
    const options: any = {};
    if (readWrite) {
      options.mode = "readwrite";
    }

    const perm = await fileHandle.queryPermission(options);

    // Check if permission was already granted. If so, return true.
    if (perm === "granted") {
      return true;
    } else {
      const check = await fileHandle.requestPermission(options);

      console.log("check", check);

      if (check === "granted") {
        return true;
      }
    }
    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === "granted") {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
  }

  async removeFile(saved: any) {
    const savedFiles: Array<any> = await this.getSavedFiles();

    const arr = savedFiles.filter((file) => file.name !== saved.name);

    await set("saved_files", arr);

    this.saved = arr;
  }

  render() {
    return html`
      <div id="gallery-wrapper">
        <div id="gallery-header">
          <a href="/home"> Back </a>

          <h2>Saved Projects</h2>
        </div>

        ${this.saved
          ? html`<ul>
              ${this.saved.length > 0
                ? html`
                    ${this.saved.map((saved) => {
                      return html`
                        <sl-card>
                          <img
                            slot="image"
                            src="${URL.createObjectURL(saved.preview)}"
                          />

                          <strong>${saved.name}</strong><br />

                          <div slot="footer">
                            <sl-button
                              variant="primary"
                              pill
                              @click="${() => this.continue(saved)}"
                            >
                              Edit

                              <ion-icon name="brush-outline"></ion-icon>
                            </sl-button>

                            <sl-button
                              id="removeButton"
                              pill
                              variant="danger"
                              @click="${() => this.removeFile(saved)}"
                            >
                              Remove

                              <ion-icon name="trash-outline"></ion-icon>
                            </sl-button>
                          </div>
                        </sl-card>
                      `;
                    })}
                  `
                : null}
            </ul>`
          : html` <div id="no-saved-block">
              <h3>No previous edits</h3>

              <a id="started" href="/">Get Started</a>
            </div>`}
      </div>
    `;
  }
}
