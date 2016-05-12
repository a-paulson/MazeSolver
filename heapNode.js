function HeapNode(key, value, childList, parent, left, right, mark, degree){
  this.key = key;
  //console.log(this.key);
  this.value = value;

  this.parent  = parent;
  this.childList = childList;

  if(degree === undefined){
    degree = 0;
  }
  this.degree = degree; //number of chilren in childList

  if(left === undefined){
    left = this;
  }

  if(right === undefined){
    right = this;
  }
  this.left = left;
  this.right = right;

  if(mark === undefined){
    mark = false;
  }
  this.mark = mark;
}


HeapNode.prototype.addChild = function (node){
  if(this.childList === undefined){
    this.childList = node;
    node.parent = this;
    node.left = node;
    node.right = node;
  } else{
    node.right = this.childList.right;
    this.childList.right.left = node;
    node.left = this.childList;
    this.childList.right = node;
    node.parent = this;
    if(node.key < this.childList.key){
      this.childList = node;
    }
  }
};

HeapNode.prototype.removeChild = function (node) {
  if(node.right === node){
    this.childList = undefined;
  }else {
    if(node === this.childList){
      this.childList = node.right;
    }
    node.left.right = node.right;
    node.right.left = node.left;
    var start = this.childList;
    var current = this.childList.right;
    while(current !== start){
      if(current.key < this.childList.key){
        this.childList = current;
      }
      current = current.right;
    }
  }
  this.degree -= 1;
};

HeapNode.prototype.siblingEnum = function () {
  var siblings =[this];
  var current = this;
  while(siblings.indexOf(current.right) === -1){
    current = current.right;
    siblings.push(current);
  }
  return siblings;
};

HeapNode.prototype.childrenEnum = function () {
  if(this.childList === undefined){
    return [];
  }
  var children =[this.childList];
  var current = this.childList;
  while(children.indexOf(current.right) === -1){
    current = current.right;
    children.push(current);
  }
  return children;
};

//Note that the child node whose parent links to it is always the node with the smallest value among its siblings.
