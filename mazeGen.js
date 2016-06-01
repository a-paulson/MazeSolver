function genMaze(width, height){
  var canvas = document.getElementById("maze");
  var ctx = canvas.getContext('2d');
  var maze, walls, seenWalls;
  [maze, walls, seenWalls] = mazeSetup(width, height);
  maze.display(ctx, canvas);
  setTimeout(PrimMazeGen, 1, maze, walls, seenWalls, ctx, canvas);
  // PrimMazeGen(maze, walls, ctx, canvas);
}


function PrimMazeGen(maze, walls, seenWalls, ctx, canvas){
  if(walls.length){
    var currentWall = randomWall(walls);

    var border = testBorder(maze, currentWall.getValidNeighbors(maze.height, maze.width));
    if(border){
      maze.setVal(currentWall, "E");
      for (var i = 0; i < border.length; i++) {
        if(seenWalls.indexOf(border[i]) === -1){
          walls.push(border[i]);
          seenWalls.push(border[i]);
        }
      }
    }
    ctx.clearRect(0,0, canvas.width, canvas.height)
    maze.display(ctx, canvas);
    // PrimMazeGen(maze, walls, ctx, canvas);
    setTimeout(PrimMazeGen, 1, maze, walls, seenWalls, ctx, canvas);
  } else{
    $(canvas).bind("click",setStart.bind(this, maze, canvas, ctx))
  }
}

function canvasPosition(canvas){
  var xCanvas = canvas.offsetLeft;
  var yCanvas = canvas.offsetTop;
  return [xCanvas, yCanvas];
}

function setStart(maze, canvas, ctx, event){
  event.preventDefault()
  var x, y;
  [x, y] = canvasPosition(canvas);


  var mouseX = event.pageX - x;
  var mouseY = event.pageY - y;
  console.log([mouseX, mouseY])
  console.log([maze.size, maze.width, maze.height]);
  if(mouseX < 0 || mouseY < 0 ||
    mouseX > maze.size * maze.width || mouseY > maze.size * maze.height){
    alert("Please click inside the maze.");
  } else{
    startCoor =  CreateCoor(Math.floor(mouseX / maze.size),  Math.floor(mouseY / maze.size));
    console.log(startCoor);
    if(maze.getVal(startCoor) !== "E"){
      alert("Please choose an empty square.");
    } else{
      maze.setVal(startCoor, "S");
      ctx.clearRect(0,0, canvas.width, canvas.height)
      maze.display(ctx, canvas);
      $(canvas).off("click");
      $(canvas).bind("click", setFinish.bind(this, maze, canvas, ctx, startCoor));
    }
  }
}

function setFinish(maze, canvas, ctx, startCoor, event){
  event.preventDefault()
  var x, y;
  [x, y] = canvasPosition(canvas);


  var mouseX = event.pageX - x;
  var mouseY = event.pageY - y;
  console.log([mouseX, mouseY]);
  console.log([maze.size, maze.width, maze.height]);
  if(mouseX < 0 || mouseY < 0 ||
    mouseX > maze.size * maze.width || mouseY > maze.size * maze.height){
    alert("Please click inside the maze.");
  } else{
    endCoor = CreateCoor(Math.floor(mouseX / maze.size),  Math.floor(mouseY / maze.size));
    console.log(endCoor);
    if(maze.getVal(endCoor) !== "E"){
      alert("Please choose an empty square.");
    } else{
      console.log("past check");
      $(canvas).off("click");
      maze.setVal(endCoor, "F");
      ctx.clearRect(0,0, canvas.width, canvas.height)
      maze.display(ctx, canvas);
      var end = new Node(startCoor);
      var start = mazeToGraph(maze, endCoor);
      console.log(start);
      var path = AStar(start, end);
      console.log(path);
      colorPath(maze, path, end, ctx, canvas);
    }
  }
}

function mazeSetup(width, height){
    var maze = new Maze(width, height);
    maze.arr[1][1] = "E";

    var walls = [CreateCoor(1,2), CreateCoor(2,1)];
    var seen = [CreateCoor(1,2), CreateCoor(2,1), CreateCoor(1,1)]
    return [maze, walls, seen];
}


function randomWall(wallList){
    var wall = wallList.splice(Math.floor(Math.random()*wallList.length), 1);
    return wall[0];
}

function testBorder(maze, walls){
  var border = undefined;
  for (var i = 0; i < walls.length; i++) {
    if(maze.getVal(walls[i]) === "E"){
      if(border === undefined){
        border = i;
      } else{
        return false;
      }
    }
  }
  walls.splice(border, 1);
  return walls;
}
