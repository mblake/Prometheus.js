var TableTest

TableTest = {
	loadUser: function(){
		user = jQuery.parseJSON("[{\"user\": {\"first_name\": \"John\", \"last_name\": \"Smith\"}}]")
		return user
	}
}
