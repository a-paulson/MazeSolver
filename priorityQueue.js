function PriorityQueue(){
  this.heap = new FibMinHeap();
}

PriorityQueue.prototype.insert = function (el, priority) {
  //console.log("PQ insert start");
  this.heap.insert(new HeapNode(priority, el));
  //console.log("PQ insert end");
};

PriorityQueue.prototype.pop = function () {
  //console.log("PQ pop start");
  return this.heap.extractMin();
};

PriorityQueue.prototype.peek = function () {
  return this.heap.findMin();
};

PriorityQueue.prototype.size = function () {
  return this.heap.size;
};
