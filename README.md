# Welcome to my project called ws_video_overlay!

## It apparently does not work for iPhone safari because it says it doesnt allow inline playing of videos.

## Directories

### src/
Sources.

### spec/
Test specification.

### build/
Build dir.

### externs/
External sources.

## Commands

### grunt (default)
Runs the default command, this will clean the project, run jshint and then build it.

### grunt unitreport 
This does the same as grunt unit but creates a coverage report. This should run on the CI server (jenkins).

### grunt unit 
This runs jshint and then unit tests. Used for development.

### grunt e2e
This runs e2e tests on a deployed version of the project.

### grunt deploy
This compiles the sources with google closure compiler (if chosen) and deploys it into an html file.

### grunt watch
This will watch the source directory for changes and then run jshint and unit tests.

## notes

Apply css must spinn through '-webkit', '-ms' and  to increase compability
```
div {
  -webkit-transform: value;
  -moz-transform:    value;
  -ms-transform:     value;
  -o-transform:      value;
  transform:         value;
}
```
Implement generated stylesheet loaded on start with custom transforms appending transforms on elements are a question of changing css classes on them. 
