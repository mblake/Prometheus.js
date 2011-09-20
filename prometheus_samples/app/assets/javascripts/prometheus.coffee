valIdPairs = {}
evenOdd = "even"
@Bindings =
  init: ->
    @mapDataValsToIds()
    @bindEditables()
  bindEditables: ->
       $(".editable").bind("click", ->
            input = $(this).find("input")
            select = $(this).find("select")
            if $(input)
              $(input).show()
              $(input).focus()
              $(input).parent().find("label").hide()
            if $(select)
              $(select).show()
              $(select).focus()
              $(select).parent().find("label").hide()
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
       
  nullCheck: (val)->
    if val == null
      return ""
    else
      return val
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
    tables = $(container).find("table")
    jQuery.each(tables, (s, ele) ->
      jQuery.each(data, (s, data) ->
        undefinedCount = 0
        obj = data
        row_count = $(ele).find("tr").length
        if $(ele).attr("data-src")
          property = $(ele).attr("data-src").split(".")
        if property
          for i in [0..property.length - 1]
            obj = obj[property[i]]
        switch evenOdd
          when "odd" then evenOdd = "even"
          when "even" then evenOdd = "odd"
          else evenOdd = "odd"
        row = "<tr class='" + evenOdd + "'>"
        headers = $(ele).find("th")
        jQuery.each(headers, (k, eles) ->
           data_options = []
           try
              try
                data_options = ($(eles).attr("data-options").split(" "))
              catch ex
                values = eles
              try
                property = $(eles).attr("data-val").split(".")
              catch ex
              unless property?
                return null
              nested = obj
              for i in [0..property.length - 1]
                  nested = nested[property[i]]
              isNull = nested?
              nested = "" unless isNull
              undefinedCount++ unless isNull
              if $(eles).attr("data-val")
                  input_name = Bindings.getInputName(eles, property)
                  input_id =  Bindings.getInputId(eles, property, row_count)
                  input_name = "#{input_name}[#{row_count}]"
                  input_type = Bindings.getInputType(eles)
                  change = Bindings.getOnChange()
                  classes = Bindings.setColumnClasses(data_options)
                  row += "<td class='#{$(eles).attr('data-class')} #{classes}'>"
                  row += "<label>#{nested}</label>"
                  if input_type == "select"
                    row += Bindings.addTableSelect(input_name, row_count, val, eles, property, data, nested)
                  else
                    row += Bindings.addTableInput(input_name, input_id, nested, property, change)
              if $(eles).attr("data-href")
                  row += Bindings.addTableLink(eles)
           catch ex
                row += Bindings.addEmptyColumn
                undefinedCount++
       
          )
        row += "</tr>"
        if undefinedCount < headers.length
          row_count++
          $(ele).find("tbody").append(row)
      )
    )
    Bindings.bindEditables()
    $(".editable").hide()
   

  getOnChange: (eles) ->
    change = "" 
    try
      if $(eles).attr("data-change")
        change = $(eles).attr("data-change")
      else
        change = ""
    catch ex
    return change

  getInputType: (eles) ->
    input_type = undefined
    try
      if $(eles).attr("data-input") 
          input_type = $(eles).attr("data-input").toString()
    catch ex
      input_type = "text"
    return input_type
  
  getInputName: (eles, property) ->
    if $(eles).attr("data-name")
        input_name = $(eles).attr("data-name")
    else if property.length > 1 
        input_name = property.join("_")
    else
        input_name = property.toString()
  
  getInputId: (eles, property, row_count) ->
    if $(eles).attr("data-id")
        input_id = $(eles).attr("data-id")
    else
        input_id = property.join("_")
        input_id = "#{input_id}_#{row_count}"
  
  addTableLink: (eles) ->
    row = "<td>"
    row += "<a href='#{$(eles).attr('data-href')}' onclick='#{$(eles).attr('data-click')}'><span class='#{$(eles).attr('data-class')}'> </span></a>"
    row += "</td>"
    return row
     
  addTableInput: (name, id, nested, property, change) ->
    unless nested?
      return null
    row  = "<input name='#{name}' id='#{id}' value='#{nested}' class='hidden #{property.join("_")} editable' onchange='#{change}'/>"
    row += "</td>"
    return row
    
  addEmptyColumn: ->
    row = "<td></td>"
    return row
    
  addTableSelect: (input_name, row_count, val, eles, property, data, nested) ->
    row = ""
    select_options = data
    property = $(eles).attr("data-select").split(".")
    unless property?
      return null
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
    row += "</td>"
    return row
    
  setColumnClasses: (options) ->
    classes = []
    jQuery.each(options, (i, val) ->
      if val == "inline-edit"
        classes.push("editable")
      else
        return ""
    )
    return classes.join(" ")
    
  bindData: (data, container) ->
    @bindSources(data, container)
    @bindValues(data, container)
    
  bindSources: (data, container) ->
    if container == undefined
      container = "body"
    if data.constructor.toString().indexOf("Array") is -1
      data = [data]
    if(data)
      @bindSelectSources(data, container)
    
  bindValues: (data, container) ->
     if container == undefined
       container = "body"
     if data.constructor.toString().indexOf("Array") is -1
       data = [data]
     if(data)
       @bindTables(data, container)
       
       @bindSelects(data, container)
       
       @bindInputs(data, container)
    
       @bindCheckboxes(data, container)
    
       @bindLists(data, container)

       @bindLabels(data, container)

       @bindEditables()

  bindLists: (data, container) ->
    lists = $(container).children().find("ul[data-val]")
    jQuery.each(lists, (i, ele) ->
            obj = data
            if $(ele).attr("data-val") 
              property = $(ele).attr("data-val").split(".")
              for i in [0..property.length - 1]
                  obj = obj[property[i]]
              $(ele).html("#{$(ele).html()}<li>#{obj}</li>")
    )   

  bindLabels: (data, container) ->
    labels = $(container).children().find("ul[datal-val]")
    jQuery.each(labels, (i, ele) ->
            obj = data
            if $(ele).attr("data-val") 
              property = $(ele).attr("data-val").split(".")
              for i in [0..property.length - 1]
                  obj = obj[property[i]]
              $(ele).val(obj)
    )

  bindSelectSources: (data, container) ->
    selects = $(container).find("select[data-val]")
    jQuery.each(selects, (i, ele) ->
            $(ele).html("")
            obj = data  
            if $(ele).attr("data-src")
              value = ""
              objects = []
              src = $(ele).attr("data-src").split(".")
              jQuery.each(obj, (i, val) ->  
                val = val
                jQuery.each(src, (i, str) ->
                  try
                    if i == src.length - 1
                      value = val["id"]
                    val = val[src[i]]
                  catch ex
                )
                if val?
                  $(ele).append("<option value='#{value}'>#{val}</option>")
              )
    )
              
  bindSelects: (data, container) ->
    selects = $(container).find("select[data-val]")
    obj = data 
    jQuery.each(selects, (i, ele) ->
      if $(ele).attr("data-val") 
        property = $(ele).attr("data-val").split(".")
        jQuery.each(obj, (i, val) ->
          try 
            for i in [0..property.length - 1]
              val = val[property[i]]
            if val?
              $("##{$(ele).attr("id")} option:contains('#{val}')").attr("selected", "selected");
          catch ex
        )
    )          
  
  bindInputs: (data, container) ->
       inputs = $(container).find("input:text[data-val]")
       jQuery.each(inputs, (i, ele) ->
                   obj = data
                   if $(ele).attr("data-val") 
                     property = $(ele).attr("data-val").split(".")
                     for i in [0..property.length - 1]
                           obj = obj[property[i]]
                     $(ele).val(obj)

       )
      
  bindCheckboxes: (data, container) ->
       checkboxes = $(container).find("input:checkbox[data-val]")
       jQuery.each(checkboxes, (i, ele) ->
              obj = data
              if $(ele).attr("data-val") 
                property = $(ele).attr("data-val").split(".")
                for i in [0..property.length - 1]
                  obj = obj[property[i]]
                $(ele).prop("checked", (obj))
                
       )