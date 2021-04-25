export const Swipe  = (function () {
    function  Swipe(element) {
        this.xDown  =  null;
        this.yDown  =  null;
        this.element  =  typeof (element) ===  'string'  ?  document.querySelector(element) :  element;
        this.element.addEventListener('touchstart', function (evt) {
            this.xDown  =  evt.touches[0].clientX;
            this.yDown  =  evt.touches[0].clientY;
        }.bind(this), false);
    }

    Swipe.prototype.onLeft  =  function (callback) {
        this.onLeft  =  callback;
        return this;
    };
    Swipe.prototype.onRight  =  function (callback) {
        this.onRight  =  callback;
        return this;
    };
    Swipe.prototype.onUp  =  function (callback) {
        this.onUp  =  callback;
        return this;
    };
    Swipe.prototype.onDown  =  function (callback) {
        this.onDown  =  callback;
        return this;
    };

    Swipe.prototype.handleTouchMove  =  function (evt) {
        if (!this.xDown  ||  !this.yDown) {
            return;
        }
        const xUp  =  evt.touches[0].clientX;
        const yUp  =  evt.touches[0].clientY;
        this.xDiff  = this.xDown  -  xUp;
        this.yDiff  = this.yDown  -  yUp;

        if (Math.abs(this.xDiff) !==  0) {
            if (this.xDiff  >  2) {
                typeof (this.onLeft) ===  "function"  && this.onLeft(evt);
            } else  if (this.xDiff  <  -2) {
                typeof (this.onRight) ===  "function"  && this.onRight(evt);
            }
        }

        if (Math.abs(this.yDiff) !==  0) {
            if (this.yDiff  >  2) {
                typeof (this.onUp) ===  "function"  && this.onUp(evt);
            } else  if (this.yDiff  <  -2) {
                typeof (this.onDown) ===  "function"  && this.onDown(evt);
            }
        }
        // Reset values.
        this.xDown  =  null;
        this.yDown  =  null;
    };

    Swipe.prototype.run  =  function () {
        this.element.addEventListener('touchmove', function (evt) {
            this.handleTouchMove(evt);
        }.bind(this), false);
    };

    return  Swipe;
}());