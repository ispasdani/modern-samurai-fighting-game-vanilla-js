const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

//modal message for different situations
const modalMessage = document.getElementById("modal-message");

//canvas fixed size
canvas.width = 1024;
canvas.height = 576;

//canvas background from start
// c.fillRect(0, 0, canvas.width, canvas.height);

//gravity
const gravity = 0.5;

//canvas background image
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/cyberpunkStreet.png",
});

//shop animation
// const shop = new Sprite({
//   position: {
//     x: 620,
//     y: 224,
//   },
//   imageSrc: "./assets/shop.png",
//   scale: 2,
//   framesMax: 6,
// });

//creating the player
const player = new Fighter({
  position: {
    x: 150,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offSet: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/samuraiMack/idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 100,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/samuraiMack/idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./assets/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./assets/samuraiMack/TakeHit.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./assets/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 140,
    height: 50,
  },
});

//creating the enemy
const enemy = new Fighter({
  position: {
    x: 800,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offSet: {
    x: -50,
    y: 0,
  },
  imageSrc: "./assets/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 100,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./assets/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./assets/kenji/TakeHit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./assets/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -140,
      y: 50,
    },
    width: 140,
    height: 50,
  },
});

//setting the key pressed
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

//function call
decreseTime();

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  c.fillStyle = "rgba(255, 255, 255, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  // shop.update();
  player.update();
  enemy.update();

  //player movement
  player.velocity.x = 0;
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  //player jump move
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //enemy movement
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  //enemy jump move
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //detect for collision for player
  if (
    charactersCollision({
      character1: player,
      character2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 3
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    const enemyHealthBar = document.getElementById("enemy-health");
    enemyHealthBar.style.width = enemy.health + "%";
  }

  //if player misses
  if (player.isAttacking && player.framesCurrent === 3) {
    player.isAttacking = false;
  }

  //detect for collision for enemy
  if (
    charactersCollision({
      character1: player,
      character2: enemy,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    const playerHealthBar = document.getElementById("player-health");
    playerHealthBar.style.width = player.health + "%";
  }

  //if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  //determine which player wins in case of time out
  if (enemy.health <= 0) {
    determineWinner({ player, enemy, counterId });
  } else if (player.health <= 0) {
    determineWinner({ player, enemy, counterId });
  }
}

//keydown event
window.addEventListener("keydown", function (e) {
  //character 1 controlls
  if (!player.dead) {
    switch (e.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = -15;
        break;
      case " ":
        player.attack();
        break;
    }
  }
  if (!enemy.dead) {
    //character 2 controlls
    switch (e.key) {
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowUp":
        enemy.velocity.y = -15;
        break;

      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

//keyup event
window.addEventListener("keyup", function (e) {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
  switch (e.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});

//call animation
animate();
