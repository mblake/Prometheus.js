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
    
$ ->
  Samples.init()