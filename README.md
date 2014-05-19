# ws_video_overlay is used to create html overlays

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

HMTL Controls doesn't work...

