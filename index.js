let camera = new Camera();

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth;
canvas.height = innerHeight;

const projectiles = [];
const enemies = [];
const ghosts = [];

const enemy1 = new Enemy(400, 300, 20, 20, './img/PLayerSprite/Bat.png');
const enemy2 = new Enemy(800, 200, 20, 20, './img/PlayerSprite/Bat.png');

const ghost1 = new Ghost(200, 300, 20, 20, 'black');
const ghost2 = new Ghost(600, 200, 20, 20, 'purple')

enemies.push(enemy1, enemy2);
ghosts.push(ghost1, ghost2);

let parsedCollisions
let collisionBlocks
let background
let doors

const player = new Player({

    imageSrc: './img/PlayerSprite/playerIdle.png',

    health: 100,


    frameRate: 11,
    animations: {
        idleRight: {
            frameRate: 1,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/PlayerSprite/idleRight.png',
        },
        runRight: {
            frameRate: 4,
            frameBuffer: 30,
            loop: true,
            imageSrc: './img/PlayerSprite/playerRight.png',
        },
        runLeft: {
            frameRate: 4,
            frameBuffer: 30,
            loop: true,
            imageSrc: './img/PlayerSprite/playerLeft.png',
        },
        runUp: {
            frameRate: 4,
            frameBuffer: 30,
            loop: true,
            imageSrc: './img/PlayerSprite/playerUp.png'
        },
        runDown: {
            frameRate: 4,
            frameBuffer: 30,
            loop: true,
            imageSrc: './img/PlayerSprite/playerDown.png'
        },
        idleLeft: {
            frameRate: 1,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/PlayerSprite/idleLeft.png',
        },
        idleUp: {
            frameRate: 1,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/PlayerSprite/idleUp.png',
        },
        idleDown: {
            frameRate: 1,
            frameBuffer: 2,
            loop: true,
            imageSrc: './img/PlayerSprite/playerIdle.png',
        },
        
        enterDoor: {
            frameRate: 4,
            frameBuffer: 4,
            loop: false,
            imageSrc: './img/PlayerSprite/playerUp.png',
            onComplete: () => {
                console.log('completed animation')
                gsap.to(overlay, {
                    opacity: 1,
                    onComplete: () => {
                        level++

                        //REMOVE BEFORE ADDING MORE LEVELS
                        if (level ===5) level = 1
                        levels[level].init()
                        player.switchSprite('idleRight')
                        player.preventInput = false
                        gsap.to(overlay, {
                            opacity: 0
                        })
                    },
                })
            },
        },
    },
})

const healthBar = new HealthBar(player, 100); // 100 is the max health

let level = 1
let levels = {

    //-----LEVEL 1-----//
    1: {
        init: () => {
            parsedCollisions = collisionsLevel1.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
            player.position.x = 1000
            player.position.y = 65
            if(player.currentAnimation) player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                x: 0,
                y: 0,
            },
            imageSrc: './img/Maps/Level2.png',
            })
            
            doors = [
                new Sprite({
                    position: {
                        x: 96,
                        y: 18,
                    },
                    imageSrc: './img/DoorSprite/door2.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                }),
            ]
        },
    },

    //-----LEVEL 2-----//
    2: {
        init: () => {
            parsedCollisions = collisionsLevel2.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
            player.position.x = 1000
            player.position.y = 65

            if(player.currentAnimation) player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                x: 0,
                y: 0,
            },
            imageSrc: './img/Maps/Level2.png',
            })



            doors = [
                new Sprite({
                    position: {
                        x: 96,
                        y: 18,
                    },
                    imageSrc: './img/DoorSprite/door2.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                }),
            ]
        },
    },

    //-----LEVEL 3-----//
    3: {
        init: () => {
            parsedCollisions = collisionsLevel3.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
            player.position.x = 45
            player.position.y = 330

            if(player.currentAnimation) player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                x: 0,
                y: 0,
            },
            imageSrc: './img/Maps/Level3.png',
            })

            doors = [
                new Sprite({
                    position: {
                        x: 175,
                        y: 336,
                    },
                    imageSrc: './img/DoorSprite/door2.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                }),
            ]
        },
    },


    //-----LEVEL 4-----//
    4: {
        init: () => {
            parsedCollisions = collisionsLevel4.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
            player.position.x = 57
            player.position.y = 258

            if(player.currentAnimation) player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                x: 0,
                y: 0,
            },
            imageSrc: './img/Maps/Level4.png',
            })

            doors = [
                new Sprite({
                    position: {
                        x: 175,
                        y: 336,
                    },
                    imageSrc: './img/door2.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                }),
            ]
        },
    },
    
}

// Function that makes the game think that you are not pressing the keys, 
// this is to be able to click on one key at the same time as another without the first key stop working
const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
}

const overlay = {
    opacity: 0,
}

function gameOver() {
    // Load the game over image
    const gameOverImage = new Image();
    gameOverImage.src = './img/game.over.png';

    gameOverImage.onload = function() {
        // Draw the game over image
        c.drawImage(gameOverImage, 0, 0, canvas.width, canvas.height);
    }

    // You could add more game over logic here, such as a button to restart the game.
}


function animate() {
    if (player.health <= 0) {
        gameOver();
        return;
    }
    window.requestAnimationFrame(animate);

    camera.x = player.position.x - canvas.width / 2 / camera.scale;  
    camera.y = player.position.y - canvas.height / 2 / camera.scale;  

    // increase camera scale to zoom in
    camera.scale = 3;  // 200% zoom (The higher the more zoomed in)
    camera.preRender();
    background.draw();
    doors.forEach((door) => {
        door.draw();
    });

    enemies.forEach((enemy) => {
        enemy.update(player);
        enemy.draw();
    });

    ghosts.forEach((ghost) => {
        ghost.update(player);
        ghost.draw();
    });
    projectiles.forEach((projectile, index) => {
        projectile.update();
    
        for (let i = 0; i < collisionBlocks.length; i++) {
            const collisionBlock = collisionBlocks[i];
            
            if (
                projectile.x - projectile.radius < collisionBlock.position.x + collisionBlock.width &&
                projectile.x + projectile.radius > collisionBlock.position.x &&
                projectile.y + projectile.radius > collisionBlock.position.y &&
                projectile.y - projectile.radius < collisionBlock.position.y + collisionBlock.height
            ) {
                // Projectile has hit a collisionBlock (wall), remove it
                projectiles.splice(index, 1);
                break;  // Exit the loop early since we've removed the projectile
            }
        }
    
        // Check if the projectile is outside of the canvas
        if (projectile.x + projectile.radius < 0 || 
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            projectiles.splice(index, 1);
        }
    });
    
    
    
  
    player.handleInput(keys);
    player.draw();
    player.update();
    

    c.save();
    c.globalAlpha = overlay.opacity;
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.restore();

    camera.postRender();
    healthBar.draw();
}

levels[level].init()
animate()