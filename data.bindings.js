var Bindings, evenOdd, valIdPairs;
valIdPairs = {};
evenOdd = "even";
Bindings = {
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
    var row_count;
    row_count = 0;
    return jQuery.each(data, function(i, val) {
      return jQuery.each($(container).find("table"), function(s, ele) {
        var i, obj, property, _ref;
        obj = data;
        row_count = $(ele).find("tr").length;
        if ($(ele).attr("data-val")) {
          property = $(ele).attr("data-val").split(".");
          for (i = 0, _ref = property.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
            obj = obj[property[i]];
          }
        }
        return jQuery.each(obj, function(s, object) {
          var row;
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
          jQuery.each($(ele).find("th"), function(k, eles) {
            var change, classes, data_options, i, input_id, input_name, input_type, nested, values, _ref2;
            data_options = [];
            try {
              try {
                data_options = $(eles).attr("data-options").split(" ");
              } catch (ex) {

              }
              values = eles;
              try {
                property = $(eles).attr("data-val").split(".");
              } catch (ex) {

              }
              if (property == null) {
                return null;
              }
              nested = object;
              for (i = 0, _ref2 = property.length - 1; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
                nested = nested[property[i]];
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
                return row += Bindings.addLink(eles);
              }
            } catch (ex) {
              return row += Bindings.addEmptyColumn;
            }
          });
          row += "</tr>";
          row_count++;
          $(ele).find("tbody").append(row);
          return Bindings.bindEditables();
        });
      });
    });
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
      if ($(eles).attr("data-input") === "select") {
        input_type = "select";
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
      return input_name = property;
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
    this.bindTables(data, container);
    jQuery.each(data, function(i, val) {
      return jQuery.each($(container).children().find("select"), function(i, ele) {
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
    });
    jQuery.each($(container).children().find("input:checkbox"), function(i, ele) {
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
    jQuery.each($("" + container + " .text-data"), function(i, ele) {
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
    return this.bindEditables();
  }
};