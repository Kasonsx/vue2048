//向左旋转
var rotateLeft = function (matrix) {
    var rows = matrix.length;
    var columns = matrix[0].length;
    var res = [];
    for (var row = 0; row < rows; ++row) {
        res.push([]);
        for (var column = 0; column < columns; ++column) {
            res[row][column] = matrix[column][columns - row - 1];
        }
    }
    return res;
};

//子片
var Tile = function (value, row, column) {
    this.value = value || 0;
    this.row = row || -1;
    this.column = column || -1;
    this.oldRow = -1;
    this.oldColumn = -1;
    this.markForDeletion = false;
    this.mergedInto = null;//合并
    this.id = Tile.id++;
}

Tile.id = 0;
//向(row,column)移动
Tile.prototype.moveTo = function (row, column) {
    this.oldRow = this.row;
    this.oldColumn = this.column;
    this.row = row;
    this.column = column;
}
//判断是否为新
Tile.prototype.isNew = function () {
    return this.oldRow == -1 && !this.mergedInto;
}
// Row合并
Tile.prototype.fromRow = function () {
    return this.mergedInto ? this.row : this.oldRow;
}
// Column合并
Tile.prototype.fromColumn = function () {
    return this.mergedInto ? this.column : this.oldColumn;
}
//
Tile.prototype.toRow = function () {
    return this.mergedInto ? this.mergedInto.row : this.row;
}
//
Tile.prototype.toColumn = function () {
    return this.mergedInto ? this.mergedInto.column : this.column;
}

//
Tile.prototype.hasMoved = function () {
    return (this.fromRow() != -1 &&
        (this.fromRow() != this.toRow() || this.fromColumn() != this.toColumn()))
        || this.mergedInto;
}

var Cell = function (subRow, subColumn) {
    this.subRow = subRow;
    this.subColumn = subColumn;
}

//面板
var Board = function () {
    this.tiles = []
    this.cells = []
    for (var i = 0; i < Board.size; ++i) {
        this.cells[i] = [this.addTile(), this.addTile(), this.addTile(), this.addTile()];
    }
    this.addRandomTile();
    this.setPositions();
    this.won = false;
    this.score = 0;
}
//向面板添加子片,并返回
Board.prototype.addTile = function () {
    var res = new Tile;
    Tile.apply(res, arguments);
    this.tiles.push(res);
    return res;
}
//4x4面板
Board.size = 4;

//移动合并
Board.prototype.moveLeft = function () {
    var hasChanged = false;
    for (var row = 0; row < Board.size; ++row) {
        var currentRow = this.cells[row].filter(tile => tile.value != 0);
        var resultRow = [];
        for (var target = 0; target < Board.size; ++target) {
            var targetTile = currentRow.length ? currentRow.shift() : this.addTile();
            if (currentRow.length > 0 && currentRow[0].value == targetTile.value) {
                var tile1 = targetTile;
                targetTile = this.addTile(targetTile.value);
                tile1.mergedInto = targetTile;
                var tile2 = currentRow.shift();
                tile2.mergedInto = targetTile;
                targetTile.value += tile2.value;
            }
            resultRow[target] = targetTile;
            this.won |= (targetTile.value == 2048);
            hasChanged |= (target.value != this.cells[row][target].value);

        }
        this.cells[row] = resultRow;
    }
    return hasChanged;
}

Board.prototype.setPositions = function () {
    this.cells.forEach((row, rowIndex) => {
        row.forEach((tile, columnIndex) => {
            tile.oldRow = tile.row;
            tile.oldColumn = tile.column;
            tile.row = rowIndex;
            tile.column = columnIndex;
            tile.markForDeletion = false;
        });
    });
};

//出现4的概率为0.1
Board.fourProbability = 0.1;
//将2或4随机加入到空格上
Board.prototype.addRandomTile = function () {
    let emptyCells = [];
    for (let r = 0; r < Board.size; ++r) {
        for (let c = 0; c < Board.size; ++c) {
            if (this.cells[r][c].value == 0) {
                //let subCell = { subRow: r, subColumn: c }
                emptyCells.push(new Cell(r, c));
            }
        }
    }
    let index = ~~(Math.random() * emptyCells.length);//~~取整
    let cell = emptyCells[index];
    if (cell) {
        let newValue = Math.random() < Board.fourProbability ? 4 : 2;
        this.cells[cell.subRow][cell.subColumn] = this.addTile(newValue);
        this.score += newValue;
    }

};
//标记删除
Board.prototype.clearOldTiles = function () {
    this.tiles = this.tiles.filter(tile => tile.markForDeletion == false);
    this.tiles.forEach(tile => {
        tile.markForDeletion = true;
    });
}
//方向键上下左右移动
Board.prototype.move = function (direction) {
    // 0 -> left, 1 -> up, 2 -> right, 3 -> down
    this.clearOldTiles();
    for (var i = 0; i < direction; ++i) {
        this.cells = rotateLeft(this.cells);
    }
    var hasChanged = this.moveLeft();
    for (var j = direction; j < 4; ++j) {
        this.cells = rotateLeft(this.cells);
    }
    if (hasChanged) {
        this.addRandomTile();
    }
    this.setPositions();
    return this;
}
//是否胜利
Board.prototype.hasWon = function () {
    return this.won;
}

Board.deltaX = [-1, 0, 1, 0];
Board.deltaY = [0, -1, 0, 1];

Board.prototype.hasLost = function () {
    var canMove = false;
    for (var row = 0; row < Board.size; ++row) {
        for (var column = 0; column < Board.size; ++column) {
            canMove |= (this.cells[row][column].value == 0);
            for (var dir = 0; dir < 4; ++dir) {
                var newRow = row + Board.deltaX[dir];
                var newColumn = column + Board.deltaY[dir];
                if (newRow < 0 || newRow >= Board.size || newColumn < 0 || newColumn >= Board.size) {
                    continue;
                }
                canMove |= (this.cells[row][column].value == this.cells[newRow][newColumn].value);
            }
        }
    }
    return !canMove;
};

export { Board }