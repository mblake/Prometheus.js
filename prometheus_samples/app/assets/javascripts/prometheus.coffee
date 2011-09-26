valIdPairs = {}
evenOdd = "even"
appendData = false
@Prometheus =
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
      success = 0
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
                  input_name = Prometheus.getInputName(eles, property)
                  input_id =  Prometheus.getInputId(eles, property, row_count)
                  input_name = "#{input_name}[#{row_count}]"
                  input_type = Prometheus.getInputType(eles)
                  change = Prometheus.getOnChange(eles)
                  classes = Prometheus.setColumnClasses(data_options)
                  cls = Prometheus.getClasses(eles)
                  row += "<td class='#{cls} #{classes}'>"
                  row += "<label>#{nested}</label>"
                  if input_type == "select"
                    row += Prometheus.addTableSelect(input_name, row_count, val, eles, property, data, nested, change, blur)
                  else
                    row += Prometheus.addTableInput(input_name, input_id, nested, property, change, blur)
              if $(eles).attr("data-href")
                  row += Prometheus.addTableLink(eles)
           catch ex
                row += Prometheus.addEmptyColumn
                undefinedCount++
       
          )
        row += "</tr>"
        if undefinedCount < headers.length
          row_count++
          if not success
            if not appendData
              $(ele).find("tbody").html("")
              success = 1
          $(ele).find("tbody").append(row)
          $(ele).find("input").hide()
          $(ele).find("select").hide()
      )
    )
    Prometheus.bindEditables()
   

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
  
  getId: (eles) ->
    ele_id = ""
    if $(eles).attr("data-id")
      ele_id = $(eles).attr("data-id")
    return ele_id
    
  getClasses: (eles) ->
    if $(eles).attr("data-class")
      cls = $(eles).attr("data-class")
    else
      cls = ""
    return cls
      
  addTableLink: (eles) ->
    row = "<td>"
    row += "<a href='#{$(eles).attr('data-href')}' onclick='#{$(eles).attr('data-click')}'><span class='#{$(eles).attr('data-class')}'> </span></a>"
    row += "</td>"
    return row
     
  addTableInput: (name, id, nested, property, change, blur) ->
    unless nested?
      return null
    row  = "<input name='#{name}' id='#{id}' value='#{nested}' onblur='#{blur}' class='hidden #{property.join("_")} editable' onchange=\"#{change}\"/>"
    row += "</td>"
    return row
    
  addEmptyColumn: ->
    row = "<td></td>"
    return row
    
  addTableSelect: (input_name, row_count, val, eles, property, data, nested,change, blur) ->
    row = ""
    select_options = data
    property = $(eles).attr("data-select").split(".")
    unless property?
      return null
    for i in [0..property.length - 1]
        select_options = select_options[property[i]]
    input_id = property.join("_")
    row += "<select id='#{input_id}_#{row_count}' name='#{input_name}' class='hidden' onchange='#{change}' onblur='#{blur}'>"
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
    @bindSources(data, container, false)
    @bindValues(data, container, false)

  appendData: (data, container) ->
    @bindSources(data, container, true)
    @bindValues(data, container, true)

  bindSources: (data, container, append) ->
    if append
      appendData = append
    else
      appendData = false
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

  getEditableInput: (ele, val, name, change, blur) ->
    input = $(document.createElement("input"))
    if Prometheus.getBoolean(val)
      input.attr("value", val)
    if Prometheus.getBoolean(blur)
      input.attr("onblur", blur)
    if Prometheus.getBoolean(change)
      input.attr("onchange", change)
    if Prometheus.getBoolean(name)
      input.attr("name", name)
    return input
    
  getOnBlur: (ele) ->
    if $(ele).attr("data-blur")
      return ""
    else
      return ""
    
  bindLists: (data, container) ->
    lists = $(container).find("ul[data-val]")
    jQuery.each(lists, (i, ele) ->
            success = 0
            list_count = $(ele).find("li").length
            if $(ele).attr("data-val") 
              jQuery.each(data, (i, obj) ->
                property = $(ele).attr("data-val").split(".")
                change = Prometheus.getOnChange(ele)
                try
                  for i in [0..property.length - 1]
                      obj = obj[property[i]]
                  data_options = ""
                  try
                    data_options = ($(ele).attr("data-options").split(" "))
                  catch ex
                  classes = Prometheus.setColumnClasses(data_options)
                  input = ""
                  if $(ele).attr("data-name")
                    name = "#{$(ele).attr('data-name')}[#{list_count}]"
                  else 
                    name = "#{property.join('_')}[#{list_count}]"
                  # TODO figure out a better way to blur and get rid of this
                  blur = undefined
                  if classes.indexOf("editable") != -1
                    input = Prometheus.getEditableInput(ele, obj, name, change, blur)
                  if not success
                    if not appendData
                      $(ele).html("")
                      success = 1
                  
                  li = $(document.createElement('li'))
                  li.attr("class", "#{Prometheus.getClasses(ele)} #{classes}")
                  li.attr("id", "#{Prometheus.getId(ele)}_#{list_count}")
                  li.append(input)
                  label = $(document.createElement('label'))
                  label.html(obj)
                  li.append(label)
                  $(ele).append(li)
                  list_count++
                  $(ele).find("select").hide()
                  $(ele).find("input").hide()
                catch ex
              )
    )   

  bindLabels: (data, container) ->
    labels = $(container).find("label[data-val]")
    jQuery.each(labels, (i, ele) ->
            jQuery.each(data, (i, obj) ->
              if $(ele).attr("data-val") 
                property = $(ele).attr("data-val").split(".")
                try
                  data_options = ""
                  for i in [0..property.length - 1]
                    obj = obj[property[i]]
                  try
                    data_options = $(ele).attr("data-options").split(" ")
                  catch ex
                  classes = Prometheus.setColumnClasses(data_options)
                  input = ""
                  change = Prometheus.getOnChange(ele)
                  if $(ele).attr("data-name")
                    name = $(ele).attr("data-name")
                  else
                    name = property.join("_")
                  # TODO Consider how to best handle blur, then make this go away
                  blur = undefined
                  if classes.indexOf("editable") != -1
                    input = Prometheus.getEditableInput(ele, obj, name, change, blur)
                  span = $(document.createElement('span')).attr("class", classes)
                  label = $(document.createElement('label'))
                  label.append(obj)
                  span.append(label)
                  span.append(input)
                  $(ele).html("")
                  $(ele).append(span)
                catch ex
            )
    
    )
    $(labels).find("input").hide()

  bindSelectSources: (data, container) ->
    selects = $(container).find("select[data-val]")
    jQuery.each(selects, (i, ele) ->
            success = 0
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
                  if success == 0
                    if not appendData
                      $(ele).html("")
                    success = 1
                  option = $(document.createElement('option'), {value: value})
                  option.html(val)
                  $(ele).append(option)
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
                   if $(ele).attr("data-val") 
                     jQuery.each(data, (i, obj) ->
                       property = $(ele).attr("data-val").split(".")
                       try
                         for i in [0..property.length - 1]
                               obj = obj[property[i]]
                         $(ele).val(obj)
                       catch ex
                     )

       )
      
  bindCheckboxes: (data, container) ->
       checkboxes = $(container).find("input:checkbox[data-val]")
       jQuery.each(checkboxes, (i, ele) ->
              if $(ele).attr("data-val") 
                jQuery.each(data, (i, obj) ->
                  property = $(ele).attr("data-val").split(".")
                  try
                    for i in [0..property.length - 1]
                      obj = obj[property[i]]
                    $(ele).prop("checked", Prometheus.getBoolean(obj))
                  catch ex
                )
       )
       
  getBoolean: (obj) ->
    if obj is 0 or obj is "false" or obj is "" or obj is "0" or obj is null or obj is undefined or obj is "undefined"
      return false
    else
      return true