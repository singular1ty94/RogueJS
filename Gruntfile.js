module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/data/colors.js', 'src/data/items.js', 'src/data/monsters.js', 'src/core/**/*.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    uglify: {
      options: { },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('build', ['concat', 'uglify']);

};