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

