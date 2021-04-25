import { Router } from '@vaadin/router';
import { get, set } from 'idb-keyval';
import { LitElement, css, html, customElement, internalProperty } from 'lit-element';

@customElement('app-about')
export class AppAbout extends LitElement {
  @internalProperty() saved: Array<any> = [];

  static get styles() {
    return css`
      ul {
        padding: 0px;
        margin: 1em;
        display: grid;
        grid-template-columns: 24.2% 24.2% 24.2% 24.2%;
        gap: 10px;
      }

      h2 {
        margin-left: 16px;
      }

      ul fast-card {
        width: 100%;
        height: 18em;
        padding: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      ul fast-card img {
        width: 100%;
        height: 8em;
        object-fit: cover;
      }

      #actions {
        display: flex;
        justify-content: flex-end;
      }

      #edit-button {
        background: var(--accent-fill-rest);
        margin-right: 6px;
      }

      @media(max-width: 800px) {
        ul {
          grid-template-columns: auto auto;
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
  }

  async getSavedFiles() {
    const files = await get("files");

    return files;
  }

  async continue(saved) {
    const perm_test = await this.verifyPermission(saved.handle, true);

    if (perm_test === true) {
      Router.go(`/?file=${saved.name}`);
    }
  }

  async verifyPermission(fileHandle, readWrite) {
    console.log('trying perm');
    const options: any = {};
    if (readWrite) {
      options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
      return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === 'granted') {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
  }

  async removeFile(saved) {
    const savedFiles:Array<any> = await this.getSavedFiles();

    const arr = savedFiles.filter(file => file.name !== saved.name);

    await set("files", arr);

    this.saved = arr;
  }

  render() {
    return html`
      <div>
        <h2>Gallery</h2>

        <ul>
          ${
            this.saved.length > 0 ? html`
              ${
                this.saved.map((saved) => {
                  return html`
                    <fast-card>
                      <div id="header-info">
                        <img src="${URL.createObjectURL(saved.preview)}">
                        <h3>${saved.name}</h3>
                      </div>

                      <div id="actions">
                        <fast-button @click="${() => this.continue(saved)}" id="edit-button">Edit</fast-button>
                        <fast-button @click="${() => this.removeFile(saved)}">Remove</fast-button>
                      </div>
                    </fast-card>
                  `
                })
              }
            ` : null
          }
        </ul>
      </div>
    `;
  }
}
