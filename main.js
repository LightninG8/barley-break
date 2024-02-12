// Строим модель.
const fifteen = {
  // Направления движения, можно совместить с кодами клавиш. Но это модель, она ничего не должна знать о внешнем мире.
  Move: { up: -4, left: -1, down: 4, right: 1 },
  // Массив чисел, отсортированный в случайном порядке, добавлям 0 последним элементов.
  order: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    .sort(function () {
      return Math.random() - 0.5;
    })
    .concat(0),
  // Расположение дырки
  hole: 15,
  // Проверка на собранность
  isCompleted: function () {
    return !this.order.some(function (item, i) {
      return item > 0 && item - 1 !== i;
    });
  },
  // Ход
  go: function (move) {
    const index = this.hole + move;
    if (!this.order[index]) return false;
    // не всякое движение вправо-влево допустимо
    if (move === this.Move.left || move === this.Move.right)
      if (Math.floor(this.hole / 4) !== Math.floor(index / 4)) return false;
    this.swap(index, this.hole);
    this.hole = index;
    return true;
  },
  // перестановка ячеек
  swap: function (i1, i2) {
    const t = this.order[i1];
    this.order[i1] = this.order[i2];
    this.order[i2] = t;
  },
  // проверка на решаемость
  solvable: function (a) {
    for (let kDisorder = 0, i = 1, len = a.length - 1; i < len; i++) {
      for (let j = i - 1; j >= 0; j--) if (a[j] > a[i]) kDisorder++;

      return !(kDisorder % 2);
    }
  },
};

// Если пазл нерешаемый, делаем его решаемым.
if (!fifteen.solvable(fifteen.order)) fifteen.swap(0, 1);

// Обрабатываем нажатия кнопок
const step = (direction) => {
  if (fifteen.go(fifteen.Move[direction])) {
    draw();
    if (fifteen.isCompleted()) {
      document.body.style.backgroundColor = "gold";
      window.removeEventListener("keydown", arguments.callee);
    }
  }
};

window.addEventListener("keydown", function (e) {
  step({ 39: "left", 37: "right", 40: "up", 38: "down" }[e.keyCode]);
});

document.addEventListener("touchstart", (e) => {
  const startX = e.touches[0].clientX;
  const startY = e.touches[0].clientY;

  const onTouchEnd = (e) => {
    console.log(e);

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    let direction = "";

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        direction = "left";
      } else {
        direction = "right";
      }
    } else {
      if (deltaY > 0) {
        direction = "up";
      } else {
        direction = "down";
      }
    }

    console.log(direction);

    step(direction);

    document.removeEventListener("touchend", onTouchEnd);
  };

  document.addEventListener("touchend", onTouchEnd);
});

document.addEventListener("mousedown", (e) => {
  const startX = e.clientX;
  const startY = e.clientY;

  const onMouseUp = (e) => {
    console.log(e);

    const endX = e.clientX;
    const endY = e.clientY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    let direction = "";

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        direction = "left";
      } else {
        direction = "right";
      }
    } else {
      if (deltaY > 0) {
        direction = "up";
      } else {
        direction = "down";
      }
    }

    console.log(direction);

    step(direction);

    document.removeEventListener("mouseup", onMouseUp);
  };

  document.addEventListener("mouseup", onMouseUp);
});

// Создаем видимые элементы
const gameElem = document.querySelector(".game");

const createCells = () => {
  fifteen.order.forEach((el, i) => {
    if (!el) return;

    const cellElem = document.createElement("div");

    cellElem.classList.add("cell");
    cellElem.classList.add(`cell-${el}`);
    cellElem.textContent = el;

    gameElem.appendChild(cellElem);
  });
};

createCells();

// Рисуем пятнашки
draw();
function draw() {
  fifteen.order.forEach((el, i) => {
    const cellElem = document.querySelector(`.cell-${el}`);

    if (!cellElem) return;

    cellElem.style.left = (i % 4) * 50 + ((i % 4) + 1) * 10 + "px";
    cellElem.style.top =
      Math.floor(i / 4) * 50 + (Math.floor(i / 4) + 1) * 10 + "px";
  });
}
