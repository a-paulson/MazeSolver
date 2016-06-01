function FibMinHeap(){
this.min = undefined; //pointer to min val
this.size = 0; // number of nodes in heap
}

FibMinHeap.prototype.findMin = function () {
  return this.min;
};

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

FibMinHeap.prototype.heapLink = function (maxNode, minNode) {
  this.removeFromRootList(maxNode);
  minNode.addChild(maxNode);
  minNode.degree += 1;
  maxNode.mark = false;
};

FibMinHeap.prototype.decreaseKey = function (node, key) {
  if(key > node.key){
    throw "new key is larger than old key";
  }
  node.key = key;
  var parent = node.parent;
  if(parent !== undefined && node.key < parent.key){
    this.cut(node, parent);
    this.cascadingCut(parent);
  }
  if(node.key < this.min.key){
    this.min = node;
  }
};

FibMinHeap.prototype.cut = function (node, parent) {
  parent.removeChild(node);
  this.addToRootList(node);
  node.parent = undefined;
  node.mark = false;
};

FibMinHeap.prototype.cascadingCut = function (node) {
  var parent = node.parent;
  if(parent !== undefined){
    if(node.mark === false){
      node.mark  = true;
    } else{
      this.cut(node, parent);
      this.cascadingCut(parent);
    }
  }
};

FibMinHeap.prototype.addToRootList = function (node) {
  node.right = this.roots.right;
  this.roots.right.left = node;
  node.left = this.roots;
  this.roots.right = node;
};

FibMinHeap.prototype.removeFromRootList = function (node) {
  node.left.right = node.right;
  node.right.left = node.left;
  if(this.roots === node){
    this.roots = node.right;
  }
};

function Union(heap1, heap2){
  var newHeap = new FibMinHeap();
  newHeap.min = heap1.min;
  newHeap.roots = heap1.roots;

  newHeap.roots.right = heap2.roots.right;
  heap2.roots.right.left = newHeap.roots;
  heap2.roots.right = heap1.roots.right;
  heap1.roots.right.left = heap2.roots;

  if(heap1.min === undefined || (heap2.min !== undefined && heap2.min.key < heap1.min.key)){
    newHeap.min = heap2.min;
  }

  newHeap.size = heap1.size + heap2.size;
  return newHeap;
}
