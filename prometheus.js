var Bindings, evenOdd, valIdPairs;
valIdPairs = {};
evenOdd = "even";
Bindings = {
  init: function() {
    this.bindEditables();
    return this.mapDataValsToIds();
  },
  bindEditables: function() {
    var inputs, selects;
    $(".editable").bind("click", function() {
      var input, select;
      input = $(this).find("input");
      select = $(this).find("select");
      $(select).show();
      input.show();
      input.focus();
      return $(this).find("label").hide();
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
            var i, input_id, input_name, input_type, nested, select_options, values, _ref2, _ref3;
            try {
              values = eles;
              try {
                property = $(eles).attr("data-val").split(".");
              } catch (ex) {

              }
              nested = object;
              for (i = 0, _ref2 = property.length - 1; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
                nested = nested[property[i]];
              }
              if ($(eles).attr("data-val")) {
                if ($(eles).attr("data-name")) {
                  input_name = $(eles).attr("data-name");
                } else if (property.length > 1) {
                  input_name = property.join("_");
                } else {
                  input_name = property;
                }
                if ($(eles).attr("data-id")) {
                  input_id = $(eles).attr("data-id");
                } else {
                  input_id = property.join("_");
                  input_id = "" + input_id + "_" + row_count;
                }
                try {
                  if ($(eles).attr("data-type") === "array") {
                    input_name = "" + input_name + "[" + row_count + "]";
                  }
                } catch (ex) {

                }
                try {
                  if ($(eles).attr("data-input") === "select") {
                    input_type = "select";
                  }
                } catch (ex) {
                  input_type = "text";
                }
                row += "<td class='" + ($(eles).attr('data-class')) + "'>";
                row += nested;
                if (input_type === "select") {
                  select_options = data;
                  property = $(eles).attr("data-options").split(".");
                  for (i = 0, _ref3 = property.length - 1; 0 <= _ref3 ? i <= _ref3 : i >= _ref3; 0 <= _ref3 ? i++ : i--) {
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
                } else {
                  row += "<input name='" + input_name + "' id='" + input_id + "' value='" + nested + "' class='hidden " + input_name + "'/>";
                }
                row += "</td>";
              }
              if ($(eles).attr("data-href")) {
                row += "<td>";
                row += "<a href='" + ($(eles).attr('data-href')) + "' onclick='" + ($(eles).attr('data-click')) + "'><span class='" + ($(eles).attr('data-class')) + "'> </span></a>";
                return row += "</td>";
              }
            } catch (ex) {
              return row += "<td></td>";
            }
          });
          row += "</tr>";
          row_count++;
          return $(ele).find("tbody").append(row);
        });
      });
    });
  },
  bindData: function(data, container) {
    this.bindTables(data, container);
    return jQuery.each(data, function(i, val) {
      jQuery.each($(container).children().find("select"), function(i, ele) {
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
      return jQuery.each($(".text-data"), function(i, ele) {
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
  }
};