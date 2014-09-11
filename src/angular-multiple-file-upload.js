"use strict";
angular.module('fileUpload',[])
    .directive('fileUpload', function(){
        return {
            restrict: 'E',
            template: '<div ng-transclude ng-model="__userFiles"></div>',
            replace: true,
            transclude: true,
            scope: {
                __userFiles: '=ngModel'
            },
            link: function(scope, el, attr){
                var fileName,
                    uri;

                fileName = attr.name || 'userFile';

                el.append('<input style="display: none !important;" type="file" '+(attr.multiple=='true'?'multiple':'')+' accept="'+(attr.accept?attr.accept:'')+'" name="'+fileName+'"/>');
                uri = attr.uri||'/upload/upload';

                function uploadFile(file, uri, index) {
                    var xhr = new XMLHttpRequest(),
                        fd = new FormData(),
                        progress = 0;

                    xhr.open('POST', uri, true);
                    xhr.onreadystatechange = function(){
                        scope.__userFiles[index].status = {
                            code: xhr.status,
                            statusText: xhr.statusText,
                            response: xhr.response
                        };
                        scope.$apply();
                    };
                    xhr.upload.addEventListener("progress", function(e) {
                        progress = parseInt(e.loaded / e.total * 100);
                        scope.__userFiles[index].percent = progress;
                        scope.$apply();
                    }, false);
                    fd.append(fileName, file);
                    xhr.send(fd);
                    return {
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        status: {},
                        percent: 0
                    }
                }

                el.bind('click',function(){
                    scope.$eval(el.find('input')[0].click());
                });

                angular.element(el.find('input')[0]).bind('change', function(e){
                    var files = e.srcElement.files || e.dataTransfer.files;
                    var list = [];
                    for (var i = 0, f; f = files[i]; i++) {
                        list.push(uploadFile(f,uri,i));
                    }

                    e.srcElement.files = [];
                    e.srcElement.value = '';

                    scope.__userFiles = list;
                    scope.$apply();
                })
            }
        }
    });