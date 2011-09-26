Samples = 
  init: ->
    @bindLinks()
    
  bindLinks: ->
    $("#bind_user").bind("click", ->
      Prometheus.bindData(users)
    )
    $("#fill_states").bind("click", ->
      Prometheus.bindSources(states)
    )
    $("#bind_states").bind("click", ->
      Prometheus.bindValues(selectedState)
    )
    $("#change_label_one").bind("click", ->
      Prometheus.bindData(labels)
    )
    $("#bind_checkboxes").bind("click", ->
      Prometheus.bindData(checkboxes)
    )
    $("#bind_inputs").bind("click", ->
      Prometheus.bindData(inputs)
    )
    $("#bind_lists").bind("click", ->
      Prometheus.bindData(cities)
    )
$ ->
  Samples.init()