var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('scripts', function() {
	return gulp.src(['src/matrix3d.js',
					 'src/vector3d.js',
					 'src/points3d.js',
					 'src/my3d.js',
					 'engine.js',
					 'shapes.js'])	
		   .pipe(concat('my3d.js'))
		   .pipe(gulp.dest('./'))
});


gulp.task('watch', function() {
	gulp.watch(['src/*.js'], ['scripts']);	
});

gulp.task('default', ['scripts']);
