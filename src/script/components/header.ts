import { Router } from '@vaadin/router';
import { LitElement, css, html, customElement } from 'lit-element';

@customElement('app-header')
export class AppHeader extends LitElement {

  static get styles() {
    return css`

      :host {
        position: fixed;
        left: calc(env(titlebar-area-x, 0) - 6px);
        top: env(titlebar-area-y, 0);
        width: env(titlebar-area-width, 100%);
        height: env(titlebar-area-height, 33px);
        -webkit-app-region: drag;
      }

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 16px;
        padding-right: 16px;
        background: var(--app-color-primary);
        color: white;
        height: env(titlebar-area-height, 33px);
      }

      nav {
        width: 9em;
        display: flex;
        justify-content: space-between;
      }

      fast-anchor ion-icon {
        display: block;
      }

      fast-anchor {
        height: calc(env(titlebar-area-height, 33px) - 6px);
        background: var(--accent-fill-rest);
        border-radius: 22px;

        -webkit-app-region: no-drag;
        app-region: no-drag;
        pointer-events: all;
        cursor: pointer;
      }

      #info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: env(titlebar-area-height, 33px);

        -webkit-app-region: no-drag;
        app-region: no-drag;
        pointer-events: all;
        cursor: pointer;
      }

      #info img {
        width: 22px;
      }

      #info h1 {
        font-size: 14px;
        margin-left: 10px;
        font-weight: bold;
        color: white;
      }

      #gallery-button::part(content) {
        display: flex;
        align-items: center;
      }

      #gallery-button ion-icon {
        margin-left: 6px;
      }

      @media(max-width: 800px) {
        :host, header {
          height: 3.6em;
        }

        #info h1 {
          font-size: 20px;
        }
      }


      @media(prefers-color-scheme: light) {
        header {
          color: black;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  goBack() {
    Router.go("/")
  }

  render() {
    return html`
      <header>
        <div @click="${() => this.goBack()}" id ="info">
          <img src="/assets/icons/icon_64.png" alt="Simple Edit app icon">

          <h1>SimpleEdit</h1>
        </div>

        ${"showSaveFilePicker" in window && location.href.includes("gallery") === false ? html`<fast-anchor href="/gallery" appearance="button" id="gallery-button">
          Gallery
          <ion-icon name="images-outline"></ion-icon>
        </fast-anchor>` : null}
      </header>
    `;
  }
}
