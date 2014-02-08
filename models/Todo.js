Todo = function(tree){
	this.prototype = new Node({}, tree);

	this.content.done = {	value: false, 
							time: undefined};
	this.content.task = {description: ""};
	this.content.duration = {	estimated: undefined, 
								actual: undefined};
	this.content.type = undefined;
};


Todo.prototype.toggleDone = function(){
	this.content.done.value = !this.content.done.value;
	if (this.content.done.value){
		this.content.done.time = new Date();
	} else {
		this.content.done.time = undefined;
	}
};

fields = {
	name: {
		displayName: {
			de: "Name"
		},
		type: "text",
		required: false
	},
	
}
Todo.prototype.schemas ={
	call: {
		displayName: {
			de: "Anruf"
		},
		fields:{
			number: {
				displayName: {
					de: "Nummer"
				},
				type: "telephone",
				required: true
			},
			name: {
				displayName: {
					de: "Name"
				},
				type: "text",
				required: false
			}
		}
	},
	email: {
		displayName: {
			de: "Email"
		},
		fields:{
			address: {	
				displayName: {
					de: "Mail-Adresse"
				},
				type: "email",
				required: true
			},
			name: {
				displayName: {
					de: "Name"
				},
				type: "text",
				required: false
			}			
		}
	}

};

Todo.prototype.getSchema = function(){
	return this.schemas[this.type];
};