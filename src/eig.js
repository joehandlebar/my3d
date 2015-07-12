//these are tricky...
//they'll be integrated into matrix3d or my3d eventually

//returns an obj w/ the dominant eigenvalue and eigenvector 
function powerIter(A) {
	var x = new Vector3D([1/2, 1/2, 1/2, 1/2]), 
		eig = undefined,
		y, c = undefined;

	//test
	i = 0
	
	//while ( !(Math.abs(1 - round(eig/c)) < 0.00001) )  {
	while ( round(eig/c) !== 1.000000 )  {
		eig = c;
		y = A.map(x);
		c = y.max();

		y.scale(1/c);

		//test
		i++;

	 	if (i === 800) {
			console.log(y
						.normalize()
						.toString("eigV from power It: "));
			return {
				eig: c,
				v: y
			}
			//return c;
		}
	}


	//latest eigenvalue convergence
	eig = c;
	//normalize eigenvector
	y.normalize();

	console.log(y.toString("eigV from power It: "));

	return { eig: eig,
			 v: y};
			
	//return eig;
}

// B = A - eig*v*v'
function deflate(A, eig, v) {
	var v = v.copy(), 
		vT = v.copy().transpose(),
		//B = A.copy().subtract( v.scale(eig).direct(vT) );
		B = A.copy().subtract( v.scale(eig).direct(vT) );


	return B;
}

//raise matrix to a power
Matrix3D.prototype.pow = function(n) {
		var S, V, Sinv;

		//memoize decomposition
		 if (!this.SVS) {
		 	this.SVS = My3D.diagonalize(this);	
		 }

		 S = this.SVS.S.copy();
		 //don't copy V yet b/c the raised one has to be saved
		 V = this.SVS.V;
		 Sinv = this.SVS.Sinv.copy();

		 //raise diagonal matrix
		 V.aSet(1, 1, 
				round(Math.pow(V.a(1,1), n)));
		

		 V.aSet(2, 2, 
				round(Math.pow(V.a(2,2), n)));

		 V.aSet(3, 3, 
				round(Math.pow(V.a(3,3), n)));


		 V.aSet(4, 4, 
				round(Math.pow(V.a(4,4), n)));


		 this.data = Sinv.transform(V.copy()).transform(S).data; 

		 return this;
	}

// A -> SVS'
My3D.diagonalize = function(A) {

		var eigs = new Vector3D(),
			//eigenvectors
			vs = new Array(4),
			B = A.copy(),
			Ainv = this.invert(A.copy()),
			Binv = Ainv.copy(),
			e, aug,
			i = 0,
			
			S, V, Sinv;
	
		//try this row reduction thing...

		//while ( i < 2 ) {
		while ( i < 3 ) {
			//e = powerIter(B);	
			//eigs.data[i] = e;

			//console.log("here's the eig:" + e);

			//console.log(A.copy()
						   //.subtract(this.eye().scale(e))
						   //.toString("A - eig*I:"));

			////find x for: (A - eig*I)x = 0
			//aug = this
					//.rref(A.copy()
					////.rref(B.copy()
						   //.subtract(this.eye().scale(e))
						   //.augment(new Vector3D([1, 1, 1, 0])))
						   ////.augment(new Vector3D([1, 1, 1, 0])))

			//aug =  aug.split(aug.n - 1, 1)
					//.B
					//.normalize();

			//console.log(aug.toString("here's the eigV"));
				
			//vs[i] = aug;
			//B = deflate(B, e, aug);	

			//console.log(B.toString('deflated:'));
			
			e = powerIter(B);	
			eigs.data[i] = e.eig;
			console.log("here's the eig:" + e.eig);

			aug = e.v;

			vs[i] = aug;
			B = deflate(B, e.eig, aug);	

			console.log(B.toString("deflated:"));

			i++;
		}	

		//while (i > 0) {
		////test... smallest eigen stuffs
		
			e = round(1/powerIter(Binv));
			console.log("here's the eig:" + e);
			eigs.data[i] = e;
			

			aug = this
					.rref(Ainv.copy()
					//.rref(B.copy()
						   .subtract(this.eye().scale(1/e))
						   .augment(new Vector3D([1, 1, 1, 0])))
						   //.augment(new Vector3D([1, 1, 1, 0])))
					.split(4, 1)
					.B
					.normalize();

			console.log(aug.toString("here's the eigV"));

			//vs[1 + i] = aug;

			//Binv = deflate(Binv, e, aug);	
			//i--;
		//}
		//

		//e = powerIter(Binv);

		//console.log("here's the eig:" + e.eig);

		//eigs.data[i] = e.eig;

		//aug = e.v;

		vs[i] = aug;

		console.log(vs);

		S = this.combine(vs);
		V = this.diag(eigs); 
		Sinv = this.invert(S.copy());

		console.log(S.toString("S"));
		console.log(V.toString("V"));
		console.log(Sinv.toString("Sinv"));

		console.log(Sinv.transform(V).transform(S).toString());

		return { S: S,
				 V: V,
				 Sinv: Sinv };
}

//returns row reduced echelon form of A
//this one's for debugging
My3D.rrefDebug = function(A) {
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
			    console.log("switched " + i + " with " + max)
			}

			//if (Math.abs(A.a(i-1, j)) < Math.abs(A.a(i, j)) 
				//&& A.a(i-1, j-1) === 0) {
			if (A.a(i-1, j-1) === 0) {

				A.permute(i, i-1);	
				console.log("switched " + i + " with " + (i-1));
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

			console.log(A.toString("with row exchanges:"));

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
			console.log("pivot val: " + b);
			console.log(A.toString("row Opped"));

			 //*Scale the row
			 
			//A.scaleRow(i, round(1/b));
			A.scaleRow(i, 1/b);
			console.log(A.toString("scaled"));
		}

		return A;
	},
