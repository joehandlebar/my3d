function round(n) {
	//var n = (Math.abs(n) < 0.0001) ? 0 : parseFloat(n.toFixed(6));
	//return n;

	return parseFloat(n.toFixed(6))
}

var Matrix3D = function(data) {
	this.data = data; 
	//number of columns
	this.n = data.length/4;
}

Matrix3D.prototype = {

	//gets the ith row, jth column of matrix
	a: function(i, j) {
		var n = this.data.length/4;

		i--;
		j--;

		return this.data[i*n + j]; 
	},

	aSet: function(i, j, val) {
		var n = this.data.length/4;

		i--;
		j--;

		this.data[i*n + j] = val; 
	},

	copy: function() {
		var copy = new Matrix3D(this.data.slice());

		return copy;
	}, 

	//[A, B]
	augment: function(B) {
		var data = this.data,  
			data2 = B.data,
			n = data.length/4,
			n2 = data2.length/4,
			C = [],
			i;

		for (i = 0 ; i < 4; i++) {
			C = C.concat(data.slice(i*n, i*n + n));
			C = C.concat(data2.slice(i*n2, i*n2 + n2));
		}	

		this.data = C;
		this.n = this.data.length/4;

		return this;
	},

	//splits matrix by specified column sizes
	//two halves by default
	//returns both
	split: function(n, n2) {
		var data = this.data,
			dataA = [],
			dataB = [],
			i;

		if (!n && !n2) {
			n = n2 = data.length/8;				
		}	
		else if (!n2) {
			n2 = data.length/4 - n;
		}

		for (i = 0 ; i < 4; i++) {
			dataA = dataA.concat(data.slice((n + n2)*i, 
											(n + n2)*i + n));
			dataB = dataB.concat(data.slice((n + n2)*i + n, 
										    (n + n2)*i + n + n2));
		}


		return { A: (dataA.length === 4) ? new Vector3D(dataA) : new Matrix3D(dataA),
				 B: (dataB.length === 4) ? new Vector3D(dataB) : new Matrix3D(dataB) };
	},

	subtract: function(b) {
		var A = this.data,
			B = b.data,
			i, leng = A.length;				  

		for (i = 0; i < leng; i++) {
			A[i] = round(A[i] - B[i]);
		}

		return this;
	},

	//maps a vector, returns mapped vector
	//SHOULD MAP MATRICES TOO bu bu
	//Ax = b
	map: function(v) {
		var b = [0, 0, 0, 0],
			A = this.data,
			x = v.data;			 

		b[0] = round(A[0]*x[0]
				   + A[1]*x[1]
				   + A[2]*x[2]
				   + A[3]*x[3]);

		b[1] = round(A[4]*x[0]
				   + A[5]*x[1]
				   + A[6]*x[2]
				   + A[7]*x[3]);

		b[2] = round(A[8]*x[0]
				   + A[9]*x[1]
				   + A[10]*x[2]
				   + A[11]*x[3]);

		b[3] = round(A[12]*x[0]
				   + A[13]*x[1]
				   + A[14]*x[2]
				   + A[15]*x[3]);

		v.data = b;

		return v;
	},

	//expects a 4 x 4 transformation matrix
	//applies transformation to 'this' matrix TA
	transform: function(t) {
		var A = this.data,
			T = t.data,
			i, leng,
			x, y, z, v;

		//transform a 4 x 4 matrix
		if (this.data.length === 16) {
			leng = 4;

			for (i = 0 ; i < leng; i++) {
				x = A[i]; y = A[i+4]; z = A[i+8]; v = A[i+12]; 

				A[i] = round(x*T[0]
						   + y*T[1]
						   + z*T[2]
						   + v*T[3]);

				A[i+4] = round(x*T[4]
							 + y*T[5] 
							 + z*T[6]
							 + v*T[7]);

				A[i+8] = round(x*T[8]
							 + y*T[9]
							 + z*T[10]
							 + v*T[11]);

				A[i+12] = round(x*T[12]
							 + y*T[13]
							 + z*T[14]
							 + v*T[15]);

			}
		}
		// transform 4 x n matrix
		else {
			//number of columns
			leng = A.length/4;	

			for (i = 1 ; i <= leng; i++) {
				x = this.a(1, i); y = this.a(2, i);
				z = this.a(3, i); v = this.a(4, i);

				this.aSet(1, i, 
						  round(x*T[0]
							  + y*T[1]
							  + z*T[2]
							  + v*T[3]));	

				this.aSet(2, i,
						  round(x*T[4]
							  + y*T[5] 
							  + z*T[6]
							  + v*T[7]));

				this.aSet(3, i,
						  round(x*T[8]
							  + y*T[9]
							  + z*T[10]
							  + v*T[11]));

				this.aSet(4, i,
						  round(x*T[12]
							  + y*T[13]
							  + z*T[14]
							  + v*T[15]));
			}
		}

		return this;
	},

	/*
	 * methods for applying transforms directly to current matrix
	 */
	scale: function(x, y, z) {
		return this.transform(My3D.scale(x, y, z));
	},

	scaleX: function(x) {
		return this.transform(My3D.scaleX(x));				
	},

	scaleY: function(y) {
		return this.transform(My3D.scaleY(y));				
	},

	scaleZ: function(z) {
		return this.transform(My3D.scaleZ(z));				
	},

	scaleRow: function(r, s) {
		return this.transform(My3D.scaleRow(r, s));
	},

	translate: function(x, y, z) {
		return this.transform(My3D.translate(x, y, z));
	},

	translateX: function(x) {
		return this.transform(My3D.translateX(x));
	},

	translateY: function(y) {
		return this.transform(My3D.translateY(y));
	},

	translateZ: function(z) {
		return this.transform(My3D.translateZ(z));
	},

	rotate: function(xdeg, ydeg, zdeg) {
		return this.transform(My3D.rotate(xdeg, ydeg, zdeg));
	},

	rotateX: function(deg) {
		return this.transform(My3D.rotateX(deg));
	},

	rotateY: function(deg) {
		return this.transform(My3D.rotateY(deg));
	},

	rotateZ: function(deg) {
		return this.transform(My3D.rotateZ(deg));
	},


	flipX: function() {
		return this.transform(My3D.flipX());
	},

	flipY: function() {
		return this.transform(My3D.flipY());
	},

	flipZ: function() {
		return this.transform(My3D.flipZ());
	},

	permute: function(r1, r2) {
		return this.transform(My3D.permute(r1, r2));		 
	},

	rowOp: function(r1, r2, s) {
		return this.transform(My3D.rowOp(r1, r2, s));		 
	},


	toString: function(s) {
		var i, 
			n = this.data.length/4,
			leng = this.data.length;

		if (s) {
			console.log(s);
		}

		for ( i = 0; i < 4; i++) {
			console.log(this.data
						.slice(i*n, i*n + n)
						.join(',   '));
		}

		return;
	}

	//shear: function(x, y) {
		//var A = [ 1, x, 0, 0, 
				  //y, 1, 0, 0,
				  //0, 0, 1, 0,
				  //0, 0, 0, 1
				 //];				

		//return this.transform(A);
	//},

	//shearX: function(x) {
		//return this.shear(x, 0);				
	//},

	//shearY: function(y) {
		//return this.shear(0, y);
	//},

//_shear: function(x, y) {
		//var A = [ 1, x, 0, 0, 
				  //y, 1, 0, 0,
				  //0, 0, 1, 0,
				  //0, 0, 0, 1
				 //];				

		//return this.transform(A);
	//},

	//shearX: function(x) {
		//return this.shear(x, 0);				
	//},

	//shearY: function(y) {
		//return this.shear(0, y);
	//},
}


