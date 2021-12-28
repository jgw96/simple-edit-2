import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.63/dist/components/dialog/dialog.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.63/dist/components/button/button.js';

@customElement('save-modal')
export class SaveModal extends LitElement {

  @property({ type: Boolean }) hiddenModal = true;

  static get styles() {
    return css`
      #background {
        background: #000000b0;
        backdrop-filter: blur(16px);
        position: fixed;
        z-index: 1;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
      }

      h2 {
          margin-top: 0;
      }

      #actions {
        display: flex;
        justify-content: flex-end;
      }

      #save-button {
          margin-left: 8px;
      }

      sl-button ion-icon {
        margin-left: 6px;
      }

      sl-button::part(content) {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    `;
  }

  constructor() {
    super();
  }

  public openModal() {
    const dialog: any = this.shadowRoot?.querySelector('.save-dialog');
    if (dialog) {
      dialog.show();
    }
  }

  public closeModal() {
    const dialog: any = this.shadowRoot?.querySelector('.save-dialog');
    if (dialog) {
      dialog.hide();
    }
  }

  public save() {
    const event = new CustomEvent('saved', {});
    this.dispatchEvent(event);

    this.closeModal();
  }

  render() {
    return html`
      <sl-dialog label="Save" class="save-dialog">
        Ready to save your work?

        <sl-button slot="footer" @click="${() => this.closeModal()}">Cancel</sl-button>
        <sl-button slot="footer" id="save-button" @click="${() => this.save()}">Save <ion-icon name="save-outline"></ion-icon>
        </sl-button>
      </sl-dialog>
    `;
  }
}
