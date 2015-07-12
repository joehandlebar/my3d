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

	transpose: function() {
		this.t = true;
		return this;
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
