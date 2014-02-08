//braucht lodash


//ändern: 	Node.prototype.addChild
//			Node.prototype.addChildAfter
//			Node.prototype.addChildBefore

var Node = function(content, tree){
	this.tree = tree;
	this.content = content;
	this.children = [];
	this.parent = undefined;
	this.treeId = undefined;
};

Node.prototype.getParent = function(){
	var result;
	result = this.tree[this.parent];
	return result;
};

Node.prototype.getChildren = function(){
	var result, k, childrenLength;
	childrenLength = this.children.length;
	if (childrenLength > 0){
		result = [];
		for (k = 0; k < childrenLength; k += 1){
			result[k] = this.tree[this.children[k]];
		}
	} else {
		result = [];
	}
	return result;
};

Node.prototype.getLevel = function(){
	var result, that;
	result = 0;
	that = this;
	while (that.parent !== undefined){
		that = that.getParent();
		result += 1;
	}
	return result;
};


Node.prototype.addChild = function(child){
	/*
	vorausgesetzt wird, dass child noch nicht im tree ist !!!!!!
	 */
	var childID, clength, i, children;
	children = child.getChildren();
	clength = children.length;
	childID = this.tree.counter.id();
	child.parent = this.treeId;
	child.treeId = childID;
	child.tree = this.tree;
	this.children.push(childID);
	this.tree[childID] = child;
	for (i = 0; i < clength; i += 1){
		child.addChild(children[i]);
	}
	return child;
};

Node.prototype.addChildAfter = function(child, afterThat){
	/*
	vorausgesetzt wird, dass child noch nicht im tree ist !!!!!!
	 */
	var childID, index, clength, i, children;
	children = child.getChildren();
	clength = children.length;
	childID = this.tree.counter.id();
	child.parent = this.treeId;
	child.treeId = childID;
	child.tree = this.tree;
	index = this.children.indexOf(afterThat.treeId);
	this.children.splice(index + 1, 0, childID);
	this.tree[childID] = child;
	for (i = 0; i < clength; i += 1){
		child.addChild(children[i]);
	}
	return child;
};

Node.prototype.addChildBefore = function(child, beforeThat){
	/*
	vorausgesetzt wird, dass child noch nicht im tree ist !!!!!!
	 */
	var childID, index, clength, i, children;
	children = child.getChildren();
	clength = children.length;
	childID = this.tree.counter.id();
	child.parent = this.treeId;
	child.treeId = childID;
	child.tree = this.tree;
	index = this.children.indexOf(beforeThat.treeId);
	this.children.splice(index, 0, childID);
	this.tree[childID] = child;
	for (i = 0; i < clength; i += 1){
		child.addChild(children[i]);
	}
	return child;
};

Node.prototype.removeChild = function(child){
	var index, i, children, childrenLength;
	children = child.getChildren();
	childrenLength = children.length;
	for (i = 0; i < childrenLength; i += 1){
		child.removeChild(children[i]);
	}
	index = this.children.indexOf(child.treeId);
	this.children.splice(index,1);
	delete this.tree[child.treeId];
	return this;
};

Node.prototype.move = function(newParent){
	//vorausgesetzt wird, dass this nur im Baum verschoben wird, also nicht in einen neuen Baum geschoben wird
	this.getParent().children.splice(this.getParent().children.indexOf(this.treeId), 1);
	this.parent = newParent.treeId;
	newParent.children.push(this.treeId);
	return this;
};

Node.prototype.moveAfter = function(afterThat){
	//vorausgesetzt wird, dass this nur im Baum verschoben wird, also nicht in einen neuen Baum geschoben wird
	var newParent;
	this.getParent().children.splice(this.getParent().children.indexOf(this.treeId), 1);
	newParent = afterThat.getParent();
	index = newParent.children.indexOf(afterThat.treeId);
	afterThat.children.splice(index + 1, 0, this.treeId);
	return that;
};

Node.prototype.moveBefore = function(beforeThat){
	//vorausgesetzt wird, dass this nur im Baum verschoben wird, also nicht in einen neuen Baum geschoben wird
	var newParent;
	this.getParent().children.splice(this.getParent().children.indexOf(this.treeId), 1);
	newParent = afterThat.getParent();
	index = newParent.children.indexOf(afterThat.treeId);
	index = newParent.children.indexOf(beforeThat.treeId);
	newParent.children.splice(index, 0, this.treeId);
	return that;
};

Node.prototype.remove = function(){
	var parent;
	parent = this.getParent();
	parent.removeChild(this);
	return this;
};

