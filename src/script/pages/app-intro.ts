import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators';

@customElement('app-intro')
export class AppIntro extends LitElement {
  static styles = [
    css`
            :host {
                display: block;
            }

            svg {
              width: 20em;
              height: 100%;
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
                color: black;
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

            @media(prefers-color-scheme: light) {
              .getting-started-item a {
                color: white;
              }
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
              <svg id="bd9e156c-4ae5-43bd-909a-1d43618968d1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"
                width="860.28256" height="661.79235" viewBox="0 0 860.28256 661.79235">
                <rect x="536.24995" y="647.27241" width="324.03261" height="2.24072" fill="#3f3d56" />
                <polygon points="698.98 653.075 663.827 647.561 678.302 632.397 698.98 632.397 698.98 653.075" fill="#a0616a" />
                <path
                  d="M862.10882,780.54949l-34.7725-11.43832a6.76267,6.76267,0,0,1-3.93554-9.44838h0a6.76266,6.76266,0,0,1,6.5046-3.72293l7.88775.533,3.09121-1.7397a1.7981,1.7981,0,0,1,2.54454,2.25161l-2.85067,6.92306,28.94991-2.06785,1.42836,11.42692A6.78111,6.78111,0,0,1,862.10882,780.54949Z"
                  transform="translate(-169.85872 -119.10383)" fill="#2f2e41" />
                <path d="M964.53347,754.86305l-36.532,9.65c6.72859-13.95812,10.872-26.30834,8.2714-34.46418l17.23209-2.06785Z"
                  transform="translate(-169.85872 -119.10383)" fill="#a0616a" />
                <path
                  d="M962.28764,767.113l-37.799,2.45089a6.99781,6.99781,0,0,1-7.42761-7.55005v0a6.99781,6.99781,0,0,1,4.80623-6.08641l7.77791-2.53514,2.29551-2.86409a1.86062,1.86062,0,0,1,3.31241,1.17862l-.06244,7.74708,26.99247-13.16742,5.785,10.41783A7.01691,7.01691,0,0,1,962.28764,767.113Z"
                  transform="translate(-169.85872 -119.10383)" fill="#2f2e41" />
                <circle cx="672.79797" cy="185.68462" r="25.50349" fill="#a0616a" />
                <path
                  d="M883.12366,337.9923l-29.4801,22.28984c-4.76461-18.19123-10.48312-31.18532-17.97568-34.5133L865.148,308.51219Z"
                  transform="translate(-169.85872 -119.10383)" fill="#a0616a" />
                <polygon
                  points="789.482 608.601 764.316 619.387 706.075 482.052 701.401 634.846 676.235 633.408 648.193 393.972 650.35 380.31 745.621 401.521 747.059 478.457 789.482 608.601"
                  fill="#2f2e41" />
                <path
                  d="M813.73756,297.36728s16.53762-15.09957,21.57081-8.62833,6.47124,7.9093,9.34735,7.9093,10.06638,7.9093,10.06638,7.9093,3.59513-7.19027,7.90929-1.43806S867.66458,317.5,867.66458,317.5s15.8186-36.67038-12.22346-43.86065S807.26632,288.739,813.73756,297.36728Z"
                  transform="translate(-169.85872 -119.10383)" fill="#2f2e41" />
                <path
                  d="M921.95112,532.12959c-13.66151-5.98231-14.06421-1.28709-33.79427,6.47124-24.84961,3.08461-40.64661,3.48007-48.53432-6.83075-3.22842-20.47072-5.87439-40.10015-7.5066-58.76611q-.50688-5.77017-.87719-11.42531c-2.87611-43.911.64705-82.08414,16.6526-112.80095l28.76108-21.57081,9.38334,6.80916c22.412,16.26439,18.92484,41.25058,21.90153,68.78215Z"
                  transform="translate(-169.85872 -119.10383)" fill="#e6e6e6" />
                <polygon points="665.09 406.555 649.991 393.612 651.429 380.67 665.09 380.67 665.09 406.555" fill="#a0616a" />
                <path
                  d="M874.79989,395.874s42.4798,55.36508,12.13709,80.531-47.31445,40.98454-47.31445,40.98454S841.4229,408.81646,874.79989,395.874Z"
                  transform="translate(-169.85872 -119.10383)" opacity="0.2" />
                <path d="M858.31723,451.23905,832.11593,473.004q-.50688-5.77017-.87719-11.42531l17.73114-79.3662Z"
                  transform="translate(-169.85872 -119.10383)" opacity="0.2" />
                <path
                  d="M839.263,517.03,818.41123,500.4924l27.323-69.02659.62026-71.95025a16.38312,16.38312,0,0,1,10.894-15.29519h0a16.38313,16.38313,0,0,1,21.87014,15.215l1.12885,83.53483Z"
                  transform="translate(-169.85872 -119.10383)" fill="#e6e6e6" />
                <path
                  d="M169.85872,669.30137V158.53494a8.39155,8.39155,0,0,1,8.38238-8.38238H646.5368a8.39155,8.39155,0,0,1,8.38238,8.38238V669.30137a8.39155,8.39155,0,0,1-8.38238,8.38238H178.2411A8.39155,8.39155,0,0,1,169.85872,669.30137Zm8.38238-515.79586a5.03493,5.03493,0,0,0-5.02943,5.02943V669.30137a5.03493,5.03493,0,0,0,5.02943,5.02943H646.5368a5.03493,5.03493,0,0,0,5.02943-5.02943V158.53494a5.03493,5.03493,0,0,0-5.02943-5.02943Z"
                  transform="translate(-169.85872 -119.10383)" fill="#e6e6e6" />
                <path id="feda1070-6288-4949-b833-330f4749d65f" data-name="Path 40"
                  d="M495.66661,202.12148a6.64647,6.64647,0,0,1,0,13.29115H329.04082a6.64647,6.64647,0,1,1-.21822-13.29115q.10911-.00186.21822,0Z"
                  transform="translate(-169.85872 -119.10383)" fill="#3f3d56" />
                <path
                  d="M291.25419,200.271a1.30766,1.30766,0,0,1,0,1.8494l-5.61377,5.61382h13.843a1.30772,1.30772,0,1,1,0,2.61543h-13.843l5.61377,5.61382a1.30771,1.30771,0,1,1-1.84936,1.8494l-7.84623-7.84623a1.30774,1.30774,0,0,1,0-1.84941l7.84623-7.84623A1.30769,1.30769,0,0,1,291.25419,200.271Z"
                  transform="translate(-169.85872 -119.10383)" fill="#e6e6e6" />
                <path
                  d="M533.52371,200.271a1.30766,1.30766,0,0,0,0,1.8494l5.61377,5.61382h-13.843a1.30772,1.30772,0,1,0,0,2.61543h13.843l-5.61377,5.61382a1.30771,1.30771,0,1,0,1.84936,1.8494l7.84623-7.84623a1.30774,1.30774,0,0,0,0-1.84941l-7.84623-7.84623A1.30769,1.30769,0,0,0,533.52371,200.271Z"
                  transform="translate(-169.85872 -119.10383)" fill="#e6e6e6" />
                <path d="M319.79668,588.10058a23.83563,23.83563,0,0,0,0,47.67127H504.98122a23.83563,23.83563,0,0,0,0-47.67127Z"
                  transform="translate(-169.85872 -119.10383)" fill="#e6e6e6" />
                <path d="M608.96227,157.40849a38.30467,38.30467,0,1,1,38.30466,38.30467A38.348,38.348,0,0,1,608.96227,157.40849Z"
                  transform="translate(-169.85872 -119.10383)" fill="#6c63ff" />
                <path
                  d="M632.1529,153.63h11.33547V142.29446a3.77857,3.77857,0,1,1,7.55713,0V153.63h11.33558a3.77851,3.77851,0,0,1,0,7.557H651.0455v11.33558a3.77857,3.77857,0,0,1-7.55713,0V161.18706H632.1529a3.77851,3.77851,0,1,1,0-7.557Z"
                  transform="translate(-169.85872 -119.10383)" fill="#fff" />
                <rect x="257.81285" y="393.55492" width="353.44729" height="2.23518"
                  transform="translate(-321.57903 245.71371) rotate(-39.33239)" fill="#e6e6e6" />
                <rect x="433.419" y="218.15297" width="2.235" height="354.15673"
                  transform="translate(-316.67736 360.12744) rotate(-50.50975)" fill="#e6e6e6" />
                <path
                  d="M293.35914,502.21257V286.506a7.83269,7.83269,0,0,1,7.82355-7.82355h266.0009a7.83234,7.83234,0,0,1,7.82356,7.82355V502.21257a7.8327,7.8327,0,0,1-7.82356,7.82356H301.18269A7.833,7.833,0,0,1,293.35914,502.21257Zm7.82355-221.29486a5.59483,5.59483,0,0,0-5.58825,5.58825V502.21257a5.59483,5.59483,0,0,0,5.58825,5.58826h266.0009a5.59483,5.59483,0,0,0,5.58825-5.58826V286.506a5.59483,5.59483,0,0,0-5.58825-5.58825Z"
                  transform="translate(-169.85872 -119.10383)" fill="#3f3d56" />
                <path
                  d="M249.77075,541.33035V325.62374a7.8327,7.8327,0,0,1,7.82356-7.82355h266.0009a7.83269,7.83269,0,0,1,7.82355,7.82355V541.33035a7.833,7.833,0,0,1-7.82355,7.82356H257.59431A7.83305,7.83305,0,0,1,249.77075,541.33035Z"
                  transform="translate(-169.85872 -119.10383)" fill="#6c63ff" />
                <path
                  d="M360.24709,496.06538H496.04776a2.76831,2.76831,0,0,0,.50748-.04021L432.32779,384.774a4.497,4.497,0,0,0-7.8281,0L381.395,459.43216l-2.06506,3.5724Z"
                  transform="translate(-169.85872 -119.10383)" fill="#fff" />
                <polygon
                  points="190.389 376.961 236.754 376.961 213.993 343.901 212.355 341.519 211.536 340.328 209.471 343.901 190.389 376.961"
                  opacity="0.2" style="isolation:isolate" />
                <path
                  d="M284.63427,496.06538H402.0907l-22.76076-33.06084-1.638-2.3816-29.6593-43.08461c-1.94445-2.82373-6.62222-2.99958-8.90833-.53258a5.3605,5.3605,0,0,0-.42711.53258Z"
                  transform="translate(-169.85872 -119.10383)" fill="#fff" />
                <circle cx="203.30104" cy="271.90237" r="20.11771" fill="#fff" />
                <rect x="492.30098" y="333.4473" width="24.58832" height="24.58832"
                  transform="translate(839.33157 572.37909) rotate(-180)" fill="#3f3d56" /></svg>
              <p>
                Quickly edit your photos, create collages and more with
                filters, text controls, and more! SimpleEdit works on any device, your phone, tablet and laptop.
              </p>

              <!-- <sl-button @click="${() => this.scrollRight()}">Next</sl-button>-->
            </div>

            <div class="getting-started-item" id="lastItem">
              <a href="/home">Get Started</a>
            </div>
          </div>
        `;
  }
}