var Vector3D = function(data) {
	this.data = data ? data : [1, 1, 1, 1];
	this.t = false;
}

Vector3D.prototype = {
	//returns a new vector w/ same data
	copy: function() {
		var copy = new Vector3D(this.data.slice());

		return copy;
	}, 

	//returns component of vector with largest magnitude
	max: function () {
	   var m = 0;

	   this.data.forEach(function(a) {
		   if (Math.abs(a) > Math.abs(m)) {
			   m = a;
		   }
	   });

	   return m;
	},

	add: function(x) {
		var v = this.data,
			v2 = x.data,
			sum = [];

		sum[0] = v[0] + v2[0];
		sum[1] = v[1] + v2[1];
		sum[2] = v[2] + v2[2];
		sum[3] = v[3] + v2[3];

		return new Vector3D(sum);
	},

	subtract: function(x) {
		var v = this.data,
			v2 = x.data,
			difference = [];

		difference[0] = v[0] - v2[0];
		difference[1] = v[1] - v2[1];
		difference[2] = v[2] - v2[2];
		difference[3] = v[3] - v2[3];

		return new Vector3D(difference);
	},

	//returns dot product v.v2
	dot: function(x) {
		var v = this.data,
			v2 = x.data;			 

		return round(v[0]*v2[0]
				   + v[1]*v2[1]
				   + v[2]*v2[2]
				   + v[3]*v2[3]);
	},

	// direct product 
	// returns dyadic matrix
	// vv2' = A  
	direct: function(x) {
		var d = [],
			result,
			v = this.data,
			v2 = x.data;

		d[0] = round(v[0]*v2[0]); 
		d[1] = round(v[0]*v2[1]);
		d[2] = round(v[0]*v2[2]); 
		d[3] = round(v[0]*v2[3]);	

		d[4] = round(v[1]*v2[0]);
		d[5] = round(v[1]*v2[1]); 
		d[6] = round(v[1]*v2[2]); 
		d[7] = round(v[1]*v2[3]);	

		d[8] = round(v[2]*v2[0]); 
		d[9] = round(v[2]*v2[1]); 
		d[10] = round(v[2]*v2[2]); 
		d[11] = round(v[2]*v2[3]);	
		
		d[12] = round(v[3]*v2[0]); 
		d[13] = round(v[3]*v2[1]); 
		d[14] = round(v[3]*v2[2]); 
		d[15] = round(v[3]*v2[3]);	

		result = new Matrix3D(d);
	
		return result; 
	},
	

	scale: function(n) {
		this.data =  this.data.map(function(a) {
			return round(a*n);	
		});	

		return this;
	},

	normalize: function() {
		var mag = this.magnitude(),
		    b;

		this.data =  this.data.map(function(a) {
			b = round(a/mag);
			if (Math.abs(b) < 0.001) {
				return 0;
			}
			else {
				return b;
			}
			//return round(a/mag);	
		});	

		return this;
	},

	magnitude: function() {
		var V = this.data;

		return round(Math.sqrt( V[0]*V[0]
							  + V[1]*V[1]
							  + V[2]*V[2]
							  + V[3]*V[3])); 
	},

	toString: function(s) {
		var data = this.data;

		if (s) {
			console.log(s);
		}
		
		console.log(data[0] + '\n'
					+ data[1] + '\n'
					+ data[2] + '\n'
					+ data[3]);
	}
}

