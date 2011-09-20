Samples = 
  init: ->
    @bindLinks()
    
  bindLinks: ->
    $("#bind_user").bind("click", ->
      Bindings.bindData(users)
    )
    $("#fill_states").bind("click", ->
      Bindings.bindSources(states)
    )
    $("#bind_states").bind("click", ->
      Bindings.bindValues(selectedState)
    )
    $("#change_label_one").bind("click", ->
      Bindings.bindData(labels)
    )
    $("#bind_checkboxes").bind("click", ->
      Bindings.bindData(checkboxes)
    )
    $("#bind_inputs").bind("click", ->
      Bindings.bindData(inputs)
    )
    $("#bind_lists").bind("click", ->
      Bindings.bindData(cities)
    )
$ ->
  Samples.init()