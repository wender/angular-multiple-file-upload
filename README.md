# Multiple File Upload Directive for [AngularJS](http://angularjs.org/)

***

AngularJS directive for multiple file upload

This directive help you to create a better looking system to control your file uploads using the "Angular Way" with no dependencies, just HTML5 and pure javascript

As a directive, the entire process can be easily customized with your own CSS and HTML and using resources already available on AngularJS just like "ng-repeat" etc...

## Example: 
```HTML
<file-upload class="btn btn-success btn-rad btn-trans file-upload" name="userFile" multiple="false" uri="/upload/upload" accept="">
    <i class="fa fa-upload"></i>
    <span>Upload Files</span>
    <ul>
        <li ng-repeat="p in __userFiles" ng-hide="p.percent == 100">
            <small>{{ p.name }}</small>
            <div class="progress">
                <div class="progress-bar" style="width: {{ p.percent }}%;"></div>
            </div>
        </li>
    </ul>
</file-upload>
```

This directive has it's own model called "__userFiles", this model contains whole information about selected files, progress and status.

## Attributes
- **name**: default 'userFile'
- **uri**: default '/upload/upload'
- **multiple**: default 'true'
- **accept**: default empty (Accept comma-separated list of MINE Types)

## Return
Returns a model called __userFiles with an Array of objects

```JAVASCRIPT
[{
  name: file.name,
  size: file.size,
  type: file.type,
  status: {
    code: xhr.status,
    statusText: xhr.statusText,
    response: xhr.response
  },
  percent: 0
}]
```

## Demo
Do you want to see this directive in action? Visit http://wender.com.br/angular/angular-multiple-file-upload.html

## Bower
bower install angular-multiple-file-upload
