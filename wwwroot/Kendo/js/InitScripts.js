var urlfile;
function clickUrl(url) {
    if (typeof (history.pushState) != "undefined") {
        kendo.ui.progress($('.content-wrapper'), true);
        var obj = { Url: url };
        links.push(obj.Url);
        history.pushState(null, 'index', obj.Url);
        $.ajax({
            url: url + "?showinline=true",
            success: function (result) {
                $("#body").html(result);
                initKendo($("body"));
                kendo.ui.progress($('.content-wrapper'), false);
            },
            error: function () {
                kendo.ui.progress($('.content-wrapper'), false);
                showErrorMsg("کاربر گرامی، از سمت سرور دچار مشکل شده لطفا دوباره امتحان کنید ");
            }
        });

    } else {
        alert("Browser does not support HTML5.");
    }
}
function grid_dataBound(e) {
    setTimeout(function () {
        var grid = $('#' + e).data('kendoGrid');
        if (grid.dataItems().length > 0) {
            showSuccessMsg("عملیات با موفقیت انجام شد");
        }
        else {
            grid_dataBound(e);
        }
        clearTimeout();
        kendo.ui.progress($('.content-wrapper'), false);

    }, 300)

}
function Deletegrid(evt) {
    var target = (window.event || evt).currentTarget;
    var grid = $(target).closest('[data-role=grid]').data('kendoGrid');
    if (!grid)
        grid = $(target).closest('[data-role=treelist]').data('kendoTreeList');

    var deleteUrl = grid.element.data('delete-url');
    var dataItem = grid.dataItem($(target).closest("tr"));

    swal({
        text: "آیا از حذف این رکورد مطمئن هستید؟",
        icon: "warning",
        buttons: ["خیر", "بله"],
        dangerMode: true
    }).then((willDelete) => {
        if (willDelete) {
            kendo.ui.progress($('.content-wrapper'), true);


            var settings = {
                "url": deleteUrl + "/" + dataItem.Guid,
                "method": "DELETE",
                "headers": {
                    "Content-Type": "application/json; " + "charset=utf-8",

                    "Authorization": "Bearer " + localStorage.getItem("jwt")


                },
                "timeout": 0,
                statusCode: {
                    401: function () {
                        kendo.ui.progress($('.content-wrapper'), false);

                        window.location.href = "/login/logout"

                    },
                    400: function () {
                        kendo.ui.progress($('.content-wrapper'), false);
                        showErrorMsg("کاربر گرامی، داده های وارد شده نادرست می باشد لطفا دوباره امتحان کنید ");
                    },
                    403: function () {
                        kendo.ui.progress($('.content-wrapper'), false);
                        showErrorMsg("کاربر گرامی، شما به این صفحه دسترسی ندارید. ");
                    },
                    500: function () {
                        kendo.ui.progress($('.content-wrapper'), false);
                        showErrorMsg("کاربر گرامی، از سمت سرور دچار مشکل شده لطفا دوباره امتحان کنید ");
                    }
                }
            };

            $.ajax(settings).done(function (data) {
                if (data.isSuccess) {
                    info("عملیات با موفقیت انجام شد.")
                    refreshGrid(grid.element.attr('id'));
                    kendo.ui.progress($('.content-wrapper'), false);
                } else {
                    showErrorMsg(data.message);
                    kendo.ui.progress($('.content-wrapper'), false);
                }
            });

        }
    });


}

function customeRefreshGrid(url, gridId) {

    var grid = $('#' + gridId).data('kendoGrid');
    if (!grid)
        grid = $('#' + gridId).data('kendoTreeList');

    grid.dataSource.transport.options.read.url = url;
    grid.dataSource.read();
    grid.refresh();
}

var objupload = { fileName: "", size: "", extension: "", Data: "" };
var objuploadlist = {};

