class SamplesController < ApplicationController
  def index
    @users = User.all.to_json
    @product = Product.all.to_json
    @subscription = Subscription.all.to_json
    @states = State.all.to_json
    @selected_state = State.find_by_description("NC").to_json
    @data = @subscription + @users + @product
    @data = @data.to_json
    @cities = City.all.to_json
  end
end