//a list of points
//its own class b/c transformation is different
var Points3D = function(data) {
		this.data = data;
}

Points3D.prototype = Object.create(Matrix3D.prototype); 

Points3D.prototype.transform = function(t) {

	var A = this.data,
		T = t.copy().data,
		i, leng,
		x, y, z, v;

	//transform a bunch of vectors 
	leng = this.data.length;

	for (i = 0; i < leng; i+=4) {
		x = A[i];
		y = A[i+1];
		z = A[i+2];
		v = A[i+3];

		A[i] = round(T[0]*x
					 + T[1]*y
					 + T[2]*z
					 + T[3]*v);

		A[i+1] = round(T[4]*x
					 + T[5]*y
					 + T[6]*z
					 + T[7]*v);

		A[i+2] = round(T[8]*x
					 + T[9]*y
					 + T[10]*z
					 + T[11]*v);

	}

	return this;
}

//main library, mostly for generating 4x4 matrices 
var My3D = {
	//M: Matrix3D,
	M: function(m) {
		var M = new Matrix3D(m);

		return M;
	},

	eye: function() {
		return new Matrix3D([ 1, 0, 0, 0,
							  0, 1, 0, 0,
							  0, 0, 1, 0,
							  0, 0, 0, 1 ]);
	},

	// takes a vector as a diagonal and  returns a diagonal matrix
	diag: function(v) {
		var D = new Matrix3D([v.data[0], 0, 0, 0,
							  0, v.data[1], 0, 0,
							  0, 0, v.data[2], 0,
							  0, 0, 0, v.data[3]]);

		return D;
	},

	// combines column vectors into a single matrix
	combine: function(vs) {
		var n = vs.length,
			data = [],
			A,
			i = 0;

		while (i < n) {
			vs.forEach(function(v) {
				data.push(v.data[i])
			});
			i++;
		}

		A = new Matrix3D(data);
		return A;
	},

	scale: function(x, y, z) {
	   if (!y || !z) {
	   		x = y = z = x;
	   }

		return new Matrix3D([ x, 0, 0, 0,
							  0, y, 0, 0,
							  0, 0, z, 0,
							  0, 0, 0, z ]);
	},

	scaleX: function(x) {
		return this.scale(x, 1, 1);				
	},

	scaleY: function(y) {
		return this.scale(1, y, 1);				
	},

	scaleZ: function(z) {
		return this.scale(1, 1, z);				
	},

	scaleRow: function(r, s) {
		var A = this.eye(),
			data = A.data;

		r--;

		data[r*4 + r] = s;

		return A;
	},

	translate: function(x, y, z) {
		//var i, leng = this.data.length;

		return new Matrix3D([ 1, 0, 0, x,
						   0, 1, 0, y,
						   0, 0, 1, z,
						   0, 0, 0, 1]);
	},

	translateX: function(x) {
		return this.translate(x, 0, 0);
	},

	translateY: function(y) {
		return this.translate(0, y, 0);
	},

	translateZ: function(z) {
		return this.translate(0, 0, z);
	},

	rotate: function(xdeg, ydeg, zdeg) {
		var m = this.rotateX(xdeg)
					.rotateY(ydeg)
					.rotateZ(zdeg);

		return m;
	},

	rotateX: function(deg) {
		var rad = deg*Math.PI/180,
			cos = Math.cos(rad),
			sin = Math.sin(rad);

		return new Matrix3D([ 1, 0, 0, 0,
							0, cos, -sin, 0,
							0, sin, cos, 0,
							0, 0, 0, 1
							]);
	},

	rotateY: function(deg) {
		var rad = deg*Math.PI/180,
			cos = Math.cos(rad),
			sin = Math.sin(rad);

		return new Matrix3D([ cos, 0, -sin, 0,
							 0, 1, 0, 0,
							 sin, 0, cos, 0,
							 0, 0, 0, 1
							]);
	},

	rotateZ: function(deg) {
		var rad = deg*Math.PI/180,
			cos = Math.cos(rad),
			sin = Math.sin(rad);

		return new Matrix3D([ cos, -sin, 0, 0,
							sin, cos, 0, 0,
							0, 0, 1, 0,
							0, 0, 0, 1
						]);
	},


	flipX: function() {
		return new Matrix3D([ -1, 0, 0, 0,
							 0, 1, 0, 0,	
							 0, 0, 1, 0,
							 0, 0, 0, 1
							]);
	},

	flipY: function() {
		return new Matrix3D([ 1, 0, 0, 0,
							0, -1, 0, 0,	
							0, 0, 1, 0,
							0, 0, 0, 1
							]);
	},

	flipZ: function() {
		return new Matrix3D([ 1, 0, 0, 0,
							0, 1, 0, 0,	
							0, 0, -1, 0,
							0, 0, 0, 1
							]);
	},

	//return a matrix for exchanging two rows
	permute: function(r1, r2) {
		var A = this.eye(),
			data = A.data;

		//for array indexes
		r1--;
		r2--;

		data[r1*4] = 0
		data[r1*4 + 1] = 0
		data[r1*4 + 2] = 0
		data[r1*4 + 3] = 0
		data[r1*4 + r2] = 1

		data[r2*4] = 0
		data[r2*4 + 1] = 0
		data[r2*4 + 2] = 0
		data[r2*4 + 3] = 0
		data[r2*4 + r1] = 1

		return A;
	},

	//matrix for adding one row to another, w/ optional scalar
	rowOp: function(r1, r2, s) {
		var A = this.eye(),
			data = A.data,
			s = s ? s : 1;

		//for array indexes
		r1--;
		r2--;
	
		data[r2*4 + r1] = s;
		
		return A;
	},

	//invert a 4x4 matrix
	invert: function(S) {
		var A = S.copy(),
			B;

			A.augment(this.eye());
			A = this.rref(A);

		B = A.split().B;

		return B;
	},

	//returns row reduced echelon form of A
	rref: function(A) {
		var n;	  

		A = A.copy();

		for (n = 1; n <= 4; n++) {
			var i = n, 
				j = n, 
				k = 1, max = 1,
				b;	
		
			//*Row exchanges
			
			while (k <= 4) {
				//get row w/ highest component
				if (Math.abs(A.a(max, j)) 
					< Math.abs(A.a(k, j))) { max = k; }	

				k++;
			}

			//row swap
			if (i < max) {
				A.permute(i, max);	
			}

			//if the previous row doesn't have a pivot, swap
			if (A.a(i-1, j-1) === 0) {

				A.permute(i, i-1);	
				//we're a row up now
				i--;
			} 


			if (A.a(i, j) === 0) {
				if (n === 1) {
					return this.rref(A.split(1, A.n - 1).B);
				}
				//pass on empty column
				continue;
			} 

			//pivot value
			//for calculating operation scalar
			b = A.a(i, j);

			//*Row operations
			k = 1;

			while (k <= 4) {
				//operate only on row other than current one	
				if (k !== i &&
					//operate only on rows w/ nonzero value on ith column
					A.a(k, j) !== 0) {
						A.rowOp(i, k, -A.a(k, j)/b)
					} 

				k++;
			} 

			 //*Scale the row
			A.scaleRow(i, 1/b);
		}

		return A;
	}
}

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

