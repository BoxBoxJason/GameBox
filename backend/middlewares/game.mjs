
export function generateStartingPoint(top, right, bottom, left) {
	// Generates a random starting point (middle x axis, random y)
	// With a random velocity
	let plusMinus = Math.random() < 0.5 ? -1 : 1;
	let dx = (5 + 4 * Math.random()) * plusMinus;
	plusMinus = Math.random() < 0.5 ? -1 : 1;
	let dy = (4 + 5 * Math.random()) * plusMinus;
	
	let y = Math.random() * (bottom - top) - 15;
	let x = (right - left) / 2 - 15;

	return [x,y,dx,dy];
}
