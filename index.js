const CANVAS_SIZE = 640;

let cellInfo = {
  size: 32,
  lifetime: 8,
  cellRatio: 18,
  stopper: false,
  cell: [],
  timeout: null
}

const initializeCell = function (preset) {
  cellInfo.cell = []
  for (let i = 0; i < Math.floor(640 / cellInfo.size); i++) {
    let cellRow = []
    for (let j = 0; j < Math.floor(640 / cellInfo.size); j++) {
      cellRow.push(
        preset
          ? preset[i] ? preset[i][j] ? preset[i][j] : 0 : 0
          : Math.random() > cellInfo.cellRatio / 20 ? 1 : 0)
    }
    cellInfo.cell.push(cellRow)
  }
}

const rerenderCells = function () {
  const cellSize = CANVAS_SIZE / Math.floor(CANVAS_SIZE / cellInfo.size)
  const canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#4694ff';
    ctx.strokeStyle = '#f7f7f7';
    ctx.lineWidth = cellSize / 32;
    for (let row = 0; row < cellInfo.cell.length; row++) {
      for (let column = 0; column < cellInfo.cell[row].length; column++) {
        if (cellInfo.cell[row][column] === 1) {
          ctx.fillRect(cellSize * column, cellSize * row, cellSize, cellSize);
        } else {
          ctx.strokeRect(cellSize * column, cellSize * row, cellSize, cellSize);
        }
      }
    }
  }
}

// update cell frame
const cellLifeCycle = function () {
  let cellCopy = JSON.parse(JSON.stringify(cellInfo.cell))
  for (let row = 0; row < cellCopy.length; row++) {
    for (let column = 0; column < cellCopy[row].length; column++) {
      const condition =
        // top-left
        cellInfo.cell[row === 0 ? cellInfo.cell.length - 1 : row - 1][column === 0 ? cellInfo.cell[row].length - 1 : column - 1] +
        // top
        cellInfo.cell[row === 0 ? cellInfo.cell.length - 1 : row - 1][column] +
        // top-right
        cellInfo.cell[row === 0 ? cellInfo.cell.length - 1 : row - 1][column === cellInfo.cell[row].length - 1 ? 0 : column + 1] +
        // bottom-left
        cellInfo.cell[row === cellInfo.cell.length - 1 ? 0 : row + 1][column === 0 ? cellInfo.cell[row].length - 1 : column - 1] +
        // bottom
        cellInfo.cell[row === cellInfo.cell.length - 1 ? 0 : row + 1][column] +
        // bottom-right
        cellInfo.cell[row === cellInfo.cell.length - 1 ? 0 : row + 1][column === cellInfo.cell[row].length - 1 ? 0 : column + 1] +
        // left
        cellInfo.cell[row][column === 0 ? cellInfo.cell[row].length - 1 : column - 1] +
        // right
        cellInfo.cell[row][column === cellInfo.cell[row].length - 1 ? 0 : column + 1]
      if (cellCopy[row][column] === 1) {
        cellCopy[row][column] = (condition === 2 || condition === 3) ? 1 : 0
      } else {
        cellCopy[row][column] = condition === 3 ? 1 : 0
      }
    }
  }
  cellInfo.cell = JSON.parse(JSON.stringify(cellCopy))
  rerenderCells()

  if (!cellInfo.stopper) {
    cellInfo.timeout = setTimeout(cellLifeCycle, 1200 / cellInfo.lifetime)
  }
}

const initializeCanvas = function () {
  initializeCell()
  rerenderCells()
}


const onCellSizeChange = function (event) {
  cellInfo.size = Number(event.target.value)
  initializeCanvas()
}

const onLifetimeChange = function (event) {
  cellInfo.lifetime = Number(event.target.value)
}

const onCellRatioChange = function (event) {
  cellInfo.cellRatio = 20 - Number(event.target.value)
  initializeCanvas()
}

const cellSizeInput = document.getElementById('cellSizeInput')
cellSizeInput.addEventListener('change', onCellSizeChange)

const lifetimeInput = document.getElementById('lifetime')
lifetimeInput.addEventListener('change', onLifetimeChange)

const liveCellRatio = document.getElementById('ratio')
liveCellRatio.addEventListener('change', onCellRatioChange)

const startLifeGame = () => {
  cellInfo.stopper = false
  cellLifeCycle()
}

const stopLifeGame = () => {
  cellInfo.stopper = true
  cellInfo.timeout = null
}

const nextFrame = () => {
  cellInfo.stopper = true
  cellInfo.timeout = null
  cellLifeCycle()
}

const glider = () => {
  initializeCell([
      [ 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 1, 1, 1 ],
      [ 0, 0, 0, 1, 0, 0 ],
      [ 0, 0, 0, 0, 1, 0 ]
    ]
  )
  rerenderCells()
}

initializeCell()
rerenderCells()
