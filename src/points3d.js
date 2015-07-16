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
