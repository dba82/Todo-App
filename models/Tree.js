var Tree = function(){
	
};

Tree.prototype.getSeed = function(){
	var result;
	result = {};
	result.prototype = new ProtoNode();
	result.tree = this;
	return result;
};