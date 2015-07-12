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

