var appendData, evenOdd, srcBound, valIdPairs;
valIdPairs = {};
evenOdd = "even";
appendData = false;
srcBound = false;
this.Prometheus = {
  init: function() {
    this.mapDataValsToIds();
    return this.bindEditables();
  },
  bindEditables: function() {
    var inputs, selects;
    $(".editable").bind("click", function() {
      var input, select;
      input = $(this).find("input");
      select = $(this).find("select");
      if ($(input)) {
        $(input).show();
        $(input).focus();
        $(input).parent().find("label").hide();
      }
      if ($(select)) {
        $(select).show();
        $(select).focus();
        return $(select).parent().find("label").hide();
      }
    });
    inputs = $(".editable").find("input");
    selects = $(".editable").find("select");
    $(selects).bind("change", function() {});
    $(selects).bind("blur", function() {
      var label;
      label = $(this).parent().find("label");
      $(label).html($("#" + this.id + " option:selected").text());
      $(this).hide();
      return $(label).show();
    });
    return $(inputs).bind("blur", function() {
      var label;
      label = $(this).parent().find("label");
      $(label).html($(this).val());
      $(this).hide();
      return $(label).show();
    });
  },
  nullCheck: function(val) {
    if (val === null) {
      return "";
    } else {
      return val;
    }
  },
  mapDataValsToIds: function() {
    var pairs;
    pairs = {};
    jQuery.each($("#" + currentForm).find("select"), function(i, val) {
      if ($(val).attr("data-val") !== null) {
        return valIdPairs[$(val).attr("data-val")] = $(val).attr("id");
      }
    });
    return jQuery.each($("#" + currentForm).find("input"), function(i, val) {
      if ($(val).attr("data-val") !== null) {
        return valIdPairs[$(val).attr("data-val")] = $(val).attr("id");
      }
    });
  },
  bindTables: function(data, container) {
    var row_count, tables;
    row_count = 0;
    tables = $(container).find("table");
    jQuery.each(tables, function(s, ele) {
      var html, success;
      html = "";
      success = 0;
      jQuery.each(data, function(s, data) {
        var headers, i, obj, property, row, undefinedCount, _ref;
        undefinedCount = 0;
        obj = data;
        row_count = $(ele).find("tr").length;
        if ($(ele).attr("data-src")) {
          property = $(ele).attr("data-src").split(".");
        }
        if (property) {
          for (i = 0, _ref = property.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
            obj = obj[property[i]];
          }
        }
        switch (evenOdd) {
          case "odd":
            evenOdd = "even";
            break;
          case "even":
            evenOdd = "odd";
            break;
          default:
            evenOdd = "odd";
        }
        row = "<tr class='" + evenOdd + "'>";
        headers = $(ele).find("th");
        if (obj.constructor.toString().indexOf("Array") === -1) {
          obj = [obj];
        }
        return jQuery.each(obj, function(k, obj) {
          jQuery.each(headers, function(k, eles) {
            var change, classes, cls, data_options, i, input_id, input_name, input_type, isNull, nested, values, _ref2;
            data_options = [];
            try {
              try {
                data_options = $(eles).attr("data-options").split(" ");
              } catch (ex) {
                values = eles;
              }
              try {
                property = $(eles).attr("data-val").split(".");
              } catch (ex) {

              }
              if (property == null) {
                return null;
              }
              nested = obj;
              for (i = 0, _ref2 = property.length - 1; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
                nested = nested[property[i]];
              }
              isNull = nested != null;
              if (!isNull) {
                nested = "";
              }
              if (!isNull) {
                undefinedCount++;
              }
              if ($(eles).attr("data-val")) {
                input_name = Prometheus.getInputName(eles, property);
                input_id = Prometheus.getInputId(eles, property, row_count);
                input_name = "" + input_name + "[" + row_count + "]";
                input_type = Prometheus.getInputType(eles);
                change = Prometheus.getOnChange(eles);
                classes = Prometheus.setColumnClasses(data_options);
                cls = Prometheus.getClasses(eles);
                row += "<td class='" + cls + " " + classes + "'>";
                row += "<label>" + nested + "</label>";
                if (input_type === "select") {
                  row += Prometheus.addTableSelect(input_name, row_count, property, eles, property, data, nested, change, blur);
                } else {
                  row += Prometheus.addTableInput(input_name, input_id, nested, property, change, blur);
                }
              }
              if ($(eles).attr("data-href")) {
                return row += Prometheus.addTableLink(eles);
              }
            } catch (ex) {
              row += Prometheus.addEmptyColumn;
              return undefinedCount++;
            }
          });
          row += "</tr>";
          if (undefinedCount < headers.length) {
            row_count++;
            html += row;
            row = "";
            if (!success) {
              if (!appendData) {
                $(ele).find("tbody").html("");
                return success = 1;
              }
            }
          }
        });
      });
      $(ele).find("tbody").append(html);
      $(ele).find("input").hide();
      return $(ele).find("select").hide();
    });
    return Prometheus.bindEditables();
  },
  getOnChange: function(eles) {
    var change;
    change = "";
    try {
      if ($(eles).attr("data-change")) {
        change = $(eles).attr("data-change");
      } else {
        change = "";
      }
    } catch (ex) {

    }
    return change;
  },
  getInputType: function(eles) {
    var input_type;
    input_type = void 0;
    try {
      if ($(eles).attr("data-input")) {
        input_type = $(eles).attr("data-input").toString();
      }
    } catch (ex) {
      input_type = "text";
    }
    return input_type;
  },
  getInputName: function(eles, property) {
    var input_name;
    if ($(eles).attr("data-name")) {
      return input_name = $(eles).attr("data-name");
    } else if (property.length > 1) {
      return input_name = property.join("_");
    } else {
      return input_name = property.toString();
    }
  },
  getInputId: function(eles, property, row_count) {
    var input_id;
    if ($(eles).attr("data-id")) {
      return input_id = $(eles).attr("data-id");
    } else {
      input_id = property.join("_");
      return input_id = "" + input_id + "_" + row_count;
    }
  },
  getId: function(eles) {
    var ele_id;
    ele_id = "";
    if ($(eles).attr("data-id")) {
      ele_id = $(eles).attr("data-id");
    }
    return ele_id;
  },
  getClasses: function(eles) {
    var cls;
    if ($(eles).attr("data-class")) {
      cls = $(eles).attr("data-class");
    } else {
      cls = "";
    }
    return cls;
  },
  addTableLink: function(eles) {
    var row;
    row = "<td>";
    row += "<a href='" + ($(eles).attr('data-href')) + "' onclick='" + ($(eles).attr('data-click')) + "'><span class='" + ($(eles).attr('data-class')) + "'> </span></a>";
    row += "</td>";
    return row;
  },
  addTableInput: function(name, id, nested, property, change, blur) {
    var row;
    if (nested == null) {
      return null;
    }
    row = "<input name='" + name + "' id='" + id + "' value='" + nested + "' onblur='" + blur + "' class='hidden " + (property.join("_")) + " editable' onchange=\"" + change + "\"/>";
    row += "</td>";
    return row;
  },
  addEmptyColumn: function() {
    var row;
    row = "<td></td>";
    return row;
  },
  addTableSelect: function(input_name, row_count, val, eles, property, data, nested, change, blur) {
    var i, input_id, row, select_options, _ref;
    row = "";
    select_options = data;
    property = $(eles).attr("data-select").split(".");
    if (property == null) {
      return null;
    }
    for (i = 0, _ref = property.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
      select_options = select_options[property[i]];
    }
    input_id = property.join("_");
    row += "<select id='" + input_id + "_" + row_count + "' name='" + input_name + "' class='hidden' onchange='" + change + "' onblur='" + blur + "'>";
    jQuery.each($(select_options), function(i, val) {
      row += "<option value='" + val.value + "'";
      if (val.text === nested) {
        row += "selected='selected'";
      }
      return row += ">" + val.text + "</option>";
    });
    row += "</select>";
    row += "</td>";
    return row;
  },
  setColumnClasses: function(options) {
    var classes;
    classes = [];
    jQuery.each(options, function(i, val) {
      if (val === "inline-edit") {
        return classes.push("editable");
      } else {
        return "";
      }
    });
    return classes.join(" ");
  },
  bindData: function(data, container) {
    if (!srcBound) {
      this.bindSources(data, container, false);
      srcBound = true;
    }
    return this.bindValues(data, container, false);
  },
  appendData: function(data, container) {
    this.bindSources(data, container, true);
    return this.bindValues(data, container, true);
  },
  bindSources: function(data, container, append) {
    if (append) {
      appendData = append;
    } else {
      appendData = false;
    }
    if (container === void 0) {
      container = "body";
    }
    if (data.constructor.toString().indexOf("Array") === -1) {
      data = [data];
    }
    if (data) {
      return this.bindSelectSources(data, container);
    }
  },
  bindValues: function(data, container, append) {
    if (append) {
      appendData = append;
    } else {
      appendData = false;
    }
    if (container === void 0) {
      container = "body";
    }
    if (data.constructor.toString().indexOf("Array") === -1) {
      data = [data];
    }
    if (data) {
      this.bindTables(data, container);
      this.bindSelects(data, container);
      this.bindInputs(data, container);
      this.bindHiddens(data, container);
      this.bindCheckboxes(data, container);
      this.bindLists(data, container);
      this.bindLabels(data, container);
      this.bindSpan(data, container);
      return this.bindEditables();
    }
  },
  bindSpan: function(data, container) {
    var labels;
    labels = $(container).find("span[data-val]");
    jQuery.each(labels, function(i, ele) {
      return jQuery.each(data, function(i, obj) {
        var change, classes, data_options, input, label, name, property, span, _ref;
        if ($(ele).attr("data-val")) {
          property = $(ele).attr("data-val").split(".");
          try {
            data_options = "";
            for (i = 0, _ref = property.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
              obj = obj[property[i]];
            }
            try {
              data_options = $(ele).attr("data-options").split(" ");
            } catch (ex) {

            }
            classes = Prometheus.setColumnClasses(data_options);
            input = "";
            change = Prometheus.getOnChange(ele);
            if ($(ele).attr("data-name")) {
              name = $(ele).attr("data-name");
            } else {
              name = property.join("_");
            }
            if (classes.indexOf("editable") !== -1) {
              input = Prometheus.getEditableInput(ele, obj, name, change);
            }
            span = $(document.createElement('span')).attr("class", classes);
            label = $(document.createElement('label'));
            label.append(obj);
            span.append(label);
            span.append(input);
            $(label).html(obj);
            $(ele).append(span);
            if ($(ele).attr("data-type") === "select") {
              return Prometheus.bindSelectSources(data, ele);
            }
          } catch (ex) {

          }
        }
      });
    });
    $(labels).find("input").hide();
    $(labels).find("select").hide();
    return Prometheus.bindEditables();
  },
  getEditableInput: function(ele, val, name, change, blur, title) {
    var input;
    if ($(ele).attr("data-type") === "select") {
      input = $(document.createElement("select"));
      input.attr("data-src", $(ele).attr("data-src"));
    } else {
      input = $(document.createElement("input"));
    }
    if ($(ele).attr("data-key")) {
      $(input).attr("data-key", $(ele).attr("data-key"));
    }
    if ($(ele).attr("data-title")) {
      $(input).attr("data-title", $(ele).attr("data-title"));
    }
    $(input).attr("id", "" + ($(ele).attr("id")) + "_input");
    if ($(ele).attr("data-src")) {
      input.attr("data-src", $(ele).attr("data-src"));
    }
    if (Prometheus.getBoolean(val)) {
      input.attr("value", val);
    }
    if (Prometheus.getBoolean(blur)) {
      input.attr("onblur", blur);
    }
    if (Prometheus.getBoolean(change)) {
      input.attr("onchange", change);
    }
    if (Prometheus.getBoolean(name)) {
      input.attr("name", name);
    }
    return input;
  },
  getOnBlur: function(ele) {
    if ($(ele).attr("data-blur")) {
      return "";
    } else {
      return "";
    }
  },
  bindLists: function(data, container) {
    var lists;
    lists = $(container).find("ul[data-val]");
    return jQuery.each(lists, function(i, ele) {
      var list_count, success, title;
      success = 0;
      title = "";
      list_count = $(ele).find("li").length;
      if ($(ele).attr("data-val")) {
        return jQuery.each(data, function(i, obj) {
          var blur, change, classes, data_options, input, label, li, name, property, _ref;
          property = $(ele).attr("data-val").split(".");
          change = Prometheus.getOnChange(ele);
          try {
            for (i = 0, _ref = property.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
              if ($(ele).attr("data-title")) {
                if (obj[$(ele).attr("data-title")]) {
                  title = obj[$(ele).attr("data-title")];
                }
              }
              obj = obj[property[i]];
            }
            data_options = "";
            try {
              data_options = $(ele).attr("data-options").split(" ");
            } catch (ex) {

            }
            classes = Prometheus.setColumnClasses(data_options);
            input = "";
            if ($(ele).attr("data-name")) {
              name = "" + ($(ele).attr('data-name')) + "[" + list_count + "]";
            } else {
              name = "" + (property.join('_')) + "[" + list_count + "]";
            }
            blur = void 0;
            if (!success) {
              if (!appendData) {
                $(ele).html("");
                success = 1;
              }
            }
            input = Prometheus.getEditableInput(ele, obj, name, change, blur);
            li = $(document.createElement('li'));
            li.attr("class", "" + (Prometheus.getClasses(ele)) + " " + classes);
            li.attr("id", "" + (Prometheus.getId(ele)) + "_" + list_count);
            li.attr("title", "" + title);
            li.append(input);
            label = $(document.createElement('label'));
            label.html(obj);
            li.append(label);
            $(ele).append(li);
            list_count++;
            $(ele).find("select").hide();
            return $(ele).find("input").hide();
          } catch (ex) {

          }
        });
      }
    });
  },
  bindLabels: function(data, container) {
    var labels;
    labels = $(container).find("label[data-val]");
    jQuery.each(labels, function(i, ele) {
      return jQuery.each(data, function(i, obj) {
        var blur, change, classes, data_options, input, label, name, property, span, _ref;
        if ($(ele).attr("data-val")) {
          property = $(ele).attr("data-val").split(".");
          try {
            data_options = "";
            for (i = 0, _ref = property.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
              obj = obj[property[i]];
            }
            try {
              data_options = $(ele).attr("data-options").split(" ");
            } catch (ex) {

            }
            classes = Prometheus.setColumnClasses(data_options);
            input = "";
            change = Prometheus.getOnChange(ele);
            if ($(ele).attr("data-name")) {
              name = $(ele).attr("data-name");
            } else {
              name = property.join("_");
            }
            blur = void 0;
            if (classes.indexOf("editable") !== -1) {
              input = Prometheus.getEditableInput(ele, obj, name, change, blur);
            }
            span = $(document.createElement('span')).attr("class", classes);
            label = $(document.createElement('label'));
            label.append(obj);
            span.append(label);
            span.append(input);
            $(ele).html("");
            $(ele).append(span);
            if ($(ele).attr("data-type") === "select") {
              return Prometheus.bindSelectSources(data, ele);
            }
          } catch (ex) {

          }
        }
      });
    });
    return $(labels).find("input").hide();
  },
  bindSelectSources: function(data, container) {
    var selects;
    selects = $(container).find("select[data-src]");
    return jQuery.each(selects, function(i, ele) {
      var objects, options, src, success, title, value;
      options = "";
      success = 0;
      if ($(ele).attr("data-src")) {
        title = "";
        value = "";
        objects = [];
        src = $(ele).attr("data-src").split(".");
        jQuery.each(data, function(i, val) {
          var option;
          val = val;
          jQuery.each(src, function(i, str) {
            try {
              if ($(ele).attr("data-title")) {
                if (val[$(ele).attr("data-title")]) {
                  title = val[$(ele).attr("data-title")];
                }
              }
              if ($(ele).attr("data-key")) {
                if (val[$(ele).attr("data-key")]) {
                  value = val[$(ele).attr("data-key")];
                }
              }
              return val = val[src[i]];
            } catch (ex) {

            }
          });
          if (val != null) {
            if (success === 0) {
              if (!appendData) {
                $(ele).html("");
              }
              success = 1;
            }
            option = "<option title='" + title + "' value=" + value + ">" + val + "</option>";
            return options += option;
          }
        });
        return $(ele).append(options);
      }
    });
  },
  getRootArray: function(data) {
    while (data[0].constructor.toString().indexOf("Array") === !-1) {
      data = data[0];
    }
    return data;
  },
  bindSelects: function(data, container) {
    var obj, selects;
    selects = $(container).find("select[data-val]");
    obj = data;
    return jQuery.each(selects, function(i, ele) {
      var property;
      if ($(ele).attr("data-val")) {
        property = $(ele).attr("data-val").split(".");
        return jQuery.each(obj, function(i, val) {
          var _ref;
          try {
            for (i = 0, _ref = property.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
              val = val[property[i]];
            }
            if (val != null) {
              $(ele).val(val);
              return $("#" + ($(ele).attr("id")) + " option:contains('" + val + "')").attr("selected", "selected");
            }
          } catch (ex) {

          }
        });
      }
    });
  },
  bindInputs: function(data, container) {
    var inputs;
    inputs = $(container).find("input:text[data-val]");
    return jQuery.each(inputs, function(i, ele) {
      if ($(ele).attr("data-val")) {
        return jQuery.each(data, function(i, obj) {
          var property, _ref;
          property = $(ele).attr("data-val").split(".");
          try {
            for (i = 0, _ref = property.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
              obj = obj[property[i]];
            }
            return $(ele).val(obj);
          } catch (ex) {

          }
        });
      }
    });
  },
  bindHiddens: function(data, container) {
    var inputs;
    inputs = $(container).find("input:hidden[data-val]");
    return jQuery.each(inputs, function(i, ele) {
      if ($(ele).attr("data-val")) {
        return jQuery.each(data, function(i, obj) {
          var property, _ref;
          property = $(ele).attr("data-val").split(".");
          try {
            for (i = 0, _ref = property.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
              obj = obj[property[i]];
            }
            return $(ele).val(obj);
          } catch (ex) {

          }
        });
      }
    });
  },
  bindCheckboxes: function(data, container) {
    var checkboxes;
    checkboxes = $(container).find("input:checkbox[data-val]");
    return jQuery.each(checkboxes, function(i, ele) {
      if ($(ele).attr("data-val")) {
        return jQuery.each(data, function(i, obj) {
          var property, _ref;
          property = $(ele).attr("data-val").split(".");
          try {
            for (i = 0, _ref = property.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
              obj = obj[property[i]];
            }
            return $(ele).prop("checked", Prometheus.getBoolean(obj));
          } catch (ex) {

          }
        });
      }
    });
  },
  getBoolean: function(obj) {
    if (obj === 0 || obj === "false" || obj === "" || obj === "0" || obj === null || obj === void 0 || obj === "undefined") {
      return false;
    } else {
      return true;
    }
  }
};