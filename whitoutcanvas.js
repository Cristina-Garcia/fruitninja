const gameContainer = document.getElementById('gameContainer')
const scoreBoard = document.getElementById('scoreBoard')
const timerDisplay = document.getElementById('timer')
const errorImage = document.getElementById('error')
let score = 0
let timeLeft = 200
let gameInterval
let fruitGenerationInterval

// Crear una fruta
const createFruit = (type, x, y) => {
  const fruit = document.createElement('img')
  fruit.src = `images/${type}.png`
  fruit.classList.add('fruit')
  fruit.style.left = `${x}px`
  fruit.style.top = `${y}px`
  fruit.dataset.type = type

  // Animar la fruta para que suba y luego caiga con rebote
  animateFruit(fruit)

  // Evento de clic para cortar frutas
  fruit.addEventListener('click', () => {
    if (type === 'banana') {
      score += 10
    } else if (type === 'apple') {
      score += 5
    } else if (type === 'orange') {
      score += 3
    } else if (type === 'ajo') {
      score -= 5
      showError(x, y) // Mostrar error
    }

    scoreBoard.textContent = `Puntos: ${score}`
    cutFruit(fruit) // Cortar la fruta
  })

  gameContainer.appendChild(fruit)
}

// Animar la fruta para que suba y luego caiga con rebote
const animateFruit = (fruit) => {
  const startY = gameContainer.clientHeight
  const midY = startY / 2
  const speedX = (Math.random() - 0.5) * 100
  const gravity = 0.1
  let velocityY = -Math.random() * 10 - 10 // Velocidad inicial hacia arriba
  let posX = parseFloat(fruit.style.left)
  let posY = startY

  const animate = () => {
    posY += velocityY
    velocityY += gravity // Gravedad
    posX += speedX * 0.01

    if (posY >= startY) {
      velocityY = -velocityY * 0.7 // Rebote
      posY = startY
    }

    if (posX <= 0 || posX >= gameContainer.clientWidth - 50) {
      speedX *= -1 // Rebote en los lados
    }

    fruit.style.top = `${posY}px`
    fruit.style.left = `${posX}px`

    if (posY < startY) {
      requestAnimationFrame(animate)
    }
  }

  animate()
}

// Cortar la fruta en dos y hacer que caigan las mitades
const cutFruit = (fruit) => {
  const rect = fruit.getBoundingClientRect()
  const fruitType = fruit.dataset.type

  // Crear las mitades
  const half1 = document.createElement('img')
  half1.src = `images/${fruitType}.png`
  half1.classList.add('fruit', 'half')
  half1.style.left = `${rect.left}px`
  half1.style.top = `${rect.top}px`
  half1.style.clip = 'rect(0px, 25px, 50px, 0px)'
  half1.style.transform = 'rotate(-20deg)'
  gameContainer.appendChild(half1)

  const half2 = document.createElement('img')
  half2.src = `images/${fruitType}.png`
  half2.classList.add('fruit', 'half')
  half2.style.left = `${rect.left + 25}px`
  half2.style.top = `${rect.top}px`
  half2.style.clip = 'rect(0px, 50px, 50px, 25px)'
  half2.style.transform = 'rotate(20deg)'
  gameContainer.appendChild(half2)

  // Quitar la fruta original
  gameContainer.removeChild(fruit)

  // Caer las mitades
  setTimeout(() => {
    gameContainer.removeChild(half1)
    gameContainer.removeChild(half2)
  }, 2000) // Tiempo para que caigan las mitades
}

// Mostrar imagen de error
const showError = (x, y) => {
  errorImage.style.left = `${x}px`
  errorImage.style.top = `${y}px`
  errorImage.style.display = 'block'
  setTimeout(() => {
    errorImage.style.display = 'none'
  }, 1000)
}

// Crear frutas aleatorias
const createRandomFruits = () => {
  const fruitTypes = ['apple', 'banana', 'orange', 'ajo']
  for (let i = 0; i < 5; i++) {
    const type = fruitTypes[Math.floor(Math.random() * fruitTypes.length)]
    const x = Math.random() * (gameContainer.clientWidth - 50)
    createFruit(type, x, gameContainer.clientHeight - 50)
  }
}

// Cronómetro
const startTimer = () => {
  const timerInterval = setInterval(() => {
    timeLeft -= 1
    timerDisplay.textContent = `Tiempo: ${timeLeft}s`
    if (timeLeft <= 0) {
      clearInterval(timerInterval)
      clearInterval(gameInterval)
      clearInterval(fruitGenerationInterval)
      alert('¡Tiempo acabado! Fin del juego.')
    }
  }, 1000)
}

// Iniciar el juego
const initGame = () => {
  createRandomFruits()
  gameInterval = setInterval(() => {
    createRandomFruits()
  }, 2000)
  startTimer()
}

initGame()
