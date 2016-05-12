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
      //console.log("found end");
      break;
    }
    //console.log("current");
    //console.log(current);
    current.neighbors.forEach(function(neighbor){
      //console.log("neighbor");
      //console.log(neighbor);
      var newCost = costSoFar[current.toString()] + 1;
      //console.log(newCost);
      if(costSoFar[neighbor.toString()] === undefined || newCost < costSoFar[neighbor.toString()]){
        costSoFar[neighbor.toString()] = newCost;
        //console.log("newCost")
        //console.log(newCost)
        // //console.log((neighbor));
        // //console.log((goal));
        frontier.insert(neighbor, newCost + manhattanDist(neighbor.coor, goal.coor));
        cameFrom[neighbor.toString()] = current;
      }
    });
  }
  //console.log("done");
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

    // maze.setVal(current.coor, "P");
    // current = cameFrom[current.coor.toString()];
  }
}


// function colorTest(maze, nodes){
//   Object.keys(nodes).forEach(function(key){
//     maze.setVal(nodes[key].coor, "P");
//   });
// }
