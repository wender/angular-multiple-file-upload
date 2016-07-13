"use strict";
angular.module('fileUpload', [])
    .directive('fileUpload', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            template: '<div ng-transclude></div>',
            replace: true,
            transclude: true,
            scope: {
                ngModel: '=',
                disabled: '='
            },
            require: 'ngModel',
            link: function (scope, el, attr) {
                var fileName,
                    shareCredentials,
                    withPreview,
                    fileSelector,
                    resize,
                    maxWidth,
                    maxHeight,
                    sel;

                fileName = attr.name || 'userFile';
                shareCredentials = attr.credentials === 'true';
                withPreview = attr.preview === 'true';
                resize = attr.resize === 'true';
                maxWidth = angular.isDefined(attr.maxWidth) ? parseInt(attr.maxWidth) : false;
                maxHeight = angular.isDefined(attr.maxHeight) ? parseInt(attr.maxHeight) : false;
                fileSelector = angular.isDefined(attr.fileSelector) ? attr.fileSelector : false;

                el.append('<input style="display: none !important;" type="file" ' + (attr.multiple == 'true' ? 'multiple' : '') + ' accept="' + (attr.accept ? attr.accept : '') + '" name="' + fileName + '"/>');

                function Resize(file, index, type) {
                    var canvas = document.createElement("canvas");
                    var img = document.createElement("img");
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        img.src = e.target.result;
                        draw();
                    };
                    reader.readAsDataURL(file);

                    function b64toBlob(b64Data, contentType, sliceSize) {
                        contentType = contentType || '';
                        sliceSize = sliceSize || 512;

                        var byteCharacters = atob(b64Data);
                        var byteArrays = [];

                        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                            var slice = byteCharacters.slice(offset, offset + sliceSize);

                            var byteNumbers = new Array(slice.length);
                            for (var i = 0; i < slice.length; i++) {
                                byteNumbers[i] = slice.charCodeAt(i);
                            }

                            var byteArray = new Uint8Array(byteNumbers);

                            byteArrays.push(byteArray);
                        }

                        var blob = new Blob(byteArrays, {type: contentType});
                        return blob;
                    }

                    function draw() {
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);

                        var width = img.width;
                        var height = img.height;

                        if (width > height) {
                            if (width > maxWidth) {
                                height *= maxWidth / width;
                                width = maxWidth;
                            }
                        } else {
                            if (height > maxHeight) {
                                width *= maxHeight / height;
                                height = maxHeight;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;

                        ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, width, height);
                        var b64 = canvas.toDataURL(type).split(',')[1];
                        file = b64toBlob(b64, type, 512);
                        uploadFile(file, index);
                    }
                }


                function upload(fileProperties, index, file) {
                    if (resize && maxWidth && maxHeight && (file.type.indexOf('image/') !== -1)) {
                        Resize(file, index, file.type);
                    } else {
                        uploadFile(file, index);
                    }
                    return angular.extend(scope.ngModel[index], {
                        name: fileProperties.name,
                        size: fileProperties.size,
                        type: fileProperties.type,
                        status: {},
                        percent: 0,
                        preview: null
                    });
                }

                function uploadFile(file, index) {
                    var xhr = new XMLHttpRequest(),
                        fd = new FormData(),
                        progress = 0,
                        uri = attr.uri || '/upload/upload';
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
                }

                $timeout(function () {
                    sel = fileSelector ? angular.element(el[0].querySelectorAll(fileSelector)[0]) : el;
                    sel.bind('click', function () {
                        if (!scope.disabled) {
                            scope.$eval(el.find('input')[0].click());
                        }
                    });
                });

                angular.element(el.find('input')[0]).bind('change', function (e) {
                    var files = e.srcElement.files || e.dataTransfer.files;
                    if (!angular.isDefined(scope.ngModel) || attr.multiple === 'true') {
                        scope.ngModel = [];
                    }
                    var f;
                    for (var i = 0; i < files.length; i++) {
                        f = {
                            name: files[i].name,
                            size: files[i].size,
                            type: files[i].type,
                            status: {},
                            percent: 0,
                            preview: null
                        };
                        scope.ngModel.push(f);
                        upload(f, i, files[i]);
                    }
                    e.srcElement.files = null;
                    e.srcElement.value = '';
                    scope.$apply();
                })
            }
        }
    }]);