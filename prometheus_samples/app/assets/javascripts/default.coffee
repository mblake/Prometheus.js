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
    
$ ->
  Samples.init()