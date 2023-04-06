// EventEmitter类用以发布和订阅消息
// on 方法接受两个参数：一个消息字符串和一个监听器函数。它检查是否存在指定消息的任何现有监听器，并在不存在时创建一个空数组。然后将监听器函数添加到此数组中。
// emit 方法接受一个消息字符串和一个可选的有效负载参数。它检查是否存在指定消息的任何侦听器，如果存在，则迭代每个侦听器函数并使用消息和有效载荷参数调用它。
// 使用此 EventEmitter 类，您可以创建实例并使用它们触发事件，从而允许应用程序的不同部分彼此通信而不被紧密耦合。例如，您可能有一个模块监听用户输入事件，另一个模块通过更新 UI 响应这些事件。
class EventEmitter {
	constructor() {
		this.listeners = {};
	}

	on(message, listener) {
		if (!this.listeners[message]) {
			this.listeners[message] = [];
		}
		this.listeners[message].push(listener);
	}

	emit(message, payload = null) {
		if (this.listeners[message]) {
			this.listeners[message].forEach((l) => l(message, payload));
		}
	}
}

// hero和enemy都是从gameObject中延伸出来的
class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dead = false;
    this.width = 0;
    this.height = 0;
    this.img = undefined;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  rectFromGameObject() {
    return {
      top: this.y,
      left: this.x,
      bottom: this.y+this.height,
      right: this.x+this.width,
    };
  }
}

class Hero extends GameObject {
  constructor(x, y) {
    super(x, y);
    (this.width = 99), (this.height = 75);
    this.type = 'Hero';
    this.speed = {x:0, y:0};
    this.cooldown = 0;
  }

  fire() {
    gameObjects.push(new Laser(this.x + 45, this.y - 10));
    this.cooldown = 500;

    let id = setInterval(() => {
      if (this.cooldown > 0) {
        this.cooldown -= 100;
      } else {
        clearInterval(id);
      }
    }, 200);
  }

  canFire() {
    return this.cooldown === 0;
  }
}

class Enemy extends GameObject {
  constructor(x, y) {
    super(x, y);
    (this.width = 98), (this.height = 50);
    this.type = 'Enemy';
    let id = setInterval(() => {
      if (this.y < canvas.height - this.height) {
        this.y += 5;
      } else {
        console.log('Stopped at', this.y);
        clearInterval(id);
      }
    }, 300)
  }
}

// 从GameObject创建移动物件
class Laser extends GameObject {
  constructor(x, y) {
    super(x, y);
    (this.width = 9), (this.height = 33);
    this.type = 'Laser';
    this.img = laserImg;
    let id = setInterval(() => {
      if (this.y > 0) {
        this.y -= 15;
      } else {
        this.dead = true;
        clearInterval(id);
      }
    }, 100)
  }
}

function loadTexture(path) {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = path
    img.onload = () => {
      resolve(img)
    }
  })
}

// 建立常数
const Messages = {
  KEY_EVENT_UP: "KEY_EVENT_UP",
  KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
  KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
  KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
  KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
  COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
  COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
};

// 设定EventEmitter
let heroImg, 
    enemyImg, 
    laserImg,
    canvas, ctx, 
    gameObjects = [], 
    hero, 
    eventEmitter = new EventEmitter();

let onKeyDown = function (e) {
	console.log(e.keyCode); // 控制台记录键盘按键信息
	switch (e.keyCode) {
		case 37: // ArrowLeft
		case 39: // ArrowRight
		case 38: // ArrowUp
		case 40: // ArrowDown
		case 32: // Space
			e.preventDefault();
			break; 
		default:
			break; // do not block other keys
	}
};

// 按下键盘时记录键值，并且去掉预设动作
window.addEventListener('keydown', onKeyDown);

// 键盘放开时执行上下移动的操作
window.addEventListener('keyup', (evt) => {
  if (evt.key === 'ArrowUp') {
    eventEmitter.emit(Messages.KEY_EVENT_UP);
  } else if (evt.key === 'ArrowDown') {
    eventEmitter.emit(Messages.KEY_EVENT_DOWN);
  } else if (evt.key === 'ArrowLeft') {
    eventEmitter.emit(Messages.KEY_EVENT_LEFT);
  } else if (evt.key === 'ArrowRight') {
    eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
  } else if (evt.keyCode === 32) {
    eventEmitter.emit(Messages.KEY_EVENT_SPACE);
  }
})

function createEnemies() {
  const MONSTER_TOTAL = 5;
  const MONSTER_WIDTH = MONSTER_TOTAL * 98;
  const START_X = (canvas.width - MONSTER_WIDTH) / 2;
  const STOP_X = START_X + MONSTER_WIDTH;
   
  for (let x = START_X; x < STOP_X; x += 98) {
    for (let y = 0; y < 50 * 5; y += 50) {
      const enemy = new Enemy(x, y);
      enemy.img = enemyImg;
      gameObjects.push(enemy);
    }
  }
}

function createHero() {
  hero = new Hero(canvas.width/2-45, canvas.height-canvas.height/4);
  hero.img = heroImg;
  gameObjects.push(hero);
}

function drawGameObjects(ctx) {
  gameObjects.forEach((go) => go.draw(ctx));
}

// 初始化游戏
function initGame() {
	gameObjects = [];
	createEnemies();
	createHero();

	eventEmitter.on(Messages.KEY_EVENT_UP, () => {
		hero.y -= 10;
	});

	eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
		hero.y += 10;
	});

	eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
		hero.x -= 20;
	});

	eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
		hero.x += 20;
	});

  eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
    if (hero.canFire()) {
      hero.fire();
    }
  });

  // 敌人碰到lasser时能更新死亡状态
  eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
    first.dead = true;
    second.dead = true;
  })
}

// 设定游戏循环
window.onload = async () => {
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  heroImg = await loadTexture('assets/hero.png');
  enemyImg = await loadTexture('assets/enemyShip.png');
  laserImg = await loadTexture('assets/laserRed.png');

  initGame();
  // 设定循环的间隔，即游戏画面的刷新时间
  let gameLoopId = setInterval(() => {
    updateGameObjects();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGameObjects(ctx);
  }, 100)
}

// 发射镭射光并侦测碰撞
// 将游戏物件都视为移动中的矩形，都有一组x，y，width，height，相交即视为碰撞
// 摧毁物件可用gameObject中的dead的布尔值做判定
// 发射镭射，作为对某一键盘事件的回应，并建立往特定方向移动的物件
// 镭射的冷却时间，需要一个计时器确保镭射在一定时间贱内只能被发射一次

// 检查碰撞
function intersectRect(r1, r2) {
  return !(r2.left > r1.right || 
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top);
}

// 处理碰撞
// go为game object的缩写
function updateGameObjects() {
  const enemies = gameObjects.filter(go => go.type === 'Enemy');
  const lasers = gameObjects.filter(go => go.type === 'Laser');

  // laser击中某物
  lasers.forEach((l) => {
    enemies.forEach((m) => {
      if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
        eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
          first: l,
          second: m,
        });
      }
    });
  });

  gameObjects = gameObjects.filter(go => !go.dead);
}