=======================================
BONES
=======================================

Bones is a front end development tool.

It incorporates a responsive 12 column grid system and Sass functions to easily develop and maintain projects.

Through Gulp it also allows the concatination and minifying of Javascript files and compiles Sass to a minified distribution format.

It incoporates gulp-autoprefixer as well as using live reload to automatically update your browser when a file is saved.

Bones will create a dev file for easy maintenance and a minified dist version for when you are ready to launch.





=====================================
GRID LAYOUT
=====================================

GRID
====

Create the wrapper for the column sections by giving the element 


<!-- 90% width grid -->
<div class="grid"></div>

<!-- or this for 100% width -->
<div class="grid__full-screen"></div>


ROW
===

Create a row within the grid

<div class="grid">
	<div class="row">
		
	</div>
</div>


COLUMNS
=======

Give the elements inside the grid the class grid-col__ and then the number of columns you want it to span. 
For example for 4 columns that takes a quarter of the container each-

<div class="grid">
	<div class="row">
		<div class="grid-col__3">
			<!-- content -->
		</div>
		<div class="grid-col__3">
			<!-- content -->
		</div>
		<div class="grid-col__3">
			<!-- content -->
		</div>
		<div class="grid-col__3">
			<!-- content -->
		</div>
	</div>
</div>


OFFSETS
=======

Elements can be offset at different break points. To offset a column use the class

<div class=".lg-offset__col--3"></div>

This example would offset the element 3 columns from the left in its parent div.



=====================================
HELPER CLASSES AND PLACEHOLDERS
=====================================

CENTERED
========

Center any element within its container

<div class="centered"></div>


CLEARFIX
========

add- 

@extend %clearfix






================================================
Running gulp
================================================

Enter the project file in command line and run-

gulp 

for the defaut setting,this will start the browser update and compile the sass to css, concat js files. Not for the app.min.js file to be updated gulp must be run again.

When raedy for the dist file to be created to deploy, run- 

gulp build

in the command line.