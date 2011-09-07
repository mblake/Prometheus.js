describe("Bindings", function(){
  
  describe("returnColumnClasses", function() {
    
    it("should return a joined string if a recognized option is passed", function() {
      val = Bindings.setColumnClasses(["inline-edit", "this"])
      expect(val).toEqual("editable")
    });
    
    
    it("should return an empty string if a unrecognized option is passed", function() {
      val = Bindings.setColumnClasses(["inline", "this"])
      expect(val).toEqual("")
    });
  });
  
  describe("addEmptyColumn", function() {
    it("should return an empty td", function() {
      expect(Bindings.addEmptyColumn()).toEqual("<td></td>")
    });
  });
  
  describe("addTableLink", function(){
    var ele
    beforeEach(function() {
      ele = $("<div data-href='http://localhost:3000' data-click='GoHere' data-class='myClass'/>")
    });
    it("should return a valid value", function() {
      expect(Bindings.addTableLink(ele)).toEqual("<td><a href='http://localhost:3000' onclick='GoHere'><span class='myClass'> </span></a></td>")
    });

  });
  
  describe("getInputType", function() {
    var typedEle
    var untypedEle
    beforeEach(function() {
      typedEle = $("<input data-input='select'/>")
      untypedEle = $("<input/>")
    });
    it("should return the correct type if type is set", function() {
      expect(Bindings.getInputType(typedEle)).toEqual("select")
    });
    
    it("should return undefined if type is not set", function() {
      expect(Bindings.getInputType(untypedEle)).toEqual(undefined)
    });
  });
  
  describe("getInputName", function() {
    var namedEle
    var unnamedEle
    var chainedProp
    var prop
    beforeEach(function() {
      namedEle = "<input data-name='myName'/>"
      unnamedEle = "<input/>"
      chainedProp = ["this", "that"]
      prop = ["this"]
    });
    
    it("should pull data name if available", function() {
      expect(Bindings.getInputName(namedEle, prop)).toEqual("myName")
    });
    
    it("should combine list of available properties if unnamed", function() {
      expect(Bindings.getInputName(unnamedEle, chainedProp)).toEqual("this_that")
    });
    
    it("should accept a single property as a name", function() {
      expect(Bindings.getInputName(unnamedEle, prop)).toEqual("this")
    });
  });
  
  describe("getInputId", function() {
    var idEle
    var ele
    var chainedProp
    var prop
    var rowCount = 3
    beforeEach(function() {
      idEle = "<input data-id='stuff'/>"
      ele = "<input/>"
      chainedProp = ["this", "that"]
      prop = ["this"]
    });
    
    it("should pull data id if available", function() {
      expect(Bindings.getInputId(idEle, prop, rowCount)).toEqual("stuff")
    });
    
    it("should combine listed properties", function() {
      expect(Bindings.getInputId(ele, chainedProp, rowCount)).toEqual("this_that_3")
    });
    
    it("should accept a single property", function() {
      expect(Bindings.getInputId(ele, prop, rowCount)).toEqual("this_3")
    });
    
  });
  
})