function Shape3D(data) {
	Line3D.call(this);

	var i, n, i3;

	n = data.length/4;

	for (i = 0; i < n; i++) {
		i3 = i*4;

		this.addPoint(new Point3D(data[i3],
									data[i3+1],
									data[i3+2]));
	}

} 

Shape3D.prototype = Object.create(Line3D.prototype);

Shape3D.prototype.render = function(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = this.colour;

		var i;

		for (i = 0; i < this.points.length; i++) {
			ctx.lineTo(this.points[i].x2D,
					   this.points[i].y2D);
		}

		//the only difference from Line3D
		ctx.closePath();

		ctx.stroke();
}



function Square3D(x, y, z, l) {
	var coords = [ -0.5, -0.5, 0, 1,
					0.5, -0.5, 0, 1,
					0.5, 0.5, 0, 1,
					-0.5, 0.5, 0, 1], 
		m;


	m = new Points3D(coords);
	m.scale(l).translate(x, y, z);

	Shape3D.call(this, m.data);
}

Square3D.prototype = Object.create(Shape3D.prototype);

function Triangle3D(x, y, z, l) {
	var coords = [ 0, -Math.sqrt(0.75) * 2/3, 0, 1,
				   0.5, Math.sqrt(0.75) * 1/3, 0, 1,
				   -0.5, Math.sqrt(0.75) * 1/3, 0, 1],
		
		m;

	m = new Points3D(coords);

	m
	 .scale(l)
	 .translate(x, y, z);

	Shape3D.call(this, m.data);
}

Triangle3D.prototype = Object.create(Shape3D.prototype);

//number of sides, x, y, x, length
function Polygon3D(n, x, y, z, l) {
	var coords = [],
		angle = 360/n,
		// triangle side length of triangulated polygon
		h = Math.sqrt(1/(2*(1 - Math.cos(angle * Math.PI/180)) )),
		v = new Vector3D([0, -h, 0, 1]),
		A = My3D.rotateZ(angle),
		m,
		i = 1;

	coords = coords.concat(v.data);
	
	while (i < n) {
		v = A.map(v);
		coords = coords.concat(v.data);
		i++
	} 

	m = new Points3D(coords);

	//one last rotation for shapes w/ even # of sides by angle/2
	if (n % 2 === 0) {
		m.rotateZ(angle/2);	
	}

	m
	 .scale(l)
	 .translate(x, y, z);

	Shape3D.call(this, m.data);
}

Polygon3D.prototype = Object.create(Shape3D.prototype);

