import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators';

@customElement('app-intro')
export class AppIntro extends LitElement {
  static styles = [
    css`
            :host {
                display: block;
            }

            img {
              width: 20em;
            }

            #getting-started-grid {
              /* display: grid; */
              margin-left: 10%;
              margin-right: 10%;
              margin-top: 6em;
            }

            .getting-started-item {
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              margin-bottom: 4em;
            }

            .getting-started-item p {
              font-size: 24px;
              font-weight: bold;
              width: 24em;
            }

            #lastItem {
              display: flex;
              flex-direction: row;
              justify-content: center;
            }

            .getting-started-item a {
                text-decoration: none;
                color: white;
                background: var(--accent-fill-hover);
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

            @media(max-width: 800px) {
              .getting-started-item {
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }

              .getting-started-item p {
                width: initial;
                text-align: center;
              }
            }

              @media(horizontal-viewport-segments: 2) {
                  #getting-started-grid {
                    display: grid;
                    grid-template-columns: 50% 50%;
                    grid-gap: 18px;
                    margin: auto;
                    height: 85vh;
                    /* margin-left: 16px; */
                    /* margin-right: 16px; */
                  }

                  .getting-started-item {
                    flex-direction: column;
                    text-align: center;
                    align-items: center;
                  }

                  .getting-started-item p {
                    width: 18em;
                  }

                  #lastItem {
                    align-items: center;
                  }
              }

              @media(vertical-viewport-segments: 2) {
                .getting-started-item {
                  height: 34vh;
                }
              }
        `
  ];

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

  render() {
    return html`
          <div id="getting-started-grid">
            <div class="getting-started-item">
              <img src="/assets/started_two.svg">
              <p>
                Quickly edit your photos, create collages and more with
                filters, text controls, and more! SimpleEdit works on any device, your phone, tablet and laptop.
              </p>

              <!-- <fluent-button @click="${() => this.scrollRight()}">Next</fluent-button>-->
            </div>

            <div class="getting-started-item" id="lastItem">
              <a href="/home">Get Started</a>
            </div>
          </div>
        `;
  }
}
