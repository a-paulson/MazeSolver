function Maze(width, height){
  this.height = height;
  this.width = width;
  this.arr = this.initializeArr();
}

Maze.prototype.initializeArr = function () {
  var maze = [];
  for (var i = 0; i < this.width; i++) {
    maze[i] = [];
    for (var j = 0; j < this.height; j++) {
      maze[i][j] = "W";
    }
  }
  return maze;
};

Maze.prototype.display = function(ctx, canvas) {
  this.size = Math.min(canvas.height / this.arr.length, canvas.width / this.arr[0].length);
  for (var i = 0; i < this.arr.length; i++) {
    for (var j = 0; j < this.arr[i].length; j++) {
      if(this.arr[i][j] === "W"){
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
      } else if(this.arr[i][j] === "P"){
        ctx.fillStyle = "red";
        ctx.strokeStyle = "red";
      } else if(this.arr[i][j] === "S"){
        ctx.fillStyle = "green";
        ctx.strokeStyle = "green";
      } else if(this.arr[i][j] === "F"){
        ctx.fillStyle = "blue";
        ctx.strokeStyle = "blue";
      } else {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
      }
      ctx.fillRect(i * this.size, j * this.size, this.size, this.size);
      ctx.strokeRect(i * this.size, j * this.size, this.size, this.size);
    }
  }
};


Maze.prototype.getVal = function(coor){
  return this.arr[coor.row][coor.col];
};

 Maze.prototype.setVal = function(coor, val){
  this.arr[coor.row][coor.col] = val;
};
