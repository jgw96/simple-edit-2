import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

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

      fluent-dialog {
        z-index: 2;

        --dialog-width: 30vw;
        --dialog-height: 24vh;
      }

      fluent-dialog::part(control) {
        padding: 10px;

        display: flex;
    flex-direction: column;
    justify-content: space-between;
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
          background: var(--accent-fill-hover);
      }

      sl-button ion-icon {
        margin-left: 6px;
      }

      sl-button::part(content) {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    @media(max-width: 1000px) {
        fluent-dialog {
          --dialog-width: 80vw;
        }
    }

    `;
  }

  constructor() {
    super();
  }

  closeModal() {
    this.hiddenModal = true;
  }

  save() {
    const event = new CustomEvent('saved', {});
    this.dispatchEvent(event);

    this.closeModal();
  }

  render() {
    return html`
    <div id="background" ?hidden="${this.hiddenModal}">
      <fluent-dialog id="example1" class="example-dialog" ?hidden="${this.hiddenModal}" aria-label="Image saving dialog" modal="true">
        <div id="dialog-header">
          <h2>Save</h2>

          <div id="content">
            <p>Are you sure you would like to save your work?</p>
          </div>
        </div>

        <div id="actions">
          <sl-button @click="${() => this.closeModal()}">Cancel</sl-button>
          <sl-button id="save-button" @click="${() => this.save()}">Save  <ion-icon name="save-outline"></ion-icon></sl-button>
        </div>
       </fluent-dialog>
      </div>
    `;
  }
}
