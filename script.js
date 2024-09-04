const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
let fruits = []
const fruitImages = []
let fruitHalves = []
let score = 0 // Puntaje inicial
let timeLeft = 200 // Tiempo inicial en segundos
let gameInterval
let fruitGenerationInterval
let alertShown = false // Bandera para controlar la alerta

let canvasWidth = window.innerWidth - 50
let canvasHeight = window.innerHeight
canvas.style.border = '1px solid black'

canvas.width = canvasWidth
canvas.height = canvasHeight

// Cargar imágenes de frutas
const loadImages = () => {
  const fruitTypes = ['apple', 'banana', 'orange', 'ajo']
  fruitTypes.forEach((type) => {
    const img = new Image()
    img.src = `./images/${type}.png`
    fruitImages.push(img)
  })
}

// Clase para la fruta
class Fruit {
  constructor(x, y, image, speedX, speedY) {
    this.x = x
    this.y = y
    this.image = image
    this.size = 50
    this.speedX = speedX
    this.speedY = speedY
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.size, this.size)
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY

    if (this.x <= 0 || this.x + this.size >= canvasWidth) {
      this.speedX *= -1 // Rebotar en los lados
    }
    if (this.y <= 0) {
      this.speedY *= -1 // Rebotar en la parte superior
    }

    this.speedY += 0.1 // Gravedad

    // Elimina la fruta si pasa la parte inferior de la pantalla
    if (this.y > canvasHeight) {
      return false
    }
    return true
  }

  isHit(x, y) {
    return (
      x >= this.x &&
      x <= this.x + this.size &&
      y >= this.y &&
      y <= this.y + this.size
    )
  }
}

// Clase para las mitades de la fruta
class FruitHalf {
  constructor(x, y, image, size, direction) {
    this.x = x
    this.y = y
    this.image = image
    this.size = size / 2
    this.speedX = direction * 2
    this.speedY = -2
    this.gravity = 0.1
    this.direction = direction
    this.rotation = 0
    this.rotationSpeed = direction * 0.1
  }

  draw() {
    ctx.save()
    ctx.translate(this.x + this.size / 2, this.y + this.size / 2)
    ctx.rotate(this.rotation)
    ctx.drawImage(
      this.image,
      this.direction === -1 ? 0 : this.image.width / 2,
      0,
      this.image.width / 2,
      this.image.height,
      -this.size / 2,
      -this.size / 2,
      this.size,
      this.size
    )
    ctx.restore()
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY
    this.speedY += this.gravity
    this.rotation += this.rotationSpeed

    if (this.y > canvasHeight) {
      return false
    }
    return true
  }
}

// Cronómetro
const drawTimer = () => {
  ctx.font = '30px Arial'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'left'
  ctx.fillText(`Tiempo: ${timeLeft}s`, 10, 50)
}

const startTimer = () => {
  const timerInterval = setInterval(() => {
    timeLeft -= 1
    if (timeLeft <= 0) {
      clearInterval(timerInterval)
      clearInterval(gameInterval)
      clearInterval(fruitGenerationInterval)
      alert('¡Tiempo acabado! Fin del juego.')
      restartGame() // Llamar a la función para reiniciar el juego
    }
  }, 1000) // Reducir el tiempo cada segundo
}

// Crear frutas
const createFruits = () => {
  for (let i = 0; i < 5; i++) {
    const x = Math.random() * (canvasWidth - 50)
    const y = canvasHeight
    const image = fruitImages[Math.floor(Math.random() * fruitImages.length)]
    const speedX = (Math.random() - 0.5) * 4 // Velocidad horizontal
    const speedY = -Math.random() * 8 - 5 // Aumentar la velocidad vertical para que suba más
    fruits.push(new Fruit(x, y, image, speedX, speedY))
  }
}

// Crear mitades de fruta
const createFruitHalves = (fruit) => {
  const half1 = new FruitHalf(fruit.x, fruit.y, fruit.image, fruit.size, -1)
  const half2 = new FruitHalf(fruit.x, fruit.y, fruit.image, fruit.size, 1)
  fruitHalves.push(half1, half2)
}

const updateAndDrawFruits = () => {
  fruits = fruits.filter((fruit) => {
    fruit.update()
    fruit.draw()
    return fruit.y + fruit.size >= 0
  })

  fruitHalves = fruitHalves.filter((half) => {
    half.update()
    half.draw()
    return half.y + half.size >= 0
  })

  if (score >= 50 && !alertShown) {
    // alert("¡Felicidades has completado todos los puntos!");
    // drawTimer()
    console.log(score)

    alertShown = true // Marcar que la alerta ya se mostró
    restartGame() // Llamar a la función para reiniciar el juego
  }
}

// Dibujar el puntaje
const drawScore = () => {
  ctx.font = '24px Arial'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'right'
  ctx.fillText('Puntos: ' + score, canvasWidth - 20, 30)
}

// Evento de clic para cortar frutas
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  fruits.forEach((fruit, index) => {
    if (fruit.isHit(x, y)) {
      if (fruit.image.src.includes('banana')) {
        score += 10
      } else if (fruit.image.src.includes('apple')) {
        score += 5
      } else if (fruit.image.src.includes('orange')) {
        score += 3
      } else if (fruit.image.src.includes('ajo')) {
        score -= 5
      }
      fruits.splice(index, 1)
      createFruitHalves(fruit)
    }
  })
})

// Reiniciar el juego
const restartGame = () => {
  fruits = []
  fruitHalves = []
  score = 0
  timeLeft = 200
  alertShown = false

  clearInterval(gameInterval)
  clearInterval(fruitGenerationInterval)

  // Reiniciar el juego
  initGame()
}

const initGame = () => {
  loadImages()
  createFruits()

  // Intervalo para el bucle principal de juego
  gameInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    updateAndDrawFruits()
    drawScore()
    drawTimer() // Dibuja el cronómetro en cada actualización
  }, 1000 / 30)

  // Intervalo para crear nuevas frutas cada cierto tiempo
  fruitGenerationInterval = setInterval(() => {
    createFruits()
  }, 2000) // Cambia el tiempo según prefieras la frecuencia de aparición

  startTimer() // Iniciar el cronómetro
}

// Ajustar el tamaño del canvas en la ventana de cambio de tamaño
window.addEventListener('resize', () => {
  canvasWidth = window.innerWidth
  canvasHeight = window.innerHeight
  canvas.width = canvasWidth
  canvas.height = canvasHeight
})

initGame()
