var evenOdd, valIdPairs;
valIdPairs = {};
evenOdd = "even";
this.Bindings = {
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
      return jQuery.each(data, function(s, data) {
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
        jQuery.each(headers, function(k, eles) {
          var change, classes, data_options, i, input_id, input_name, input_type, isNull, nested, values, _ref2;
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
              input_name = Bindings.getInputName(eles, property);
              input_id = Bindings.getInputId(eles, property, row_count);
              input_name = "" + input_name + "[" + row_count + "]";
              input_type = Bindings.getInputType(eles);
              change = Bindings.getOnChange();
              classes = Bindings.setColumnClasses(data_options);
              row += "<td class='" + ($(eles).attr('data-class')) + " " + classes + "'>";
              row += "<label>" + nested + "</label>";
              if (input_type === "select") {
                row += Bindings.addTableSelect(input_name, row_count, val, eles, property, data, nested);
              } else {
                row += Bindings.addTableInput(input_name, input_id, nested, property, change);
              }
            }
            if ($(eles).attr("data-href")) {
              return row += Bindings.addTableLink(eles);
            }
          } catch (ex) {
            return row += Bindings.addEmptyColumn;
          }
        });
        row += "</tr>";
        if (undefinedCount < headers.length) {
          row_count++;
          return $(ele).find("tbody").append(row);
        }
      });
    });
    Bindings.bindEditables();
    return $(".editable").hide();
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
  addTableLink: function(eles) {
    var row;
    row = "<td>";
    row += "<a href='" + ($(eles).attr('data-href')) + "' onclick='" + ($(eles).attr('data-click')) + "'><span class='" + ($(eles).attr('data-class')) + "'> </span></a>";
    row += "</td>";
    return row;
  },
  addTableInput: function(name, id, nested, property, change) {
    var row;
    if (nested == null) {
      return null;
    }
    row = "<input name='" + name + "' id='" + id + "' value='" + nested + "' class='hidden " + (property.join("_")) + " editable' onchange='" + change + "'/>";
    row += "</td>";
    return row;
  },
  addEmptyColumn: function() {
    var row;
    row = "<td></td>";
    return row;
  },
  addTableSelect: function(input_name, row_count, val, eles, property, data, nested) {
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
    row += "<select id='" + input_id + "_" + row_count + "' name='" + input_name + "' class='hidden'>";
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
      this.bindCheckboxes(data, container);
      this.bindLists(data, container);
      this.bindLabels(data, container);
      return this.bindEditables();
    }
  },
  bindLists: function(data, container) {
    var lists;
    lists = $(container).children().find("ul[data-val]");
    return jQuery.each(lists, function(i, ele) {
      var obj, property, _ref;
      obj = data;
      if ($(ele).attr("data-val")) {
        property = $(ele).attr("data-val").split(".");
        for (i = 0, _ref = property.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          obj = obj[property[i]];
        }
        return $(ele).html("" + ($(ele).html()) + "<li>" + obj + "</li>");
      }
    });
  },
  bindLabels: function(data, container) {
    var labels;
    labels = $(container).children().find("ul[datal-val]");
    return jQuery.each(labels, function(i, ele) {
      var obj, property, _ref;
      obj = data;
      if ($(ele).attr("data-val")) {
        property = $(ele).attr("data-val").split(".");
        for (i = 0, _ref = property.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          obj = obj[property[i]];
        }
        return $(ele).val(obj);
      }
    });
  },
  bindSelects: function(data, container) {
    var selects;
    selects = $(container).children().find("select[data-val]");
    return jQuery.each(selects, function(i, ele) {
      var obj, property, _ref;
      obj = data;
      if ($(ele).attr("data-val")) {
        property = $(ele).attr("data-val").split(".");
        for (i = 0, _ref = property.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          obj = obj[property[i]];
        }
        return $(ele).val(obj);
      }
    });
  },
  bindInputs: function(data, container) {
    var inputs;
    inputs = $(container).find("input:text[data-val]");
    return jQuery.each(inputs, function(i, ele) {
      var obj, property, _ref;
      obj = data;
      if ($(ele).attr("data-val")) {
        property = $(ele).attr("data-val").split(".");
        for (i = 0, _ref = property.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          obj = obj[property[i]];
        }
        return $(ele).val(obj);
      }
    });
  },
  bindCheckboxes: function(data, container) {
    var checkboxes;
    checkboxes = $(container).find("input:checkbox[data-val]");
    return jQuery.each(checkboxes, function(i, ele) {
      var obj, property, _ref;
      obj = data;
      if ($(ele).attr("data-val")) {
        property = $(ele).attr("data-val").split(".");
        for (i = 0, _ref = property.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          obj = obj[property[i]];
        }
        return $(ele).prop("checked", obj);
      }
    });
  }
};