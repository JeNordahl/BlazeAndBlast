class Ghost {
  constructor(x, y, width, height, imageSrc) {
    this.position = {
      x: x,
      y: y,
    };
    this.width = width; // set the width of the ghosts
    this.height = height; // set  the height of the ghosts
    this.image = new Image();
    this.image.onload = () => {
      this.imageLoaded = true;
      this.frameWidth = this.image.width / this.frameCount; // Width of each frame
    };
    this.image.src = imageSrc;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.speed = 0.4; // Set the speed of the ghosts
    this.followingPlayer = false;

    this.damageTimer = null;
    this.damageInterval = 500; //How often the damage is ticking when colliding with player

    this.frameRate = 2;
    this.elapserFrames = 0;

    // Animation properties
    this.currentFrame = 0;
    this.frameCount = 4; // Number of frames in the animation

    this.originalSprite = imageSrc;  // save the original sprite 
    this.isHit = false;

    this.health = 100; // Sets the health to 100
  }

  //Hit function to switch sprite, indicating that the enemy has been hit
  handleHit() {
    this.isHit = true;
    this.image.src = './img/enemies/ghostHit.png'; // switch to the hit sprite
    this.currentFrame = 0; // start at the first frame
  }

  drawAnimation() {
    if (!this.imageLoaded) return;

    const cropbox = {
      position: {
        x: this.frameWidth * this.currentFrame,
        y: 0,
      },
      width: this.frameWidth,
      height: this.image.height,
    };

    c.drawImage(
      this.image,
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    this.updateFrames();
  }

  updateFrames() {
    this.elapserFrames++; // Increment the frame counter

    if (this.isHit) {
      // If we're playing the hit animation and we've reached the last frame
      if (this.elapserFrames % (10 * this.frameRate) === 0) {
        this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        if (this.currentFrame == 0) {
          this.isHit = false;  // Reset the hit flag
          this.image.src = this.originalSprite;  // switch back to the original sprite
        }
      }
    } else if (this.elapserFrames % (10 * this.frameRate) === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    }
  }

  draw() {
    if (this.imageLoaded) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  update(player) {
    const dx = player.position.x - this.position.x;
    const dy = player.position.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // followingplayer makes the Enemies follow the player if within a certain distance
    if (distance <= 400) {
      this.followingPlayer = true;
    }

    if (
      player.position.x < this.position.x + this.width &&
      player.position.x + player.width * 0.47 > this.position.x &&
      player.position.y + player.height * 0.47 > this.position.y &&
      player.position.y < this.position.y + this.height
    ) {
      if (!this.damageTimer) {
        player.health -= 20; // Player takes 20% damage
        document.querySelector('#playerHealth').style.width = player.health + '%'; //Animates the html div #playerHealth when taking damage

        // Start the damage timer after the first hit
        this.damageTimer = setInterval(() => {
          player.health -= 20;
          document.querySelector('#playerHealth').style.width = player.health + '%';
        }, this.damageInterval);
      }
    } else {
      // Clear the damage timer if the player is not colliding
      if (this.damageTimer) {
        clearInterval(this.damageTimer);
        this.damageTimer = null;
      }
    }


    if (this.followingPlayer) {
      this.velocity.x = (dx / distance) * this.speed;
      this.velocity.y = (dy / distance) * this.speed;
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
}