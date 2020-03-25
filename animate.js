class Honeybee {
    constructor(obj, container, beehive) {
        this.$object = obj;
        this.$container = container;
        this.$hive = beehive;
        this.position = this._generateNewPosition();
        this.returnToHive = 0;
        this.returnInterval = randint(3, 7);
        this.boundEvent = this._moveOnce.bind(this);
    }

    _generateNewPosition() {
        var x, y;

        if(this.returnToHive >= this.returnInterval) {
            var rect = this.$hive.getBoundingClientRect();

            x = ((rect.left + rect.right) / 2) + randint(-30, 30);
            y = ((rect.top + rect.bottom) / 2) + randint(-30, 30);
            this.returnToHive = -1;
            this.returnInterval = randint(3, 7);
        }
        else {
            var availableWidth = this.$container.innerWidth - this.$object.clientWidth;
            var availableHeight = this.$container.innerHeight - this.$object.clientHeight;

            x = Math.random() * availableWidth;
            y = Math.random() * availableHeight;
            this.returnToHive++;
        }

        return { x: x, y: y };
    }

    _calcDelta(a, b) {
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    _moveOnce(wait=true) {
        if(this.returnToHive == -1) {
            this.$object.style.visibility = 'hidden';
            this.returnToHive++;
            setTimeout(this.boundEvent, randint(1000, 3000));
            return;
        }

        setTimeout(function(that) {
            if(that.returnToHive == 0) that.$object.style.visibility = 'visible';

            var next = that._generateNewPosition();
            var delta = that._calcDelta(that.position, next);
            var speed = Math.round((delta / 250) * 100) / 100;

            that.$object.style.transition = 'transform ' + speed + 's ease-in-out';
            that.$object.style.transform = 'translate3d(' + next.x + 'px, ' + next.y + 'px, 0)';
            that.position = next;
        }, wait ? randint(500, 5000) : 0, this);
    }

    start() {
        this.$object.willChange = 'transform';
        this.$object.pointerEvents = 'auto';
        this.$object.addEventListener('transitionend', this.boundEvent, { passive: true, useCapture: false });
        this.$object.style.transform = 'translate3d(' + this.position.x + 'px, ' + this.position.y + 'px, 0)';
        this._moveOnce(false);
    }
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnBees() {
    var hive = document.getElementById("beehive");

    for(let i = 0; i < randint(9, 21); i++) {
        var b = document.createElement("div");
        b.setAttribute('class', 'bee position-absolute');
        b.innerHTML = "\ud83d\udc1d";
        document.body.prepend(b);
        (new Honeybee(b, window, hive)).start();
    }
};

window['spawnBees'] = spawnBees;