function showSuccessMsg(str) {
    $("#popupNotification").kendoNotification({
        autoHideAfter: 700, position: { pinned: true, top: 40, left: 20, bottom: null, right: null }
    });
    $("#popupNotification").data("kendoNotification").show(str, "success");
};
function info(str) {
    $("#popupNotification").kendoNotification({
        autoHideAfter: 5000, position: { pinned: true, top: 40, left: 20, bottom: null, right: null }
    });
    $("#popupNotification").data("kendoNotification").show(str, "info");
};
function warning(str) {
    $("#popupNotification").kendoNotification({
        autoHideAfter: 5000, position: { pinned: true, top: 40, left: 20, bottom: null, right: null }
    });

    $("#popupNotification").data("kendoNotification").show(str, "warning");

};
function showErrorMsg(str) {
    $("#popupNotification").kendoNotification({
        autoHideAfter: 10000, position: { pinned: true, top: 40, left: 20, bottom: null, right: null }
    });
    $("#popupNotification").data("kendoNotification").show(str, "error");
}
var afterInitKendoFunctions = [];
function getKendoGridDataItem(target) {
    var grid = $(target).closest('[data-role=grid]').data('kendoGrid');
    if (!grid)
        grid = $(target).closest('[data-role=treelist]').data('kendoTreeList');

    return grid.dataItem($(target).closest("tr"));
}

currentDropDownId = "";
function refreshDropDown(id) {
    if (currentDropDownId || id) {
        var dropDownId = dropDownId || id;
        var dropDown = $('#' + currentDropDownId).data('kendoDropDownList');
        dropDown.open();
        dropDown.search(dropDown.filterInput.val());

    }
    currentDropDownId = "";
}
currentGridId = "";
function refreshGrid(id) {
    if (currentGridId || id) {
        var gridId = currentGridId || id;
        var grid = $('#' + gridId).data('kendoGrid');
        if (!grid)
            grid = $('#' + gridId).data('kendoTreeList');

        grid.dataSource.read();
        grid.refresh();
    }
    currentGridId = "";
}

Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
}
function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

function nationalIdValidator(value) {
    if (value.length < 10 ||
        value.length > 10 ||
        value == "1111111111" ||
        value == "0000000000" ||
        value == "2222222222" ||
        value == "3333333333" ||
        value == "4444444444" ||
        value == "5555555555" ||
        value == "6666666666" ||
        value == "7777777777" ||
        value == "8888888888" ||
        value == "9999999999")
        return false;
    var A, B, C;
    var m = 10;
    B = 0;
    C = 0;
    A = parseInt(value.toString().substr(9, 1));
    for (var i = 0; i < value.length - 1; i++, m--) {
        B = B + (parseInt(value.toString().substr(i, 1)) * m);
    }
    C = (B % 11);
    if ((A == C && C == 0) || (A == 1 && C == 1) || (C > 1 && A == (11 - C))) {
        return true;
    }
    else
        return false;
}

function userFrindlySize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

function getFileLink(file) {
    if (!file)
        return "";
    return "<a target='_blank' href='" + urlfile + file.Url + "'>" + file.FileName + "</a>";
}

function editorInsertInlineFileCallBack(data) {
    if (data.success) {
        var editor = $('#' + data.tag.EditorId).data("kendoEditor");
        editor.exec("inserthtml", { value: "<a target='_blank' href='" + urlfile + data.tag.Url + "'>" + data.tag.Title + "</a>" });
        $("#insertFileModal").data("kendoWindow").close();

    } else {
        showErrorMsg(data.messages)
    }
}

var maps = [];
function initMap(mapId) {
    var mapContainer = $('#' + mapId);
    var map = L.map(mapContainer.attr('id')).setView(mapContainer.data('center'), mapContainer.data('zoom'));

    if (mapContainer.data('locations')) {
        var popupTemplate = mapContainer.data('popup-template');
        var locations = mapContainer.data('locations');
        for (var i = 0; i < locations.length; i++) {
            var location = locations[i];
            var marker = L.marker([location.Latitude, location.Longitude]);
            if (popupTemplate) {
                var popup = L.popup({ maxWidth: "auto" }).setContent(kendo.template($('#' + popupTemplate).html())(location));
                marker.bindPopup(popup);
            }
            marker.addTo(map);
        }
    }

    if (mapContainer.data('set-marker-onclick')) {
        var marker = L.marker(map.getCenter());
        marker.addTo(map);
        map.on('click', function (e) {
            var id = $(map.getContainer()).attr('id');
            $('#' + id + '_Longitude').val(e.latlng.lng);
            $('#' + id + '_Latitude').val(e.latlng.lat);
            marker.setLatLng(e.latlng);
        });
    }

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?_{ticks}', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        ticks: function () { return new Date().getTime(); }
    }).addTo(map);

    maps.push(map);
}

