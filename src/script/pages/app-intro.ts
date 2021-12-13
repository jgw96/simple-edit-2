import { LitElement, css, html, customElement } from 'lit-element';

@customElement('app-intro')
export class AppIntro extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
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

              @media(max-width: 800px) {
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

              @media(min-width: 1200px) {
                #getting-started-backer {
                  margin: 4em;
                  margin-left: 12em;
                  margin-right: 12em;
                }
              }

              @media(horizontal-viewport-segments: 2) {
                #getting-started-backer {
                    width: 44vw;
                    margin: 2em;
                  }

                  #getting-started-wrapper {
                    margin-top: 2em;
                  }

                  #getting-started img {
                    width: 444px;
                  }
              }

              @media(vertical-viewport-segments: 2) {
                #getting-started-wrapper {
                    margin: 0em 1em;
                  }

                  #getting-started {
                    width: 444px;
                  }

                  #getting-started img {
                    width: 444px;
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
          <div id="getting-started-backer"><div id="getting-started-wrapper">
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

                  <a href="/home">Get Started</a>
                </div>
               </div>
  </div></div>
        `;
    }
}
