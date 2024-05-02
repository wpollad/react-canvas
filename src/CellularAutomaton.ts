interface Cell {
  x: number;
  y: number;
  size: number;
  isLife: boolean;
}

export class CellularAutomaton {
  private readonly canvas: HTMLCanvasElement;

  private cells: Cell[] = [];

  private rafTime: number;

  private speed: number;

  private width: number;

  private height: number;

  private cols: number;

  private cellSize: number;

  private rows: number;

  private fixedStartPosition: number[][];

  private isFixedStartPosition: boolean;

  private surviveRules: number[];

  private birthRule: number[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.cells = [];

    this.width = 1;
    this.height = 1;
    this.cols = 1;
    this.cellSize = 1;
    this.rows = 1;

    this.isFixedStartPosition = true;
    this.rafTime = 0;
    this.speed = 0.1;

    this.surviveRules = [2, 3];
    this.birthRule = [3];

    this.fixedStartPosition = [
      [1, 1],
      [2, 2],
      [2, 3],
      [3, 1],
      [3, 2],
    ];

    this.handleResize = this.handleResize.bind(this);
    window.addEventListener("resize", this.handleResize);
    this.handleResize();

    this.animation();
  }

  public dispose() {
    window.removeEventListener("resize", this.handleResize);
  }

  private handleResize() {
    const { width, height } = this.canvas.getBoundingClientRect();
    const dpi = window.devicePixelRatio;
    this.canvas.width = width * dpi;
    this.canvas.height = height * dpi;
    this.width = width;
    this.height = height;

    this.cols = 40;
    this.cellSize = width / this.cols;
    this.rows = Math.floor(height / this.cellSize);

    this.cells = [];

    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.cells.push({
          x: x * this.cellSize,
          y: y * this.cellSize,
          size: this.cellSize,
          isLife: this.isFixedStartPosition ? false : Math.random() > 0.5,
        });
      }
    }

    if (this.isFixedStartPosition) {
      for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
          this.fixedStartPosition.forEach(([x, y]) => {
            if (i === x && j === y) {
              this.cells[x + y * this.rows].isLife = true;
            }
          });
        }
      }
    }
  }

  private getNeighbors(x: number, y: number): number {
    const left = x - 1 < 0 ? this.rows - 1 : x - 1;
    const right = x + 1 >= this.rows ? 0 : x + 1;
    const top = y - 1 < 0 ? this.cols - 1 : y - 1;
    const bottom = y + 1 >= this.cols ? 0 : y + 1;

    return (
      (this.cells[left + this.rows * top].isLife ? 1 : 0) +
      (this.cells[x + this.rows * top].isLife ? 1 : 0) +
      (this.cells[right + this.rows * top].isLife ? 1 : 0) +
      (this.cells[left + this.rows * y].isLife ? 1 : 0) +
      (this.cells[right + this.rows * y].isLife ? 1 : 0) +
      (this.cells[left + this.rows * bottom].isLife ? 1 : 0) +
      (this.cells[x + this.rows * bottom].isLife ? 1 : 0) +
      (this.cells[right + this.rows * bottom].isLife ? 1 : 0)
    );
  }

  private handleFrame() {
    const ctx = this.canvas.getContext("2d")!;
    const newCells = [] as Cell[];

    ctx.resetTransform();
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.clearRect(0, 0, this.width, this.height);

    for (let y = 0; y < this.cols; y++) {
      for (let x = 0; x < this.rows; x++) {
        const index = x + y * this.rows;
        const neighbors = this.getNeighbors(x, y);

        let isLife = false;

        if (this.cells[index].isLife) {
          if (this.surviveRules.includes(neighbors)) {
            isLife = true;
          }
        } else {
          if (this.birthRule.includes(neighbors)) {
            isLife = true;
          }
        }

        newCells.push({
          x: this.cells[index].x,
          y: this.cells[index].y,
          size: this.cells[index].size,
          isLife,
        });

        ctx.beginPath();
        ctx.rect(
          this.cells[index].x,
          this.cells[index].y,
          this.cells[index].size,
          this.cells[index].size
        );
        if (this.cells[index].isLife) {
          ctx.fillStyle = "#000";
          ctx.strokeStyle = "#fff";
        } else {
          ctx.fillStyle = "#fff";
          ctx.strokeStyle = "#000";
        }
        ctx.fill();
        ctx.stroke();
      }
    }

    this.cells = newCells;
  }

  private animation() {
    requestAnimationFrame(() => {
      this.rafTime += this.speed;
      if (this.rafTime >= 2) {
        this.rafTime = 0;
        this.handleFrame();
      }
      this.animation();
    });
  }
}
