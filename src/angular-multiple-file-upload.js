"use strict";
angular.module('fileUpload', [])
    .directive('fileUpload', function () {
        return {
            restrict: 'E',
            template: '<div ng-transclude></div>',
            replace: true,
            transclude: true,
            scope: {
                ngModel: '='
            },
            require: 'ngModel',
            link: function (scope, el, attr) {
                var fileName,
                    uri,
                    shareCredentials,
                    withPreview;

                fileName = attr.name || 'userFile';
                shareCredentials = attr.credentials === 'true' ? true : false;
                withPreview = attr.preview === 'true' ? true : false;

                el.append('<input style="display: none !important;" type="file" ' + (attr.multiple == 'true' ? 'multiple' : '') + ' accept="' + (attr.accept ? attr.accept : '') + '" name="' + fileName + '"/>');
                uri = attr.uri || '/upload/upload';

                function uploadFile(file, uri, index) {
                    var xhr = new XMLHttpRequest(),
                        fd = new FormData(),
                        progress = 0;

                    xhr.open('POST', uri, true);
                    xhr.withCredentials = shareCredentials;
                    xhr.onreadystatechange = function () {
                        scope.ngModel[index].status = {
                            code: xhr.status,
                            statusText: xhr.statusText,
                            response: xhr.response
                        };
                        scope.$apply();
                    };
                    xhr.upload.addEventListener("progress", function (e) {
                        progress = parseInt(e.loaded / e.total * 100);
                        scope.ngModel[index].percent = progress;
                        scope.$apply();
                    }, false);
                    fd.append(fileName, file);
                    xhr.send(fd);

                    if (withPreview) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            scope.ngModel[index].preview = e.target.result;
                            scope.$apply();
                        };
                        reader.readAsDataURL(file);
                    }

                    return {
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        status: {},
                        percent: 0,
                        preview: null
                    }
                }

                el.bind('click', function () {
                    scope.$eval(el.find('input')[0].click());
                });

                angular.element(el.find('input')[0]).bind('change', function (e) {
                    var files = e.srcElement.files || e.dataTransfer.files;
                    var list = [];
                    for (var i = 0, f; f = files[i]; i++) {
                        list.push(uploadFile(f, uri, i));
                    }
                    e.srcElement.files = null;
                    e.srcElement.value = '';
                    scope.ngModel = list;
                    scope.$apply();
                })
            }
        }
    });