namespace jmcd.SpaceInvaders {

    import g = jmcd.Graphics;
    import s = jmcd.Sprites;

    export class ImageDatas {
        static invader2a = new g.Texture(16, [new g.Color(0, 0, 0, 0), new g.Color(0, 0, 0, 255)], [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]).toImageData();
        static invader2b = new g.Texture(16, [new g.Color(0, 0, 0, 0), new g.Color(0, 0, 0, 255)], [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0]).toImageData();
        static tank = new g.Texture(16, [new g.Color(0, 0, 0, 0), new g.Color(0, 0, 0, 255)], [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]).toImageData();
        static shell = new g.Texture(1, [new g.Color(0, 0, 0, 255)], [0, 0, 0, 0, 0, 0, 0, 0]).toImageData();
    }

    class AnimationDefinitions {
        static invader = new g.AnimationDefinition([ImageDatas.invader2a, ImageDatas.invader2b], 1000);
        static tank = new g.AnimationDefinition([ImageDatas.tank]);
        static shell = new g.AnimationDefinition([ImageDatas.shell]);
    }

    export enum JoystickSwitch {
        None,
        Fire = 1,
        Left = 2,
        Right = 4
    }

    export class Joystick {
        currentSwitches: JoystickSwitch = JoystickSwitch.None;

        press(sw: JoystickSwitch) {
            this.currentSwitches = this.currentSwitches | sw;
        }

        depress(sw: JoystickSwitch) {
            this.currentSwitches = this.currentSwitches ^ sw;
        }

        isPressed(sw: JoystickSwitch): boolean {
            return (this.currentSwitches & sw) == sw;
        }
    }

    class InvaderFormation extends s.Formation {

        constructor(difficultyLevel: number) {
            super(new g.Rect(new g.Vertex(0, 100), g.Vertex.zero), new g.Vertex(difficultyLevel / 100, 0));
            const anim = new g.Animation(AnimationDefinitions.invader, 0);
            for (let iy = 0; iy < 5; iy++) {
                for (let ix = 0; ix < 11; ix++) {
                    const sprite = new s.Sprite(new g.Vertex(ix * anim.size.x, iy * (anim.size.y + 4)), g.Vertex.zero, anim);
                    this.addChild(sprite);
                }
            }
            this.fitRectToContents();
        }

        updateCore(duration: number) {
            super.updateCore(duration);

            this.fitRectToContents();

            if (this.boundary == null) { return; }

            if (this.velocity.x > 0) {
                if (this.rect.antiOrigin.x >= this.boundary.antiOrigin.x) {
                    this.velocity = new g.Vertex(-this.velocity.x, this.velocity.y);
                }
            } else {
                if (this.rect.origin.x <= 0) {
                    this.velocity = new g.Vertex(-this.velocity.x, this.velocity.y);
                }
            }
        }
    }

    enum Direction {
        Left,
        Right
    }

    class Tank extends s.Sprite {

        private static readonly speed = 100 / 1000;
        static readonly leftVelocity = new g.Vertex(-Tank.speed, 0);
        static readonly rightVelocity = new g.Vertex(Tank.speed, 0);

        constructor(origin: g.Vertex) {
            super(origin, g.Vertex.zero, new g.Animation(AnimationDefinitions.tank, 0))
        }

        setVelocityFor(direction: Direction | null) {
            if (direction == null) {
                this.velocity = g.Vertex.zero;
                return;
            }
            switch (direction) {
                case Direction.Left:
                    this.velocity = Tank.leftVelocity;
                    break;
                case Direction.Right:
                    this.velocity = Tank.rightVelocity;
                    break;
            }
        }
    }

    class BattleScene extends s.Scene {

        formation: s.Formation;
        tank: Tank;
        shell: s.Sprite | null = null;

        constructor() {

            super(new g.Vertex(256, 224));
            const formation = new InvaderFormation(1);
            formation.boundary = this.rect;
            this.addChild(formation);

            const anim = new g.Animation(AnimationDefinitions.tank, 0);
            let tank = new Tank(new g.Vertex((this.rect.size.x - anim.size.x) / 2, (this.rect.size.y - anim.size.y)));
            tank.boundary = new g.Rect(new g.Vertex(0, tank.rect.origin.y), new g.Vertex(this.rect.size.x - tank.rect.size.x, 8));
            this.addChild(tank);

            this.formation = formation;
            this.tank = tank;
        }

        updateCore(duration: number) {
            super.updateCore(duration);

            if (this.shell != null) {
                if (this.shell.rect.antiOrigin.y < 0) {
                    this.removeShell();
                }
            }
        }

        addShell() {
            if (this.shell != null) { return; }
            const tr = this.tank.rect;
            const so = new g.Vertex(tr.origin.x + tr.size.x / 2, tr.origin.y)
            this.shell = new s.Sprite(so, new g.Vertex(0, -50 / 1000), new g.Animation(AnimationDefinitions.shell, 0));
            this.addChild(this.shell);
        }

        removeShell() {
            if (this.shell == null) { return; }
            this.shell.removeFromParent();
            this.shell = null;
        }

        checkForShellCollision() {
            if (this.shell == null) { return; }

            const shellRect = this.shell.rectInContextOf(this);
            if (shellRect == null) { return; }

            for (const invader of this.formation.children) {

                const invaderRect = invader.rectInContextOf(this);
                if (invaderRect == null) { continue; }

                if (shellRect.intersects(invaderRect)) {
                    this.removeShell();
                    invader.removeFromParent();
                }
            }
        }
    }

    export class Game {

        battleScene = new BattleScene();

        lastUpdateTime: number | undefined;
        lastRedrawTime: number | undefined;
        readonly targetFps = 50;
        readonly targetFrameDuration = 1000 / this.targetFps;

        constructor(private joystick: Joystick) { }

        update(time: number) {
            if (this.lastUpdateTime != undefined) {
                let duration = time - this.lastUpdateTime;

                for (let i = 0; i < duration / this.targetFrameDuration; i++) {
                    this.battleScene.update(this.targetFrameDuration);
                }
                this.battleScene.update(duration % this.targetFrameDuration);

                var tankDirection: Direction | null = null;
                if (this.joystick.isPressed(JoystickSwitch.Left)) {
                    tankDirection = Direction.Left;
                } else if (this.joystick.isPressed(JoystickSwitch.Right)) {
                    tankDirection = Direction.Right;
                }
                this.battleScene.tank.setVelocityFor(tankDirection);

                if (this.joystick.isPressed(JoystickSwitch.Fire)) {
                    this.battleScene.addShell();
                }

                this.battleScene.checkForShellCollision();
            }
            this.lastUpdateTime = time;
        }

        redrawnImageDataOrNull(time: number): ImageData | null {

            let shouldRedraw: boolean;
            if (this.lastRedrawTime != undefined) {
                let duration = time - this.lastRedrawTime;
                shouldRedraw = duration >= this.targetFrameDuration;
            } else {
                shouldRedraw = true;
            }

            if (shouldRedraw) {
                this.lastRedrawTime = time;
                return this.battleScene.redraw(time);
            }
            return null;
        }
    }
}