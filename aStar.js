function AStar(start, goal){

  var frontier = new PriorityQueue();
  frontier.insert(start, 0);

  var cameFrom = {};
  var costSoFar = {};

  cameFrom[start.toString()] = undefined;
  costSoFar[start.toString()] = 0;

  while(frontier.size()){
    var current = frontier.pop().value;

    if(current.eq(goal)){
      break;
    }

    current.neighbors.forEach(function(neighbor){
      var newCost = costSoFar[current.toString()] + 1;

      if(costSoFar[neighbor.toString()] === undefined || newCost < costSoFar[neighbor.toString()]){
        costSoFar[neighbor.toString()] = newCost;
        frontier.insert(neighbor, newCost + manhattanDist(neighbor.coor, goal.coor));
        cameFrom[neighbor.toString()] = current;
      }
    });
  }
  
  return [cameFrom, costSoFar];
}


function manhattanDist(a, b){
  return (Math.abs(a.row - b.row) + Math.abs(a.col - b.col));
}


function colorPath(maze, path, goal, ctx, canvas){
  var cameFrom = path[0];
  maze.setVal(goal.coor, "P");
  ctx.clearRect(0,0, canvas.width, canvas.height);
  maze.display(ctx, canvas);
  var current = cameFrom[goal.toString()];
  if(current){
    setTimeout(colorPath, 50, maze, path, current, ctx, canvas);
  }
}
