"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var jmcd;
(function (jmcd) {
    var Graphics;
    (function (Graphics) {
        var Vertex = /** @class */ (function () {
            function Vertex(x, y) {
                this.x = x;
                this.y = y;
            }
            Object.defineProperty(Vertex, "zero", {
                get: function () {
                    return new Vertex(0, 0);
                },
                enumerable: true,
                configurable: true
            });
            Vertex.prototype.adding = function (rhs) {
                return new Vertex(this.x + rhs.x, this.y + rhs.y);
            };
            Vertex.prototype.subtracting = function (rhs) {
                return new Vertex(this.x - rhs.x, this.y - rhs.y);
            };
            Vertex.prototype.multiplying = function (rhs) {
                return new Vertex(this.x * rhs, this.y * rhs);
            };
            Vertex.prototype.settingX = function (x) {
                return new Vertex(x, this.y);
            };
            Vertex.prototype.settingY = function (y) {
                return new Vertex(this.x, y);
            };
            return Vertex;
        }());
        Graphics.Vertex = Vertex;
        var Rect = /** @class */ (function () {
            function Rect(origin, size) {
                this.origin = origin;
                this.size = size;
                this.antiOrigin = origin.adding(size);
            }
            Rect.prototype.settingSize = function (size) {
                return new Rect(this.origin, size);
            };
            Rect.prototype.settingOrigin = function (origin) {
                return new Rect(origin, this.size);
            };
            Rect.prototype.clamp = function (point) {
                return new Vertex(Math.min(this.antiOrigin.x, Math.max(this.origin.x, point.x)), Math.min(this.antiOrigin.y, Math.max(this.origin.y, point.y)));
            };
            Rect.prototype.intersects = function (other) {
                return this.origin.x < other.antiOrigin.x && this.antiOrigin.x > other.origin.x &&
                    this.origin.y < other.antiOrigin.y && this.antiOrigin.y > other.origin.y;
            };
            Rect.prototype.liesIn = function (other) {
                return this.liesInXBounds(other.origin.x) || this.liesInXBounds(other.antiOrigin.x) &&
                    this.liesInYBounds(other.origin.y) || this.liesInYBounds(other.antiOrigin.y);
            };
            Rect.prototype.liesInXBounds = function (x) {
                return x >= this.origin.x && x < this.antiOrigin.x;
            };
            Rect.prototype.liesInYBounds = function (y) {
                return y >= this.origin.y && y < this.antiOrigin.y;
            };
            Object.defineProperty(Rect, "zero", {
                get: function () {
                    return new Rect(Vertex.zero, Vertex.zero);
                },
                enumerable: true,
                configurable: true
            });
            return Rect;
        }());
        Graphics.Rect = Rect;
        var Color = /** @class */ (function () {
            function Color(r, g, b, a) {
                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;
            }
            return Color;
        }());
        Graphics.Color = Color;
        var Texture = /** @class */ (function () {
            function Texture(width, palette, pixelPaletteIndices) {
                this.width = width;
                this.palette = palette;
                this.pixelPaletteIndices = pixelPaletteIndices;
            }
            Texture.prototype.toImageData = function () {
                var data = new Uint8ClampedArray(this.pixelPaletteIndices.length * 4);
                for (var i = 0; i < this.pixelPaletteIndices.length; i++) {
                    var paletteIndex = this.pixelPaletteIndices[i];
                    var col = this.palette[paletteIndex];
                    data[i * 4 + 0] = col.r;
                    data[i * 4 + 1] = col.g;
                    data[i * 4 + 2] = col.b;
                    data[i * 4 + 3] = col.a;
                }
                return new ImageData(data, this.width, this.pixelPaletteIndices.length / this.width);
            };
            return Texture;
        }());
        Graphics.Texture = Texture;
        var AnimationDefinition = /** @class */ (function () {
            function AnimationDefinition(imageDatas, frameDuration) {
                if (frameDuration === void 0) { frameDuration = null; }
                this.imageDatas = imageDatas;
                this.frameDuration = frameDuration;
                this.size = new Vertex(imageDatas[0].width, imageDatas[0].height);
            }
            return AnimationDefinition;
        }());
        Graphics.AnimationDefinition = AnimationDefinition;
        var Animation = /** @class */ (function () {
            function Animation(defn, startTime) {
                this.defn = defn;
                this.startTime = startTime;
            }
            Object.defineProperty(Animation.prototype, "size", {
                get: function () { return this.defn.size; },
                enumerable: true,
                configurable: true
            });
            Animation.prototype.getImageData = function (time) {
                if (this.defn.frameDuration == null) {
                    return this.defn.imageDatas[0];
                }
                var duration = time - this.startTime;
                var numberOfFrames = Math.floor(duration / this.defn.frameDuration);
                var frameIndex = numberOfFrames % this.defn.imageDatas.length;
                return this.defn.imageDatas[frameIndex];
            };
            return Animation;
        }());
        Graphics.Animation = Animation;
        var ImageDataTool = /** @class */ (function () {
            function ImageDataTool() {
            }
            ImageDataTool.index = function (id, x, y) {
                return y * id.width + x;
            };
            ImageDataTool.draw = function (bg, fg, x, y) {
                x = Math.floor(x);
                y = Math.floor(y);
                for (var fgY = 0; fgY < fg.height; fgY++) {
                    for (var fgX = 0; fgX < fg.width; fgX++) {
                        var bgX = x + fgX;
                        var bgY = y + fgY;
                        var fgI = this.index(fg, fgX, fgY);
                        var bgI = this.index(bg, bgX, bgY);
                        if (bgI > bg.data.length) {
                            continue;
                        }
                        bg.data[bgI * 4 + 0] = fg.data[fgI * 4 + 0];
                        bg.data[bgI * 4 + 1] = fg.data[fgI * 4 + 1];
                        bg.data[bgI * 4 + 2] = fg.data[fgI * 4 + 2];
                        bg.data[bgI * 4 + 3] = fg.data[fgI * 4 + 3]; // TODO: alpha blending
                    }
                }
            };
            return ImageDataTool;
        }());
        Graphics.ImageDataTool = ImageDataTool;
    })(Graphics = jmcd.Graphics || (jmcd.Graphics = {}));
})(jmcd || (jmcd = {}));
var jmcd;
(function (jmcd) {
    var Sprites;
    (function (Sprites) {
        var g = jmcd.Graphics;
        var Node = /** @class */ (function () {
            function Node(rect) {
                this.rect = rect;
                this.parent = null;
                this.children = new Array();
            }
            Node.prototype.addChild = function (node) {
                this.children.push(node);
                node.parent = this;
            };
            Node.prototype.removeFromParent = function () {
                if (this.parent == null) {
                    return;
                }
                var index = this.parent.children.indexOf(this, 0);
                if (index > -1) {
                    this.parent.children.splice(index, 1);
                }
                this.parent = null;
            };
            Node.prototype.update = function (duration) {
                this.updateCore(duration);
                this.children.forEach(function (c) { return c.update(duration); });
            };
            Node.prototype.draw = function (bg, time, position) {
                var absolutePosition = position.adding(this.rect.origin);
                this.drawCore(bg, time, absolutePosition);
                this.children.forEach(function (c) { return c.draw(bg, time, absolutePosition); });
            };
            Node.prototype.rectInContextOf = function (ancestor) {
                var o = this.rect.origin;
                var n = this;
                while (ancestor != n) {
                    if (n.parent == null) {
                        return null;
                    }
                    n = n.parent;
                    o = o.adding(n.rect.origin);
                }
                return new g.Rect(o, this.rect.size);
            };
            return Node;
        }());
        Sprites.Node = Node;
        var Scene = /** @class */ (function (_super) {
            __extends(Scene, _super);
            function Scene(size) {
                return _super.call(this, new g.Rect(g.Vertex.zero, size)) || this;
            }
            Scene.prototype.redraw = function (time) {
                var data = new ImageData(this.rect.size.x, this.rect.size.y);
                this.draw(data, time, g.Vertex.zero);
                return data;
            };
            Scene.prototype.updateCore = function (duration) { };
            Scene.prototype.drawCore = function (bg, time, absolutePosition) { };
            return Scene;
        }(Node));
        Sprites.Scene = Scene;
        var Body = /** @class */ (function (_super) {
            __extends(Body, _super);
            function Body(rect, velocity) {
                var _this = _super.call(this, rect) || this;
                _this.rect = rect;
                _this.velocity = velocity;
                _this.boundary = null;
                return _this;
            }
            Body.prototype.updateCore = function (duration) {
                var newOrigin = this.rect.origin.adding(this.velocity.multiplying(duration));
                if (this.boundary != null) {
                    newOrigin = this.boundary.clamp(newOrigin);
                }
                this.rect = this.rect.settingOrigin(newOrigin);
            };
            Body.prototype.drawCore = function (bg, time, absolutePosition) { };
            return Body;
        }(Node));
        Sprites.Body = Body;
        var Sprite = /** @class */ (function (_super) {
            __extends(Sprite, _super);
            function Sprite(origin, velocity, animation) {
                var _this = _super.call(this, new g.Rect(origin, animation.size), velocity) || this;
                _this.animation = animation;
                return _this;
            }
            Sprite.prototype.drawCore = function (bg, time, absolutePosition) {
                var invaderImageData = this.animation.getImageData(time);
                g.ImageDataTool.draw(bg, invaderImageData, absolutePosition.x, absolutePosition.y);
            };
            return Sprite;
        }(Body));
        Sprites.Sprite = Sprite;
        var Formation = /** @class */ (function (_super) {
            __extends(Formation, _super);
            function Formation() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Formation.prototype.fitRectToContents = function () {
                var xMin = this.rect.antiOrigin.x;
                var yMin = this.rect.antiOrigin.y;
                var xMax = 0;
                var yMax = 0;
                for (var i = 0; i < this.children.length; i++) {
                    var child = this.children[i];
                    var or = child.rect.origin;
                    xMin = Math.min(or.x, xMin);
                    yMin = Math.min(or.y, yMin);
                    var aor = child.rect.antiOrigin;
                    xMax = Math.max(aor.x, xMax);
                    yMax = Math.max(aor.y, yMax);
                }
                var originOffset = new g.Vertex(xMin, yMin);
                var newOrigin = this.rect.origin.adding(originOffset);
                var newSize = new g.Vertex(xMax - xMin, yMax - yMin);
                this.rect = new g.Rect(newOrigin, newSize);
                for (var i = 0; i < this.children.length; i++) {
                    var child = this.children[i];
                    child.rect = child.rect.settingOrigin(child.rect.origin.subtracting(originOffset));
                }
            };
            return Formation;
        }(Body));
        Sprites.Formation = Formation;
    })(Sprites = jmcd.Sprites || (jmcd.Sprites = {}));
})(jmcd || (jmcd = {}));
var jmcd;
(function (jmcd) {
    var SpaceInvaders;
    (function (SpaceInvaders) {
        var g = jmcd.Graphics;
        var s = jmcd.Sprites;
        var ImageDatas = /** @class */ (function () {
            function ImageDatas() {
            }
            ImageDatas.invader2a = new g.Texture(16, [new g.Color(0, 0, 0, 0), new g.Color(0, 0, 0, 255)], [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]).toImageData();
            ImageDatas.invader2b = new g.Texture(16, [new g.Color(0, 0, 0, 0), new g.Color(0, 0, 0, 255)], [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0]).toImageData();
            ImageDatas.tank = new g.Texture(16, [new g.Color(0, 0, 0, 0), new g.Color(0, 0, 0, 255)], [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]).toImageData();
            ImageDatas.shell = new g.Texture(1, [new g.Color(0, 0, 0, 255)], [0, 0, 0, 0, 0, 0, 0, 0]).toImageData();
            return ImageDatas;
        }());
        SpaceInvaders.ImageDatas = ImageDatas;
        var AnimationDefinitions = /** @class */ (function () {
            function AnimationDefinitions() {
            }
            AnimationDefinitions.invader = new g.AnimationDefinition([ImageDatas.invader2a, ImageDatas.invader2b], 1000);
            AnimationDefinitions.tank = new g.AnimationDefinition([ImageDatas.tank]);
            AnimationDefinitions.shell = new g.AnimationDefinition([ImageDatas.shell]);
            return AnimationDefinitions;
        }());
        var JoystickSwitch;
        (function (JoystickSwitch) {
            JoystickSwitch[JoystickSwitch["None"] = 0] = "None";
            JoystickSwitch[JoystickSwitch["Fire"] = 1] = "Fire";
            JoystickSwitch[JoystickSwitch["Left"] = 2] = "Left";
            JoystickSwitch[JoystickSwitch["Right"] = 4] = "Right";
        })(JoystickSwitch = SpaceInvaders.JoystickSwitch || (SpaceInvaders.JoystickSwitch = {}));
        var Joystick = /** @class */ (function () {
            function Joystick() {
                this.currentSwitches = JoystickSwitch.None;
            }
            Joystick.prototype.press = function (sw) {
                this.currentSwitches = this.currentSwitches | sw;
            };
            Joystick.prototype.depress = function (sw) {
                this.currentSwitches = this.currentSwitches ^ sw;
            };
            Joystick.prototype.isPressed = function (sw) {
                return (this.currentSwitches & sw) == sw;
            };
            return Joystick;
        }());
        SpaceInvaders.Joystick = Joystick;
        var InvaderFormation = /** @class */ (function (_super) {
            __extends(InvaderFormation, _super);
            function InvaderFormation(difficultyLevel) {
                var _this = _super.call(this, new g.Rect(new g.Vertex(0, 100), g.Vertex.zero), new g.Vertex(difficultyLevel / 100, 0)) || this;
                var anim = new g.Animation(AnimationDefinitions.invader, 0);
                for (var iy = 0; iy < 5; iy++) {
                    for (var ix = 0; ix < 11; ix++) {
                        var sprite = new s.Sprite(new g.Vertex(ix * anim.size.x, iy * (anim.size.y + 4)), g.Vertex.zero, anim);
                        _this.addChild(sprite);
                    }
                }
                _this.fitRectToContents();
                return _this;
            }
            InvaderFormation.prototype.updateCore = function (duration) {
                _super.prototype.updateCore.call(this, duration);
                this.fitRectToContents();
                if (this.boundary == null) {
                    return;
                }
                if (this.velocity.x > 0) {
                    if (this.rect.antiOrigin.x >= this.boundary.antiOrigin.x) {
                        this.velocity = new g.Vertex(-this.velocity.x, this.velocity.y);
                    }
                }
                else {
                    if (this.rect.origin.x <= 0) {
                        this.velocity = new g.Vertex(-this.velocity.x, this.velocity.y);
                    }
                }
            };
            return InvaderFormation;
        }(s.Formation));
        var Direction;
        (function (Direction) {
            Direction[Direction["Left"] = 0] = "Left";
            Direction[Direction["Right"] = 1] = "Right";
        })(Direction || (Direction = {}));
        var Tank = /** @class */ (function (_super) {
            __extends(Tank, _super);
            function Tank(origin) {
                return _super.call(this, origin, g.Vertex.zero, new g.Animation(AnimationDefinitions.tank, 0)) || this;
            }
            Tank.prototype.setVelocityFor = function (direction) {
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
            };
            Tank.speed = 100 / 1000;
            Tank.leftVelocity = new g.Vertex(-Tank.speed, 0);
            Tank.rightVelocity = new g.Vertex(Tank.speed, 0);
            return Tank;
        }(s.Sprite));
        var BattleScene = /** @class */ (function (_super) {
            __extends(BattleScene, _super);
            function BattleScene() {
                var _this = _super.call(this, new g.Vertex(256, 224)) || this;
                _this.shell = null;
                var formation = new InvaderFormation(1);
                formation.boundary = _this.rect;
                _this.addChild(formation);
                var anim = new g.Animation(AnimationDefinitions.tank, 0);
                var tank = new Tank(new g.Vertex((_this.rect.size.x - anim.size.x) / 2, (_this.rect.size.y - anim.size.y)));
                tank.boundary = new g.Rect(new g.Vertex(0, tank.rect.origin.y), new g.Vertex(_this.rect.size.x - tank.rect.size.x, 8));
                _this.addChild(tank);
                _this.formation = formation;
                _this.tank = tank;
                return _this;
            }
            BattleScene.prototype.updateCore = function (duration) {
                _super.prototype.updateCore.call(this, duration);
                if (this.shell != null) {
                    if (this.shell.rect.antiOrigin.y < 0) {
                        this.removeShell();
                    }
                }
            };
            BattleScene.prototype.addShell = function () {
                if (this.shell != null) {
                    return;
                }
                var tr = this.tank.rect;
                var so = new g.Vertex(tr.origin.x + tr.size.x / 2, tr.origin.y);
                this.shell = new s.Sprite(so, new g.Vertex(0, -50 / 1000), new g.Animation(AnimationDefinitions.shell, 0));
                this.addChild(this.shell);
            };
            BattleScene.prototype.removeShell = function () {
                if (this.shell == null) {
                    return;
                }
                this.shell.removeFromParent();
                this.shell = null;
            };
            BattleScene.prototype.checkForShellCollision = function () {
                if (this.shell == null) {
                    return;
                }
                var shellRect = this.shell.rectInContextOf(this);
                if (shellRect == null) {
                    return;
                }
                for (var _i = 0, _a = this.formation.children; _i < _a.length; _i++) {
                    var invader = _a[_i];
                    var invaderRect = invader.rectInContextOf(this);
                    if (invaderRect == null) {
                        continue;
                    }
                    if (shellRect.intersects(invaderRect)) {
                        this.removeShell();
                        invader.removeFromParent();
                    }
                }
            };
            return BattleScene;
        }(s.Scene));
        var Game = /** @class */ (function () {
            function Game(joystick) {
                this.joystick = joystick;
                this.battleScene = new BattleScene();
                this.targetFps = 50;
                this.targetFrameDuration = 1000 / this.targetFps;
            }
            Game.prototype.update = function (time) {
                if (this.lastUpdateTime != undefined) {
                    var duration = time - this.lastUpdateTime;
                    for (var i = 0; i < duration / this.targetFrameDuration; i++) {
                        this.battleScene.update(this.targetFrameDuration);
                    }
                    this.battleScene.update(duration % this.targetFrameDuration);
                    var tankDirection = null;
                    if (this.joystick.isPressed(JoystickSwitch.Left)) {
                        tankDirection = Direction.Left;
                    }
                    else if (this.joystick.isPressed(JoystickSwitch.Right)) {
                        tankDirection = Direction.Right;
                    }
                    this.battleScene.tank.setVelocityFor(tankDirection);
                    if (this.joystick.isPressed(JoystickSwitch.Fire)) {
                        this.battleScene.addShell();
                    }
                    this.battleScene.checkForShellCollision();
                }
                this.lastUpdateTime = time;
            };
            Game.prototype.redrawnImageDataOrNull = function (time) {
                var shouldRedraw;
                if (this.lastRedrawTime != undefined) {
                    var duration = time - this.lastRedrawTime;
                    shouldRedraw = duration >= this.targetFrameDuration;
                }
                else {
                    shouldRedraw = true;
                }
                if (shouldRedraw) {
                    this.lastRedrawTime = time;
                    return this.battleScene.redraw(time);
                }
                return null;
            };
            return Game;
        }());
        SpaceInvaders.Game = Game;
    })(SpaceInvaders = jmcd.SpaceInvaders || (jmcd.SpaceInvaders = {}));
})(jmcd || (jmcd = {}));
//# sourceMappingURL=app.js.map