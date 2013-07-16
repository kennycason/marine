Vector = {
	// calculate angle, theta, between two vectors
	// A · B = |A||B| cos θ
	// A · B = A B cos θ = |A||B| cos θ
	theta : function(A, B) {
		var A_B = A[0]*B[0] + A[1]*B[1]
		var AM = Vector.magnitude(A);
		var BM = Vector.magnitude(B);
		// cos θ = A · B / |A||B|
		var cosTheta = A_B/ (AM * BM);
		return Math.acos(cosTheta);
	},
	// A · B = |A||B| cos θ
	// (A · B) / |A|cos θ = |B|
	multTheta : function(A, theta) {
		return [A[0] * Math.cos(theta) - A[1] * Math.sin(theta),
			    A[0] * Math.sin(theta) + A[1] * Math.cos(theta)];
	},
	unit : function(A) {
		var mag = Math.sqrt(A[0]*A[0] + A[1]*A[1]);
		A[0] /= mag;
		A[1] /= mag;
		return A;
	},
	magnitude : function(A) {
		return Math.sqrt(A[0] * A[0] + A[1] * A[1]);
	},
}

Point = {

	distance : function(P1, P2) {
		return Math.sqrt((P1[0] - P2[0]) * (P1[0] - P2[0]) + (P1[1] - P2[1]) * (P1[1] - P2[1]));
	}

}

Dice = {
	roll : function(max) {
	    return Math.floor(Math.random() * (max + 1));
	}
}
