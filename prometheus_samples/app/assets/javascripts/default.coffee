Samples = 
  init: ->
    @bindLinks()
    
  bindLinks: ->
    $("#bind_user").bind("click", ->
      Prometheus.bindValues(users, "body", true)
    )
    $("#fill_states").bind("click", ->
      Prometheus.bindSources(states)
    )
    $("#bind_states").bind("click", ->
      Prometheus.bindValues(selectedState)
    )
    $("#change_label_one").bind("click", ->
      Prometheus.bindData(labels, "#labelsContainer")
    )
    $("#change_span").bind("click", -> 
      Prometheus.bindData(labels, "#spanContainer")
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