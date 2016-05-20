#Maze Solver

[Maze Solver][live]

[live]: https://a-paulson.github.io/

Maze Solver is a JavaScript app that generates and solves mazes. Mazes are generated using a random Prim's algorithm. Then, the shortest path between two, user specified, points is found using the A* algorithm. This priority queue in A* is implemented using a hand made Fibonacci heap.

##Features

###Maze Generation: Random Prim's Algorithm

Maze Solver uses a random Prim's algorithm to procedurally generate mazes. This algorithm starts with a maze completely filled with walls except for the top left corner. The walls adjacent to the top left corner are added to a wall list. At each step of the algorithm, a random wall is chosen from the wall list. If exactly one adjacent square is empty, the wall is changed to an empty square creating a passage and all its adjacent walls are added to the wall list. Otherwise it is ignored. This continues until every square has been examined. To speed up the algorithm I assure that each square is visited once and only once using a list of seen walls.

```javascript
function PrimMazeGen(maze, walls, seenWalls){
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
  PrimMazeGen(maze, walls, seenWalls);
  }
}
```

###Pathfinding: A* Algorithm

I've used the A* algorithm to find the path between two user specified points in the maze. The A* algorithm is a graph traversal algorithm that works by checking the most promising paths first. It finds the most promising paths by minimizing the sum of the actual distance from the starting point and the estimated distance to the end point. A heuristic is chosen to estimate the distance to the end point. I've chose Manhattan Distance as my heuristic. This heuristic estimates the distance between two points by adding together the absolute value of the difference between their coordinates.

```javascript
function manhattanDist(a, b){
  return (Math.abs(a.row - b.row) + Math.abs(a.col - b.col));
}
```

Using this heuristic A* finds the most promising path and continues to follow it until it either reaches the end point or stops being the most promising path. It follows a path by finding the current square with the shortest estimated distance to the end and then adding all its neighbors to a priority queue with their estimated distance as the key.

The priority queue is a data structure that always returns the element it contains with the smallest key. Then, it asks the priority queue for the new closest square and repeats. This way you are always working from the square that is estimated to be closest to the end point.

The algorithm terminates when you reach the end point. I've recorded my path backwards in an object called `cameFrom` in order to trace it in the maze.

```javascript
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
```

###Priority Queue: Fibonacci Heap

The priority queue is a data structure that has two important methods, `insert` and `pop`. `insert` adds an element to the queue with a given key value. `pop` returns the element with the smallest key, in this case the shortest estimated distance. This data structure is most commonly implemented with a heap.

I've chosen to use a Fibonacci heap because it makes several excellent worst case guarantees. For my purposes it can find the minimum element and insert a new element in O(1) time. It can also delete the minimum element, this is needed for `pop`, in O(log(n)) time.

The Fibonacci heap maintains a pointer to the minimum element in the heap. It also maintains a doubly linked root list of trees obeying the heap property. When you want to insert a new element, you just add it to this root list. To remove the minimum element, you take it out, promote all its children to the root list and then consolidate the trees so that each remaining root node has a unique number of children. The details of the implementation are beyond the scope of this document but I encourage you to examine the code or read the section on Fibonacci Heaps in *Introduction to Algorithms* by Cormen, Leiserson, Rivest and Stein.

```javascript
FibMinHeap.prototype.insert = function (node) {
  node.degree = 0;
  node.parent = undefined;
  node.childList = undefined;
  node.mark = false;
  if (this.min === undefined){
    this.roots = node;
    this.min = node;
  } else{
    this.addToRootList(node);
    if(node.key < this.min.key){
      this.min = node;
    }
  }
  this.size += 1;
};

FibMinHeap.prototype.extractMin = function () {
  var node = this.min;
  if(node !== undefined){
    var child = node.childList;
    if(child !== undefined){
      var children = node.childrenEnum();
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        this.addToRootList(child);
        child.parent = undefined;
      }
    }

    this.removeFromRootList(node);

    if(node === node.right){
      this.min = undefined;
      this.roots = undefined;
    } else{
      this.min = node.right;
      this.consolidate();
    }

    this.size -=1;
  }
  return node;
};

FibMinHeap.prototype.consolidate = function () {
  var treeArr = [];
  var rootNodes = this.roots.siblingEnum();
  for (var i = 0; i < rootNodes.length; i++) {
    var currentRoot = rootNodes[i];
    var degree = currentRoot.degree;
    while(treeArr[degree] !== undefined){
      var sameDegree = treeArr[degree];

      if(currentRoot.key > sameDegree.key){
        sameDegree = currentRoot;
        currentRoot = treeArr[degree];
      }
      this.heapLink(sameDegree, currentRoot);

      treeArr[degree] = undefined;
      degree = degree +1;
    }
    treeArr[degree] = currentRoot;
  }
  this.min = undefined;
  for (var i = 0; i < treeArr.length; i++) {
    if(treeArr[i] !== undefined){
      if(this.min === undefined){
        var newRoot = treeArr[i];
        newRoot.right = newRoot;
        newRoot.left = newRoot;
        this.roots = newRoot;
        this.min = newRoot;
      } else{
        this.addToRootList(treeArr[i]);
        if(treeArr[i].key < this.min.key){
          this.min = treeArr[i];
        }
      }
    }
  }
};
```
