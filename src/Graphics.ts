namespace jmcd.Graphics {

    export class Vertex {

        readonly x: number;
        readonly y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        static get zero(): Vertex {
            return new Vertex(0, 0);
        }

        adding(rhs: Vertex): Vertex {
            return new Vertex(this.x + rhs.x, this.y + rhs.y);
        }

        subtracting(rhs: Vertex): Vertex {
            return new Vertex(this.x - rhs.x, this.y - rhs.y);
        }

        multiplying(rhs: number): Vertex {
            return new Vertex(this.x * rhs, this.y * rhs);
        }

        settingX(x: number): Vertex {
            return new Vertex(x, this.y);
        }

        settingY(y: number): Vertex {
            return new Vertex(this.x, y);
        }
    }

    export class Rect {
        settingSize(size: Vertex): Rect {
            return new Rect(this.origin, size);
        }
        settingOrigin(origin: Vertex): Rect {
            return new Rect(origin, this.size);
        }
        clamp(point: Vertex): Vertex {
            return new Vertex(
                Math.min(this.antiOrigin.x, Math.max(this.origin.x, point.x)),
                Math.min(this.antiOrigin.y, Math.max(this.origin.y, point.y))
            );
        }
        intersects(other: Rect): boolean {
            return this.origin.x < other.antiOrigin.x && this.antiOrigin.x > other.origin.x && 
            this.origin.y < other.antiOrigin.y && this.antiOrigin.y > other.origin.y;
        }

        private liesIn(other: Rect): boolean {
            return this.liesInXBounds(other.origin.x) || this.liesInXBounds(other.antiOrigin.x) &&
                this.liesInYBounds(other.origin.y) || this.liesInYBounds(other.antiOrigin.y);
        }

        private liesInXBounds(x: number): boolean {
            return x >= this.origin.x && x < this.antiOrigin.x;
        }

        private liesInYBounds(y: number): boolean {
            return y >= this.origin.y && y < this.antiOrigin.y;
        }


        readonly origin: Vertex;
        readonly size: Vertex;
        readonly antiOrigin: Vertex;
        constructor(origin: Vertex, size: Vertex) {
            this.origin = origin;
            this.size = size;
            this.antiOrigin = origin.adding(size);
        }
        static get zero(): Rect {
            return new Rect(Vertex.zero, Vertex.zero);
        }
    }

    export class Color {
        constructor(public r: number, public g: number, public b: number, public a: number) { }
    }

    export class Texture {

        constructor(public width: number, public palette: Array<Color>, public pixelPaletteIndices: Array<number>) { }

        toImageData(): ImageData {
            let data = new Uint8ClampedArray(this.pixelPaletteIndices.length * 4);
            for (let i = 0; i < this.pixelPaletteIndices.length; i++) {
                const paletteIndex = this.pixelPaletteIndices[i];
                const col = this.palette[paletteIndex];
                data[i * 4 + 0] = col.r;
                data[i * 4 + 1] = col.g;
                data[i * 4 + 2] = col.b;
                data[i * 4 + 3] = col.a;
            }
            return new ImageData(data, this.width, this.pixelPaletteIndices.length / this.width);
        }
    }

    export class AnimationDefinition {
        size: Vertex;
        constructor(public imageDatas: Array<ImageData>, public frameDuration: number | null = null) {
            this.size = new Vertex(imageDatas[0].width, imageDatas[0].height);
        }
    }

    export class Animation {
        constructor(public defn: AnimationDefinition, private startTime: number) { }

        get size(): Vertex { return this.defn.size; }

        getImageData(time: number): ImageData {
            if (this.defn.frameDuration == null) {
                return this.defn.imageDatas[0];
            }
            let duration = time - this.startTime;
            let numberOfFrames = Math.floor(duration / this.defn.frameDuration);
            let frameIndex = numberOfFrames % this.defn.imageDatas.length;
            return this.defn.imageDatas[frameIndex];
        }
    }

    export class ImageDataTool {

        static index(id: ImageData, x: number, y: number): number {
            return y * id.width + x;
        }

        static draw(bg: ImageData, fg: ImageData, x: number, y: number) {

            x = Math.floor(x);
            y = Math.floor(y);

            for (let fgY = 0; fgY < fg.height; fgY++) {

                for (let fgX = 0; fgX < fg.width; fgX++) {

                    let bgX = x + fgX;
                    let bgY = y + fgY;

                    let fgI = this.index(fg, fgX, fgY);
                    let bgI = this.index(bg, bgX, bgY);

                    if (bgI > bg.data.length) {
                        continue;
                    }

                    bg.data[bgI * 4 + 0] = fg.data[fgI * 4 + 0];
                    bg.data[bgI * 4 + 1] = fg.data[fgI * 4 + 1];
                    bg.data[bgI * 4 + 2] = fg.data[fgI * 4 + 2];
                    bg.data[bgI * 4 + 3] = fg.data[fgI * 4 + 3]; // TODO: alpha blending
                }
            }
        }
    }
}


