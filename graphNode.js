function Node(coor, neighbors){
  this.coor = coor;
}

Node.prototype.eq = function (node2) {
  return this.coor.eq(node2.coor);
};

Node.prototype.toString = function () {
  return this.coor.toString();
};

Node.prototype.setNeighbors = function (neighbors) {
  this.neighbors = neighbors;
};

Node.prototype.generateNeighbors = function (nodes, maze) {
  //DOUBLE CHECK THIS LINE maze.height and maze.width, throughout
  var possibleNeighbors = this.coor.getValidNeighbors(maze.height, maze.width);
  var neighbors = possibleNeighbors.filter(function(coor){
    return maze.getVal(coor) !== "W";
  });
  var neighborNodes = neighbors.map(function(coor){
    var neighborNode = nodes[coor.toString()];
    if(neighborNode){
      return neighborNode;
    } else {
      var newNode = new Node(coor);
      nodes[coor.toString()] = newNode;
      newNode.generateNeighbors(nodes, maze);
      return newNode;
    }
  });
  this.setNeighbors(neighborNodes);
};

function mazeToGraph(maze, start){
  var nodes = {};
  var startNode = new Node(start);
  nodes[start.toString()] = startNode;
  startNode.generateNeighbors(nodes, maze);
  return startNode;
}