Node.prototype.walkDown = function(func, withThis){
	var children, clength, i;
	if (withThis){
		func(this);
	}
	children = this.getChildren();
	clength = children.length;
	for (i = 0; i < clength; i += 1){
		func(children[i]);
		children[i].walkDown(func, false);
	}
};

Node.prototype.walkUp = function(func, withThis){
	//Beginne bei den Blättern, die an this hängen
	//schwierig das umzusetzen ...
	//arbeite dich hoch bis this
};

Node.prototype.addMiddler = function(child){
	//mache this zum parent von child und child zum einzigen child von this
	//setze die ursprüngliche children von this als children von child und setze deren parent auf child
};

Node.prototype.replace = function(newNode, withChildren){
	
};

Node.prototype.serialize = function(){
	var result;
	result = {};
	result.treeId = this.treeId;
	result.content = this.content;
	result.parent = this.parent;
	result.children = this.children;
	return result;
};

Node.deserialize = function(pickle, tree){//ACHTUNG: Zur Deserialisierung von node, schreibt man also:
	//node = Node.deserialize(nodePickle, nodeTree)
	var result;
	result = new Node(pickle.content, tree);
	result.treeId = pickle.treeId;
	result.children = pickle.children;
	result.parent = pickle.parent;
	return result;
};

Node.prototype.isLeaf = function(){
	return (this.children.length === 0);
};

Node.prototype.isRoot = function(){
	return this.parent === undefined;
};

Node.prototype.clone = function(withChildren){
	
};

var Counter = function(){
	this.counter = -1;
	this.rootCount = 0;
};

/*
Counter.prototype.id = function(){
	this.counter += 1;
	return this.counter;
};
*/
Counter.prototype.id = function(){
	var now, rand;
	now = Date.now();
	rand = Math.random()
	this.counter = "" + now + "" + rand;
	return this.counter;
};

var Tree = function(counter, root){
	var rootId;
	if (counter === undefined){
		this.counter = new Counter();
	} else {
		this.counter = counter;
	}
	rootId = this.counter.id();
	this.counter.rootCount = rootId;

	if (root === undefined){
		this[rootId] = new Node({text: "this is the root node"}, this);
	} else {
		this[rootId] = root;
	}
	this[rootId].treeId = rootId;
};

Tree.prototype.getRoot = function(){
	var result;
	result = this[this.counter.rootCount];
	return result;
};

Tree.prototype.getNodesOfLevel = function(level){
	return _.filter(this, function(x){return (x.children !== undefined && x.getLevel() === level);});
};

Tree.prototype.serialize = function(JSONString){
	var root, result, serialize;
	root = this.getRoot();
	result = {};
	result.root = root.serialize();
	result.counterState = this.counter.counter;
	serialize = function(x){
		result[x.treeId] = x.serialize();
	};
	root.walkDown(serialize, true);
	if (JSONString){
		result = JSON.stringify(result);
	}
	return result;
};

Tree.prototype.walkDown = function(func){
	this.getRoot().walkDown(func, true);
};

Tree.deserialize = function(seed, counter){ //ACHTUNG: Zur Deserialisierung von tree, schreibt man also:
	//tree = Tree.deserialize(treeSeed, treeCounter)
	var result, k;
	if (typeof seed === typeof "string"){
		seed = JSON.parse(seed);
	}
	result = new Tree(counter, Node.deserialize(seed.root, result));
	counter.rootCount = seed.root.treeId;
	delete result[seed.counterState];
	delete seed.counterState;
	delete seed.root;
	for (k in seed){
		result[k] = Node.deserialize(seed[k], result);
	}
	return result;
};

//TEST
/*
var tree1 = new Tree();
var tree2 = new Tree();

var node1 = new Node({text: "Good Day"});
tree1.getRoot().addChild(node1);
var node2 = new Node({text: "Bad Day"});
var node3 = new Node({text: "Better Day"});
var node4 = new Node({text: "Fourth Day"});
var node5 = new Node({text: "Fifth Day"});

node1.addChild(node2);

node2.addChild(node3);
node2.addChild(node4);
node4.addChild(node5);

node2 = node2.move(tree2.getRoot());
node1.move(node2);

node2.move(tree1.getRoot());

console.log(tree1);
console.log(tree2);

tree1.walkDown(function(x){console.log(x.content.text);});
var pickleTree = tree1.serialize(true);
console.log(pickleTree);
var tree1Resurrected = Tree.deserialize(pickleTree, new Counter());
console.log(tree1Resurrected.getRoot().isRoot());
console.log(tree1Resurrected);
//Stimmt's jetzt?
*/
