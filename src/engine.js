function _extend(obj, props) {
	for (var prop in props) {
		obj[prop] = props[prop];
	}
}

/**
 * 3d engine taken from: 
 * creativebloq.com/3d/build-your-own-html5-3d-engine-7112935 
 *
 */

function Scene3D(canvas) {
	Points3D.call(this, []);
    
	this.runTransition = Transition3D.call(this);

	this.focalLength = 1000;
	this.context = canvas.getContext('2d');
	this.sceneWidth = canvas.width;
	this.sceneHeight = canvas.height;
	this.points3D = this.data;
	this.points2D = [];
	this.numPoints = 0;

	this.items = [];
}

//delegate matrix methods
Scene3D.prototype = Object.create(Points3D.prototype);

_extend(Scene3D.prototype, {
	setupPoint: function(x, y, z) {
		var returnVal = this.numPoints;

		this.points2D[this.points2D.length] = 0;
		this.points2D[this.points2D.length] = 0;
		
		this.points3D[this.points3D.length] = x;
		this.points3D[this.points3D.length] = y;
		this.points3D[this.points3D.length] = z;
		//for affine transformations
		this.points3D[this.points3D.length] = 1;

		this.numPoints++;

		return returnVal;
	},

	addItem: function(item) {
		this.items[this.items.length] = item;
		item.addToScene(this);
	},

	setColorF: function(f) {
		this.colorF = f.bind(this);			   
	},

	setColor: function(c) {
		var i = 0;		  

		for (i = 0; i < this.items.length; i++) {
			this.items[i].colour = c;
		}
	},

	transition: function(props, keys, duration) {
		this.runTransition(props, keys, duration);
	},

	render: function() {
		var halfWidth = this.sceneWidth * 0.5,
			halfHeight = this.sceneHeight * 0.5,
			i, i3, i2, x, y, z, scale;

		for (i = 0; i < this.numPoints; i++) {
			i3 = i*4;
			i2 = i*2;
			x = this.points3D[i3];
			y = this.points3D[i3+1];
			z = this.points3D[i3+2];
			scale = this.focalLength/(z + this.focalLength);

			this.points2D[i2] = x*scale + halfWidth;
			this.points2D[i2+1] = y*scale + halfHeight;
		}

		this.context.save();
		//this.ctx.fillStyle = "rgb(0, 0, 0);";
	
		//this.context.clearRect(0, 0, canvas.width, canvas.height);

		for (i = 0; i < this.items.length; i++) {
			this.items[i].render(this.context);
		}

		this.context.restore();


		return this;
	}
});

function Point3D(x, y, z) {
	this._x = x ? x : 0;
	this._y = y ? y : 0;
	this._z = z ? z : 0;
	this.myScene = null;
	this.xIdx;
	this.yIdx;
	this.zIdx;
	this.xIdx2D;
	this.yIdx2D;
}

Point3D.prototype = {
	
	setupWithScene: function(scene) {
		this.myScene = scene;

		var idx = scene.setupPoint(this._x, this._y, this._z),
			i3 = idx*4,
			i2 = idx*2;

		this.xIdx = i3;
		this.yIdx = i3 + 1;
		this.zIdx = i3 + 2;

		this.xIdx2D = i2;
		this.yIdx2D = i2 + 1;
	}
}

Object.defineProperties(Point3D.prototype, {
	sceneIdx: {
	  get: function() {
	  	   return this.myScene;
	  }
	},

	x: {
	   get: function() {
	    	return this._x;
	   },

	   set: function(val) {
		  if (this.myScene) {
			this.myScene.points3D[this.xIdx] = val;
		  }			  

		  this._x = val;
	   }
	},	

	y: {
	   get: function() {
	    	return this._y;
	   },

	   set: function(val) {
		  if (this.myScene) {
			this.myScene.points3D[this.yIdx] = val;
		  }			  

		  this._y = val;
	   }
	},	

	z: {
	   get: function() {
	    	return this._z;
	   },

	   set: function(val) {
		  if (this.myScene) {
			this.myScene.points3D[this.zIdx] = val;
		  }			  

		  this._z = val;
	   }
	},	

	x2D: {
		get: function() {
			return this.myScene.points2D[this.xIdx2D];			  
	    }			 
	}, 

	y2D: {
		get: function() {
			return this.myScene.points2D[this.yIdx2D];			  
	    }			 
	} 
});

function Line3D() {
	this.colour = "#aaa";
	this.points = [];
	this.startPoint = new Point3D();
	this.endPoint = new Point3D();
}

Line3D.prototype = {
	addToScene: function(scene) {
		var i;
		
		for (i = 0; i < this.points.length; i++) {
			this.points[i].setupWithScene(scene);
		}					
	},

	addPoint: function(point) {
		this.points[this.points.length] = point;						  
	},

	render: function(ctx) {				
		ctx.beginPath();
		ctx.strokeStyle = this.colour;

		var i;

		for (i = 0; i < this.points.length; i++) {
			ctx.lineTo(this.points[i].x2D,
					   this.points[i].y2D);
		}

		ctx.stroke();
	}
}
