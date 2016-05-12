function Coor(row, col){
  this.row = row;
  this.col = col;
}

var _coordinates = {};

function CreateCoor(row, col){
  var coor = _coordinates[JSON.stringify([row,col])];
  if(coor){
    return coor;
  }
  else {
    var newCoor = new Coor(row, col);
    _coordinates[JSON.stringify([row, col])] = newCoor;
    return newCoor;
  }
}

Coor.prototype.add = function (coor2) {
    return CreateCoor(this.row + coor2.row, this.col + coor2.col);
};

Coor.prototype.eq = function(coor2){
  if(this.row === coor2.row && this.col === coor2.col){
    return true;
  } else{
    return false;
  }
};

Coor.prototype.toString = function () {
  return JSON.stringify([this.row, this.col]);
};

Coor.prototype.getValidNeighbors = function (height, width) {
    var deltas = [CreateCoor(-1,0), CreateCoor(1,0), CreateCoor(0,-1), CreateCoor(0,1)];
    var self = this;
    var possibleNeighbors =  deltas.map(function(delta){
      return delta.add(self);
    });
    return possibleNeighbors.filter(function(neighbor){
      return (neighbor.row > 0 && neighbor.col > 0 &&
        neighbor.row < height - 1 && neighbor.col < width - 1);
    });
};
