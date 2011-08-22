valIdPairs = {}
evenOdd = "even"

Bindings =
  init: ->
    @bindEditables()
    @mapDataValsToIds()
  bindEditables: ->
       $(".editable").bind("click", ->
            input = $(this).find("input")
            select = $(this).find("select")
            $(select).show()
            input.show()
            input.focus()
            $(this).find("label").hide()
       )
       inputs = $(".editable").find("input")
       selects = $(".editable").find("select")
       $(selects).bind("blur", ->
            label = $(this).parent().find("label")
            $(label).html($("#" + this.id + " option:selected").text())
            $(this).hide()
            $(label).show()
       )
       $(inputs).bind("blur", ->
            label = $(this).parent().find("label")
            $(label).html($(this).val())
            $(this).hide()
            $(label).show()
       )
  mapDataValsToIds: ->
     #TODO Optimize, Genericizea
     pairs = {}
     jQuery.each($("##{currentForm}").find("select"), (i, val) ->
          if $(val).attr("data-val") != null
              valIdPairs[$(val).attr("data-val")] = $(val).attr("id")

     )
     jQuery.each($("##{currentForm}").find("input"), (i, val) ->
          if $(val).attr("data-val") != null
              valIdPairs[$(val).attr("data-val")] = $(val).attr("id")

     )

  bindTables: (data, container) ->
    row_count = 0
    jQuery.each(data, (i, val) ->
        jQuery.each($(container).find("table"), (s, ele) ->
            obj = data
            if $(ele).attr("data-val")
                property = $(ele).attr("data-val").split(".")
                for i in [0..property.length - 1]
                    obj = obj[property[i]]
            jQuery.each(obj, (s, object) ->
                switch evenOdd
                    when "odd" then evenOdd = "even"
                    when "even" then evenOdd = "odd"
                    else evenOdd = "odd"
                row = "<tr class='" + evenOdd + "'>"
                jQuery.each($(ele).find("th"), (k, eles) ->
                    try
                        values = eles
                        try
                          property = $(eles).attr("data-val").split(".")
                        catch ex
                        nested = object
                        for i in [0..property.length - 1]
                            nested = nested[property[i]]
                        if $(eles).attr("data-val")
                            if $(eles).attr("data-name")
                                input_name = $(eles).attr("data-name")
                            else if property.length > 1 
                                input_name = property.join("_")
                            else
                                input_name = property
                            if $(eles).attr("data-id")
                                input_id = $(eles).attr("data-id")
                            else
                                input_id = property.join("_")
                                input_id = "#{input_id}_#{row_count}"
                            try
                                if $(eles).attr("data-type") == "array"
                                    input_name = "#{input_name}[#{row_count}]"
                            catch ex
                            try
                              if $(eles).attr("data-input") == "select"
                                input_type = "select"
                            catch ex
                              input_type = "text"
                            row += "<td class='#{$(eles).attr('data-class')}'>"
                            row += nested
                            if input_type == "select"
                              select_options = data
                              property = $(eles).attr("data-options").split(".")
                              for i in [0..property.length - 1]
                                  select_options = select_options[property[i]]
                              input_id = property.join("_")
                              row += "<select id='#{input_id}_#{row_count}' name='#{input_name}' class='hidden'>"
                              jQuery.each($(select_options), (i, val)->
                                row += "<option value='#{val.value}'"
                                if val.text == nested
                                  row += "selected='selected'"
                                row += ">#{val.text}</option>"
                              )
                              row += "</select>"
                            else
                              row += "<input name='#{input_name}' id='#{input_id}' value='#{nested}' class='hidden #{input_name}'/>"
                            row += "</td>"
                        if $(eles).attr("data-href")
                            row += "<td>"
                            row += "<a href='#{$(eles).attr('data-href')}' onclick='#{$(eles).attr('data-click')}'><span class='#{$(eles).attr('data-class')}'> </span></a>"
                            row += "</td>"
                    catch ex
                        row += "<td></td>"
                        
                )
                row += "</tr>"
                row_count++
                $(ele).find("tbody").append(row)
            )
        )
    )
     
  bindData: (data, container) -> 
   @bindTables(data, container)
   jQuery.each(data, (i, val) ->
       jQuery.each($(container).children().find("select"), (i, ele) ->
              obj = data
              if $(ele).attr("data-val") 
                property = $(ele).attr("data-val").split(".")
                for i in [0..property.length - 1]
                    obj = obj[property[i]]
                $(ele).val(obj)
       )
      
       jQuery.each($(container).children().find("input:checkbox"), (i, ele) ->
              obj = data
              if $(ele).attr("data-val") 
                property = $(ele).attr("data-val").split(".")
                for i in [0..property.length - 1]
                  obj = obj[property[i]]
                $(ele).prop("checked", (obj))
       )
      
       jQuery.each($(".text-data"), (i, ele) ->
                  obj = data
                  if $(ele).attr("data-val") 
                    property = $(ele).attr("data-val").split(".")
                    for i in [0..property.length - 1]
                          obj = obj[property[i]]
                    $(ele).val(obj)
       )
   )
  