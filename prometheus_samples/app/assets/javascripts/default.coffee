Samples = 
  init: ->
    @bindLinks()
    
  bindLinks: ->
    $("#bind_user").bind("click", ->
      Bindings.bindData(users)
    )
    
$ ->
  Samples.init()