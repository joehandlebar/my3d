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
