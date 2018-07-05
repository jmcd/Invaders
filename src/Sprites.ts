namespace jmcd.Sprites {

    import g = jmcd.Graphics;

    export abstract class Node {

        parent: Node | null = null;
        children = new Array<Node>();

        constructor(public rect: g.Rect) { }

        addChild(node: Node) {
            this.children.push(node);
            node.parent = this;
        }

        removeFromParent() {
            if (this.parent == null) {
                return
            }
            var index = this.parent.children.indexOf(this, 0);
            if (index > -1) {
                this.parent.children.splice(index, 1);
            }
            this.parent = null;
        }

        update(duration: number) {
            this.updateCore(duration);
            this.children.forEach(c => c.update(duration));
        }

        abstract updateCore(duration: number): void;

        draw(bg: ImageData, time: number, position: g.Vertex) {
            let absolutePosition = position.adding(this.rect.origin);
            this.drawCore(bg, time, absolutePosition);
            this.children.forEach(c => c.draw(bg, time, absolutePosition));
        }

        abstract drawCore(bg: ImageData, time: number, absolutePosition: g.Vertex): void;

        rectInContextOf(ancestor: Node): g.Rect | null {
            var o = this.rect.origin;
            var n: Node = this;
            while (ancestor != n) {
                if (n.parent == null) {
                    return null;
                }
                n = n.parent;
                o = o.adding(n.rect.origin);
            }
            return new g.Rect(o, this.rect.size);
        }
    }

    export class Scene extends Node {

        constructor(size: g.Vertex) {
            super(new g.Rect(g.Vertex.zero, size));
        }

        redraw(time: number): ImageData {
            let data = new ImageData(this.rect.size.x, this.rect.size.y);
            this.draw(data, time, g.Vertex.zero);
            return data;
        }

        updateCore(duration: number): void { }

        drawCore(bg: ImageData, time: number, absolutePosition: g.Vertex) { }
    }

    export abstract class Body extends Node {

        boundary: g.Rect | null = null;

        constructor(public rect: g.Rect, public velocity: g.Vertex) {
            super(rect);
        }

        updateCore(duration: number) {
            var newOrigin = this.rect.origin.adding(this.velocity.multiplying(duration));
            if (this.boundary != null) {
                newOrigin = this.boundary.clamp(newOrigin);
            }
            this.rect = this.rect.settingOrigin(newOrigin);
        }

        drawCore(bg: ImageData, time: number, absolutePosition: g.Vertex): void { }
    }

    export class Sprite extends Body {

        constructor(origin: g.Vertex, velocity: g.Vertex, public animation: g.Animation) {
            super(new g.Rect(origin, animation.size), velocity);
        }

        drawCore(bg: ImageData, time: number, absolutePosition: g.Vertex) {
            let invaderImageData = this.animation.getImageData(time);
            g.ImageDataTool.draw(bg, invaderImageData, absolutePosition.x, absolutePosition.y);
        }
    }

    export class Formation extends Body {
        fitRectToContents() {
            let xMin = this.rect.antiOrigin.x;
            let yMin = this.rect.antiOrigin.y;
            let xMax = 0;
            let yMax = 0;
            for (let i = 0; i < this.children.length; i++) {
                const child = this.children[i];
                const or = child.rect.origin;
                xMin = Math.min(or.x, xMin);
                yMin = Math.min(or.y, yMin);
                const aor = child.rect.antiOrigin;
                xMax = Math.max(aor.x, xMax);
                yMax = Math.max(aor.y, yMax);
            }
            const originOffset = new g.Vertex(xMin, yMin);
            const newOrigin = this.rect.origin.adding(originOffset);
            const newSize = new g.Vertex(xMax-xMin, yMax-yMin);
            
            this.rect = new g.Rect(newOrigin, newSize);

            for (let i = 0; i < this.children.length; i++) {
                const child = this.children[i];
                child.rect = child.rect.settingOrigin(child.rect.origin.subtracting(originOffset));
            }
        }
    }
}