var kendeHandlers = {
    getNoDataTemplate: function (e) {
        if (!this.element.data('create-url'))
            return "موردی یافت نشد!";

        return "<div>موردی یافت نشد! آیا میخواید ایتم جدیدی اضافه کنید؟</div><br /><button type='button' data-add-item-to-dropdown='" + this.element.attr('id') + "' class='k-button'>درج ایتم جدید</button>";
    },


    dateTimePickerOnChange: function (e) {

    },
    editorInsertInlineImage: function (e) {
        kendo.ui.progress($('.content-wrapper'), true);
        $('#insertImageModal').data('kendoWindow').refresh('/File/InsertImageToHtmlEditor?editorId=' + $(this).attr('id'));
    },

    editorInsertInlineFile: function (e) {
        kendo.ui.progress($('.content-wrapper'), true);
        $('#insertFileModal').data('kendoWindow').refresh('/File/InsertFileToHtmlEditor?editorId=' + $(this).attr('id'));
    },

    gridDetailInit: function (e) {

        var detailRow = e.detailRow;
        var id = e.data.Guid;
        if (e.data.Guid == "00000000-0000-0000-0000-000000000000") {
            id = e.data.Id;
        }
        var url = e.sender.element.data("detail-view-url") + '/' + id;

        kendo.ui.progress($('.content-wrapper'), true);
        $.get(url, function (res) {
            detailRow.find('td.k-detail-cell').html(res);
            initKendo(detailRow);
        }).always(function () {
            kendo.ui.progress($('.content-wrapper'), false);
        });
    },
    gridDataSourceDelete: function (evt) {

        var target = (window.event || evt).currentTarget;
        var grid = $(target).closest('[data-role=grid]').data('kendoGrid');
        if (!grid)
            grid = $(target).closest('[data-role=treelist]').data('kendoTreeList');

        var deleteUrl = grid.element.data('delete-url');
        var dataItem = grid.dataItem($(target).closest("tr"));


        swal({
            text: "آیا از حذف این رکورد مطمئن هستید؟",
            icon: "warning",
            buttons: ["خیر", "بله"],
            dangerMode: true
        }).then((willDelete) => {
            if (willDelete) {
                kendo.ui.progress($('.content-wrapper'), true);
                var id = dataItem.Guid;
                if (dataItem.Guid == "00000000-0000-0000-0000-000000000000") {
                    id = dataItem.Id;
                }
                $.post(deleteUrl, { guid: id }, function (data) {
                    if (data.success) {
                        info("عملیات با موفقیت انجام شد.")
                        refreshGrid(grid.element.attr('id'));
                    } else {
                        showErrorMsg(data.messages);
                    }

                }, 'json').always(function () {
                    kendo.ui.progress($('.content-wrapper'), false);
                }).fail(function (x, e, s) {
                    showErrorMsg(x.responseText);
                });
            }
        });


    },

    gridDataSourceEdit: function (evt) {

        evt.preventDefault();
        var target = (window.event || evt).currentTarget;
        var grid = $(target).closest('[data-role=grid]').data('kendoGrid');
        var id = $(target).closest('[data-role=id]').data('kendoGrid');
        if (!grid)
            grid = $(target).closest('[data-role=treelist]').data('kendoTreeList');
        var dataItem = grid.dataItem($(target).closest("tr"));

        if (dataItem.Guid == "00000000-0000-0000-0000-000000000000") {
            var editUrl = grid.element.data('edit-url') + '/' + dataItem.Id;
            var editInModal = grid.element.data('edit-in-modal');
            if (editInModal) {
                currentGridId = grid.element.attr('id');
                kendo.ui.progress($('.content-wrapper'), true);
                var modal = $('#createModal').data('kendoWindow');
                modal.setOptions({ activate: function () { modal.title("ویرایش رکورد") } });
                modal.refresh(editUrl);
            }
            else
                window.location.href = editUrl;
        }
        else {
            var editUrl = grid.element.data('edit-url') + '/' + dataItem.Guid;
            var editInModal = grid.element.data('edit-in-modal');
            if (editInModal) {
                currentGridId = grid.element.attr('id');
                kendo.ui.progress($('.content-wrapper'), true);
                var modal = $('#createModal').data('kendoWindow');
                modal.setOptions({ activate: function () { modal.title("ویرایش رکورد") } });
                modal.refresh(editUrl);
            }
            else
                window.location.href = editUrl;
        }





    },

    gridShowPdf: function (evt) {

        evt.preventDefault();
       
        showErrorMsg("show")



    },

    gridDataSourceParameterMap: function (data, type) {
        //Convert persian date filters
        if (type == 'read') {
            if (data.filter && data.filter.filters) {
                for (var i = 0; i < data.filter.filters.length; i++) {
                    var split = "";
                    if (typeof (data.filter.filters[i].value) != "number") {
                        split = data.filter.filters[i].value.toString().split('/');
                    }
                    if (split.length > 2) {
                        var jdate = data.filter.filters[i].value;
                        data.filter.filters[i].value = moment.from(jdate, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD');

                        //data.filter.filters[i].value = new JalaliDate(jdate.split('/')[0],
                        //    jdate.split('/')[1],
                        //    jdate.split('/')[2]).toUTCString();
                    }
                }
            }
        }
        return kendo.stringify(data);
    },

    gridDataSourceRequestEnd: function (e) {
        if (e.type == 'update' && e.response.success)
            this.read();
    },

    gridDataSourceError: function (e) {
        console.log(e.errorThrown);

        if (e.errorThrown == "Unauthorized") {

            window.location.href = "/login/logout"

        }
        if (e.errorThrown == "Forbidden") {
            showErrorMsg("کاربر گرامی، شما به این صفحه دسترسی ندارید. ");

        }
    },

    gridExcelExport: function (e) {
        var exportedColumns = [];
        for (var i = 0; i < this.columns.length; i++)
            if (this.columns[i].hidden != true && this.columns[i].field)
                exportedColumns.push(this.columns[i]);

        for (var i = 0; i < exportedColumns.length; i++) {
            var col = exportedColumns[i];
            if (col.type == "date") {
                for (var j = 1; j < e.workbook.sheets[0].rows.length; j++) {
                    var cell = e.workbook.sheets[0].rows[j].cells[i];
                    if (cell.value && cell.value instanceof JalaliDate)
                        cell.value = cell.value.toString();
                }
            }
        }

        e.workbook.fileName = kendo.toString(new JalaliDate(new Date()), "yy-MM-dd_HH:mm") + ".xlsx";
    },

    gridDataSourceParser: function (response) {

        if (this.model && this.model.fields)
            for (f in this.model.fields) {
                if (this.model.fields[f].type == "date") {
                    if (response.Group && response.Group.length)
                        for (var i = 0; i < response.Group.length; i++) {
                            checkDateTime(response.Group[i].items, f);
                        }
                    else if (response.Data)
                        checkDateTime(response.Data, f);
                }
            }
        return response;
    },

    windowError: function (e) {
        console.log(e);
        showErrorMsg(e.xhr.responseText);
        kendo.ui.progress($('.content-wrapper'), false);

    },

    uploadOnSelect: function (e) {
        if (!e.target.files.length) {
            kendeHandlers.uploadOnRemove(e);
            return;
        }
        var file = e.target.files[0];
        var container = $(e.target).parents('.kupload');

        container.find('a').attr('href', URL.createObjectURL(file)).text(file.name);

        container.find('[data-field=fileName]').val(file.name);
        container.find('[data-field=size]').val(file.size);
        container.find('[data-field=extension]').val('.' + file.name.split('.').pop());

        var reader = new FileReader();
        reader.onload = function (res) {
            container.find('[data-field=data]').val(res.target.result);
        }
        reader.readAsDataURL(file);
    },

    uploadOnRemove: function (e) {
        var container = $(e.target).parents('.kupload');
        container.find('a').text('');
        container.find('[data-field=fileId]').val('0');
        container.find('[data-field=fileName]').val('');
        container.find('[data-field=size]').val('0');
        container.find('[data-field=data]').val('');
    },
    windowOnRefresh: function (e) {
        initKendo(this.element);
        this.open().center();
        kendo.ui.progress($('.content-wrapper'), false);

        //Leaflet map not displayed properly inside modal
        for (var i = 0; i < maps.length; i++) {
            maps[i].invalidateSize(false);
        }
    },

    gridOnChange: function (e) {
        var selectedIsExpanded = this.select().find('.k-i-collapse').length;
        this.collapseRow(this.tbody.find(' > tr.k-master-row'));

        if (!selectedIsExpanded)
            this.expandRow(this.select());

    },

    treeListOnChange: function (e) {
        this.expand(this.select());
    }
}

function checkDateTime(items, f) {
    for (var i = 0; i < items.length; i++) {
        if (/^\/Date\((d|-|.*)\)[\/|\\]$/.test(items[i][f]))
            items[i][f] = new JalaliDate(kendo.parseDate(items[i][f]));
    }
}

function initKendo(container) {
    container.find('.form-group textarea').each(function (index, item) {
        var dest = $(this).parents('.col-sm-9').removeClass('col-sm-9').addClass('col-sm-12');
        $(this).parents('.form-group').find('label').removeClass('col-sm-3').prependTo(dest);
    });


    $('.dropify').dropify();
    kendo.init(container);


    container.find('[data-role=maskedDateTimePicker]').each(function (index, item) {
        $(this).kendoMaskedTextBox({
            mask: "0000/00/00 00:00",
        });

        var dateTimePicker = $(this).kendoDateTimePicker({
            format: "yyyy/MM/dd HH:mm",
        }).data('kendoDateTimePicker');
        if ($(this).val())
            dateTimePicker.value(JalaliDate.parse($(this).val()));

        $(this).closest(".k-datetimepicker")
            .add($(this))
            .removeClass("k-textbox");
    });

    container.find('[data-role=maskedDatePicker]').each(function (index, item) {
        $(this).kendoMaskedTextBox({
            mask: "0000/00/00"
        });

        var datePicker = $(this).kendoDatePicker({
            format: "yyyy/MM/dd"
        }).data('kendoDatePicker');
        if ($(this).val())
            datePicker.value(JalaliDate.parse($(this).val()));

        $(this).closest(".k-datepicker")
            .add($(this))
            .removeClass("k-textbox");
    });

    container.find('[data-role=maskedTimePicker]').each(function (index, item) {
        $(this).kendoMaskedTextBox({
            mask: "00:00"
        });

        var timePicker = $(this).kendoTimePicker({
        }).data('kendoTimePicker');
        if ($(this).val())
            timePicker.value($(this).val());

        $(this).closest(".k-timepicker")
            .add($(this))
            .removeClass("k-textbox");
    });
    container.find('form').kendoValidator(
        {
           
            errorTemplate: "<div class='k-widget k-tooltip k-popup k-tooltip-validation k-invalid-msg'><span class='k-icon k-i-warning'></span>#=message#<div class='k-callout'></div></div>",
            rules: {

                required: function (input) {
                    if (input.data("val-required"))
                        return (input.val() != null && input.val().length > 0);
                    else
                        return true;
                },
                range: function (input) {
                    if (input.data("val-range")) {
                        var min = parseFloat(input.data('val-range-min'));
                        var max = parseFloat(input.data('val-range-max'));
                        return max >= parseFloat(input.val()) && parseFloat(input.val()) >= min;
                    }
                    else
                        return true;
                },
                lengthMax: function (input) {
                    if (input.data("val-length-max"))
                        return input.val().length <= input.data("val-length-max");
                    else
                        return true;
                },
                lengthMin: function (input) {
                    if (input.data("val-length-min"))
                        return input.val().length >= input.data("val-length-min");
                    else
                        return true;
                },
                nationalid: function (input) {
                    if (input.data("val-nationalid") && input.val())
                        return nationalIdValidator(input.val());
                    else
                        return true;
                },
                equalto: function (input) {
                    if (input.data("val-equalto")) {
                        var otherId = input.data('val-equalto-other').split('.')[1];
                        return input.val() == $('#' + otherId).val();
                    }
                    else
                        return true;
                },
                clientValidation: function (input) {
                    if (input.data("val-client"))
                        return eval(input.data("val-client-function") + "(input)");
                    else
                        return true;
                },
                remoteValidation: function (input) {
                    if (input.data("val-remote")) {
                        var data = { id: input.closest('form').find('#Id').val(), value: input.val() };
                        if (input.data("val-remote-additionalfields")) {
                            var temp = input.data("val-remote-additionalfields").split(',');
                            for (var i = 0; i < temp.length; i++) {
                                var fieldId = temp[i].split('.')[1];
                                data[fieldId] = input.closest('form').find('#' + fieldId).val();
                            }
                        }

                        return $.ajax({
                            data: data,
                            url: input.data("val-remote-url"), type: 'POST', async: false, cache: false,
                        }).responseJSON;
                    }
                    else
                        return true;
                },
                dateTimePickerValidation: function (input) {
                    if (input.data("role") == "maskedDateTimePicker")
                        return !(input.val() && input.data('kendoDateTimePicker').value() == null);
                    else
                        return true;
                },
                datePickerValidation: function (input) {
                    if (input.data("role") == "maskedDatePicker") {
                        if (input.val())
                            input.data('kendoDatePicker').value(JalaliDate.parse(input.val()));
                        return !(input.val() && input.data('kendoDatePicker').value() == null);
                    }
                    else
                        return true;
                },
                timePickerValidation: function (input) {
                    if (input.data("role") == "maskedTimePicker")
                        return !(input.val() && input.data('kendoTimePicker').value() == null);
                    else
                        return true;
                }
            },
            messages: {
                required: function (input) {
                    return 'این فیلد الزامی است!';
                },
                range: function (input) {
                    var min = input.data("val-range-min");
                    var max = input.data("val-range-max");
                    return 'مقدار وارد شده باید در بازه (' + min + ') تا (' + max + ') باشد!';
                },
                lengthMax: function (input) {
                    var max = input.data("val-length-max");
                    return 'تعداد کارکترهای وارد شده نباید بیشتر از (' + max + ') باشد.';
                },
                lengthMin: function (input) {
                    var min = input.data("val-length-min");
                    return 'تعداد کارکترهای وارد شده نباید کمتر از (' + min + ') باشد.';
                },
                nationalid: function (input) {
                    return input.data("val-nationalid");
                },
                clientValidation: function (input) {
                    return input.data("val-client");
                },
                equalto: function (input) {
                    return input.data("val-equalto");
                },
                url: function (input) {
                    return "آدرس اینترنتی صحیح وارد نشده است!";
                },
                remoteValidation: function (input) {
                    return input.data("val-remote");
                },
                dateTimePickerValidation: function (input) {
                    return "مقدار وارد شده معتبر نیست!";
                },
                datePickerValidation: function (input) {
                    return "مقدار وارد شده معتبر نیست!";
                },
                timePickerValidation: function (input) {
                    return "مقدار وارد شده معتبر نیست!";
                }
            }

        });

    container.find('#btnInsertImage').on('click', function (evt) {
        var frm = $((window.event || evt).target).closest("form");
        if (!frm.data("kendoValidator").validate()) return;

        var width = frm.find('#Width').val();
        var height = frm.find('#Height').val();
        var imgSrc = frm.find('input[data-field=data]').val();

        var editor = $('#' + frm.find('#EditorId').val()).data("kendoEditor");
        editor.exec("inserthtml", { value: "<img src='" + imgSrc + "' style='width:" + width + ";height:" + height + ";' />" });

        frm.closest("[data-role=window]").data("kendoWindow").close();
    });

    container.find('.k-button.k-grid-add').on('click', function () {
        var grid = $(this).parents('[data-role=grid]');
        if (!grid.length)
            grid = $(this).parents('[data-role=treelist]');

        currentGridId = grid.attr('id');

        if (grid.data('inline-add'))
            return;

        kendo.ui.progress($('.content-wrapper'), true);
        var modal = $('#createModal').data('kendoWindow');
        modal.setOptions({ activate: function () { modal.title("ایجاد رکورد جدید") } });
        modal.refresh(grid.data('create-url'));
    });

    container.find("[type=file]").each(function (index, item) {

        $(this).on('change', kendeHandlers.uploadOnSelect);

        $(this).parents('.k-upload').find('.k-btn-delete').on('click', kendeHandlers.uploadOnRemove);

    })

    container.find('[data-map-id]').on('click', function (evt) {
        (window.event || evt).preventDefault();
        $('#' + $(this).data('map-id')).parent().parent().toggle();
        if (!$(this).data('map-init')) {
            initMap($(this).data('map-id'));
            $(this).data('map-init', true);
        }

    });

    //Leaflet map not displayed properly inside tabstrip
    container.find('[data-role=tabstrip]').each(function (index, item) {
        $(this).data('kendoTabStrip').bind('activate', function (e) {
            for (var i = 0; i < maps.length; i++) {
                maps[i].invalidateSize(false);
            }
        });
    });

    container.find('.k-grid-cancel').on('click', function () {
        $(this).closest('[data-role=window]').data("kendoWindow").close();
    });

    container.find('.k-filtercell [data-role=autocomplete]').each(function (index, item) {
        var autocomplete = $(this).data("kendoAutoComplete");
        autocomplete.list.width("auto");
        autocomplete.bind('open', adjustDropDownWidth);
        autocomplete.bind('dataBound', adjustDropDownWidth);
    });

    container.find('.k-filtercell [data-role=combobox]').each(function (index, item) {
        var combobox = $(this).data("kendoComboBox");
        combobox.list.width("auto");
        combobox.bind('open', adjustDropDownWidth);
        combobox.bind('dataBound', adjustDropDownWidth);
    });

    container.find('.k-filtercell [data-role=dropdownlist]').each(function (index, item) {
        var dropdownlist = $(this).data("kendoDropDownList");
        dropdownlist.list.width("auto");
        dropdownlist.bind('open', adjustDropDownWidth);
        dropdownlist.bind('dataBound', adjustDropDownWidth);
    });

    while (afterInitKendoFunctions.length) {
        afterInitKendoFunctions.pop()();
    }

}

function adjustDropDownWidth(e) {
    var listContainer = e.sender.list.closest(".k-list-container");
    var width = listContainer.width() + kendo.support.scrollbar();
    listContainer.width(width);
}

$(document).ready(function () {
    kendo.culture("fa-IR");
    initKendo($("body"));
    $("body").on("click", "[data-add-item-to-dropdown]", function (evt) {
        kendo.ui.progress($('.content-wrapper'), true);
        currentDropDownId = $(this).data('add-item-to-dropdown');
        var dropDown = $('#' + currentDropDownId).data('kendoDropDownList');
        if (!dropDown)
            dropDown = $('#' + currentDropDownId).data('kendoComboBox');
        dropDown.close();
        var createUrl = $('#' + currentDropDownId).data('create-url');
        var modal = $('#createModal2').data('kendoWindow');
        modal.setOptions({
            activate: function () {
                var dropDownInput = dropDown.filterInput || dropDown.input;
                modal.element.find('#' + dropDown.element.data('text-field')).val(dropDownInput.val());
            }
        });
        modal.refresh(createUrl);
    });
    $("body").on("click", "[data-submit='ajax']", function (evt) {
        (window.event || evt).preventDefault();

        var frm = $((window.event || evt).target).closest("form");

        if (!frm.data("kendoValidator").validate()) return;

        kendo.ui.progress(frm, true);
        var callback = $(this).data('callback') || $(this).parents('[data-submit=ajax]').data('callback');


        var data = '';
        var list = frm.serialize().split('&')
        for (let i = 0; i < list.length; i++) {
            const last = list[i].charAt(list[i].length - 1);
            if (last != "=") {
                data = data + list[i] + "&"
            }
        }

        var elements = "#" + window.event.target.offsetParent.id;
        if (elements == "#") {
            elements = "#" + window.event.target.form.id;
        }

        $(elements + " input ," + elements + " select ," + elements + " textarea").map(function (index, elm) {
            var checknameelm = elm.name.split('.');
            if (elm.name != "" && checknameelm.length == 1) {
                var datakendoMultiSelect = $("[name =" + elm.name + "]").data('role');
                if (datakendoMultiSelect != "undefined" && datakendoMultiSelect == "multiselect") {

                    data = data.replace("&" + elm.name + "=", "");
                    var values = $("[name =" + elm.name + "]").data("kendoMultiSelect").value();
                    for (var i = 0; i < values.length; i++) {
                        data = data + "&" + elm.name + "=" + values[i]
                    }
                }


            }



        });


        $.post(frm.attr("action"), data,
            function (data) {
                if (typeof (callback) != "undefined") {
                    window[callback](data);
                } else {
                    if (data.success) {
                        if (data.messages) {
                            showSuccessMsg(data.messages);
                        } else {
                            showSuccessMsg("عملیات با موفقیت انجام شد");
                        }
                        refreshGrid();
                        refreshDropDown();
                        if (frm.closest('[data-role=window]').data("kendoWindow"))
                            frm.closest('[data-role=window]').data("kendoWindow").close();

                    } else {
                        showErrorMsg(data.messages);
                    }
                }

            }, 'json')
            .fail(function (x, e, s) {
                showErrorMsg(x.responseText);
            })
            .always(function () {
                kendo.ui.progress(frm, false);
            });
    });
});


// استفاده از يك كنترل انتخاب تاريخ شمسي بجاي نمونه‌ي توكار ميلادي
function addMdDateTimePicker(container, options) {
    debugger;
    // console.log(options);
    // دريافت تاريخ ميلادي و تبديل آن به شمسي جهت نمايش در تكست باكس
    var fieldValue = options.model[options.field];
    var persianDate = fieldValue ? moment(fieldValue).format('jYYYY/jMM/jDD') : "";

    // ايجاد كنترل انتخاب تاريخ سفارشي با مقدار تاريخ شمسي دريف جاري
    var input = $('<div dir="ltr" class="input-group">' +
        '<div class="input-group-addon" data-name="datepicker1" data-mddatetimepicker="true" data-trigger="click" data-targetselector="#' + options.field + '" data-fromdate="false" data-enabletimepicker="false" data-englishnumber="true" data-placement="left">' +
        '<span class="glyphicon glyphicon-calendar"></span>' +
        '</div>' +
        '<input type="text" value="' + persianDate + '" class="form-control" id="' + options.field + '" placeholder="از تاریخ" data-mddatetimepicker="true" data-trigger="click" data-targetselector="#' + options.field + '" data-englishnumber="true"  data-fromdate="true" data-enabletimepicker="false" data-placement="right" />' +
        '</div>');
    // افزودن كنترل جديد به صفحه
    input.appendTo(container);

    // با خبر سازي كتابخانه انتخاب تاريخ از تكست باكس جديد
    EnableMdDateTimePickers();

    // هر زمانيكه كاربر تاريخ جديدي را وارد كرد، آن‌را به ميلادي تبديل كرده و در مدل رديف جاري ثبت مي‌كنيم
    // در نهايت اين مقدار ميلادي است كه به سمت سرور ارسال خواهد شد
    $('#' + options.field).change(function () {
        var selectedPersianDate = $(this)[0].value;
        if (selectedPersianDate) {
            var gregorianDate = moment(selectedPersianDate, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
            options.model.set(options.field, gregorianDate);
        }
    });

    // با از دست رفتن فوكوس نياز است اين كنترل مخفي شود
    $('#' + options.field).blur(function () {
        $('[data-name="datepicker1"]').MdPersianDateTimePicker('hide');
    });
}


function addMdDateTimePickerui(element) {
    var name = $(element[0]).data("bind").replace("[", "").replace("]", "").replace(".", "").replace(" ", "").replace(":", "");
    $(element[0])
        .addClass("k-input k-textbox")
        .attr("style", "width:100%")
        .attr("data-mddatetimepicker", "true")
        .attr("data-englishnumber", "true")
        .attr("data-trigger", "click")
        .attr("data-targetselector", "#" + name)
        .attr("data-fromdate", "true")
        .attr("data-enabletimepicker", "false")
        .attr("data-placement", "right")
        .attr("name", name)
        .attr("id", name);
    EnableMdDateTimePickers();
}

