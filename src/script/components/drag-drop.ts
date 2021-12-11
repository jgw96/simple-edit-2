import { LitElement, css, html, customElement } from 'lit-element';


@customElement('drag-drop')
export class DragDrop extends LitElement {

  static get styles() {
    return css`
        #dragdrop {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            display: block;
            height: 100%;
        }

        @media(max-width: 1000px) {
            #dragdrop {
                height: 69vh;
            }
        }

        @media(min-width: 1000px) {
          #dragdrop {
            height: 80vh;
          }
        }

        @media(horizontal-viewport-segments: 2) {
            #dragdrop {
                width: 48.8%;
                height: 90vh;
            }
        }

        @media(vertical-viewport-segments: 2) {
            #dragdrop {
                height: 50%;
            }
        }
        `
  }

  constructor() {
    super();
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
  dropHandler(ev: any) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') {
          let file = ev.dataTransfer.items[i].getAsFile();
          console.log('... file[' + i + '].name = ' + file.name);

          let event = new CustomEvent('got-file', {
            detail: {
              file: file
            }
          });
          this.dispatchEvent(event);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);

        let event = new CustomEvent('got-file', {
          detail: {
            file: ev.dataTransfer.files[i]
          }
        });
        this.dispatchEvent(event);

        return;
      }
    }
  }

  dragOverHandler(ev: any) {

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

  }

  render() {
    return html`
        <div @drop="${(event: any) => this.dropHandler(event)}" @dragover="${(event: any) => this.dragOverHandler(event)}"
            id="dragdrop">
            <slot></slot>
        </div>
        `;
  }
}