class Honeybee {
    constructor(obj, container) {
        this.$object = obj;
        this.$container = container;
        this.current_position = this._generateNewPosition();
    }

    _generateNewPosition() {
        // Get container dimensions minus div size
        var availableWidth = this.$container.innerWidth - this.$object.clientWidth;
        var availableHeight = this.$container.innerHeight - this.$object.clientHeight;
        // Pick a random place in the space
        var x = Math.floor(Math.random() * availableWidth);
        var y = Math.floor(Math.random() * availableHeight);
        return { x: x, y: y };
    }

    _calcDelta(a, b) {
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        return dist;
    }

    _moveOnce(wait=true) {
        setTimeout(function(that) {
            // Pick a new spot on the page
            var next = that._generateNewPosition();
            // How far do we have to move?
            var delta = that._calcDelta(that.current_position, next);
            // Speed of this transition, rounded to 2DP
            var speed = Math.round((delta / 250) * 100) / 100;
            that.$object.style.transition = 'transform ' + speed + 's ease-in-out';
            that.$object.style.transform = 'translate3d(' + next.x + 'px, ' + next.y + 'px, 0)';
            // Save this new position ready for the next call.
            that.current_position = next;
        }, wait ? Math.random() * 5 * 1000 : 0, this);
    }

    start() {
        // Make sure our object has the right css set
        this.$object.willChange = 'transform';
        this.$object.pointerEvents = 'auto';
        this.boundEvent = this._moveOnce.bind(this)

        // Bind callback to keep things moving
        this.$object.addEventListener('transitionend', this.boundEvent);

        // Start it moving
        this.$object.style.transform = 'translate3d(' + this.current_position.x + 'px, ' + this.current_position.y + 'px, 0)';
        this._moveOnce(false);
    }
}

for(let i = 0; i < Math.floor(Math.random() * (15 - 7 + 1)) + 7; i++) {
    var b = document.createElement("div");
    b.setAttribute('class', 'bee position-absolute');
    b.innerHTML = "🐝";
    document.body.prepend(b);
    (new Honeybee(b, window)).start();
}