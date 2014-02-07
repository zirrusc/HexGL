module.exports = (grunt) ->
  pkg = grunt.file.readJSON 'package.json'
  grunt.initConfig
    watch:
      files: ['src/**'],
      tasks: ['copy','uglify']
    coffee:
      compile:
        options:
          sourceMap: true
        files: [
            expand: true,
            cwd: 'src/coffee/',
            src: ['**/*.coffee'],
            dest: 'src/js/coffee/',
            ext: '.js'
        ]
    uglify:
      compress_target:
        options:
          sourceMap: (fileName) ->
            fileName.replace /\.js$/, '.js.map'
            except: [ '**/Ladder*' ]
        files: [
            expand: true,
            cwd: 'src/js/',
            src: ['**/*.js']
            #src: ['*.js', 'mobile/*.js'],
            dest: 'build/js/',
            ext: '.js',

        ]
    copy:
      dist:
        files:[
            #src: ['src/css/**', 'src/geometries/**', 'src/images/**', 'src/textures/**', 'src/thumbs/**', 'src/**.html']
            expand: true,
            cwd: 'src/',
            src: [ '**' ],
            dest: 'build/'
        ]

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.registerTask 'default', ['copy','uglify']
  