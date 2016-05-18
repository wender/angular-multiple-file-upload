# Multiple File Upload Directive for [AngularJS](http://angularjs.org/)

***

AngularJS directive for multiple file upload

This directive help you to create a better looking system to control your file uploads using the "Angular Way" with no dependencies, just HTML5 and pure javascript

As a directive, the entire process can be easily customized with your own CSS and HTML and using resources already available on AngularJS just like "ng-repeat" etc...

## Example: 
```HTML
<file-upload class="btn btn-success btn-rad btn-trans file-upload" name="userFile" ng-model="my.foo.model" multiple="false" uri="/upload/upload" accept="image/png, image/jpg">
    <i class="fa fa-upload"></i>
    <span>Upload Files</span>
    <ul>
        <li ng-repeat="p in my.foo.model" ng-hide="p.percent == 100">
            <small>{{ p.name }}</small>
            <div class="progress">
                <div class="progress-bar" style="width: {{ p.percent }}%;"></div>
            </div>
        </li>
    </ul>
</file-upload>
```

This directive will keep it's model update with whole information about selected files, progress and status.

## Attributes
- **ng-model**: ***required***
- **name**: default 'userFile'
- **uri**: default '/upload/upload'
- **multiple**: default 'true'
- **accept**: default empty (Accept comma-separated list of MIME Types)
- **credentials**: default 'false' (Share your credentials between your browser and the API)
- **preview**: default 'false' (Process a base64 preview of the selected image)

## Return
Charge it's model with an Array of objects

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
  percent: 0,
  preview: data:base64
}]
```

## Bower
	bower install angular-multiple-file-upload --save
